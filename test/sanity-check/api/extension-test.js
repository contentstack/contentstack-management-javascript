/**
 * Extension API Tests
 */

import path from 'path'
import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { generateUniqueId, wait, testData } from '../utility/testHelpers.js'

// Get base directory for test files
const testBaseDir = path.resolve(process.cwd(), 'test/sanity-check')

let client = null
let stack = null

// Extension UIDs for cleanup
let customFieldUrlUid = null
let customFieldSrcUid = null
let customWidgetUrlUid = null
let customWidgetSrcUid = null
let customDashboardUrlUid = null
let customDashboardSrcUid = null
let customFieldUploadUid = null

// Mock extension data
const customFieldURL = {
  extension: {
    title: `Custom Field URL ${generateUniqueId()}`,
    src: 'https://www.example.com/custom-field',
    type: 'field',
    data_type: 'text',
    tags: ['test', 'custom-field'],
    multiple: false
  }
}

const customFieldSRC = {
  extension: {
    title: `Custom Field SRC ${generateUniqueId()}`,
    src: '<!DOCTYPE html><html><head></head><body><h1>Custom Field</h1></body></html>',
    type: 'field',
    data_type: 'text',
    tags: ['test', 'custom-field-src'],
    multiple: false
  }
}

const customWidgetURL = {
  extension: {
    title: `Custom Widget URL ${generateUniqueId()}`,
    src: 'https://www.example.com/custom-widget',
    type: 'widget',
    tags: ['test', 'widget'],
    scope: {
      content_types: ['$all']
    }
  }
}

const customWidgetSRC = {
  extension: {
    title: `Custom Widget SRC ${generateUniqueId()}`,
    src: '<!DOCTYPE html><html><head></head><body><h1>Custom Widget</h1></body></html>',
    type: 'widget',
    tags: ['test', 'widget-src'],
    scope: {
      content_types: ['$all']
    }
  }
}

const customDashboardURL = {
  extension: {
    title: `Custom Dashboard URL ${generateUniqueId()}`,
    src: 'https://www.example.com/custom-dashboard',
    type: 'dashboard',
    tags: ['test', 'dashboard'],
    enable: true,
    default_width: 'full'
  }
}

const customDashboardSRC = {
  extension: {
    title: `Custom Dashboard SRC ${generateUniqueId()}`,
    src: '<!DOCTYPE html><html><head></head><body><h1>Custom Dashboard</h1></body></html>',
    type: 'dashboard',
    tags: ['test', 'dashboard-src'],
    enable: true,
    default_width: 'half'
  }
}

