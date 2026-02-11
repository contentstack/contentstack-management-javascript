/**
 * Taxonomy API Tests
 * 
 * Comprehensive test suite for:
 * - Taxonomy CRUD operations
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  categoryTaxonomy,
  regionTaxonomy
} from '../mock/taxonomy.js'
import { validateTaxonomyResponse, testData, wait, shortId, trackedExpect } from '../utility/testHelpers.js'

describe('Taxonomy API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // TAXONOMY CRUD OPERATIONS
  // ==========================================================================

  describe('Taxonomy CRUD Operations', () => {
    const categoryUid = `cat_${shortId()}`
    let createdTaxonomy

    after(async () => {
      // NOTE: Deletion removed - taxonomies persist for content types
    })

    it('should create a taxonomy', async function () {
      this.timeout(30000)
      const taxonomyData = {
        taxonomy: {
          name: `Categories ${shortId()}`,
          uid: categoryUid,
          description: 'Content categories for testing'
        }
      }

      // SDK returns the taxonomy object directly
      const taxonomy = await stack.taxonomy().create(taxonomyData)

      trackedExpect(taxonomy, 'Taxonomy').toBeAn('object')
      trackedExpect(taxonomy.uid, 'Taxonomy UID').toBeA('string')
      validateTaxonomyResponse(taxonomy)

      trackedExpect(taxonomy.uid, 'Taxonomy UID').toEqual(categoryUid)
      trackedExpect(taxonomy.name, 'Taxonomy name').toInclude('Categories')

      createdTaxonomy = taxonomy
      testData.taxonomies.category = taxonomy
      
      // Wait for taxonomy to be fully created
      await wait(2000)
    })

    it('should fetch the created taxonomy', async function () {
      this.timeout(15000)
      const response = await stack.taxonomy(categoryUid).fetch()

      trackedExpect(response, 'Taxonomy').toBeAn('object')
      trackedExpect(response.uid, 'Taxonomy UID').toEqual(categoryUid)
      trackedExpect(response.name, 'Taxonomy name').toEqual(createdTaxonomy.name)
    })

    it('should update taxonomy name', async () => {
      const taxonomy = await stack.taxonomy(categoryUid).fetch()
      const newName = `Updated Cat ${shortId()}`

      taxonomy.name = newName
      const response = await taxonomy.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should update taxonomy description', async () => {
      const taxonomy = await stack.taxonomy(categoryUid).fetch()
      taxonomy.description = 'Updated description for taxonomy'

      const response = await taxonomy.update()

      expect(response).to.be.an('object')
      expect(response.description).to.equal('Updated description for taxonomy')
    })

    it('should query all taxonomies', async () => {
      const response = await stack.taxonomy().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.taxonomies).to.be.an('array')

      // Verify our taxonomy is in the list
      const items = response.items || response.taxonomies
      const found = items.find(t => t.uid === categoryUid)
      expect(found).to.exist
    })
  })

  // ==========================================================================
  // REGION TAXONOMY
  // ==========================================================================

  describe('Region Taxonomy', () => {
    const regionUid = `reg_${shortId()}`

    after(async () => {
      // NOTE: Deletion removed - taxonomies persist for content types
    })

    it('should create region taxonomy', async () => {
      const taxonomyData = {
        taxonomy: {
          name: `Regions ${shortId()}`,
          uid: regionUid,
          description: 'Geographic regions for content targeting'
        }
      }

      // SDK returns the taxonomy object directly
      const taxonomy = await stack.taxonomy().create(taxonomyData)

      validateTaxonomyResponse(taxonomy)
      expect(taxonomy.uid).to.equal(regionUid)

      testData.taxonomies.region = taxonomy
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create taxonomy with duplicate UID', async () => {
      const taxonomyData = {
        taxonomy: {
          name: 'Duplicate Test',
          uid: 'duplicate_tax_test',
          description: 'Test'
        }
      }

      // Create first
      try {
        await stack.taxonomy().create(taxonomyData)
      } catch (e) { }

      // Try to create again
      try {
        await stack.taxonomy().create(taxonomyData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }

      // Cleanup
      try {
        const taxonomy = await stack.taxonomy('duplicate_tax_test').fetch()
        await taxonomy.delete()
      } catch (e) { }
    })

    it('should fail to fetch non-existent taxonomy', async () => {
      try {
        await stack.taxonomy('nonexistent_taxonomy_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to create taxonomy without name', async () => {
      const taxonomyData = {
        taxonomy: {
          uid: 'no_name_test'
        }
      }

      try {
        await stack.taxonomy().create(taxonomyData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE TAXONOMY
  // ==========================================================================

  describe('Delete Taxonomy', () => {

    it('should delete a taxonomy', async function () {
      this.timeout(30000)
      
      // Create a temporary taxonomy to delete
      const tempUid = `del_${shortId()}`
      const taxonomyData = {
        taxonomy: {
          name: 'Temp Delete Test',
          uid: tempUid
        }
      }

      await stack.taxonomy().create(taxonomyData)
      
      await wait(1000)

      // OLD pattern: use delete({ force: true }) and expect status 204
      const response = await stack.taxonomy(tempUid).delete({ force: true })

      expect(response).to.be.an('object')
      expect(response.status).to.equal(204)
    })

    it('should return 404 for deleted taxonomy', async function () {
      this.timeout(30000)
      
      const tempUid = `temp_verify_${Date.now()}`
      const taxonomyData = {
        taxonomy: {
          name: 'Temp Verify Test',
          uid: tempUid
        }
      }

      await stack.taxonomy().create(taxonomyData)
      await wait(1000)
      
      // OLD pattern: use delete({ force: true })
      await stack.taxonomy(tempUid).delete({ force: true })

      try {
        await stack.taxonomy(tempUid).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
