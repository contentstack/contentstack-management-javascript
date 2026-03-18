/**
 * Variants API Tests
 *
 * Comprehensive test suite for:
 * - Variant CRUD operations within Variant Groups
 * - Error handling
 *
 * NOTE: Variants feature must be enabled for the stack.
 * Tests will be skipped if the feature is not available.
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { wait, testData, trackedExpect } from '../utility/testHelpers.js'

describe('Variants API Tests', () => {
  let client = null
  let stack = null
  let variantGroupUid = null
  let variantUid = null
  let featureEnabled = true

  before(async function () {
    this.timeout(60000)

    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // Create a variant group first for variant tests
    try {
      const createData = {
        uid: `vg_for_var_${Date.now().toString().slice(-8)}`,
        name: `Variant Group for Variants Test ${Date.now()}`,
        description: 'Variant group for testing variants API'
      }

      const response = await stack.variantGroup().create(createData)
      variantGroupUid = response.uid
      await wait(2000)
    } catch (error) {
      if (error.status === 403 || error.errorCode === 403 ||
          (error.errorMessage && error.errorMessage.includes('not enabled'))) {
        console.log('Variant Groups feature not enabled for this stack')
        featureEnabled = false
      } else {
        console.log('Variant group creation warning:', error.errorMessage || error.message)
      }
    }
  })

  after(async function () {
    // NOTE: Deletion removed - variants persist for other tests
    // Variant Deletion tests will handle cleanup
  })

  // Helper to fetch variant by UID
  async function fetchVariantByUid (uid) {
    const response = await stack.variantGroup(variantGroupUid).variants().query().find()
    const items = response.items || response.variants || []
    const variant = items.find(v => v.uid === uid)
    if (!variant) {
      const error = new Error(`Variant with UID ${uid} not found`)
      error.status = 404
      throw error
    }
    return variant
  }

  describe('Variant CRUD Operations', () => {
    it('should create a variant in variant group', async function () {
      this.timeout(30000)

      // Skip check at beginning only
      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      const varId = Date.now().toString().slice(-8)
      const createData = {
        name: `Test Variant ${varId}`,
        uid: `test_var_${varId}`,
        personalize_metadata: {
          experience_uid: 'exp_test_1',
          experience_short_uid: 'exp_short_1',
          project_uid: 'project_test_1',
          variant_short_uid: `var_short_${varId}`
        }
      }

      const response = await stack.variantGroup(variantGroupUid).variants().create(createData)

      trackedExpect(response, 'Variant').toBeAn('object')
      trackedExpect(response.uid, 'Variant UID').toBeA('string')
      trackedExpect(response.name, 'Variant name').toInclude('Test Variant')

      variantUid = response.uid
      testData.variantUid = response.uid

      await wait(1000)
    })

    it('should fetch all variants in variant group', async function () {
      this.timeout(15000)

      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        const response = await stack.variantGroup(variantGroupUid).variants().query().find()

        trackedExpect(response, 'Variants query response').toBeAn('object')
        const items = response.items || response.variants || []
        trackedExpect(items, 'Variants list').toBeAn('array')

        items.forEach(variant => {
          expect(variant.uid).to.not.equal(null)
          expect(variant.name).to.not.equal(null)
        })
      } catch (error) {
        if (error.status === 403) {
          featureEnabled = false
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should fetch a single variant by UID', async function () {
      this.timeout(15000)

      if (!variantGroupUid || !variantUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        const variant = await fetchVariantByUid(variantUid)

        expect(variant.uid).to.equal(variantUid)
        expect(variant.name).to.not.equal(null)
      } catch (error) {
        if (error.status === 403 || error.status === 404) {
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should update a variant', async function () {
      this.timeout(15000)

      if (!variantGroupUid || !variantUid || !featureEnabled) {
        this.skip()
        return
      }

      const newName = `Updated Variant ${Date.now()}`

      try {
        const variant = await fetchVariantByUid(variantUid)

        // SDK update() takes data object as parameter
        const response = await variant.update({
          name: newName
        })

        expect(response).to.be.an('object')
        // Response might be nested
        const updatedVariant = response.variant || response
        expect(updatedVariant.name).to.equal(newName)
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

  describe('Variant Deletion', () => {
    it('should delete a variant', async function () {
      this.timeout(30000)

      // Skip check at beginning only
      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      // Create a TEMPORARY variant for deletion testing
      const delId = Date.now().toString().slice(-8)
      const tempVariantData = {
        name: `Delete Test Var ${delId}`,
        uid: `del_var_${delId}`,
        personalize_metadata: {
          experience_uid: 'exp_del_1',
          experience_short_uid: 'exp_del_short',
          project_uid: 'project_del_1',
          variant_short_uid: `var_del_${delId}`
        }
      }

      const tempVariant = await stack.variantGroup(variantGroupUid).variants().create(tempVariantData)
      expect(tempVariant.uid).to.be.a('string')

      await wait(1000)

      const variantToDelete = await fetchVariantByUid(tempVariant.uid)
      const response = await variantToDelete.delete()

      expect(response).to.be.an('object')
    })
  })

  describe('Error Handling', () => {
    it('should handle fetching non-existent variant', async function () {
      this.timeout(15000)

      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        await fetchVariantByUid('non_existent_variant_xyz')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should handle creating variant without name', async function () {
      this.timeout(15000)

      if (!variantGroupUid || !featureEnabled) {
        this.skip()
        return
      }

      try {
        await stack.variantGroup(variantGroupUid).variants().create({})
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })
})
