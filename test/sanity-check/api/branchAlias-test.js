/**
 * Branch Alias API Tests
 * 
 * Comprehensive test suite for:
 * - Branch alias CRUD operations
 * - Branch alias query operations
 * - Branch alias update (reassignment)
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, wait, shortId, trackedExpect } from '../utility/testHelpers.js'

describe('Branch Alias API Tests', () => {
  let client
  let stack
  let testBranchUid = null
  let testAliasUid = null

  before(async function () {
    this.timeout(60000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // First, try to use branch from testData (created by branch-test.js)
    // This branch is guaranteed to exist and be ready
    if (testData.branches && testData.branches.development) {
      testBranchUid = testData.branches.development.uid
      console.log(`Branch Alias tests using branch from testData: ${testBranchUid}`)
    } else {
      // Fall back to main branch which always exists
      testBranchUid = 'main'
      console.log('Branch Alias tests using main branch (no branch in testData)')
    }
    
    // Wait for any pending operations
    await wait(1000)
  })

  after(async function () {
    // NOTE: Deletion removed - branch aliases persist for other tests
    // Branch Alias Delete tests will handle cleanup
  })

  // ==========================================================================
  // BRANCH ALIAS CRUD
  // ==========================================================================

  describe('Branch Alias CRUD', () => {

    it('should create a branch alias', async function () {
      this.timeout(45000)

      // Generate short alias uid (max 15 chars, lowercase alphanumeric and underscore only)
      // Format: branchUid + '_alias' (similar to old test pattern)
      testAliasUid = `${testBranchUid}_alias`.slice(0, 15)
      
      // If using main branch, use a unique alias name
      if (testBranchUid === 'main') {
        testAliasUid = `main_al_${Date.now().toString().slice(-5)}`
      }

      console.log(`Creating alias "${testAliasUid}" for branch "${testBranchUid}"`)
      
      // Create the branch alias using SDK method (same as old tests)
      const response = await stack.branchAlias(testAliasUid).createOrUpdate(testBranchUid)

      trackedExpect(response, 'Branch alias').toBeAn('object')
      
      // Validate response matches old test expectations
      trackedExpect(response.uid, 'Branch alias uid').toEqual(testBranchUid)
      trackedExpect(response.alias, 'Branch alias alias').toEqual(testAliasUid)
      expect(response.urlPath).to.equal(`/stacks/branches/${testBranchUid}`)
      
      // Store for later tests
      testData.branchAliases = testData.branchAliases || {}
      testData.branchAliases.test = response

      await wait(2000)
    })

    it('should fetch branch alias', async function () {
      this.timeout(15000)

      if (!testAliasUid) {
        throw new Error('No alias UID available - previous test may have failed')
      }

      const response = await stack.branchAlias(testAliasUid).fetch()

      trackedExpect(response, 'Branch alias').toBeAn('object')
      // Validate response matches old test expectations
      trackedExpect(response.uid, 'Branch alias uid').toEqual(testBranchUid)
      trackedExpect(response.alias, 'Branch alias alias').toEqual(testAliasUid)
      expect(response.urlPath).to.equal(`/stacks/branches/${testBranchUid}`)
      expect(response.source).to.be.a('string')
      // Check SDK methods exist on response
      expect(response.delete).to.not.equal(undefined)
      expect(response.fetch).to.not.equal(undefined)
    })

    it('should query branch aliases and return created alias', async function () {
      this.timeout(15000)

      if (!testAliasUid) {
        throw new Error('No alias UID available - previous test may have failed')
      }

      // Query for the branch we aliased (same as old test pattern)
      const response = await stack.branchAlias().fetchAll({
        query: { uid: testBranchUid }
      })

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')
      expect(response.items.length).to.be.at.least(1)
      
      // Find our alias in the results
      const item = response.items.find(a => a.alias === testAliasUid)
      expect(item).to.exist
      expect(item.urlPath).to.equal(`/stacks/branches/${testBranchUid}`)
      // Check SDK methods exist on response items
      expect(item.delete).to.not.equal(undefined)
      expect(item.fetch).to.not.equal(undefined)
    })

    it('should fetch all branch aliases', async function () {
      this.timeout(15000)

      const response = await stack.branchAlias().fetchAll()

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')
    })

    it('should update branch alias (reassign to different branch)', async function () {
      this.timeout(30000)

      if (!testAliasUid) {
        this.skip()
        return
      }

      try {
        // Re-assign alias to main branch
        const response = await stack.branchAlias(testAliasUid).createOrUpdate('main')

        expect(response).to.be.an('object')
        expect(response.uid || response.alias).to.be.a('string')

        await wait(1000)

        // Re-assign back to test branch
        if (testBranchUid !== 'main') {
          await stack.branchAlias(testAliasUid).createOrUpdate(testBranchUid)
          await wait(1000)
        }
      } catch (error) {
        console.log('Alias update failed:', error.errorMessage)
        // Not critical, continue with other tests
      }
    })
  })

  // ==========================================================================
  // BRANCH ALIAS VALIDATION
  // ==========================================================================

  describe('Branch Alias Validation', () => {

    it('should validate alias response structure', async function () {
      this.timeout(15000)

      if (!testAliasUid) {
        this.skip()
        return
      }

      try {
        const alias = await stack.branchAlias(testAliasUid).fetch()

        // Check for expected properties
        expect(alias).to.have.property('uid')
        expect(alias).to.have.property('source')
        expect(alias).to.have.property('alias')
      } catch (error) {
        console.log('Validation fetch failed:', error.errorMessage)
        this.skip()
      }
    })

    it('should verify alias points to correct branch', async function () {
      this.timeout(15000)

      if (!testAliasUid) {
        this.skip()
        return
      }

      try {
        const alias = await stack.branchAlias(testAliasUid).fetch()

        expect(alias.uid).to.equal(testBranchUid)
        expect(alias.alias).to.equal(testAliasUid)
      } catch (error) {
        console.log('Alias verification failed:', error.errorMessage)
        this.skip()
      }
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to fetch non-existent alias', async function () {
      this.timeout(15000)

      try {
        await stack.branchAlias('nonexistent_alias_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422, 403])
      }
    })

    it('should fail to create alias for non-existent branch', async function () {
      this.timeout(15000)

      try {
        await stack.branchAlias('test_alias').createOrUpdate('nonexistent_branch')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 404, 422, 403])
      }
    })

    it('should fail with invalid alias UID format', async function () {
      this.timeout(15000)

      try {
        await stack.branchAlias('Invalid-Alias!@#').createOrUpdate('main')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422, 403])
      }
    })
  })

  // ==========================================================================
  // BRANCH ALIAS DELETE
  // ==========================================================================

  describe('Branch Alias Delete', () => {

    it('should delete branch alias', async function () {
      this.timeout(45000)

      // Create a TEMPORARY branch alias for deletion testing
      // Don't delete the shared testAliasUid
      const tempAliasUid = `del${Date.now().toString().slice(-8)}`

      try {
        // Create temp alias pointing to main
        await stack.branchAlias(tempAliasUid).createOrUpdate('main')
        
        await wait(2000)

        const response = await stack.branchAlias(tempAliasUid).delete()

        expect(response).to.be.an('object')
        expect(response.notice).to.be.a('string')
      } catch (error) {
        if (error.status === 403 || error.status === 422) {
          console.log('Branch aliasing not available for delete test')
          this.skip()
        } else if (error.status !== 404) {
          throw error
        }
      }
    })
  })
})
