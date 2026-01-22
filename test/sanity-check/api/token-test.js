/**
 * Token API Tests
 * 
 * Comprehensive test suite for:
 * - Delivery Token CRUD operations
 * - Management Token CRUD operations
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { validateTokenResponse, testData, wait } from '../utility/testHelpers.js'

describe('Token API Tests', () => {
  let client
  let stack
  let existingEnvironment = null
  let deliveryTokenScope
  let managementTokenScope

  before(async function () {
    this.timeout(30000)
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
    
    // ALWAYS fetch fresh environments from API - don't rely on testData which may be stale
    // (Environments in testData may have been deleted by environment delete tests)
    try {
      const envResponse = await stack.environment().query().find()
      const environments = envResponse.items || envResponse.environments || []
      if (environments.length > 0) {
        existingEnvironment = environments[0].name
        console.log(`Token tests using environment from API: ${existingEnvironment}`)
      } else {
        console.log('Warning: No environments found, token tests may be limited')
      }
    } catch (e) {
      console.log('Note: Could not fetch environments, token tests may be limited')
    }
    
    // Build scopes with existing environment (required for delivery tokens)
    // Use environment NAME, not UID (API expects names in scope)
    deliveryTokenScope = [
      {
        module: 'environment',
        environments: existingEnvironment ? [existingEnvironment] : [],
        acl: { read: true }
      },
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      }
    ]
    
    // Base scope with required branch field for management tokens
    managementTokenScope = [
      {
        module: 'content_type',
        acl: { read: true, write: true }
      },
      {
        module: 'entry',
        acl: { read: true, write: true }
      },
      {
        module: 'asset',
        acl: { read: true, write: true }
      },
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      }
    ]
  })

  // Helper to fetch delivery token by UID using query
  async function fetchDeliveryTokenByUid(tokenUid) {
    const response = await stack.deliveryToken().query().find()
    const items = response.items || response.tokens || []
    const token = items.find(t => t.uid === tokenUid)
    if (!token) {
      const error = new Error(`Delivery token with UID ${tokenUid} not found`)
      error.status = 404
      throw error
    }
    return token
  }

  // Helper to fetch management token by UID using query
  async function fetchManagementTokenByUid(tokenUid) {
    const response = await stack.managementToken().query().find()
    const items = response.items || response.tokens || []
    const token = items.find(t => t.uid === tokenUid)
    if (!token) {
      const error = new Error(`Management token with UID ${tokenUid} not found`)
      error.status = 404
      throw error
    }
    return token
  }

  // ==========================================================================
  // DELIVERY TOKEN TESTS
  // ==========================================================================

  describe('Delivery Token Operations', () => {
    let createdTokenUid

    after(async () => {
      // NOTE: Deletion removed - tokens persist for other tests
    })

    it('should create a delivery token', async function () {
      this.timeout(30000)
      
      // Skip if no environment exists (required for delivery tokens)
      if (!existingEnvironment) {
        this.skip()
        return
      }
      
      const tokenData = {
        token: {
          name: `Delivery Token ${Date.now()}`,
          description: 'Token for development environment',
          scope: deliveryTokenScope
        }
      }

      const response = await stack.deliveryToken().create(tokenData)

      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      expect(response.name).to.include('Delivery Token')
      expect(response.token).to.be.a('string')
      expect(response.scope).to.be.an('array')

      createdTokenUid = response.uid
      testData.tokens.delivery = response
      
      // Wait for token to be fully created
      await wait(2000)
    })

    it('should fetch delivery token by UID from query', async function () {
      this.timeout(15000)
      const token = await fetchDeliveryTokenByUid(createdTokenUid)

      expect(token).to.be.an('object')
      expect(token.uid).to.equal(createdTokenUid)
    })

    it('should validate delivery token scope', async () => {
      const token = await fetchDeliveryTokenByUid(createdTokenUid)

      expect(token.scope).to.be.an('array')
      // Should have branch scope
      const branchScope = token.scope.find(s => s.module === 'branch')
      expect(branchScope).to.exist
    })

    it('should update delivery token name', async function () {
      this.timeout(15000)
      
      if (!createdTokenUid) {
        console.log('Skipping - no delivery token created')
        this.skip()
        return
      }
      
      const token = await fetchDeliveryTokenByUid(createdTokenUid)
      const newName = `Updated Delivery Token ${Date.now()}`

      // Update only the name field
      token.name = newName
      
      // Preserve the original scope with environment NAMES (not objects)
      // The API expects environment names in scope, not complex objects
      if (token.scope) {
        token.scope = token.scope.map(s => {
          if (s.module === 'environment' && s.environments) {
            return {
              module: 'environment',
              environments: s.environments.map(env => 
                typeof env === 'object' ? (env.name || env.uid) : env
              ),
              acl: s.acl || { read: true }
            }
          }
          return s
        })
      }
      
      const response = await token.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should query all delivery tokens', async () => {
      const response = await stack.deliveryToken().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.tokens).to.be.an('array')
    })

    it('should query delivery tokens with limit', async () => {
      const response = await stack.deliveryToken().query({ limit: 2 }).find()

      expect(response).to.be.an('object')
      const items = response.items || response.tokens
      expect(items.length).to.be.at.most(2)
    })
  })

  // ==========================================================================
  // MANAGEMENT TOKEN TESTS
  // ==========================================================================

  describe('Management Token Operations', () => {
    let createdMgmtTokenUid

    after(async () => {
      // NOTE: Deletion removed - tokens persist for other tests
    })

    it('should create a management token', async function () {
      this.timeout(30000)
      const tokenData = {
        token: {
          name: `Management Token ${Date.now()}`,
          description: 'Token for API integrations',
          scope: managementTokenScope,
          expires_on: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      }

      const response = await stack.managementToken().create(tokenData)

      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      expect(response.name).to.include('Management Token')
      expect(response.token).to.be.a('string')

      createdMgmtTokenUid = response.uid
      testData.tokens.management = response
      
      // Wait for token to be fully created
      await wait(2000)
    })

    it('should fetch management token by UID from query', async function () {
      this.timeout(15000)
      const token = await fetchManagementTokenByUid(createdMgmtTokenUid)

      expect(token).to.be.an('object')
      expect(token.uid).to.equal(createdMgmtTokenUid)
    })

    it('should validate management token scope', async () => {
      const token = await fetchManagementTokenByUid(createdMgmtTokenUid)

      expect(token.scope).to.be.an('array')
      token.scope.forEach(scope => {
        expect(scope.module).to.be.a('string')
      })
    })

    it('should have read/write permissions', async () => {
      const token = await fetchManagementTokenByUid(createdMgmtTokenUid)

      // Should have write permissions for management token
      const hasWriteScope = token.scope.some(s => s.acl && s.acl.write === true)
      expect(hasWriteScope).to.be.true
    })

    it('should update management token name', async () => {
      const token = await fetchManagementTokenByUid(createdMgmtTokenUid)
      const newName = `Updated Mgmt Token ${Date.now()}`

      token.name = newName
      const response = await token.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should query all management tokens', async () => {
      const response = await stack.managementToken().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.tokens).to.be.an('array')
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create token without name', async () => {
      const tokenData = {
        token: {
          scope: deliveryTokenScope
        }
      }

      try {
        await stack.deliveryToken().create(tokenData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create delivery token without branch scope', async () => {
      const tokenData = {
        token: {
          name: 'No Branch Token',
          scope: [
            {
              module: 'environment',
              environments: [],
              acl: { read: true }
            }
          ]
        }
      }

      try {
        await stack.deliveryToken().create(tokenData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
        // Check for specific error if errors object exists
        if (error.errors) {
          expect(error.errors).to.have.property('scope.branch_or_alias')
        }
      }
    })

    it('should fail to create management token without branch scope', async () => {
      const tokenData = {
        token: {
          name: 'No Branch Mgmt Token',
          scope: [
            {
              module: 'content_type',
              acl: { read: true, write: false }
            }
          ]
        }
      }

      try {
        await stack.managementToken().create(tokenData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
        // Check for specific error if errors object exists
        if (error.errors) {
          expect(error.errors).to.have.property('scope.branch_or_alias')
        }
      }
    })

    it('should fail to fetch non-existent delivery token', async () => {
      try {
        await fetchDeliveryTokenByUid('nonexistent_token_12345')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to fetch non-existent management token', async () => {
      try {
        await fetchManagementTokenByUid('nonexistent_token_12345')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE TOKEN
  // ==========================================================================

  describe('Delete Token', () => {

    it('should delete a delivery token', async function () {
      this.timeout(30000)
      // Create temp token
      const tokenData = {
        token: {
          name: `Delete Test Token ${Date.now()}`,
          scope: deliveryTokenScope
        }
      }

      const response = await stack.deliveryToken().create(tokenData)
      expect(response.uid).to.be.a('string')
      
      await wait(1000)
      
      const token = await fetchDeliveryTokenByUid(response.uid)
      const deleteResponse = await token.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })

    it('should delete a management token', async function () {
      this.timeout(30000)
      // Create temp token
      const tokenData = {
        token: {
          name: `Delete Mgmt Token ${Date.now()}`,
          scope: managementTokenScope
        }
      }

      const response = await stack.managementToken().create(tokenData)
      expect(response.uid).to.be.a('string')
      
      await wait(1000)
      
      const token = await fetchManagementTokenByUid(response.uid)
      const deleteResponse = await token.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })

    it('should return 404 for deleted token', async function () {
      this.timeout(30000)
      // Create and delete
      const tokenData = {
        token: {
          name: `Verify Delete Token ${Date.now()}`,
          scope: deliveryTokenScope
        }
      }

      const response = await stack.deliveryToken().create(tokenData)
      const tokenUid = response.uid
      
      await wait(1000)
      
      const token = await fetchDeliveryTokenByUid(tokenUid)
      await token.delete()

      await wait(2000)

      try {
        await fetchDeliveryTokenByUid(tokenUid)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
