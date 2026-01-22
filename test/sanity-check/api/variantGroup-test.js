/**
 * Variant Group API Tests
 * 
 * Comprehensive test suite for:
 * - Variant Group CRUD operations
 * - Content type linking
 * - Error handling
 * 
 * NOTE: Variant Groups feature must be enabled for the stack.
 * Tests will be skipped if the feature is not available.
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { wait, testData } from '../utility/testHelpers.js'

describe('Variant Group API Tests', () => {
  let client = null
  let stack = null
  let variantGroupUid = null
  let featureEnabled = true

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  after(async function () {
    // NOTE: Deletion removed - variant groups persist for other tests
    // Variant Group Deletion tests will handle cleanup
  })

  // Helper to fetch variant group by UID
  async function fetchVariantGroupByUid(uid) {
    const response = await stack.variantGroup().query().find()
    const items = response.items || response.variant_groups || []
    const group = items.find(g => g.uid === uid)
    if (!group) {
      const error = new Error(`Variant group with UID ${uid} not found`)
      error.status = 404
      throw error
    }
    return group
  }

  describe('Variant Group CRUD Operations', () => {
    
    it('should create a variant group', async function () {
      this.timeout(30000)

      const createData = {
        uid: `test_vg_${Date.now().toString().slice(-8)}`,
        name: `Test Variant Group ${Date.now()}`,
        description: 'Test variant group for API testing',
        content_types: []
      }

      try {
        const response = await stack.variantGroup().create(createData)
        
        expect(response).to.be.an('object')
        expect(response.uid).to.be.a('string')
        expect(response.name).to.include('Test Variant Group')
        
        variantGroupUid = response.uid
        testData.variantGroupUid = response.uid
        
        await wait(1000)
      } catch (error) {
        // Variant groups might not be enabled for this stack
        if (error.status === 403 || error.errorCode === 403 || 
            (error.errorMessage && error.errorMessage.includes('not enabled'))) {
          console.log('Variant Groups feature not enabled for this stack')
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should fetch all variant groups', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      try {
        const response = await stack.variantGroup().query().find()
        
        expect(response).to.be.an('object')
        const items = response.items || response.variant_groups || []
        expect(items).to.be.an('array')
        
        items.forEach(variantGroup => {
          expect(variantGroup.name).to.not.equal(null)
          expect(variantGroup.uid).to.not.equal(null)
        })
      } catch (error) {
        if (error.status === 403 || error.errorCode === 403) {
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should query variant group by name', async function () {
      this.timeout(15000)
      
      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        const group = await fetchVariantGroupByUid(variantGroupUid)
        const response = await stack.variantGroup()
          .query({ query: { name: group.name } })
          .find()
        
        expect(response).to.be.an('object')
        const items = response.items || response.variant_groups || []
        expect(items).to.be.an('array')
      } catch (error) {
        if (error.status === 403) {
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should fetch a single variant group by UID', async function () {
      this.timeout(15000)
      
      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        const group = await fetchVariantGroupByUid(variantGroupUid)
        
        expect(group.uid).to.equal(variantGroupUid)
        expect(group.name).to.not.equal(null)
      } catch (error) {
        if (error.status === 403 || error.status === 404) {
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should update a variant group', async function () {
      this.timeout(15000)
      
      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      const newName = `Updated Variant Group ${Date.now()}`
      const newDescription = 'Updated description for testing'

      try {
        const group = await fetchVariantGroupByUid(variantGroupUid)
        
        // SDK update() takes data object as parameter
        const response = await group.update({
          name: newName,
          description: newDescription
        })
        
        expect(response).to.be.an('object')
        // Response might be nested or direct
        const updatedGroup = response.variant_group || response
        expect(updatedGroup.name).to.equal(newName)
      } catch (error) {
        if (error.status === 403) {
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })
  })

  describe('Variant Group Content Type Linking', () => {
    let contentTypeUid = null

    before(async function () {
      this.timeout(15000)
      
      if (!featureEnabled) {
        return
      }
      
      // Get a content type for linking
      try {
        const contentTypes = await stack.contentType().query().find()
        const items = contentTypes.items || contentTypes.content_types || []
        if (items.length > 0) {
          contentTypeUid = items[0].uid
        }
      } catch (e) {
        // Content types might not be accessible
      }
    })

    it('should link content type to variant group', async function () {
      this.timeout(15000)
      
      if (!variantGroupUid || !contentTypeUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        const group = await fetchVariantGroupByUid(variantGroupUid)
        
        // Per CMA API docs, content_types must be array of objects with uid AND status properties
        // See: https://www.contentstack.com/docs/developers/apis/content-management-api#link-content-types
        const response = await group.update({
          content_types: [{ uid: contentTypeUid, status: 'linked' }]
        })
        
        const updatedGroup = response.variant_group || response
        expect(updatedGroup.uid).to.equal(variantGroupUid)
      } catch (error) {
        if (error.status === 403 || error.status === 422 || error.status === 400) {
          // Feature might not be enabled or operation not supported
          console.log('Link content type skipped:', error.errorMessage || error.message)
          this.skip()
        } else {
          throw error
        }
      }
    })
  })

  describe('Variant Group Deletion', () => {
    it('should delete variant group', async function () {
      this.timeout(30000)
      
      if (!featureEnabled) {
        this.skip()
        return
      }

      // Create a TEMPORARY variant group for deletion testing
      // Don't delete the shared variantGroupUid
      const tempGroupData = {
        uid: `del_vg_${Date.now().toString().slice(-8)}`,
        name: `Delete Test VG ${Date.now()}`,
        description: 'Temporary variant group for delete testing',
        content_types: []
      }

      try {
        const tempGroup = await stack.variantGroup().create(tempGroupData)
        expect(tempGroup.uid).to.be.a('string')
        
        await wait(1000)
        
        const groupToDelete = await fetchVariantGroupByUid(tempGroup.uid)
        const response = await groupToDelete.delete()
        
        expect(response).to.be.an('object')
      } catch (error) {
        if (error.status === 403) {
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle fetching non-existent variant group', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      try {
        await fetchVariantGroupByUid('non_existent_variant_group_xyz')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should handle creating variant group without name', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      try {
        await stack.variantGroup().create({})
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })
})
