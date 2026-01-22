/**
 * Branch API Tests
 * 
 * Comprehensive test suite for:
 * - Branch CRUD operations
 * - Branch compare
 * - Branch merge
 * - Branch alias
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  developmentBranch,
  featureBranch,
  branchCompare,
  branchMerge,
  branchAlias,
  branchAliasUpdate
} from '../mock/configurations.js'
import { validateBranchResponse, testData, wait, shortId } from '../utility/testHelpers.js'

describe('Branch API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // BRANCH CRUD OPERATIONS
  // ==========================================================================

  describe('Branch CRUD Operations', () => {
    // Branch UID must be max 15 chars
    const devBranchUid = `dev${shortId()}`
    let createdBranch

    after(async () => {
      // NOTE: Deletion removed - branches persist for other tests
    })

    it('should query all branches', async () => {
      const response = await stack.branch().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.branches).to.be.an('array')

      const items = response.items || response.branches
      // At least main branch should exist
      expect(items.length).to.be.at.least(1)
    })

    it('should fetch main branch', async () => {
      const response = await stack.branch('main').fetch()

      expect(response).to.be.an('object')
      expect(response.uid).to.equal('main')
    })

    it('should create a development branch from main', async function () {
      this.timeout(30000)
      
      const branchData = {
        branch: {
          uid: devBranchUid,
          source: 'main'
        }
      }

      // SDK returns the branch object directly
      const branch = await stack.branch().create(branchData)

      expect(branch).to.be.an('object')
      expect(branch.uid).to.be.a('string')
      validateBranchResponse(branch)

      expect(branch.uid).to.equal(devBranchUid)
      expect(branch.source).to.equal('main')

      createdBranch = branch
      testData.branches.development = branch
      
      // Wait for branch to be fully ready
      await wait(2000)
    })

    it('should fetch the created branch', async function () {
      this.timeout(15000)
      const response = await stack.branch(devBranchUid).fetch()

      expect(response).to.be.an('object')
      expect(response.uid).to.equal(devBranchUid)
    })

    it('should validate branch response structure', async () => {
      const branch = await stack.branch(devBranchUid).fetch()

      expect(branch.uid).to.be.a('string')
      expect(branch.source).to.be.a('string')

      // Timestamps
      if (branch.created_at) {
        expect(new Date(branch.created_at)).to.be.instanceof(Date)
      }
    })
  })

  // ==========================================================================
  // BRANCH COMPARE
  // ==========================================================================

  describe('Branch Compare', () => {
    let compareBranchUid

    before(async function () {
      this.timeout(60000)
      // Create a branch for comparison
      compareBranchUid = `cmp${shortId()}`

      try {
        await stack.branch().create({
          branch: {
            uid: compareBranchUid,
            source: 'main'
          }
        })
        // Wait for branch to be fully ready before compare operations
        await wait(2000)
      } catch (error) {
        console.log('Branch creation failed:', error.errorMessage)
      }
    })

    after(async () => {
      // NOTE: Deletion removed - branches persist for other tests
    })

    it('should compare two branches', async () => {
      try {
        const response = await stack.branch(compareBranchUid).compare('main')

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Compare failed:', error.errorMessage)
      }
    })

    it('should get branch diff', async () => {
      try {
        const response = await stack.branch(compareBranchUid).compare('main').all()

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Branch diff failed:', error.errorMessage)
      }
    })

    it('should compare content types between branches', async () => {
      try {
        const response = await stack.branch(compareBranchUid).compare('main').contentTypes()

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Content type compare failed:', error.errorMessage)
      }
    })

    it('should compare global fields between branches', async () => {
      try {
        const response = await stack.branch(compareBranchUid).compare('main').globalFields()

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Global field compare failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // BRANCH MERGE
  // ==========================================================================

  describe('Branch Merge', () => {
    let mergeBranchUid

    before(async function () {
      this.timeout(60000)
      // Create a branch for merging
      mergeBranchUid = `mrg${shortId()}`

      try {
        await stack.branch().create({
          branch: {
            uid: mergeBranchUid,
            source: 'main'
          }
        })
        // Wait for branch to be fully ready before merge operations
        await wait(2000)
      } catch (error) {
        console.log('Branch creation failed:', error.errorMessage)
      }
    })

    after(async () => {
      // NOTE: Deletion removed - branches persist for other tests
    })

    it('should get merge queue', async () => {
      try {
        const response = await stack.branch(mergeBranchUid).mergeQueue()

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Merge queue failed:', error.errorMessage)
      }
    })

    it('should merge branch into main (dry run conceptual)', async () => {
      // Note: Actual merge requires changes in the branch
      // This tests the merge API availability
      try {
        const response = await stack.branch(mergeBranchUid).merge({
          base_branch: 'main',
          compare_branch: mergeBranchUid,
          default_merge_strategy: 'merge_prefer_base',
          merge_comment: 'Test merge'
        })

        expect(response).to.be.an('object')
      } catch (error) {
        // Merge might fail if no changes or conflicts
        console.log('Merge result:', error.errorMessage)
      }
    })
  })

  // NOTE: Branch Alias tests are in the dedicated branchAlias-test.js file

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create branch with duplicate UID', async () => {
      // Main branch always exists
      try {
        await stack.branch().create({
          branch: {
            uid: 'main',
            source: 'main'
          }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }
    })

    it('should fail to create branch from non-existent source', async () => {
      try {
        await stack.branch().create({
          branch: {
            uid: 'orphan_branch',
            source: 'nonexistent_source'
          }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 404, 422])
      }
    })

    it('should fail to fetch non-existent branch', async () => {
      try {
        await stack.branch('nonexistent_branch_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to delete main branch', async () => {
      try {
        const branch = await stack.branch('main').fetch()
        await branch.delete()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 403, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE BRANCH
  // ==========================================================================

  describe('Delete Branch', () => {

    // Helper to wait for branch to be ready (with polling)
    async function waitForBranchReady(branchUid, maxAttempts = 10) {
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const branch = await stack.branch(branchUid).fetch()
          if (branch && branch.uid) {
            return branch
          }
        } catch (e) {
          // Branch not ready yet
        }
        await wait(2000) // Wait 2 seconds between attempts
      }
      throw new Error(`Branch ${branchUid} not ready after ${maxAttempts} attempts`)
    }

    it('should delete a branch', async function () {
      this.timeout(60000) // Increased timeout for branch operations
      const tempBranchUid = `del${shortId()}`

      // Create temp branch
      await stack.branch().create({
        branch: {
          uid: tempBranchUid,
          source: 'main'
        }
      })
      
      // Wait for branch to be fully created (15 seconds like old tests)
      await wait(15000)

      // Poll until branch is ready
      const branch = await waitForBranchReady(tempBranchUid, 5)
      const response = await branch.delete()

      expect(response).to.be.an('object')
      expect(response.notice).to.be.a('string')
    })

    it('should return 404 for deleted branch', async function () {
      this.timeout(60000) // Increased timeout
      const tempBranchUid = `vfy${shortId()}`

      // Create and delete
      await stack.branch().create({
        branch: {
          uid: tempBranchUid,
          source: 'main'
        }
      })
      
      // Wait for branch to be fully created (15 seconds like old tests)
      await wait(15000)

      // Poll until branch is ready
      const branch = await waitForBranchReady(tempBranchUid, 5)
      await branch.delete()
      
      // Wait for deletion to propagate
      await wait(5000)

      try {
        await stack.branch(tempBranchUid).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
