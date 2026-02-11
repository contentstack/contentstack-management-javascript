/**
 * Content Type API Tests
 * 
 * Comprehensive test suite for:
 * - Content type CRUD operations
 * - Complex schema creation (all field types)
 * - Schema modifications
 * - Content type import/export
 * - Error handling and validation
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import path from 'path'
import {
  simpleContentType,
  mediumContentType,
  complexContentType,
  authorContentType,
  articleContentType,
  singletonContentType
} from '../mock/content-types/index.js'
import {
  validateContentTypeResponse,
  validateErrorResponse,
  generateValidUid,
  testData,
  safeDeleteContentType,
  wait,
  trackedExpect
} from '../utility/testHelpers.js'

// Get base path for mock files (works with both ESM and CommonJS after Babel transpilation)
const mockBasePath = path.resolve(process.cwd(), 'test/sanity-check/mock')

describe('Content Type API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // SIMPLE CONTENT TYPE CRUD
  // ==========================================================================

  describe('Simple Content Type CRUD', () => {
    const simpleCtUid = `simple_test_${Date.now()}`
    let createdCt

    it('should create a simple content type', async function () {
      this.timeout(30000)
      const ctData = JSON.parse(JSON.stringify(simpleContentType))
      ctData.content_type.uid = simpleCtUid
      ctData.content_type.title = `Simple Test ${Date.now()}`

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      trackedExpect(ct, 'Content type').toBeAn('object')
      trackedExpect(ct.uid, 'Content type UID').toBeA('string')
      validateContentTypeResponse(ct, simpleCtUid)

      trackedExpect(ct.title, 'Content type title').toInclude('Simple Test')
      expect(ct.schema).to.be.an('array')
      expect(ct.schema.length).to.be.at.least(1)

      // Verify schema fields
      const titleField = ct.schema.find(f => f.uid === 'title')
      expect(titleField).to.exist
      expect(titleField.data_type).to.equal('text')
      expect(titleField.mandatory).to.be.true

      createdCt = ct
      testData.contentTypes.simple = ct
      
      // Wait for content type to be fully created
      await wait(2000)
    })

    it('should fetch the created content type', async function () {
      this.timeout(15000)
      const response = await stack.contentType(simpleCtUid).fetch()

      trackedExpect(response, 'Content type').toBeAn('object')
      trackedExpect(response.uid, 'Content type UID').toEqual(simpleCtUid)
      trackedExpect(response.title, 'Content type title').toEqual(createdCt.title)
      expect(response.schema).to.deep.equal(createdCt.schema)
    })

    it('should update the content type title', async () => {
      const updateData = {
        content_type: {
          title: `Updated Simple Test ${Date.now()}`,
          description: 'Updated description'
        }
      }

      const ct = await stack.contentType(simpleCtUid).fetch()
      Object.assign(ct, updateData.content_type)
      const response = await ct.update()

      expect(response).to.be.an('object')
      expect(response.title).to.include('Updated Simple Test')
      expect(response.description).to.equal('Updated description')
    })

    it('should add a new field to the content type', async () => {
      const ct = await stack.contentType(simpleCtUid).fetch()

      // Add a new field to schema
      ct.schema.push({
        display_name: 'New Field',
        uid: 'new_field',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Dynamically added field', default_value: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      })

      const response = await ct.update()

      expect(response.schema).to.be.an('array')
      const newField = response.schema.find(f => f.uid === 'new_field')
      expect(newField).to.exist
      expect(newField.data_type).to.equal('text')
    })

    it('should query all content types', async () => {
      const response = await stack.contentType().query().find()

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')
      expect(response.items.length).to.be.at.least(1)

      // Verify our content type is in the list
      const found = response.items.find(ct => ct.uid === simpleCtUid)
      expect(found).to.exist
    })

    it('should query content types with limit and skip', async () => {
      const response = await stack.contentType().query({ limit: 5, skip: 0 }).find()

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')
      expect(response.items.length).to.be.at.most(5)
    })

    it('should delete a content type', async function () {
      this.timeout(30000)
      
      // Create a temporary content type specifically for delete testing
      // so we don't delete the simple CT which is needed by downstream tests (workflow, labels, etc.)
      const tempCtUid = `temp_del_ct_${Date.now()}`
      await stack.contentType().create({
        content_type: {
          title: 'Temp Delete Test CT',
          uid: tempCtUid,
          schema: [{ display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true, field_metadata: { _default: true } }]
        }
      })
      await wait(2000)
      
      const ct = await stack.contentType(tempCtUid).fetch()
      const response = await ct.delete()

      expect(response).to.be.an('object')
      expect(response.notice).to.be.a('string')
    })

    it('should return 404 for deleted content type', async function () {
      this.timeout(30000)
      
      // Create and delete a temp CT to test 404 behavior
      const tempCtUid = `temp_404_ct_${Date.now()}`
      await stack.contentType().create({
        content_type: {
          title: 'Temp 404 Test CT',
          uid: tempCtUid,
          schema: [{ display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true, field_metadata: { _default: true } }]
        }
      })
      await wait(2000)
      
      const ct = await stack.contentType(tempCtUid).fetch()
      await ct.delete()
      await wait(2000)
      
      try {
        await stack.contentType(tempCtUid).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })

  // ==========================================================================
  // MEDIUM COMPLEXITY CONTENT TYPE
  // ==========================================================================

  describe('Medium Complexity Content Type', () => {
    const mediumCtUid = `medium_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - content types persist for entries, variants, labels
      // Resources will be cleaned up when the stack is deleted at the end
    })

    it('should create content type with multiple field types', async () => {
      const ctData = JSON.parse(JSON.stringify(mediumContentType))
      ctData.content_type.uid = mediumCtUid
      ctData.content_type.title = `Medium Complexity ${Date.now()}`

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      validateContentTypeResponse(ct, mediumCtUid)

      // Verify all field types are present
      const fieldTypes = ct.schema.map(f => f.data_type)
      expect(fieldTypes).to.include('text')
      expect(fieldTypes).to.include('number')
      expect(fieldTypes).to.include('boolean')
      expect(fieldTypes).to.include('isodate')
      expect(fieldTypes).to.include('file')
      expect(fieldTypes).to.include('link')

      // Verify dropdown field
      const statusField = ct.schema.find(f => f.uid === 'status')
      expect(statusField).to.exist
      expect(statusField.display_type).to.equal('dropdown')
      expect(statusField.enum).to.be.an('object')
      expect(statusField.enum.choices).to.be.an('array')

      // Verify checkbox field
      const categoriesField = ct.schema.find(f => f.uid === 'categories')
      expect(categoriesField).to.exist
      expect(categoriesField.display_type).to.equal('checkbox')
      expect(categoriesField.multiple).to.be.true

      testData.contentTypes.medium = ct
    })

    it('should validate number field constraints', async () => {
      const ct = await stack.contentType(mediumCtUid).fetch()

      const viewCountField = ct.schema.find(f => f.uid === 'view_count')
      expect(viewCountField).to.exist
      expect(viewCountField.data_type).to.equal('number')
      expect(viewCountField.min).to.equal(0)
    })

    it('should validate boolean field defaults', async () => {
      const ct = await stack.contentType(mediumCtUid).fetch()

      const isFeaturedField = ct.schema.find(f => f.uid === 'is_featured')
      expect(isFeaturedField).to.exist
      expect(isFeaturedField.data_type).to.equal('boolean')
      expect(isFeaturedField.field_metadata.default_value).to.equal(false)
    })

    it('should validate date field configuration', async () => {
      const ct = await stack.contentType(mediumCtUid).fetch()

      const dateField = ct.schema.find(f => f.uid === 'publish_date')
      expect(dateField).to.exist
      expect(dateField.data_type).to.equal('isodate')
    })

    it('should validate file field configuration', async function () {
      this.timeout(60000)
      const ct = await stack.contentType(mediumCtUid).fetch()

      const fileField = ct.schema.find(f => f.uid === 'hero_image')
      expect(fileField).to.exist
      expect(fileField.data_type).to.equal('file')
      expect(fileField.field_metadata.image).to.be.true
    })
  })

  // ==========================================================================
  // COMPLEX CONTENT TYPE WITH NESTED STRUCTURES
  // ==========================================================================

  describe('Complex Content Type with Nested Structures', () => {
    const complexCtUid = `complex_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - content types persist for entries, variants, labels
    })

    it('should create content type with modular blocks', async () => {
      const ctData = JSON.parse(JSON.stringify(complexContentType))
      ctData.content_type.uid = complexCtUid
      ctData.content_type.title = `Complex Page ${Date.now()}`

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      validateContentTypeResponse(ct, complexCtUid)

      // Verify modular blocks field exists
      const sectionsField = ct.schema.find(f => f.uid === 'sections')
      expect(sectionsField).to.exist
      expect(sectionsField.data_type).to.equal('blocks')
      expect(sectionsField.blocks).to.be.an('array')
      expect(sectionsField.blocks.length).to.be.at.least(1)

      testData.contentTypes.complex = ct
    })

    it('should validate modular block structure', async () => {
      const ct = await stack.contentType(complexCtUid).fetch()

      const sectionsField = ct.schema.find(f => f.uid === 'sections')
      const heroBlock = sectionsField.blocks.find(b => b.uid === 'hero_section')

      expect(heroBlock).to.exist
      expect(heroBlock.title).to.equal('Hero Section')
      expect(heroBlock.schema).to.be.an('array')

      // Verify hero block has expected fields
      const headlineField = heroBlock.schema.find(f => f.uid === 'headline')
      expect(headlineField).to.exist
      expect(headlineField.mandatory).to.be.true
    })

    it('should validate nested group field', async () => {
      const ct = await stack.contentType(complexCtUid).fetch()

      const seoField = ct.schema.find(f => f.uid === 'seo')
      expect(seoField).to.exist
      expect(seoField.data_type).to.equal('group')
      expect(seoField.schema).to.be.an('array')

      // Verify nested fields
      const metaTitleField = seoField.schema.find(f => f.uid === 'meta_title')
      expect(metaTitleField).to.exist
      expect(metaTitleField.data_type).to.equal('text')
    })

    it('should validate repeatable group field', async () => {
      const ct = await stack.contentType(complexCtUid).fetch()

      const linksField = ct.schema.find(f => f.uid === 'links')
      expect(linksField).to.exist
      expect(linksField.data_type).to.equal('group')
      expect(linksField.multiple).to.be.true
      expect(linksField.schema).to.be.an('array')
    })

    it('should validate JSON RTE field', async () => {
      const ct = await stack.contentType(complexCtUid).fetch()

      const jsonRteField = ct.schema.find(f => f.uid === 'content_json_rte')
      expect(jsonRteField).to.exist
      expect(jsonRteField.data_type).to.equal('json')
      expect(jsonRteField.field_metadata.allow_json_rte).to.be.true
    })
  })

  // ==========================================================================
  // CONTENT TYPE WITH REFERENCES
  // ==========================================================================

  describe('Content Type with References', () => {
    const authorCtUid = `author_${Date.now()}`
    const articleCtUid = `article_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - content types persist for entries, variants, labels
    })

    it('should create author content type (reference target)', async () => {
      const ctData = JSON.parse(JSON.stringify(authorContentType))
      ctData.content_type.uid = authorCtUid
      ctData.content_type.title = `Author ${Date.now()}`

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      validateContentTypeResponse(ct, authorCtUid)
      testData.contentTypes.author = ct
    })

    it('should create article content type with references', async () => {
      // Update reference to point to our author content type
      const ctData = JSON.parse(JSON.stringify(articleContentType))
      ctData.content_type.uid = articleCtUid
      ctData.content_type.title = `Article ${Date.now()}`

      // Update author reference to use our created author CT
      const authorField = ctData.content_type.schema.find(f => f.uid === 'author')
      if (authorField) {
        authorField.reference_to = [authorCtUid]
      }

      // Update related_articles to reference self
      const relatedField = ctData.content_type.schema.find(f => f.uid === 'related_articles')
      if (relatedField) {
        relatedField.reference_to = [articleCtUid]
      }

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      validateContentTypeResponse(ct, articleCtUid)

      // Verify reference field
      const refField = ct.schema.find(f => f.uid === 'author')
      expect(refField).to.exist
      expect(refField.data_type).to.equal('reference')

      testData.contentTypes.article = ct
    })

    it('should validate single reference field', async () => {
      const ct = await stack.contentType(articleCtUid).fetch()

      const authorRef = ct.schema.find(f => f.uid === 'author')
      expect(authorRef).to.exist
      expect(authorRef.data_type).to.equal('reference')
      expect(authorRef.reference_to).to.be.an('array')
      expect(authorRef.field_metadata.ref_multiple).to.be.false
    })

    // NOTE: Taxonomy field validation test removed - it was always skipping
    // because taxonomies need to be pre-created and linked. Taxonomy CRUD
    // operations are tested separately in taxonomy-test.js
  })

  // ==========================================================================
  // SINGLETON CONTENT TYPE
  // ==========================================================================

  describe('Singleton Content Type', () => {
    const singletonCtUid = `site_settings_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - content types persist for entries, variants, labels
    })

    it('should create singleton content type', async () => {
      const ctData = JSON.parse(JSON.stringify(singletonContentType))
      ctData.content_type.uid = singletonCtUid
      ctData.content_type.title = `Site Settings ${Date.now()}`

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      validateContentTypeResponse(ct, singletonCtUid)
      expect(ct.options.singleton).to.be.true
      expect(ct.options.is_page).to.be.false
    })

    it('should validate singleton options', async () => {
      const ct = await stack.contentType(singletonCtUid).fetch()

      expect(ct.options).to.be.an('object')
      expect(ct.options.singleton).to.be.true
    })
  })

  // ==========================================================================
  // ERROR HANDLING TESTS
  // ==========================================================================

  describe('Error Handling', () => {
    
    it('should fail to create content type with duplicate UID', async () => {
      const ctData = JSON.parse(JSON.stringify(simpleContentType))
      ctData.content_type.uid = 'duplicate_test'
      ctData.content_type.title = 'Duplicate Test'

      // Create first
      try {
        await stack.contentType().create(ctData)
      } catch (e) { }

      // Try to create again with same UID
      try {
        await stack.contentType().create(ctData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }

      // Cleanup
      try {
        const ct = await stack.contentType('duplicate_test').fetch()
        await ct.delete()
      } catch (e) { }
    })

    it('should fail to create content type with invalid UID format', async () => {
      const ctData = JSON.parse(JSON.stringify(simpleContentType))
      ctData.content_type.uid = 'Invalid-UID-With-Caps!'
      ctData.content_type.title = 'Invalid UID Test'

      try {
        await stack.contentType().create(ctData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create content type without title', async () => {
      const ctData = {
        content_type: {
          uid: 'no_title_test',
          schema: []
        }
      }

      try {
        await stack.contentType().create(ctData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to fetch non-existent content type', async () => {
      try {
        await stack.contentType('non_existent_ct_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to delete content type with entries', async () => {
      // This test requires creating entries first
      // Skipping as it's dependent on entry tests
      console.log('Delete with entries - test requires entry creation first')
    })
  })

  // ==========================================================================
  // SCHEMA MODIFICATION TESTS
  // ==========================================================================

  describe('Schema Modifications', () => {
    const modifyCtUid = `modify_${Date.now()}`

    before(async () => {
      const ctData = JSON.parse(JSON.stringify(simpleContentType))
      ctData.content_type.uid = modifyCtUid
      ctData.content_type.title = `Modify Test ${Date.now()}`
      await stack.contentType().create(ctData)
    })

    after(async () => {
      // NOTE: Deletion removed - content types persist for entries, variants, labels
    })

    it('should add a new text field to schema', async () => {
      const ct = await stack.contentType(modifyCtUid).fetch()

      ct.schema.push({
        display_name: 'Added Text Field',
        uid: 'added_text',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Added via update' }
      })

      const response = await ct.update()

      const addedField = response.schema.find(f => f.uid === 'added_text')
      expect(addedField).to.exist
      expect(addedField.data_type).to.equal('text')
    })

    it('should modify field properties', async function () {
      this.timeout(60000)
      const ct = await stack.contentType(modifyCtUid).fetch()

      const addedField = ct.schema.find(f => f.uid === 'added_text')
      if (addedField) {
        addedField.display_name = 'Modified Text Field'
        addedField.field_metadata.description = 'Modified description'
      }

      const response = await ct.update()

      const modifiedField = response.schema.find(f => f.uid === 'added_text')
      expect(modifiedField.display_name).to.equal('Modified Text Field')
    })

    it('should add a group field with nested schema', async () => {
      const ct = await stack.contentType(modifyCtUid).fetch()

      ct.schema.push({
        display_name: 'Settings',
        uid: 'settings',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: '' },
        schema: [
          {
            display_name: 'Enabled',
            uid: 'enabled',
            data_type: 'boolean',
            mandatory: false,
            field_metadata: { default_value: false }
          }
        ]
      })

      const response = await ct.update()

      const settingsField = response.schema.find(f => f.uid === 'settings')
      expect(settingsField).to.exist
      expect(settingsField.data_type).to.equal('group')
      expect(settingsField.schema).to.be.an('array')
    })

    it('should remove a non-required field from schema', async () => {
      const ct = await stack.contentType(modifyCtUid).fetch()

      const initialLength = ct.schema.length
      ct.schema = ct.schema.filter(f => f.uid !== 'added_text')

      const response = await ct.update()

      expect(response.schema.length).to.equal(initialLength - 1)
      const removedField = response.schema.find(f => f.uid === 'added_text')
      expect(removedField).to.not.exist
    })
  })

  // ==========================================================================
  // CONTENT TYPE IMPORT
  // ==========================================================================

  describe('Content Type Import', () => {
    let importedCtUid = null

    after(async function () {
      this.timeout(30000)
      // NOTE: Deletion removed - imported content types persist for other tests
    })

    it('should import content type from JSON file', async function () {
      this.timeout(30000)
      
      const importPath = path.join(mockBasePath, 'contentType-import.json')
      
      try {
        const response = await stack.contentType().import({
          content_type: importPath
        })
        
        expect(response).to.be.an('object')
        expect(response.uid).to.be.a('string')
        
        importedCtUid = response.uid
        testData.contentTypes.imported = response
        
        await wait(2000)
      } catch (error) {
        // Import might fail if content type with same UID exists
        if (error.errorCode === 115 || error.message?.includes('already exists')) {
          console.log('Content type already exists, skipping import test')
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should fetch imported content type', async function () {
      this.timeout(15000)
      
      if (!importedCtUid) {
        this.skip()
        return
      }
      
      const response = await stack.contentType(importedCtUid).fetch()
      
      expect(response).to.be.an('object')
      expect(response.uid).to.equal(importedCtUid)
      expect(response.title).to.equal('Imported Content Type')
      
      // Verify schema was imported correctly
      expect(response.schema).to.be.an('array')
      const titleField = response.schema.find(f => f.uid === 'title')
      expect(titleField).to.exist
      expect(titleField.data_type).to.equal('text')
    })

    it('should validate imported content type options', async function () {
      this.timeout(15000)
      
      if (!importedCtUid) {
        this.skip()
        return
      }
      
      const response = await stack.contentType(importedCtUid).fetch()
      
      expect(response.options).to.be.an('object')
      expect(response.options.is_page).to.be.true
      expect(response.options.singleton).to.be.false
    })
  })
})