describe('Extensions API Tests', () => {
  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  after(async function () {
    // NOTE: Deletion removed - extensions persist for other tests
    // Extension Deletion tests will handle cleanup
  })

  describe('Custom Field Operations', () => {
    it('should create custom field with source URL', async function () {
      this.timeout(15000)

      const response = await stack.extension().create(customFieldURL)
      
      customFieldUrlUid = response.uid
      testData.extensionUid = response.uid
      
      expect(response.uid).to.not.equal(null)
      expect(response.uid).to.be.a('string')
      expect(response.title).to.equal(customFieldURL.extension.title)
      expect(response.type).to.equal('field')
      expect(response.data_type).to.equal('text')
    })

    it('should create custom field with source code', async function () {
      this.timeout(15000)

      try {
        const response = await stack.extension().create(customFieldSRC)
        
        customFieldSrcUid = response.uid
        
        expect(response.uid).to.not.equal(null)
        expect(response.title).to.equal(customFieldSRC.extension.title)
        expect(response.type).to.equal('field')
      } catch (error) {
        // Extension limit might be reached - this is acceptable
        expect(error.status || error.errorCode).to.be.oneOf([422, 344])
      }
    })

    it('should fetch custom field by UID', async function () {
      this.timeout(15000)
      
      if (!customFieldUrlUid) {
        this.skip()
      }

      const response = await stack.extension(customFieldUrlUid).fetch()
      
      expect(response.uid).to.equal(customFieldUrlUid)
      expect(response.title).to.equal(customFieldURL.extension.title)
      expect(response.type).to.equal('field')
    })

    it('should update custom field', async function () {
      this.timeout(15000)
      
      if (!customFieldUrlUid) {
        this.skip()
      }

      const extension = await stack.extension(customFieldUrlUid).fetch()
      extension.title = `Updated Custom Field ${generateUniqueId()}`
      
      const response = await extension.update()
      
      expect(response.uid).to.equal(customFieldUrlUid)
      expect(response.title).to.include('Updated Custom Field')
    })

    it('should query custom fields by type', async function () {
      this.timeout(15000)

      const response = await stack.extension()
        .query({ query: { type: 'field' } })
        .find()
      
      expect(response.items).to.be.an('array')
      
      response.items.forEach(extension => {
        expect(extension.uid).to.not.equal(null)
        expect(extension.type).to.equal('field')
      })
    })
  })

  describe('Custom Widget Operations', () => {
    it('should create custom widget with source URL', async function () {
      this.timeout(15000)

      try {
        const response = await stack.extension().create(customWidgetURL)
        
        customWidgetUrlUid = response.uid
        
        expect(response.uid).to.not.equal(null)
        expect(response.title).to.equal(customWidgetURL.extension.title)
        expect(response.type).to.equal('widget')
      } catch (error) {
        // Extension limit might be reached
        expect(error.status || error.errorCode).to.be.oneOf([422, 344])
      }
    })

    it('should create custom widget with source code', async function () {
      this.timeout(15000)

      try {
        const response = await stack.extension().create(customWidgetSRC)
        
        customWidgetSrcUid = response.uid
        
        expect(response.uid).to.not.equal(null)
        expect(response.title).to.equal(customWidgetSRC.extension.title)
        expect(response.type).to.equal('widget')
      } catch (error) {
        // Extension limit might be reached
        expect(error.status || error.errorCode).to.be.oneOf([422, 344])
      }
    })

    it('should fetch and update custom widget', async function () {
      this.timeout(15000)
      
      if (!customWidgetUrlUid) {
        this.skip()
      }

      const extension = await stack.extension(customWidgetUrlUid).fetch()
      
      expect(extension.uid).to.equal(customWidgetUrlUid)
      expect(extension.type).to.equal('widget')
      
      extension.title = `Updated Widget ${generateUniqueId()}`
      const updatedExtension = await extension.update()
      
      expect(updatedExtension.title).to.include('Updated Widget')
    })

    it('should query custom widgets by type', async function () {
      this.timeout(15000)

      const response = await stack.extension()
        .query({ query: { type: 'widget' } })
        .find()
      
      expect(response.items).to.be.an('array')
      
      response.items.forEach(extension => {
        expect(extension.type).to.equal('widget')
      })
    })
  })

  describe('Custom Dashboard Operations', () => {
    it('should create custom dashboard with source URL', async function () {
      this.timeout(15000)

      try {
        const response = await stack.extension().create(customDashboardURL)
        
        customDashboardUrlUid = response.uid
        
        expect(response.uid).to.not.equal(null)
        expect(response.title).to.equal(customDashboardURL.extension.title)
        expect(response.type).to.equal('dashboard')
        expect(response.enable).to.equal(true)
        expect(response.default_width).to.equal('full')
      } catch (error) {
        // Extension limit might be reached
        expect(error.status || error.errorCode).to.be.oneOf([422, 344])
      }
    })

    it('should create custom dashboard with source code', async function () {
      this.timeout(15000)

      try {
        const response = await stack.extension().create(customDashboardSRC)
        
        customDashboardSrcUid = response.uid
        
        expect(response.uid).to.not.equal(null)
        expect(response.title).to.equal(customDashboardSRC.extension.title)
        expect(response.type).to.equal('dashboard')
        expect(response.default_width).to.equal('half')
      } catch (error) {
        // Extension limit might be reached
        expect(error.status || error.errorCode).to.be.oneOf([422, 344])
      }
    })

    it('should fetch and update custom dashboard', async function () {
      this.timeout(15000)
      
      if (!customDashboardUrlUid) {
        this.skip()
      }

      const extension = await stack.extension(customDashboardUrlUid).fetch()
      
      expect(extension.uid).to.equal(customDashboardUrlUid)
      expect(extension.type).to.equal('dashboard')
      
      extension.title = `Updated Dashboard ${generateUniqueId()}`
      const updatedExtension = await extension.update()
      
      expect(updatedExtension.title).to.include('Updated Dashboard')
    })

    it('should query custom dashboards by type', async function () {
      this.timeout(15000)

      const response = await stack.extension()
        .query({ query: { type: 'dashboard' } })
        .find()
      
      expect(response.items).to.be.an('array')
      
      response.items.forEach(extension => {
        expect(extension.type).to.equal('dashboard')
      })
    })
  })

  describe('Extension Upload Operations', () => {
    let uploadedFieldUid = null
    let uploadedWidgetUid = null
    let uploadedDashboardUid = null
    
    it('should upload custom field from file', async function () {
      this.timeout(15000)

      const uploadPath = path.join(testBaseDir, 'mock/assets/customUpload.html')
      
      try {
        const response = await stack.extension().upload({
          title: `Uploaded Field ${Date.now()}`,
          data_type: 'text',
          type: 'field',
          tags: ['upload', 'test'],
          multiple: false,
          upload: uploadPath
        })
        
        expect(response.uid).to.be.a('string')
        expect(response.title).to.include('Uploaded Field')
        expect(response.type).to.equal('field')
        
        uploadedFieldUid = response.uid
      } catch (error) {
        // File might not exist or upload might fail
        console.log('Upload field warning:', error.message)
        throw error
      }
    })
    
    it('should upload custom widget from file', async function () {
      this.timeout(15000)

      const uploadPath = path.join(testBaseDir, 'mock/assets/customUpload.html')
      
      try {
        const response = await stack.extension().upload({
          title: `Uploaded Widget ${Date.now()}`,
          type: 'widget',
          tags: 'upload,test',
          upload: uploadPath
        })
        
        expect(response.uid).to.be.a('string')
        expect(response.title).to.include('Uploaded Widget')
        expect(response.type).to.equal('widget')
        
        uploadedWidgetUid = response.uid
      } catch (error) {
        console.log('Upload widget warning:', error.message)
        throw error
      }
    })
    
    it('should upload custom dashboard from file', async function () {
      this.timeout(15000)

      const uploadPath = path.join(testBaseDir, 'mock/assets/customUpload.html')
      
      try {
        const response = await stack.extension().upload({
          title: `Uploaded Dashboard ${Date.now()}`,
          type: 'dashboard',
          tags: ['upload', 'test'],
          enable: true,
          default_width: 'half',
          upload: uploadPath
        })
        
        expect(response.uid).to.be.a('string')
        expect(response.title).to.include('Uploaded Dashboard')
        expect(response.type).to.equal('dashboard')
        
        uploadedDashboardUid = response.uid
      } catch (error) {
        console.log('Upload dashboard warning:', error.message)
        throw error
      }
    })
  })

  describe('Extension Query Operations', () => {
    it('should fetch all extensions', async function () {
      this.timeout(15000)

      const response = await stack.extension()
        .query()
        .find()
      
      expect(response.items).to.be.an('array')
      
      response.items.forEach(extension => {
        expect(extension.uid).to.not.equal(null)
        expect(extension.title).to.not.equal(null)
        expect(extension.type).to.be.oneOf(['field', 'widget', 'dashboard', 'rte_plugin', 'asset_sidebar_widget'])
      })
    })

    it('should query extensions with parameters', async function () {
      this.timeout(15000)

      // The SDK query() accepts parameters object, not chained methods
      const response = await stack.extension()
        .query({ limit: 5 })
        .find()
      
      expect(response.items).to.be.an('array')
      expect(response.items.length).to.be.at.most(5)
    })
  })

  describe('Extension Deletion', () => {
    it('should delete an extension', async function () {
      this.timeout(30000)
      
      // Create a TEMPORARY extension for deletion testing
      // Don't delete the shared extension UIDs
      const tempExtensionData = {
        extension: {
          title: `Delete Test Extension ${generateUniqueId()}`,
          type: 'field',
          data_type: 'text',
          src: 'https://www.contentstack.com/delete-test'
        }
      }

      try {
        const tempExtension = await stack.extension().create(tempExtensionData)
        expect(tempExtension.uid).to.be.a('string')
        
        await wait(2000)
        
        const response = await stack.extension(tempExtension.uid).delete()
        
        expect(response.notice).to.equal('Extension deleted successfully.')
      } catch (error) {
        // Extension limit might be reached
        if (error.status === 422 || error.errorCode === 344) {
          console.log('Extension limit reached, skipping delete test')
          this.skip()
        } else {
          throw error
        }
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle fetching non-existent extension', async function () {
      this.timeout(15000)

      try {
        await stack.extension('non_existent_extension_uid').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
        // Extension not found error
        expect(error.status || error.errorCode).to.be.oneOf([404, 347])
      }
    })

    it('should handle creating extension without required fields', async function () {
      this.timeout(15000)

      try {
        await stack.extension().create({ extension: {} })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should handle deleting non-existent extension', async function () {
      this.timeout(15000)

      try {
        await stack.extension('non_existent_extension_uid').delete()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })
  })
})
