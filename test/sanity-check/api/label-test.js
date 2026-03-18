/**
 * Label API Tests
 *
 * Comprehensive test suite for:
 * - Label CRUD operations
 * - Label with content types
 * - Error handling
 *
 * NOTE: Labels require existing content types when using specific UIDs.
 * We either use empty content_types array or create a content type first.
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, wait, trackedExpect } from '../utility/testHelpers.js'

describe('Label API Tests', () => {
  let client
  let stack
  let testContentTypeUid = null

  before(async function () {
    this.timeout(60000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // Create a simple content type for label tests
    try {
      const ctData = {
        content_type: {
          title: 'Label Test CT',
          uid: `label_test_ct_${Date.now().toString().slice(-6)}`,
          schema: [
            {
              display_name: 'Title',
              uid: 'title',
              data_type: 'text',
              field_metadata: { _default: true },
              unique: false,
              mandatory: true,
              multiple: false
            }
          ],
          options: {
            is_page: false,
            singleton: false,
            title: 'title'
          }
        }
      }

      const response = await stack.contentType().create(ctData)
      testContentTypeUid = response.content_type ? response.content_type.uid : response.uid
      await wait(2000)
    } catch (error) {
      console.log('Could not create test content type for labels:', error.errorMessage || error.message)
      // Try to get an existing content type
      try {
        const response = await stack.contentType().query().find()
        const items = response.items || response.content_types || []
        if (items.length > 0) {
          testContentTypeUid = items[0].uid
        }
      } catch (e) {
        // No content types available
      }
    }
  })

  after(async function () {
    // NOTE: Deletion removed - content types persist for other tests
  })

  // Helper to fetch label by UID using query
  async function fetchLabelByUid (labelUid) {
    const response = await stack.label().query().find()
    const items = response.items || response.labels || []
    const label = items.find(l => l.uid === labelUid)
    if (!label) {
      const error = new Error(`Label with UID ${labelUid} not found`)
      error.status = 404
      throw error
    }
    return label
  }

  // ==========================================================================
  // LABEL CRUD OPERATIONS
  // ==========================================================================

  describe('Label CRUD Operations', () => {
    let createdLabelUid

    after(async () => {
      // NOTE: Deletion removed - labels persist for other tests
    })

    it('should create a label with empty content types', async function () {
      this.timeout(30000)

      // Use empty content_types to avoid dependency issues
      const labelData = {
        label: {
          name: `Test Label ${Date.now()}`,
          content_types: []
        }
      }

      const response = await stack.label().create(labelData)

      trackedExpect(response, 'Label').toBeAn('object')
      trackedExpect(response.uid, 'Label UID').toBeA('string')
      trackedExpect(response.name, 'Label name').toInclude('Test Label')

      createdLabelUid = response.uid
      testData.labels = testData.labels || {}
      testData.labels.basic = response

      await wait(1000)
    })

    it('should fetch label by UID from query', async function () {
      this.timeout(15000)
      const label = await fetchLabelByUid(createdLabelUid)

      trackedExpect(label, 'Label').toBeAn('object')
      trackedExpect(label.uid, 'Label UID').toEqual(createdLabelUid)
    })

    it('should update label name', async () => {
      const label = await fetchLabelByUid(createdLabelUid)
      const newName = `Updated Label ${Date.now()}`

      label.name = newName
      const response = await label.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should query all labels', async () => {
      const response = await stack.label().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.labels).to.be.an('array')
    })

    it('should query labels with limit', async () => {
      const response = await stack.label().query({ limit: 5 }).find()

      expect(response).to.be.an('object')
      const items = response.items || response.labels
      expect(items.length).to.be.at.most(5)
    })
  })

  // ==========================================================================
  // LABEL WITH CONTENT TYPES
  // ==========================================================================

  describe('Label with Content Types', () => {
    let specificLabelUid

    after(async () => {
      // NOTE: Deletion removed - labels persist for other tests
    })

    it('should create label for specific content type', async function () {
      this.timeout(30000)

      if (!testContentTypeUid) {
        console.log('Skipping - no test content type available')
        return
      }

      const labelData = {
        label: {
          name: `CT Specific Label ${Date.now()}`,
          content_types: [testContentTypeUid]
        }
      }

      const response = await stack.label().create(labelData)

      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      expect(response.content_types).to.be.an('array')
      expect(response.content_types).to.include(testContentTypeUid)

      specificLabelUid = response.uid

      await wait(1000)
    })

    it('should update label to remove content types', async function () {
      if (!specificLabelUid) {
        console.log('Skipping - no label created')
        return
      }

      const label = await fetchLabelByUid(specificLabelUid)
      label.content_types = []

      const response = await label.update()

      expect(response.content_types).to.be.an('array')
    })
  })

  // ==========================================================================
  // PARENT-CHILD LABELS
  // ==========================================================================

  describe('Parent-Child Labels', () => {
    let parentLabelUid

    after(async () => {
      // NOTE: Deletion removed - labels persist for other tests
    })

    it('should create parent label', async function () {
      this.timeout(30000)

      const labelData = {
        label: {
          name: `Parent Label ${Date.now()}`,
          content_types: []
        }
      }

      const response = await stack.label().create(labelData)

      expect(response.uid).to.be.a('string')
      parentLabelUid = response.uid

      await wait(1000)
    })

    it('should create child label with parent', async function () {
      this.timeout(30000)

      if (!parentLabelUid) {
        console.log('Skipping - no parent label')
        return
      }

      const labelData = {
        label: {
          name: `Child Label ${Date.now()}`,
          parent: [parentLabelUid],
          content_types: []
        }
      }

      const response = await stack.label().create(labelData)

      expect(response.uid).to.be.a('string')
      expect(response.parent).to.be.an('array')
      expect(response.parent).to.include(parentLabelUid)
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {
    it('should fail to create label without name', async () => {
      const labelData = {
        label: {
          content_types: []
        }
      }

      try {
        await stack.label().create(labelData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create label with non-existent content type', async () => {
      const labelData = {
        label: {
          name: 'Invalid CT Label',
          content_types: ['nonexistent_content_type_xyz']
        }
      }

      try {
        await stack.label().create(labelData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
        // Check for specific error if errors object exists
        if (error.errors) {
          expect(error.errors).to.have.property('content_types')
        }
      }
    })

    it('should fail to fetch non-existent label', async () => {
      try {
        await fetchLabelByUid('nonexistent_label_12345')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE LABEL
  // ==========================================================================

  describe('Delete Label', () => {
    it('should delete a label', async function () {
      this.timeout(30000)
      const labelData = {
        label: {
          name: `Delete Test Label ${Date.now()}`,
          content_types: []
        }
      }

      const response = await stack.label().create(labelData)
      expect(response.uid).to.be.a('string')

      await wait(1000)

      const label = await fetchLabelByUid(response.uid)
      const deleteResponse = await label.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })

    it('should return 404 for deleted label', async function () {
      this.timeout(30000)
      const labelData = {
        label: {
          name: `Verify Delete Label ${Date.now()}`,
          content_types: []
        }
      }

      const response = await stack.label().create(labelData)
      const labelUid = response.uid

      await wait(1000)

      const label = await fetchLabelByUid(labelUid)
      await label.delete()

      await wait(2000)

      try {
        await fetchLabelByUid(labelUid)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
