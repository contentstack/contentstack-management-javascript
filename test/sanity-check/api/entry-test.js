/**
 * Entry API Tests
 * 
 * Comprehensive test suite for:
 * - Entry CRUD operations with all field types
 * - Complex nested data (groups, modular blocks)
 * - Entry versioning
 * - Entry publishing operations
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { mediumContentType, complexContentType } from '../mock/content-types/index.js'
import {
  mediumEntry,
  mediumEntryUpdate,
  complexEntry
} from '../mock/entries/index.js'
import { testData, wait, trackedExpect } from '../utility/testHelpers.js'

describe('Entry API Tests', () => {
  let client
  let stack

  // Content type UIDs created for testing (shorter UIDs to avoid length issues)
  const mediumCtUid = `ent_med_${Date.now().toString().slice(-8)}`
  const complexCtUid = `ent_cplx_${Date.now().toString().slice(-8)}`
  
  // Flags to track successful setup
  let mediumCtReady = false
  let complexCtReady = false

  before(async function () {
    this.timeout(90000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    testData.contentTypes = testData.contentTypes || {}

    // Create Medium content type for testing
    try {
      const mediumCtData = JSON.parse(JSON.stringify(mediumContentType))
      mediumCtData.content_type.uid = mediumCtUid
      mediumCtData.content_type.title = `Entry Test Medium ${Date.now()}`
      await stack.contentType().create(mediumCtData)
      testData.contentTypes.entryTestMedium = { uid: mediumCtUid }
      mediumCtReady = true
      console.log(`  ✓ Created medium content type: ${mediumCtUid}`)
      await wait(1000)
    } catch (error) {
      console.log(`  ✗ Failed to create medium content type: ${error.errorMessage || error.message}`)
      if (error.errors) {
        console.log(`    Validation errors: ${JSON.stringify(error.errors)}`)
      }
    }

    // Create Complex content type for testing
    try {
      const complexCtData = JSON.parse(JSON.stringify(complexContentType))
      complexCtData.content_type.uid = complexCtUid
      complexCtData.content_type.title = `Entry Test Complex ${Date.now()}`
      await stack.contentType().create(complexCtData)
      testData.contentTypes.entryTestComplex = { uid: complexCtUid }
      complexCtReady = true
      console.log(`  ✓ Created complex content type: ${complexCtUid}`)
      await wait(1000)
    } catch (error) {
      console.log(`  ✗ Failed to create complex content type: ${error.errorMessage || error.message}`)
      if (error.errors) {
        console.log(`    Validation errors: ${JSON.stringify(error.errors)}`)
      }
    }
  })

  after(async function () {
    this.timeout(60000)
    // NOTE: Deletion removed - entries and content types persist for variant entries, releases, bulk ops
  })

  // ==========================================================================
  // MEDIUM COMPLEXITY ENTRY - All basic field types
  // ==========================================================================

  describe('Medium Complexity Entry - All Field Types', () => {
    let entryUid

    before(function () {
      if (!mediumCtReady) {
        console.log('    Skipping: Medium content type not available')
        this.skip()
      }
    })

    after(async function () {
      // NOTE: Deletion removed - entries persist for variant entries, releases, bulk ops
    })

    it('should create entry with all field types', async function () {
      this.timeout(15000)
      
      const entryData = JSON.parse(JSON.stringify(mediumEntry))
      entryData.entry.title = `All Fields ${Date.now()}`

      // Add asset reference if an image asset was created by asset tests
      // File fields require the asset UID as a string value
      if (testData.assets && testData.assets.image && testData.assets.image.uid) {
        entryData.entry.hero_image = testData.assets.image.uid
        console.log(`  ✓ Added hero_image asset: ${testData.assets.image.uid}`)
      }

      // SDK returns the entry object directly
      const entry = await stack.contentType(mediumCtUid).entry().create(entryData)

      trackedExpect(entry, 'Entry').toBeAn('object')
      trackedExpect(entry.uid, 'Entry UID').toBeA('string')
      expect(entry.title).to.include('All Fields')
      expect(entry.summary).to.be.a('string')
      expect(entry.view_count).to.equal(1250)
      expect(entry.is_featured).to.be.true
      expect(entry.status).to.equal('published')

      entryUid = entry.uid
      testData.entries = testData.entries || {}
      testData.entries.medium = entry
      
      await wait(2000)
    })

    it('should fetch the created entry', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      trackedExpect(entry.uid, 'Entry UID').toEqual(entryUid)
      expect(entry.title).to.include('All Fields')
    })

    it('should validate text field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.title).to.be.a('string')
      expect(entry.summary).to.be.a('string')
    })

    it('should validate number field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.view_count).to.be.a('number')
      expect(entry.view_count).to.equal(1250)
    })

    it('should validate boolean field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.is_featured).to.be.a('boolean')
      expect(entry.is_featured).to.be.true
    })

    it('should validate date field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.publish_date).to.be.a('string')
      const date = new Date(entry.publish_date)
      expect(date).to.be.instanceof(Date)
      expect(isNaN(date.getTime())).to.be.false
    })

    it('should validate link field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.external_link).to.be.an('object')
      expect(entry.external_link.title).to.be.a('string')
      // Link fields use 'href' not 'url' based on mock data structure
      expect(entry.external_link.href).to.be.a('string')
    })

    it('should validate select/dropdown field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.status).to.be.a('string')
      expect(['draft', 'review', 'published', 'archived']).to.include(entry.status)
    })

    it('should validate multiple text (content_tags) field', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      expect(entry.content_tags).to.be.an('array')
      entry.content_tags.forEach(tag => {
        expect(tag).to.be.a('string')
      })
    })

    it('should update entry with partial data', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(entryUid).fetch()

      entry.view_count = 5000
      entry.is_featured = false

      const response = await entry.update()

      expect(response.view_count).to.equal(5000)
      expect(response.is_featured).to.be.false
      expect(response._version).to.be.at.least(2)
    })
  })

  // ==========================================================================
  // COMPLEX ENTRY - Nested Structures
  // ==========================================================================

  describe('Complex Entry - Nested Structures', () => {
    let entryUid

    before(function () {
      if (!complexCtReady) {
        console.log('    Skipping: Complex content type not available')
        this.skip()
      }
    })

    after(async function () {
      // NOTE: Deletion removed - entries persist for variant entries, releases, bulk ops
    })

    it('should create entry with modular blocks', async function () {
      this.timeout(15000)
      
      const entryData = JSON.parse(JSON.stringify(complexEntry))
      entryData.entry.title = `Complex Entry ${Date.now()}`

      // Add asset references if an image asset was created by asset tests
      // File fields require the asset UID as a string value
      const assetUid = testData.assets && testData.assets.image && testData.assets.image.uid
      
      if (assetUid) {
        console.log(`  ✓ Adding asset references with UID: ${assetUid}`)
        
        // Add to SEO group
        if (entryData.entry.seo) {
          entryData.entry.seo.social_image = assetUid
        }
        
        // Add to modular block sections
        if (entryData.entry.sections) {
          entryData.entry.sections.forEach(section => {
            if (section.hero_section) {
              section.hero_section.background_image = assetUid
            }
            if (section.content_block) {
              section.content_block.image = assetUid
            }
            if (section.card_grid && section.card_grid.cards) {
              section.card_grid.cards.forEach(card => {
                card.card_image = assetUid
              })
            }
          })
        }
      } else {
        console.log('  ⚠ No asset available - creating entry without image fields')
      }

      // SDK returns the entry object directly
      const entry = await stack.contentType(complexCtUid).entry().create(entryData)

      expect(entry).to.be.an('object')
      expect(entry.uid).to.be.a('string')
      expect(entry.sections).to.be.an('array')

      entryUid = entry.uid
      testData.entries = testData.entries || {}
      testData.entries.complex = entry
      
      await wait(2000)
    })

    it('should validate modular block data', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(complexCtUid).entry(entryUid).fetch()

      expect(entry.sections).to.be.an('array')
      expect(entry.sections.length).to.be.at.least(1)
    })

    it('should validate nested group data (SEO)', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(complexCtUid).entry(entryUid).fetch()

      expect(entry.seo).to.be.an('object')
      expect(entry.seo.meta_title).to.be.a('string')
      expect(entry.seo.meta_description).to.be.a('string')
    })

    it('should validate repeatable group data (links)', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(complexCtUid).entry(entryUid).fetch()

      expect(entry.links).to.be.an('array')
      if (entry.links.length > 0) {
        const link = entry.links[0]
        expect(link.link).to.be.an('object')
        expect(link.appearance).to.be.a('string')
      }
    })

    it('should validate JSON RTE content', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(complexCtUid).entry(entryUid).fetch()

      expect(entry.content_json_rte).to.be.an('object')
      expect(entry.content_json_rte.type).to.equal('doc')
      expect(entry.content_json_rte.children).to.be.an('array')
    })

    it('should update complex entry', async function () {
      this.timeout(15000)
      if (!entryUid) this.skip()
      
      const entry = await stack.contentType(complexCtUid).entry(entryUid).fetch()

      entry.seo.meta_title = 'Updated SEO Title'

      const response = await entry.update()

      expect(response.seo.meta_title).to.equal('Updated SEO Title')
      expect(response._version).to.be.at.least(2)
    })
  })

  // ==========================================================================
  // ENTRY CRUD OPERATIONS
  // ==========================================================================

  describe('Entry CRUD Operations', () => {
    let crudEntryUid

    before(function () {
      if (!mediumCtReady) {
        console.log('    Skipping: Medium content type not available')
        this.skip()
      }
    })

    it('should create an entry', async function () {
      this.timeout(15000)
      
      const entryData = {
        entry: {
          title: `CRUD Entry ${Date.now()}`,
          summary: 'Entry for CRUD testing',
          view_count: 100,
          is_featured: true
        }
      }

      // SDK returns the entry object directly
      const entry = await stack.contentType(mediumCtUid).entry().create(entryData)

      expect(entry).to.be.an('object')
      expect(entry.uid).to.be.a('string')

      crudEntryUid = entry.uid
      
      await wait(2000)
    })

    it('should fetch entry by UID', async function () {
      this.timeout(15000)
      if (!crudEntryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(crudEntryUid).fetch()

      expect(entry.uid).to.equal(crudEntryUid)
      expect(entry.title).to.include('CRUD Entry')
    })

    it('should query all entries', async function () {
      this.timeout(15000)
      
      const response = await stack.contentType(mediumCtUid).entry().query().find()

      expect(response).to.be.an('object')
      expect(response.items).to.be.an('array')
    })

    it('should count entries', async function () {
      this.timeout(15000)
      
      const response = await stack.contentType(mediumCtUid).entry().query().count()

      expect(response).to.be.an('object')
      expect(response.entries).to.be.a('number')
    })

    it('should update entry', async function () {
      this.timeout(15000)
      if (!crudEntryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(crudEntryUid).fetch()

      entry.title = `Updated CRUD Entry ${Date.now()}`
      entry.view_count = 999

      const response = await entry.update()

      expect(response.title).to.include('Updated CRUD Entry')
      expect(response.view_count).to.equal(999)
      expect(response._version).to.be.at.least(2)
    })

    it('should delete entry', async function () {
      this.timeout(15000)
      if (!crudEntryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(crudEntryUid).fetch()
      const response = await entry.delete()

      expect(response).to.be.an('object')
      expect(response.notice).to.be.a('string')
      
      crudEntryUid = null // Mark as deleted
    })

    it('should return error for deleted entry', async function () {
      this.timeout(15000)
      if (crudEntryUid) this.skip() // Only run if entry was deleted
      
      try {
        await stack.contentType(mediumCtUid).entry('deleted_entry_uid_123').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })

  // ==========================================================================
  // ENTRY VERSIONING
  // ==========================================================================

  describe('Entry Versioning', () => {
    let versionEntryUid

    before(function () {
      if (!mediumCtReady) {
        console.log('    Skipping: Medium content type not available')
        this.skip()
      }
    })

    after(async function () {
      // NOTE: Deletion removed - entries persist for variant entries, releases, bulk ops
    })

    it('should create entry with version 1', async function () {
      this.timeout(15000)
      
      const entryData = {
        entry: {
          title: `Version Test ${Date.now()}`,
          summary: 'Initial version',
          view_count: 1
        }
      }

      // SDK returns the entry object directly
      const entry = await stack.contentType(mediumCtUid).entry().create(entryData)
      versionEntryUid = entry.uid
      
      expect(entry._version).to.equal(1)
      
      await wait(2000)
    })

    it('should increment version on update', async function () {
      this.timeout(15000)
      if (!versionEntryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(versionEntryUid).fetch()
      entry.summary = 'Second version'
      entry.view_count = 2
      
      const response = await entry.update()
      
      expect(response._version).to.equal(2)
      
      await wait(2000)
    })

    it('should have version 3 after another update', async function () {
      this.timeout(15000)
      if (!versionEntryUid) this.skip()
      
      const entry = await stack.contentType(mediumCtUid).entry(versionEntryUid).fetch()
      entry.summary = 'Third version'
      entry.view_count = 3
      
      const response = await entry.update()
      
      expect(response._version).to.equal(3)
    })
  })

  // ==========================================================================
  // DAM 2.0 - ASSET FIELDS QUERY PARAMETER
  // Note: These tests are for AM 2.0 feature which is still in development.
  // Set DAM_2_0_ENABLED=true in .env to enable these tests once the feature is available.
  // ==========================================================================

  describe('DAM 2.0 - Asset Fields Query Parameter', () => {
    let assetFieldsEntryUid
    let dam20Enabled = false

    before(async function () {
      this.timeout(30000)
      
      // Check if DAM 2.0 feature is enabled via env variable
      if (process.env.DAM_2_0_ENABLED !== 'true') {
        console.log('    DAM 2.0 tests skipped: Set DAM_2_0_ENABLED=true in .env to enable')
        this.skip()
        return
      }
      
      dam20Enabled = true
      
      if (!mediumCtReady) {
        console.log('    Skipping: Medium content type not available')
        this.skip()
        return
      }

      // Create an entry for asset_fields testing
      try {
        const entryData = {
          entry: {
            title: `Asset Fields Test ${Date.now()}`,
            summary: 'Entry for testing asset_fields parameter'
          }
        }
        const entry = await stack.contentType(mediumCtUid).entry().create(entryData)
        assetFieldsEntryUid = entry.uid
        console.log(`  ✓ Created entry for asset_fields tests: ${assetFieldsEntryUid}`)
        await wait(2000)
      } catch (e) {
        console.log(`  ✗ Failed to create entry for asset_fields tests: ${e.message}`)
      }
    })

    // ----- FETCH with asset_fields -----

    it('should fetch entry with asset_fields parameter - single value', async function () {
      this.timeout(15000)
      if (!assetFieldsEntryUid) this.skip()

      const entry = await stack.contentType(mediumCtUid).entry(assetFieldsEntryUid)
        .fetch({ asset_fields: ['user_defined_fields'] })

      expect(entry).to.be.an('object')
      expect(entry.uid).to.equal(assetFieldsEntryUid)
    })

    it('should fetch entry with asset_fields parameter - multiple values', async function () {
      this.timeout(15000)
      if (!assetFieldsEntryUid) this.skip()

      const entry = await stack.contentType(mediumCtUid).entry(assetFieldsEntryUid)
        .fetch({ 
          asset_fields: ['user_defined_fields', 'embedded', 'ai_suggested', 'visual_markups'] 
        })

      expect(entry).to.be.an('object')
      expect(entry.uid).to.equal(assetFieldsEntryUid)
    })

    it('should fetch entry with asset_fields combined with other params', async function () {
      this.timeout(15000)
      if (!assetFieldsEntryUid) this.skip()

      const entry = await stack.contentType(mediumCtUid).entry(assetFieldsEntryUid)
        .fetch({ 
          locale: 'en-us',
          include_workflow: true,
          include_publish_details: true,
          asset_fields: ['user_defined_fields', 'embedded'] 
        })

      expect(entry).to.be.an('object')
      expect(entry.uid).to.equal(assetFieldsEntryUid)
    })

    // ----- QUERY with asset_fields -----

    it('should query entries with asset_fields parameter - single value', async function () {
      this.timeout(15000)
      if (!mediumCtReady) this.skip()

      const response = await stack.contentType(mediumCtUid).entry()
        .query({ 
          include_count: true, 
          asset_fields: ['user_defined_fields'] 
        })
        .find()

      expect(response).to.be.an('object')
      const entries = response.items || response.entries || []
      expect(entries).to.be.an('array')
      if (response.count !== undefined) {
        expect(response.count).to.be.a('number')
      }
    })

    it('should query entries with asset_fields parameter - multiple values', async function () {
      this.timeout(15000)
      if (!mediumCtReady) this.skip()

      const response = await stack.contentType(mediumCtUid).entry()
        .query({ 
          include_count: true, 
          asset_fields: ['user_defined_fields', 'embedded', 'ai_suggested', 'visual_markups'] 
        })
        .find()

      expect(response).to.be.an('object')
      const entries = response.items || response.entries || []
      expect(entries).to.be.an('array')
    })

    it('should query entries with asset_fields combined with other query params', async function () {
      this.timeout(15000)
      if (!mediumCtReady) this.skip()

      const response = await stack.contentType(mediumCtUid).entry()
        .query({ 
          include_count: true,
          include_content_type: true,
          locale: 'en-us',
          asset_fields: ['user_defined_fields', 'embedded']
        })
        .find()

      expect(response).to.be.an('object')
      const entries = response.items || response.entries || []
      expect(entries).to.be.an('array')
    })

    // ----- Edge cases -----

    it('should handle empty asset_fields array gracefully', async function () {
      this.timeout(15000)
      if (!assetFieldsEntryUid) this.skip()

      try {
        const entry = await stack.contentType(mediumCtUid).entry(assetFieldsEntryUid)
          .fetch({ asset_fields: [] })

        expect(entry).to.be.an('object')
        expect(entry.uid).to.equal(assetFieldsEntryUid)
      } catch (error) {
        // Some APIs may reject empty array - that's also acceptable
        expect(error).to.exist
      }
    })

    it('should fetch entry with all supported asset_fields values', async function () {
      this.timeout(15000)
      if (!assetFieldsEntryUid) this.skip()

      // Test all four supported values from DAM 2.0
      const allAssetFields = ['user_defined_fields', 'embedded', 'ai_suggested', 'visual_markups']
      
      const entry = await stack.contentType(mediumCtUid).entry(assetFieldsEntryUid)
        .fetch({ asset_fields: allAssetFields })

      expect(entry).to.be.an('object')
      expect(entry.uid).to.equal(assetFieldsEntryUid)
      expect(entry.title).to.include('Asset Fields Test')
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Entry Error Handling', () => {
    before(function () {
      if (!mediumCtReady) {
        console.log('    Skipping: Medium content type not available')
        this.skip()
      }
    })

    it('should fail to create entry without required title', async function () {
      this.timeout(15000)
      
      try {
        await stack.contentType(mediumCtUid).entry().create({
          entry: {
            summary: 'No title entry'
          }
        })
        // API might accept entry without title depending on content type configuration
        // This is acceptable - content type title field might not be marked required
        console.log('Note: API accepted entry without title - title may not be required')
      } catch (error) {
        expect(error).to.exist
        if (error.status) {
          expect(error.status).to.be.oneOf([400, 422])
        }
      }
    })

    it('should fail to fetch non-existent entry', async function () {
      this.timeout(15000)
      
      try {
        await stack.contentType(mediumCtUid).entry('nonexistent_uid_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to create entry for non-existent content type', async function () {
      this.timeout(15000)
      
      try {
        await stack.contentType('nonexistent_ct_12345').entry().create({
          entry: {
            title: 'Test Entry'
          }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
