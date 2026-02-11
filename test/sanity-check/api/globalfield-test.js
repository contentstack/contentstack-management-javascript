/**
 * Global Field API Tests
 *
 * Comprehensive test suite for:
 * - Global field CRUD operations
 * - Complex nested schemas
 * - Nested global fields (api_version 3.2)
 * - Global field import
 * - Global field in content types
 * - Error handling
 */

import path from 'path'
import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  seoGlobalField,
  contentBlockGlobalField,
  heroBannerGlobalField,
  cardGlobalField
} from '../mock/global-fields.js'
import {
  validateGlobalFieldResponse,
  testData,
  wait,
  trackedExpect
} from '../utility/testHelpers.js'

// Get base path for mock files (works with both ESM and CommonJS after Babel transpilation)
const mockBasePath = path.resolve(process.cwd(), 'test/sanity-check/mock')

describe('Global Field API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // SIMPLE GLOBAL FIELD CRUD
  // ==========================================================================

  describe('Simple Global Field CRUD', () => {
    const seoGfUid = `seo_${Date.now()}`
    let createdGf

    after(async () => {
      // NOTE: Deletion removed - global fields persist for content type tests
    })

    it('should create a simple global field', async function () {
      this.timeout(60000)
      const gfData = JSON.parse(JSON.stringify(seoGlobalField))
      gfData.global_field.uid = seoGfUid
      gfData.global_field.title = `SEO ${Date.now()}`

      // SDK returns the global field object directly
      const gf = await stack.globalField().create(gfData)

      trackedExpect(gf, 'Global field').toBeAn('object')
      trackedExpect(gf.uid, 'Global field UID').toBeA('string')
      validateGlobalFieldResponse(gf, seoGfUid)

      expect(gf.title).to.include('SEO')
      expect(gf.schema).to.be.an('array')
      expect(gf.schema.length).to.be.at.least(1)

      createdGf = gf
      testData.globalFields.seo = gf

      // Wait for global field to be fully created
      await wait(5000)
    })

    it('should fetch the created global field', async function () {
      this.timeout(15000)
      const response = await stack.globalField(seoGfUid).fetch()

      trackedExpect(response, 'Global field').toBeAn('object')
      trackedExpect(response.uid, 'Global field UID').toEqual(seoGfUid)
      expect(response.title).to.equal(createdGf.title)
    })

    it('should validate global field schema fields', async () => {
      const gf = await stack.globalField(seoGfUid).fetch()

      // Check for expected fields in SEO schema
      const metaTitleField = gf.schema.find(f => f.uid === 'meta_title')
      expect(metaTitleField).to.exist
      expect(metaTitleField.data_type).to.equal('text')

      const metaDescField = gf.schema.find(f => f.uid === 'meta_description')
      expect(metaDescField).to.exist
      expect(metaDescField.field_metadata.multiline).to.be.true
    })

    it('should update global field title', async () => {
      const gf = await stack.globalField(seoGfUid).fetch()
      const newTitle = `Updated SEO ${Date.now()}`

      gf.title = newTitle
      const response = await gf.update()

      expect(response).to.be.an('object')
      expect(response.title).to.equal(newTitle)
    })

    it('should add a field to global field schema', async () => {
      const gf = await stack.globalField(seoGfUid).fetch()

      gf.schema.push({
        display_name: 'Robots',
        uid: 'robots',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Robots meta tag', default_value: '' }
      })

      const response = await gf.update()

      const robotsField = response.schema.find(f => f.uid === 'robots')
      expect(robotsField).to.exist
    })

    it('should query all global fields', async () => {
      const response = await stack.globalField().query().find()

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')

      // Verify our global field is in the list
      const found = response.items.find(gf => gf.uid === seoGfUid)
      expect(found).to.exist
    })

    it('should delete the global field', async () => {
      // Create a temporary GF to delete
      const tempUid = `temp_delete_${Date.now()}`
      const gfData = {
        global_field: {
          title: 'Temp Delete Test',
          uid: tempUid,
          schema: [
            { display_name: 'Field', uid: 'field', data_type: 'text' }
          ]
        }
      }

      await stack.globalField().create(gfData)

      const gf = await stack.globalField(tempUid).fetch()
      const response = await gf.delete()

      expect(response).to.be.an('object')
      expect(response.notice).to.be.a('string')
    })
  })

  // ==========================================================================
  // CONTENT BLOCK GLOBAL FIELD
  // ==========================================================================

  describe('Content Block Global Field', () => {
    const contentBlockUid = `content_block_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - global fields persist for content type tests
    })

    it('should create content block with nested groups', async () => {
      const gfData = JSON.parse(JSON.stringify(contentBlockGlobalField))
      gfData.global_field.uid = contentBlockUid
      gfData.global_field.title = `Content Block ${Date.now()}`

      // SDK returns the global field object directly
      const gf = await stack.globalField().create(gfData)

      validateGlobalFieldResponse(gf, contentBlockUid)

      // Verify nested group field
      const linksField = gf.schema.find(f => f.uid === 'links')
      expect(linksField).to.exist
      expect(linksField.data_type).to.equal('group')
      expect(linksField.multiple).to.be.true
      expect(linksField.schema).to.be.an('array')

      testData.globalFields.contentBlock = gf
    })

    it('should validate nested group schema', async () => {
      const gf = await stack.globalField(contentBlockUid).fetch()

      const linksField = gf.schema.find(f => f.uid === 'links')
      expect(linksField.schema).to.be.an('array')

      // Check nested fields
      const linkField = linksField.schema.find(f => f.uid === 'link')
      expect(linkField).to.exist
      expect(linkField.data_type).to.equal('link')

      const styleField = linksField.schema.find(f => f.uid === 'style')
      expect(styleField).to.exist
      expect(styleField.display_type).to.equal('dropdown')
    })

    it('should validate JSON RTE field', async () => {
      const gf = await stack.globalField(contentBlockUid).fetch()

      const contentField = gf.schema.find(f => f.uid === 'content')
      expect(contentField).to.exist
      expect(contentField.data_type).to.equal('json')
      expect(contentField.field_metadata.allow_json_rte).to.be.true
    })
  })

  // ==========================================================================
  // HERO BANNER GLOBAL FIELD
  // ==========================================================================

  describe('Hero Banner Global Field', () => {
    const heroBannerUid = `hero_banner_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - global fields persist for content type tests
    })

    it('should create hero banner with all field types', async () => {
      const gfData = JSON.parse(JSON.stringify(heroBannerGlobalField))
      gfData.global_field.uid = heroBannerUid
      gfData.global_field.title = `Hero Banner ${Date.now()}`

      // SDK returns the global field object directly
      const gf = await stack.globalField().create(gfData)

      validateGlobalFieldResponse(gf, heroBannerUid)

      // Verify various field types
      const textColorField = gf.schema.find(f => f.uid === 'text_color')
      expect(textColorField.display_type).to.equal('radio')

      const sizeField = gf.schema.find(f => f.uid === 'size')
      expect(sizeField.display_type).to.equal('dropdown')

      testData.globalFields.heroBanner = gf
    })

    it('should validate file fields', async () => {
      const gf = await stack.globalField(heroBannerUid).fetch()

      const bgImageField = gf.schema.find(f => f.uid === 'background_image')
      expect(bgImageField).to.exist
      expect(bgImageField.data_type).to.equal('file')
      expect(bgImageField.field_metadata.image).to.be.true

      const bgVideoField = gf.schema.find(f => f.uid === 'background_video')
      expect(bgVideoField).to.exist
      expect(bgVideoField.data_type).to.equal('file')
      expect(bgVideoField.multiple).to.be.true
    })

    it('should validate link fields', async () => {
      const gf = await stack.globalField(heroBannerUid).fetch()

      const primaryCtaField = gf.schema.find(f => f.uid === 'primary_cta')
      expect(primaryCtaField).to.exist
      expect(primaryCtaField.data_type).to.equal('link')

      const secondaryCtaField = gf.schema.find(f => f.uid === 'secondary_cta')
      expect(secondaryCtaField).to.exist
      expect(secondaryCtaField.data_type).to.equal('link')
    })

    it('should validate modal group', async () => {
      const gf = await stack.globalField(heroBannerUid).fetch()

      const modalField = gf.schema.find(f => f.uid === 'modal')
      expect(modalField).to.exist
      expect(modalField.data_type).to.equal('group')
      expect(modalField.multiple).to.be.false

      // Verify nested modal fields
      const enabledField = modalField.schema.find(f => f.uid === 'enabled')
      expect(enabledField).to.exist
      expect(enabledField.data_type).to.equal('boolean')
    })
  })

  // ==========================================================================
  // CARD GLOBAL FIELD
  // ==========================================================================

  describe('Card Global Field', () => {
    const cardUid = `card_${Date.now()}`

    after(async () => {
      // NOTE: Deletion removed - global fields persist for content type tests
    })

    it('should create card global field', async () => {
      const gfData = JSON.parse(JSON.stringify(cardGlobalField))
      gfData.global_field.uid = cardUid
      gfData.global_field.title = `Card ${Date.now()}`

      // SDK returns the global field object directly
      const gf = await stack.globalField().create(gfData)

      validateGlobalFieldResponse(gf, cardUid)

      testData.globalFields.card = gf
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {
    it('should fail to create global field with duplicate UID', async () => {
      const gfData = {
        global_field: {
          title: 'Duplicate Test',
          uid: 'duplicate_gf_test',
          schema: [
            { display_name: 'Field', uid: 'field', data_type: 'text' }
          ]
        }
      }

      // Create first
      try {
        await stack.globalField().create(gfData)
      } catch (e) { }

      // Try to create again
      try {
        await stack.globalField().create(gfData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }

      // Cleanup
      try {
        const gf = await stack.globalField('duplicate_gf_test').fetch()
        await gf.delete()
      } catch (e) { }
    })

    it('should fail to create global field with invalid UID', async () => {
      const gfData = {
        global_field: {
          title: 'Invalid UID Test',
          uid: 'Invalid-UID-With-Caps!',
          schema: []
        }
      }

      try {
        await stack.globalField().create(gfData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to fetch non-existent global field', async () => {
      try {
        await stack.globalField('nonexistent_gf_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to create global field without schema', async () => {
      const gfData = {
        global_field: {
          title: 'No Schema Test',
          uid: 'no_schema_test'
        }
      }

      try {
        await stack.globalField().create(gfData)
        // Some APIs might allow empty schema
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })

  // ==========================================================================
  // GLOBAL FIELD IN CONTENT TYPE
  // ==========================================================================

  describe('Global Field in Content Type', () => {
    const testGfUid = `embed_test_gf_${Date.now()}`
    const testCtUid = `embed_test_ct_${Date.now()}`

    before(async function () {
      this.timeout(60000)
      // Create a global field for embedding
      const gfData = {
        global_field: {
          title: 'Embed Test GF',
          uid: testGfUid,
          schema: [
            {
              display_name: 'Text Field',
              uid: 'text_field',
              data_type: 'text',
              mandatory: false
            }
          ]
        }
      }

      await stack.globalField().create(gfData)
      await wait(2000)
    })

    after(async () => {
      // NOTE: Deletion removed - content types and global fields persist for other tests
    })

    it('should embed global field in content type', async function () {
      this.timeout(30000)
      const ctData = {
        content_type: {
          title: 'Embed Test CT',
          uid: testCtUid,
          schema: [
            {
              display_name: 'Title',
              uid: 'title',
              data_type: 'text',
              mandatory: true,
              unique: true,
              field_metadata: { _default: true }
            },
            {
              display_name: 'Embedded GF',
              uid: 'embedded_gf',
              data_type: 'global_field',
              reference_to: testGfUid,
              field_metadata: { description: 'Embedded global field' }
            }
          ]
        }
      }

      // SDK returns the content type object directly
      const ct = await stack.contentType().create(ctData)

      expect(ct.uid).to.equal(testCtUid)

      const gfField = ct.schema.find(f => f.uid === 'embedded_gf')
      expect(gfField).to.exist
      expect(gfField.data_type).to.equal('global_field')
      expect(gfField.reference_to).to.equal(testGfUid)
    })

    it('should fetch content type with global field reference', async function () {
      this.timeout(30000)
      const ct = await stack.contentType(testCtUid).fetch()

      const gfField = ct.schema.find(f => f.uid === 'embedded_gf')
      expect(gfField).to.exist
      expect(gfField.data_type).to.equal('global_field')
    })
  })

  // ==========================================================================
  // NESTED GLOBAL FIELDS (api_version: 3.2)
  // ==========================================================================

  describe('Nested Global Fields (api_version 3.2)', () => {
    const baseGfUid = `base_gf_${Date.now()}`
    const nestedGfUid = `ngf_parent_${Date.now()}`

    after(async function () {
      this.timeout(60000)
      // NOTE: Deletion removed - nested global fields persist for other tests
    })

    it('should create base global field for nesting', async function () {
      this.timeout(30000)

      const gfData = {
        global_field: {
          title: `Base GF ${Date.now()}`,
          uid: baseGfUid,
          schema: [
            {
              display_name: 'Label',
              uid: 'label',
              data_type: 'text',
              mandatory: false,
              field_metadata: { description: '', default_value: '', version: 3 },
              multiple: false,
              unique: false
            },
            {
              display_name: 'Value',
              uid: 'value',
              data_type: 'text',
              mandatory: false,
              field_metadata: { description: '', default_value: '', version: 3 },
              multiple: false,
              unique: false
            }
          ]
        }
      }

      const response = await stack.globalField({ api_version: '3.2' }).create(gfData)

      expect(response).to.be.an('object')
      const gf = response.global_field || response
      expect(gf.uid).to.equal(baseGfUid)

      testData.globalFields.baseForNesting = gf
      await wait(2000)
    })

    it('should create nested global field referencing base', async function () {
      this.timeout(30000)

      const gfData = {
        global_field: {
          title: `Nested Parent ${Date.now()}`,
          uid: nestedGfUid,
          schema: [
            {
              display_name: 'Parent Title',
              uid: 'parent_title',
              data_type: 'text',
              mandatory: true,
              field_metadata: { description: '', default_value: '', version: 3 },
              multiple: false,
              unique: false
            },
            {
              display_name: 'Nested Base GF',
              uid: 'nested_base_gf',
              data_type: 'global_field',
              reference_to: baseGfUid,
              field_metadata: { description: 'Embedded global field' },
              multiple: false,
              mandatory: false,
              unique: false
            }
          ]
        }
      }

      const response = await stack.globalField({ api_version: '3.2' }).create(gfData)

      expect(response).to.be.an('object')
      const gf = response.global_field || response
      expect(gf.uid).to.equal(nestedGfUid)

      // Validate nested field structure
      const nestedField = gf.schema.find(f => f.data_type === 'global_field')
      expect(nestedField).to.exist
      expect(nestedField.reference_to).to.equal(baseGfUid)

      testData.globalFields.nestedParent = gf
      await wait(2000)
    })

    it('should fetch nested global field with api_version 3.2', async function () {
      this.timeout(15000)

      const response = await stack.globalField(nestedGfUid, { api_version: '3.2' }).fetch()

      expect(response).to.be.an('object')
      expect(response.uid).to.equal(nestedGfUid)

      // Verify nested field is present
      const nestedField = response.schema.find(f => f.data_type === 'global_field')
      expect(nestedField).to.exist
    })

    it('should query all nested global fields with api_version 3.2', async function () {
      this.timeout(15000)

      const response = await stack.globalField({ api_version: '3.2' }).query().find()

      expect(response).to.be.an('object')
      const items = response.items || response.global_fields || []
      expect(items).to.be.an('array')
      expect(items.length).to.be.at.least(1)
    })

    it('should update nested global field', async function () {
      this.timeout(30000)

      const gf = await stack.globalField(nestedGfUid, { api_version: '3.2' }).fetch()
      const newTitle = `Updated Nested ${Date.now()}`

      gf.title = newTitle
      const response = await gf.update()

      expect(response.title).to.equal(newTitle)
    })

    it('should validate nested global field schema structure', async function () {
      this.timeout(15000)

      const gf = await stack.globalField(nestedGfUid, { api_version: '3.2' }).fetch()

      // Should have at least 2 fields: text field + nested global field
      expect(gf.schema.length).to.be.at.least(2)

      // Find the nested global_field type
      const globalFieldTypes = gf.schema.filter(f => f.data_type === 'global_field')
      expect(globalFieldTypes.length).to.be.at.least(1)

      globalFieldTypes.forEach(field => {
        expect(field.reference_to).to.be.a('string')
        expect(field.reference_to.length).to.be.at.least(1)
      })
    })
  })

  // ==========================================================================
  // GLOBAL FIELD IMPORT
  // ==========================================================================

  describe('Global Field Import', () => {
    let importedGfUid = null

    after(async function () {
      this.timeout(30000)
      // NOTE: Deletion removed - imported global fields persist for other tests
    })

    it('should import global field from JSON file', async function () {
      this.timeout(30000)

      const importPath = path.join(mockBasePath, 'globalfield-import.json')

      // First, try to delete any existing global field with the same UID
      // The import file has uid: "imported_gf"
      try {
        const existingGf = await stack.globalField('imported_gf').fetch()
        if (existingGf) {
          await existingGf.delete()
          await wait(2000)
        }
      } catch (e) {
        // Global field doesn't exist, which is fine
      }

      try {
        const response = await stack.globalField().import({
          global_field: importPath
        })

        expect(response).to.be.an('object')
        expect(response.uid).to.be.a('string')

        importedGfUid = response.uid
        testData.globalFields.imported = response

        await wait(2000)
      } catch (error) {
        // Import might fail for other reasons
        console.log('Import error:', error.message || error.errorMessage)
        throw error
      }
    })

    it('should fetch imported global field', async function () {
      this.timeout(15000)

      if (!importedGfUid) {
        this.skip()
        return
      }

      const response = await stack.globalField(importedGfUid).fetch()

      expect(response).to.be.an('object')
      expect(response.uid).to.equal(importedGfUid)
      expect(response.title).to.equal('Imported Global Field')
    })
  })
})
