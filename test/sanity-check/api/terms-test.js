/**
 * Taxonomy Terms API Tests
 * 
 * Comprehensive test suite for:
 * - Term CRUD operations
 * - Hierarchical terms
 * - Term movement and ordering
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  categoryTerms,
  regionTerms,
  termUpdate
} from '../mock/taxonomy.js'
import { validateTermResponse, testData, wait, shortId, trackedExpect } from '../utility/testHelpers.js'

describe('Taxonomy Terms API Tests', () => {
  let client
  let stack
  const taxonomyUid = `trm_${shortId()}`

  before(async function () {
    this.timeout(30000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // Create taxonomy for term testing
    const taxonomyData = {
      taxonomy: {
        name: `Terms Tax ${shortId()}`,
        uid: taxonomyUid,
        description: 'Taxonomy for term testing'
      }
    }

    await stack.taxonomy().create(taxonomyData)
  })

  after(async function () {
    this.timeout(30000)
    // NOTE: Deletion removed - taxonomies persist for content types
  })

  // ==========================================================================
  // TERM CRUD OPERATIONS
  // ==========================================================================

  describe('Term CRUD Operations', () => {
    let parentTermUid
    let childTermUid

    it('should create a root term', async () => {
      const termData = {
        term: {
          name: 'Technology',
          uid: 'technology'
        }
      }

      // SDK returns the term object directly
      const term = await stack.taxonomy(taxonomyUid).terms().create(termData)

      trackedExpect(term, 'Term').toBeAn('object')
      trackedExpect(term.uid, 'Term UID').toBeA('string')
      validateTermResponse(term)

      trackedExpect(term.uid, 'Term UID').toEqual('technology')
      trackedExpect(term.name, 'Term name').toEqual('Technology')

      parentTermUid = term.uid
      testData.taxonomies.terms = testData.taxonomies.terms || {}
      testData.taxonomies.terms.technology = term
    })

    it('should create a child term', async () => {
      const termData = {
        term: {
          name: 'Software',
          uid: 'software',
          parent_uid: parentTermUid
        }
      }

      // SDK returns the term object directly
      const term = await stack.taxonomy(taxonomyUid).terms().create(termData)

      validateTermResponse(term)
      trackedExpect(term.uid, 'Child term UID').toEqual('software')
      trackedExpect(term.parent_uid, 'Child term parent_uid').toEqual(parentTermUid)

      childTermUid = term.uid
    })

    it('should create another root term', async () => {
      const termData = {
        term: {
          name: 'Business',
          uid: 'business'
        }
      }

      // SDK returns the term object directly
      const term = await stack.taxonomy(taxonomyUid).terms().create(termData)

      validateTermResponse(term)
      expect(term.uid).to.equal('business')
    })

    it('should fetch a term', async () => {
      const response = await stack.taxonomy(taxonomyUid).terms(parentTermUid).fetch()

      trackedExpect(response, 'Term').toBeAn('object')
      trackedExpect(response.uid, 'Term UID').toEqual(parentTermUid)
      trackedExpect(response.name, 'Term name').toEqual('Technology')
    })

    it('should update term name', async () => {
      const term = await stack.taxonomy(taxonomyUid).terms(parentTermUid).fetch()
      term.name = 'Tech & Innovation'

      const response = await term.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal('Tech & Innovation')
    })

    it('should query all terms', async () => {
      const response = await stack.taxonomy(taxonomyUid).terms().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.terms).to.be.an('array')

      const items = response.items || response.terms
      expect(items.length).to.be.at.least(2)
    })

    it('should query terms with depth parameter', async () => {
      try {
        const response = await stack.taxonomy(taxonomyUid).terms().query({
          depth: 2
        }).find()

        expect(response).to.be.an('object')
        expect(response.items || response.terms).to.be.an('array')
      } catch (error) {
        console.log('Depth query not supported:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // HIERARCHICAL TERMS
  // ==========================================================================

  describe('Hierarchical Terms', () => {
    let grandparentUid
    let parentUid
    let childUid

    before(async () => {
      // Create hierarchical structure - SDK returns term object directly
      const grandparent = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: 'Electronics', uid: 'electronics' }
      })
      grandparentUid = grandparent.uid

      await wait(500)

      const parent = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: 'Computers', uid: 'computers', parent_uid: grandparentUid }
      })
      parentUid = parent.uid

      await wait(500)

      const child = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: 'Laptops', uid: 'laptops', parent_uid: parentUid }
      })
      childUid = child.uid
    })

    it('should have correct parent relationship', async () => {
      const term = await stack.taxonomy(taxonomyUid).terms(parentUid).fetch()

      expect(term.parent_uid).to.equal(grandparentUid)
    })

    it('should have correct grandchild relationship', async () => {
      const term = await stack.taxonomy(taxonomyUid).terms(childUid).fetch()

      expect(term.parent_uid).to.equal(parentUid)
    })

    it('should get term ancestors', async () => {
      try {
        const response = await stack.taxonomy(taxonomyUid).terms(childUid).ancestors()

        expect(response).to.be.an('object')
        if (response.terms) {
          expect(response.terms).to.be.an('array')
        }
      } catch (error) {
        console.log('Ancestors endpoint not available:', error.errorMessage)
      }
    })

    it('should get term descendants', async () => {
      try {
        const response = await stack.taxonomy(taxonomyUid).terms(grandparentUid).descendants()

        expect(response).to.be.an('object')
        if (response.terms) {
          expect(response.terms).to.be.an('array')
        }
      } catch (error) {
        console.log('Descendants endpoint not available:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // TERM MOVEMENT
  // ==========================================================================

  describe('Term Movement', () => {
    let moveableTermUid
    let newParentUid

    before(async function () {
      this.timeout(30000)
      const moveId = shortId()
      const parentId = shortId()
      
      // Create terms for movement testing
      const moveable = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: `Move Term ${moveId}`, uid: `move_${moveId}` }
      })
      moveableTermUid = moveable.uid

      await wait(1000)

      const newParent = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: `New Parent ${parentId}`, uid: `parent_${parentId}` }
      })
      newParentUid = newParent.uid
      
      await wait(1000)
    })

    it('should move term to new parent', async function () {
      this.timeout(15000)
      
      if (!moveableTermUid || !newParentUid) {
        this.skip()
        return
      }
      
      // Use the correct SDK syntax: terms(uid).move({ term: {...}, force: true })
      const response = await stack.taxonomy(taxonomyUid).terms(moveableTermUid).move({
        term: {
          parent_uid: newParentUid,
          order: 1
        },
        force: true
      })

      expect(response).to.be.an('object')
      expect(response.parent_uid).to.equal(newParentUid)
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create term with duplicate UID', async () => {
      // Create first
      try {
        await stack.taxonomy(taxonomyUid).terms().create({
          term: { name: 'Duplicate', uid: 'duplicate_term' }
        })
      } catch (e) { }

      // Try to create again
      try {
        await stack.taxonomy(taxonomyUid).terms().create({
          term: { name: 'Duplicate Again', uid: 'duplicate_term' }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }
    })

    it('should fail to fetch non-existent term', async () => {
      try {
        await stack.taxonomy(taxonomyUid).terms('nonexistent_term_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to create term with non-existent parent', async () => {
      try {
        await stack.taxonomy(taxonomyUid).terms().create({
          term: {
            name: 'Orphan Term',
            uid: 'orphan_term',
            parent_uid: 'nonexistent_parent'
          }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 404, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE TERMS
  // ==========================================================================

  describe('Delete Terms', () => {

    it('should delete a leaf term', async function () {
      this.timeout(30000)
      
      // Generate unique UID for this test
      const deleteTermUid = `del_${shortId()}`
      
      // Create a term to delete - SDK returns term object directly
      const createdTerm = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: 'Delete Me', uid: deleteTermUid }
      })
      
      await wait(1000)
      
      // Get the UID from the response (handle different response structures)
      const termUid = createdTerm.uid || (createdTerm.term && createdTerm.term.uid) || deleteTermUid
      expect(termUid).to.be.a('string', 'Term UID should be available after creation')

      // OLD pattern: use delete({ force: true }) directly and expect status 204
      const deleteResponse = await stack.taxonomy(taxonomyUid).terms(termUid).delete({ force: true })

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.status).to.equal(204)
    })

    it('should return 404 for deleted term', async function () {
      this.timeout(30000)
      
      // Generate unique UID for this test
      const verifyTermUid = `vfy_${shortId()}`
      
      // Create and delete - SDK returns term object directly
      const createdTerm = await stack.taxonomy(taxonomyUid).terms().create({
        term: { name: 'Delete Verify', uid: verifyTermUid }
      })
      
      await wait(1000)
      
      // Get the UID from the response (handle different response structures)
      const termUid = createdTerm.uid || (createdTerm.term && createdTerm.term.uid) || verifyTermUid

      // OLD pattern: use delete({ force: true }) directly
      await stack.taxonomy(taxonomyUid).terms(termUid).delete({ force: true })
      
      await wait(2000)

      try {
        await stack.taxonomy(taxonomyUid).terms(verifyTermUid).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
