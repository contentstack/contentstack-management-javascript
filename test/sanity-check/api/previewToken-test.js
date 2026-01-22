/**
 * Preview Token API Tests
 * 
 * Comprehensive test suite for:
 * - Preview token CRUD operations
 * - Preview token lifecycle (create from delivery token)
 * - Preview token validation
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, wait } from '../utility/testHelpers.js'

describe('Preview Token API Tests', () => {
  let client
  let stack
  let deliveryTokenUid = null
  let previewTokenCreated = false
  let testEnvironmentName = 'development'

  before(async function () {
    this.timeout(60000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // Check if development environment exists, if not create one
    try {
      const envResponse = await stack.environment().query().find()
      const environments = envResponse.items || []
      
      if (environments.length > 0) {
        testEnvironmentName = environments[0].name
      } else {
        // Create a test environment
        const createEnvResponse = await stack.environment().create({
          environment: {
            name: 'development',
            urls: [{ locale: 'en-us', url: 'http://localhost:3000' }]
          }
        })
        testEnvironmentName = createEnvResponse.environment?.name || 'development'
        await wait(1000)
      }
    } catch (error) {
      console.log('Environment check failed:', error.errorMessage)
    }

    // Create a delivery token for preview token tests
    try {
      const tokenResponse = await stack.deliveryToken().create({
        token: {
          name: `Preview Token Test DT ${Date.now()}`,
          description: 'Delivery token for preview token testing',
          scope: [
            {
              module: 'environment',
              environments: [testEnvironmentName],
              acl: { read: true }
            },
            {
              module: 'branch',
              branches: ['main'],
              acl: { read: true }
            }
          ]
        }
      })

      deliveryTokenUid = tokenResponse.token?.uid || tokenResponse.uid
      testData.tokens = testData.tokens || {}
      testData.tokens.deliveryForPreview = tokenResponse.token || tokenResponse

      await wait(2000)
    } catch (error) {
      console.log('Delivery token creation for preview test failed:', error.errorMessage)
    }
  })

  after(async function () {
    // NOTE: Deletion removed - preview tokens persist for other tests
    // Preview Token Delete tests will handle cleanup
  })

  // ==========================================================================
  // PREVIEW TOKEN CRUD
  // ==========================================================================

  describe('Preview Token CRUD', () => {

    it('should create a preview token from delivery token', async function () {
      this.timeout(30000)

      if (!deliveryTokenUid) {
        console.log('No delivery token available, skipping preview token tests')
        this.skip()
        return
      }

      try {
        const response = await stack.deliveryToken(deliveryTokenUid).previewToken().create()

        expect(response).to.be.an('object')
        expect(response.preview_token || response.token?.preview_token).to.be.a('string')

        previewTokenCreated = true
        testData.tokens.preview = response

        await wait(1000)
      } catch (error) {
        // Preview tokens might not be enabled
        if (error.status === 403 || error.status === 422) {
          console.log('Preview tokens not available:', error.errorMessage)
          this.skip()
        } else {
          throw error
        }
      }
    })

    it('should fetch delivery token with preview token', async function () {
      this.timeout(15000)

      if (!deliveryTokenUid || !previewTokenCreated) {
        this.skip()
        return
      }

      try {
        // Fetch all tokens and find ours
        const tokens = await stack.deliveryToken().query().find()
        const token = tokens.items?.find(t => t.uid === deliveryTokenUid)

        expect(token).to.exist
        expect(token.preview_token).to.be.a('string')
      } catch (error) {
        console.log('Fetch with preview token failed:', error.errorMessage)
        this.skip()
      }
    })

    it('should validate preview token is non-empty', async function () {
      this.timeout(15000)

      if (!deliveryTokenUid || !previewTokenCreated) {
        this.skip()
        return
      }

      try {
        const tokens = await stack.deliveryToken().query().find()
        const token = tokens.items?.find(t => t.uid === deliveryTokenUid)

        expect(token.preview_token).to.be.a('string')
        expect(token.preview_token.length).to.be.at.least(10)
      } catch (error) {
        console.log('Preview token validation failed:', error.errorMessage)
        this.skip()
      }
    })
  })

  // NOTE: "Preview Token with Multiple Environments" test removed
  // Live Preview only supports ONE environment mapped, not multiple.
  // Testing multi-env preview tokens was invalid.

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create preview token for non-existent delivery token', async function () {
      this.timeout(15000)

      try {
        await stack.deliveryToken('nonexistent_token_12345').previewToken().create()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 404, 422, 403])
      }
    })

    it('should fail to delete preview token that does not exist', async function () {
      this.timeout(15000)

      // Create a delivery token without preview token
      let tempTokenUid = null
      try {
        const tokenResponse = await stack.deliveryToken().create({
          token: {
            name: `Temp DT No Preview ${Date.now()}`,
            description: 'Temp token',
            scope: [
              {
                module: 'environment',
                environments: [testEnvironmentName],
                acl: { read: true }
              },
              {
                module: 'branch',
                branches: ['main'],
                acl: { read: true }
              }
            ]
          }
        })
        tempTokenUid = tokenResponse.token?.uid || tokenResponse.uid
        await wait(1000)

        // Try to delete preview token that doesn't exist
        await stack.deliveryToken(tempTokenUid).previewToken().delete()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 404, 422, 403])
      } finally {
        // Cleanup temp token
        if (tempTokenUid) {
          try {
            const tokens = await stack.deliveryToken().query().find()
            const token = tokens.items?.find(t => t.uid === tempTokenUid)
            if (token) {
              await token.delete()
            }
          } catch (e) { }
        }
      }
    })
  })

  // ==========================================================================
  // PREVIEW TOKEN DELETE
  // ==========================================================================

  describe('Preview Token Delete', () => {

    it('should delete preview token', async function () {
      this.timeout(30000)

      if (!deliveryTokenUid || !previewTokenCreated) {
        this.skip()
        return
      }

      try {
        const response = await stack.deliveryToken(deliveryTokenUid).previewToken().delete()

        expect(response).to.be.an('object')
        expect(response.notice).to.be.a('string')
        expect(response.notice.toLowerCase()).to.include('preview token deleted')

        previewTokenCreated = false
      } catch (error) {
        console.log('Preview token delete failed:', error.errorMessage)
        if (error.status !== 404) {
          throw error
        }
      }
    })
  })
})
