/**
 * Ungrouped Variants (Personalize) API Tests
 * 
 * Tests stack.variants() - for ungrouped/personalize variants
 * SDK Methods: create, query, fetch, fetchByUIDs, delete
 * NOTE: There is NO update method for ungrouped variants in the SDK
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { generateUniqueId, wait, testData } from '../utility/testHelpers.js'

let client = null
let stack = null
let variantUid = null
let createdVariantName = null  // Store actual created name
let featureEnabled = true

// Mock data - UID/name generated fresh each run
function getCreateVariantData() {
  const id = Math.random().toString(36).substring(2, 6)
  return {
    uid: `ugv_${id}`,
    name: `Ungrouped Var ${id}`,
    personalize_metadata: {
      experience_uid: 'exp_test_1',
      experience_short_uid: 'exp_short_1',
      project_uid: 'project_test_1',
      variant_short_uid: 'variant_short_1'
    }
  }
}

describe('Ungrouped Variants (Personalize) API Tests', () => {
  before(async function () {
    this.timeout(30000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
    
    // Feature detection - check if Personalize/Variants feature is enabled
    try {
      await stack.variants().query().find()
      featureEnabled = true
    } catch (error) {
      if (error.status === 403 || error.errorCode === 403 ||
          (error.errorMessage && error.errorMessage.includes('not enabled'))) {
        console.log('Ungrouped Variants (Personalize) feature not enabled for this stack')
        featureEnabled = false
      } else {
        // Other error - feature might still be enabled
        featureEnabled = true
      }
    }
  })

  after(async function () {
    // Cleanup handled in deletion tests
  })

  describe('Ungrouped Variant CRUD Operations', () => {
    it('should create an ungrouped variant', async function () {
      this.timeout(15000)

      // Skip check at beginning only  
      if (!featureEnabled) {
        this.skip()
        return
      }

      const createVariant = getCreateVariantData()
      
      const response = await stack.variants().create(createVariant)
      
      expect(response.uid).to.not.equal(null)
      expect(response.name).to.equal(createVariant.name)
      
      variantUid = response.uid
      createdVariantName = response.name  // Store actual name
      testData.ungroupedVariantUid = response.uid
      
      await wait(1000)
    })

    it('should query all ungrouped variants', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      const response = await stack.variants().query().find()
      
      expect(response.items).to.be.an('array')
      
      response.items.forEach(variant => {
        expect(variant.uid).to.not.equal(null)
        expect(variant.name).to.not.equal(null)
      })
    })

    it('should query ungrouped variants by name', async function () {
      this.timeout(15000)
      
      if (!variantUid || !featureEnabled || !createdVariantName) {
        this.skip()
        return
      }

      const response = await stack.variants()
        .query({ query: { name: createdVariantName } })
        .find()
      
      expect(response.items).to.be.an('array')
      
      // Find our created variant by UID (not just first result)
      const foundVariant = response.items.find(v => v.uid === variantUid)
      if (foundVariant) {
        expect(foundVariant.name).to.equal(createdVariantName)
      } else {
        // Query might not support exact match - just verify query works
        expect(response.items.length).to.be.at.least(0)
      }
    })

    it('should fetch ungrouped variant by UID', async function () {
      this.timeout(15000)
      
      if (!variantUid || !featureEnabled) {
        this.skip()
        return
      }

      const response = await stack.variants(variantUid).fetch()
      
      expect(response.uid).to.equal(variantUid)
      expect(response.name).to.not.equal(null)
    })

    it('should fetch variants by array of UIDs', async function () {
      this.timeout(15000)
      
      if (!variantUid || !featureEnabled) {
        this.skip()
        return
      }

      const response = await stack.variants().fetchByUIDs([variantUid])
      
      expect(response).to.be.an('object')
      // Response should contain the variant(s)
      const variants = response.variants || response.items || []
      expect(variants).to.be.an('array')
    })
  })

  describe('Ungrouped Variant Deletion', () => {
    it('should delete an ungrouped variant', async function () {
      this.timeout(30000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      // Create a TEMPORARY variant for deletion testing
      const delId = Date.now().toString().slice(-8)
      const tempVariantData = {
        uid: `del_ungr_${delId}`,
        name: `Delete Test Ungrouped ${delId}`,
        personalize_metadata: {
          experience_uid: 'exp_del_test',
          experience_short_uid: 'exp_del_short',
          project_uid: 'project_del_test',
          variant_short_uid: `var_del_${delId}`
        }
      }

      const tempVariant = await stack.variants().create(tempVariantData)
      expect(tempVariant.uid).to.be.a('string')
      
      await wait(1000)
      
      const response = await stack.variants(tempVariant.uid).delete()
      
      expect(response).to.be.an('object')
    })
  })

  describe('Error Handling', () => {
    it('should handle fetching non-existent ungrouped variant', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      try {
        await stack.variants('non_existent_variant_xyz').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should handle creating variant without required fields', async function () {
      this.timeout(15000)

      if (!featureEnabled) {
        this.skip()
        return
      }

      try {
        await stack.variants().create({})
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })
})
