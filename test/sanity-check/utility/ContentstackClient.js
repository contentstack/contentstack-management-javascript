/**
 * Contentstack Client Factory
 * 
 * Provides client instances for test files.
 * Works in two modes:
 * 1. With testSetup (recommended) - Uses dynamically generated authtoken and stack
 * 2. Standalone - Uses environment variables directly
 * 
 * Environment Variables:
 * - HOST: API host URL (required)
 * - EMAIL: User email (required for login)
 * - PASSWORD: User password (required for login)
 * - ORGANIZATION: Organization UID (required for stack creation)
 */

// Import from dist (built version) to avoid ESM module resolution issues
import * as contentstack from '../../../dist/node/contentstack-management.js'
import dotenv from 'dotenv'
dotenv.config()

// Import test setup for shared context
import { testContext } from './testSetup.js'

/**
 * Create a Contentstack client instance
 * 
 * @param {string|null} authtoken - Optional authtoken (uses testSetup context if not provided)
 * @returns {Object} Contentstack client instance
 */
export function contentstackClient(authtoken = null) {
  const host = process.env.HOST || 'api.contentstack.io'
  
  // If testContext is available and initialized, use its context
  if (testContext && testContext.authtoken && !authtoken) {
    return contentstack.client({
      host: host,
      authtoken: testContext.authtoken,
      timeout: 60000
    })
  }
  
  // Standalone mode with provided authtoken
  const params = {
    host: host,
    timeout: 60000
  }
  
  if (authtoken) {
    params.authtoken = authtoken
  }
  
  return contentstack.client(params)
}

/**
 * Get a stack instance
 * 
 * @param {string|null} apiKey - Optional API key (uses testSetup context if not provided)
 * @returns {Object} Stack instance
 */
export function getStack(apiKey = null) {
  const client = contentstackClient()
  
  // If testContext is available, use its stack API key
  if (!apiKey && testContext && testContext.stackApiKey) {
    apiKey = testContext.stackApiKey
  }
  
  if (!apiKey) {
    throw new Error('API_KEY not available. Ensure testSetup.setup() has been called.')
  }
  
  return client.stack({ api_key: apiKey })
}

/**
 * Get the current test context
 * 
 * @returns {Object} Test context with authtoken, stackApiKey, etc.
 */
export function getTestContext() {
  if (testContext) {
    return testContext
  }
  
  // Fallback to environment variables
  return {
    authtoken: process.env.AUTHTOKEN,
    stackApiKey: process.env.API_KEY,
    organizationUid: process.env.ORGANIZATION
  }
}
