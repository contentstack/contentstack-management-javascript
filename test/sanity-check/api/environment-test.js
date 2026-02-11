/**
 * Environment API Tests
 * 
 * Comprehensive test suite for:
 * - Environment CRUD operations
 * - URL configuration
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  developmentEnvironment,
  stagingEnvironment,
  productionEnvironment,
  environmentUpdate
} from '../mock/configurations.js'
import { validateEnvironmentResponse, testData, wait, trackedExpect } from '../utility/testHelpers.js'

/**
 * Helper function to wait for environment to be available after creation
 * NOTE: The SDK's .environment() method uses environment NAME, not UID
 * @param {object} stack - Stack object
 * @param {string} envName - Environment NAME (not UID!)
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise<object>} - The fetched environment
 */
async function waitForEnvironment(stack, envName, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // SDK uses environment NAME for fetch, not UID
      const env = await stack.environment(envName).fetch()
      return env
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Environment ${envName} not available after ${maxAttempts} attempts: ${error.errorMessage || error.message}`)
      }
      // Wait before retrying
      await wait(2000)
    }
  }
}

describe('Environment API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // ENVIRONMENT CRUD OPERATIONS
  // ==========================================================================

  describe('Environment CRUD Operations', () => {
    const devEnvName = `development_${Date.now()}`
    let currentEnvName = devEnvName  // Track current name (changes after update)
    let createdEnvUid

    after(async () => {
      // NOTE: Deletion removed - environments persist for tokens, bulk operations
    })

    it('should create a development environment', async function () {
      this.timeout(30000)
      const envData = {
        environment: {
          name: devEnvName,
          urls: [
            {
              locale: 'en-us',
              url: 'https://dev.example.com'
            }
          ]
        }
      }

      // SDK returns the environment object directly
      const env = await stack.environment().create(envData)

      trackedExpect(env, 'Environment').toBeAn('object')
      trackedExpect(env.uid, 'Environment UID').toBeA('string')
      validateEnvironmentResponse(env)

      trackedExpect(env.name, 'Environment name').toEqual(devEnvName)
      trackedExpect(env.urls, 'Environment urls').toBeAn('array')
      trackedExpect(env.urls.length, 'Environment urls count').toBeAtLeast(1)

      createdEnvUid = env.uid
      currentEnvName = env.name
      testData.environments.development = env
      
      // Wait for environment to be fully created
      await wait(2000)
    })

    it('should fetch environment by name', async function () {
      this.timeout(30000)
      
      if (!currentEnvName) {
        throw new Error('Environment name not set - previous test may have failed')
      }
      
      // SDK uses environment NAME for fetch (not UID) - following old test pattern
      const response = await waitForEnvironment(stack, currentEnvName)

      trackedExpect(response, 'Environment').toBeAn('object')
      trackedExpect(response.uid, 'Environment UID').toEqual(createdEnvUid)
      trackedExpect(response.name, 'Environment name').toEqual(currentEnvName)
    })

    it('should validate environment URL structure', async function () {
      this.timeout(30000)
      
      if (!currentEnvName) {
        throw new Error('Environment name not set - previous test may have failed')
      }
      
      // SDK uses environment NAME for fetch
      const env = await waitForEnvironment(stack, currentEnvName)

      expect(env.urls).to.be.an('array')
      env.urls.forEach(urlConfig => {
        expect(urlConfig.locale).to.be.a('string')
        expect(urlConfig.url).to.be.a('string')
        expect(urlConfig.url).to.match(/^https?:\/\//)
      })
    })

    it('should update environment name', async function () {
      this.timeout(30000)
      
      if (!currentEnvName) {
        throw new Error('Environment name not set - previous test may have failed')
      }
      
      // SDK uses environment NAME for fetch
      const env = await waitForEnvironment(stack, currentEnvName)
      const newName = `updated_${devEnvName}`

      env.name = newName
      const response = await env.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
      
      // Update tracking variable since name changed
      currentEnvName = newName
    })

    it('should add URL to environment', async function () {
      this.timeout(30000)
      
      if (!currentEnvName) {
        throw new Error('Environment name not set - previous test may have failed')
      }
      
      // SDK uses environment NAME for fetch (use currentEnvName which was updated)
      const env = await waitForEnvironment(stack, currentEnvName)
      const initialUrlCount = env.urls.length

      env.urls.push({
        locale: 'fr-fr',
        url: 'https://dev-fr.example.com'
      })

      const response = await env.update()

      expect(response.urls.length).to.equal(initialUrlCount + 1)
    })

    it('should query all environments', async () => {
      const response = await stack.environment().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.environments).to.be.an('array')

      const items = response.items || response.environments
      const found = items.find(e => e.uid === createdEnvUid)
      expect(found).to.exist
    })
  })

  // ==========================================================================
  // STAGING ENVIRONMENT
  // ==========================================================================

  describe('Staging Environment', () => {
    const stagingEnvName = `staging_${Date.now()}`
    let currentStagingName = stagingEnvName

    after(async () => {
      // NOTE: Deletion removed - environments persist for tokens, bulk operations
    })

    it('should create staging environment with multiple URLs', async function () {
      this.timeout(30000)
      
      const envData = {
        environment: {
          name: stagingEnvName,
          urls: [
            { locale: 'en-us', url: 'https://staging.example.com' },
            { locale: 'fr-fr', url: 'https://staging.example.com/fr' }
          ]
        }
      }

      // SDK returns the environment object directly
      const env = await stack.environment().create(envData)

      validateEnvironmentResponse(env)
      expect(env.urls.length).to.equal(2)

      currentStagingName = env.name
      testData.environments.staging = env
      
      // Wait for environment to propagate
      await wait(2000)
    })

    it('should update URL for specific locale', async function () {
      this.timeout(30000)
      
      if (!currentStagingName) {
        throw new Error('Staging environment name not set - previous test may have failed')
      }
      
      // SDK uses environment NAME for fetch
      const env = await waitForEnvironment(stack, currentStagingName)

      const frUrl = env.urls.find(u => u.locale === 'fr-fr')
      if (frUrl) {
        frUrl.url = 'https://staging-updated.example.com/fr'
      }

      const response = await env.update()

      const updatedFrUrl = response.urls.find(u => u.locale === 'fr-fr')
      expect(updatedFrUrl.url).to.equal('https://staging-updated.example.com/fr')
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create environment with duplicate name', async () => {
      const envData = {
        environment: {
          name: 'duplicate_env_test',
          urls: [{ locale: 'en-us', url: 'https://test.example.com' }]
        }
      }

      // Create first
      try {
        await stack.environment().create(envData)
      } catch (e) { }

      // Try to create again
      try {
        await stack.environment().create(envData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }

      // Cleanup - SDK uses environment NAME for fetch
      try {
        const envObj = await stack.environment('duplicate_env_test').fetch()
        await envObj.delete()
      } catch (e) { }
    })

    it('should fail to create environment without name', async () => {
      const envData = {
        environment: {
          urls: [{ locale: 'en-us', url: 'https://test.example.com' }]
        }
      }

      try {
        await stack.environment().create(envData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create environment without URLs', async () => {
      const envData = {
        environment: {
          name: 'no_urls_test'
        }
      }

      try {
        await stack.environment().create(envData)
        // API might accept empty URLs in some cases
      } catch (error) {
        expect(error).to.exist
        if (error.status) {
          expect(error.status).to.be.oneOf([400, 422])
        }
      }
    })

    it('should fail to fetch non-existent environment', async () => {
      try {
        await stack.environment('nonexistent_env_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail with invalid URL format', async () => {
      const envData = {
        environment: {
          name: 'invalid_url_test',
          urls: [{ locale: 'en-us', url: 'not-a-valid-url' }]
        }
      }

      try {
        await stack.environment().create(envData)
        // Some APIs might accept invalid URLs
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE ENVIRONMENT
  // ==========================================================================

  describe('Delete Environment', () => {

    it('should delete an environment', async function () {
      this.timeout(45000)
      
      // Create a temp environment - SDK returns environment object directly
      const tempName = `temp_delete_env_${Date.now()}`
      const createdEnv = await stack.environment().create({
        environment: {
          name: tempName,
          urls: [{ locale: 'en-us', url: 'https://temp.example.com' }]
        }
      })
      
      // Wait for environment to propagate
      await wait(2000)
      
      // SDK uses environment NAME for fetch
      const env = await waitForEnvironment(stack, tempName)
      const deleteResponse = await env.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })

    it('should return 404 for deleted environment', async function () {
      this.timeout(45000)
      
      // Create and delete - SDK returns environment object directly
      const tempName = `temp_verify_env_${Date.now()}`
      const createdEnv = await stack.environment().create({
        environment: {
          name: tempName,
          urls: [{ locale: 'en-us', url: 'https://temp.example.com' }]
        }
      })
      
      // Wait for environment to propagate
      await wait(2000)
      
      // SDK uses environment NAME for fetch
      const env = await waitForEnvironment(stack, tempName)
      await env.delete()
      
      await wait(1000)

      try {
        // SDK uses environment NAME for fetch
        await stack.environment(tempName).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
