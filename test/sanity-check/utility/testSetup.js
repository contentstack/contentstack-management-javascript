/**
 * Test Setup Module
 * 
 * This module handles the complete lifecycle of test setup and teardown:
 * 1. Login with credentials to get authtoken
 * 2. Use existing stack from API_KEY in .env
 * 3. Store credentials for all test files
 * 4. Logout (stack is NOT deleted - it's a persistent test stack)
 * 
 * Environment Variables Required:
 * - EMAIL: User email for login
 * - PASSWORD: User password for login
 * - HOST: API host URL (e.g., api.contentstack.io)
 * - API_KEY: Existing test stack API key
 * - ORGANIZATION: Organization UID (for Teams and other org-level tests)
 * 
 * Optional:
 * - CLIENT_ID, APP_ID, REDIRECT_URI: For OAuth tests
 * - PERSONALIZE_PROJECT_UID: For Variants/Personalize tests
 * - MEMBER_EMAIL: For team member operations
 */

// Import from dist (built version) to avoid ESM module resolution issues
import * as contentstack from '../../../dist/node/contentstack-management.js'

// Global test context - shared across all test files
export const testContext = {
  // Authentication
  authtoken: null,
  userUid: null,
  
  // Stack details (from API_KEY in .env)
  stackApiKey: null,
  stackUid: null,
  stackName: null,
  
  // Organization - will be set at runtime
  organizationUid: null,
  
  // Personalize (optional) - for variant tests
  personalizeProjectUid: null,
  
  // Client instance
  client: null,
  stack: null,
  
  // Feature flags
  isLoggedIn: false,
  
  // OAuth (optional) - will be set at runtime
  clientId: null,
  appId: null,
  redirectUri: null
}

/**
 * Initialize Contentstack client
 */
export function initializeClient() {
  const host = process.env.HOST || 'api.contentstack.io'
  
  testContext.client = contentstack.client({
    host: host,
    timeout: 60000
  })
  
  return testContext.client
}

/**
 * Login with email/password and store authtoken
 */
export async function login() {
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  
  if (!email || !password) {
    throw new Error('EMAIL and PASSWORD environment variables are required')
  }
  
  console.log('🔐 Logging in...')
  
  const client = testContext.client || initializeClient()
  
  const response = await client.login({
    email: email,
    password: password
  })
  
  testContext.authtoken = response.user.authtoken
  testContext.userUid = response.user.uid
  testContext.isLoggedIn = true
  
  // Reinitialize client with authtoken
  testContext.client = contentstack.client({
    host: process.env.HOST || 'api.contentstack.io',
    authtoken: testContext.authtoken,
    timeout: 60000
  })
  
  console.log(`✅ Logged in successfully as: ${email}`)
  
  return testContext.authtoken
}

/**
 * Use existing stack from API_KEY in environment
 */
export async function useExistingStack() {
  if (!testContext.isLoggedIn) {
    throw new Error('Must login before using stack')
  }
  
  const apiKey = process.env.API_KEY
  if (!apiKey) {
    throw new Error('API_KEY environment variable is required')
  }
  
  console.log('📦 Using existing test stack...')
  
  testContext.stackApiKey = apiKey
  
  // Initialize stack reference
  testContext.stack = testContext.client.stack({ api_key: testContext.stackApiKey })
  
  // Fetch stack details to verify it exists and get name
  try {
    const stackDetails = await testContext.stack.fetch()
    testContext.stackUid = stackDetails.uid
    testContext.stackName = stackDetails.name
    
    console.log(`✅ Connected to stack: ${testContext.stackName}`)
    console.log(`   API Key: ${testContext.stackApiKey}`)
  } catch (error) {
    throw new Error(`Failed to connect to stack with API_KEY: ${error.message}`)
  }
  
  // Wait a moment for connection to stabilize
  console.log('⏳ Initializing stack connection...')
  await wait(1000)
  console.log('✅ Stack is ready')
  
  return {
    apiKey: testContext.stackApiKey,
    uid: testContext.stackUid,
    name: testContext.stackName
  }
}

/**
 * Stack cleanup - Delete all resources but keep the stack
 * Uses direct CMA API calls for faster cleanup
 */
export async function cleanupStack() {
  console.log('🧹 Cleaning up stack resources (using direct API calls)...')
  
  const apiKey = testContext.stackApiKey
  const authtoken = testContext.authtoken
  const host = process.env.HOST || 'api.contentstack.io'
  
  if (!apiKey || !authtoken) {
    console.log('⚠️ Missing credentials for cleanup')
    return
  }
  
  // Import axios dynamically
  const axios = (await import('axios')).default
  
  // Base headers for all requests
  const headers = {
    'api_key': apiKey,
    'authtoken': authtoken,
    'Content-Type': 'application/json'
  }
  
  const baseUrl = `https://${host}/v3`
  
  // Track cleanup results
  const results = {
    entries: 0, contentTypes: 0, globalFields: 0, assets: 0,
    environments: 0, locales: 0, taxonomies: 0, webhooks: 0,
    workflows: 0, labels: 0, extensions: 0, roles: 0,
    deliveryTokens: 0, managementTokens: 0, releases: 0
  }
  
  // Helper for API calls
  async function apiGet(path) {
    try {
      const response = await axios.get(`${baseUrl}${path}`, { headers })
      return response.data
    } catch (e) {
      return null
    }
  }
  
  async function apiDelete(path) {
    try {
      await axios.delete(`${baseUrl}${path}`, { headers })
      return true
    } catch (e) {
      // Log deletion failures for debugging
      if (e.response?.status !== 404) {
        console.log(`      ⚠️ Failed to delete ${path}: ${e.response?.data?.error_message || e.message}`)
      }
      return false
    }
  }
  
  try {
    // 1. Delete Entries (must be deleted before content types)
    console.log('   Deleting entries...')
    const ctData = await apiGet('/content_types')
    if (ctData?.content_types) {
      for (const ct of ctData.content_types) {
        const entriesData = await apiGet(`/content_types/${ct.uid}/entries`)
        if (entriesData?.entries) {
          await Promise.all(entriesData.entries.map(async (entry) => {
            if (await apiDelete(`/content_types/${ct.uid}/entries/${entry.uid}`)) {
              results.entries++
            }
          }))
        }
      }
    }
    await wait(2000)
    
    // 2. Variant Groups - Delete all except the one linked to Personalize
    console.log('   Deleting variant groups (preserving Personalize-linked)...')
    results.variantGroups = 0
    try {
      const vgData = await apiGet('/variant_groups')
      if (vgData?.variant_groups) {
        for (const vg of vgData.variant_groups) {
          // Skip the one linked to Personalize (has source or personalize_project_uid)
          // The Personalize-linked one typically has name "test 1" or has personalize metadata
          if (vg.source === 'Personalize' || vg.personalize_project_uid || vg.name === 'test 1') {
            console.log(`      Preserving Personalize-linked variant group: ${vg.name}`)
            continue
          }
          if (await apiDelete(`/variant_groups/${vg.uid}`)) {
            results.variantGroups++
          }
          await wait(500)
        }
      }
    } catch (e) {
      console.log('   Variant groups cleanup error:', e.message)
    }
    
    // 3. Delete Workflows
    console.log('   Deleting workflows...')
    const wfData = await apiGet('/workflows')
    if (wfData?.workflows) {
      await Promise.all(wfData.workflows.map(async (wf) => {
        if (await apiDelete(`/workflows/${wf.uid}`)) results.workflows++
      }))
    }
    
    // 4. Delete Labels (children first, then parents)
    console.log('   Deleting labels...')
    try {
      const labelsData = await apiGet('/labels')
      if (labelsData?.labels) {
        // Sort: children first (those with parent_uid), then parents
        const sorted = [...labelsData.labels].sort((a, b) => {
          if (a.parent && !b.parent) return -1
          if (!a.parent && b.parent) return 1
          return 0
        })
        for (const label of sorted) {
          if (await apiDelete(`/labels/${label.uid}`)) {
            results.labels++
          }
          await wait(500)
        }
      }
    } catch (e) {
      console.log('   Labels cleanup error:', e.message)
    }
    
    // 5. Delete Releases
    console.log('   Deleting releases...')
    const releasesData = await apiGet('/releases')
    if (releasesData?.releases) {
      await Promise.all(releasesData.releases.map(async (release) => {
        if (await apiDelete(`/releases/${release.uid}`)) results.releases++
      }))
    }
    
    // 6. Delete Content Types
    console.log('   Deleting content types...')
    const ctData2 = await apiGet('/content_types')
    if (ctData2?.content_types) {
      for (const ct of ctData2.content_types) {
        if (await apiDelete(`/content_types/${ct.uid}?force=true`)) results.contentTypes++
      }
    }
    await wait(1000)
    
    // 7. Delete Global Fields
    console.log('   Deleting global fields...')
    const gfData = await apiGet('/global_fields')
    if (gfData?.global_fields) {
      await Promise.all(gfData.global_fields.map(async (gf) => {
        if (await apiDelete(`/global_fields/${gf.uid}?force=true`)) results.globalFields++
      }))
    }
    
    // 8. Delete Assets
    console.log('   Deleting assets...')
    const assetsData = await apiGet('/assets')
    if (assetsData?.assets) {
      await Promise.all(assetsData.assets.map(async (asset) => {
        if (await apiDelete(`/assets/${asset.uid}`)) results.assets++
      }))
    }
    
    // 9. Delete Taxonomies (with force)
    console.log('   Deleting taxonomies...')
    const taxData = await apiGet('/taxonomies')
    if (taxData?.taxonomies) {
      await Promise.all(taxData.taxonomies.map(async (tax) => {
        if (await apiDelete(`/taxonomies/${tax.uid}?force=true`)) results.taxonomies++
      }))
    }
    
    // 10. Delete Extensions
    console.log('   Deleting extensions...')
    const extData = await apiGet('/extensions')
    if (extData?.extensions) {
      await Promise.all(extData.extensions.map(async (ext) => {
        if (await apiDelete(`/extensions/${ext.uid}`)) results.extensions++
      }))
    }
    
    // 11. Delete Webhooks
    console.log('   Deleting webhooks...')
    const whData = await apiGet('/webhooks')
    if (whData?.webhooks && whData.webhooks.length > 0) {
      console.log(`      Found ${whData.webhooks.length} webhooks to delete`)
      for (const wh of whData.webhooks) {
        // Webhooks require sequential deletion
        const deleted = await apiDelete(`/webhooks/${wh.uid}`)
        if (deleted) {
          results.webhooks++
          console.log(`      Deleted webhook: ${wh.uid}`)
        }
        await new Promise(r => setTimeout(r, 500)) // Small delay between deletions
      }
    } else {
      console.log('      No webhooks found to delete')
    }
    
    // 12. Delete Delivery Tokens
    console.log('   Deleting delivery tokens...')
    const dtData = await apiGet('/stacks/delivery_tokens')
    if (dtData?.tokens) {
      await Promise.all(dtData.tokens.map(async (token) => {
        if (await apiDelete(`/stacks/delivery_tokens/${token.uid}`)) results.deliveryTokens++
      }))
    }
    
    // 13. Delete Management Tokens (only test-created ones, preserve user tokens)
    console.log('   Deleting management tokens (only test-created)...')
    const mtData = await apiGet('/stacks/management_tokens')
    if (mtData?.tokens) {
      await Promise.all(mtData.tokens.map(async (token) => {
        // Only delete tokens created by test suite (identified by naming pattern)
        // Preserve user-created tokens like those used for MANAGEMENT_TOKEN env
        const isTestCreatedToken = token.name && (
          token.name.includes('Bulk Job Status Token') ||
          token.name.includes('Test Token') ||
          token.name.includes('test_') ||
          token.name.startsWith('mgmt_')
        )
        if (isTestCreatedToken) {
          if (await apiDelete(`/stacks/management_tokens/${token.uid}`)) {
            results.managementTokens++
            console.log(`      Deleted test token: ${token.name}`)
          }
        } else {
          console.log(`      Preserved user token: ${token.name}`)
        }
      }))
    }
    
    // 14. Delete custom locales (keep en-us master locale)
    console.log('   Deleting custom locales...')
    const localeData = await apiGet('/locales')
    if (localeData?.locales) {
      await Promise.all(localeData.locales.map(async (locale) => {
        if (locale.code === 'en-us') return // Keep master locale
        if (await apiDelete(`/locales/${locale.code}`)) results.locales++
      }))
    }
    
    // 15. Delete custom environments
    console.log('   Deleting custom environments...')
    const envData = await apiGet('/environments')
    if (envData?.environments) {
      await Promise.all(envData.environments.map(async (env) => {
        if (await apiDelete(`/environments/${env.name}`)) results.environments++
      }))
    }
    
    // 16. Delete custom roles (keep default roles)
    console.log('   Deleting custom roles...')
    const roleData = await apiGet('/roles')
    const defaultRoles = ['Admin', 'Developer', 'Content Manager']
    if (roleData?.roles) {
      await Promise.all(roleData.roles.map(async (role) => {
        if (defaultRoles.includes(role.name)) return // Keep default roles
        if (await apiDelete(`/roles/${role.uid}`)) results.roles++
      }))
    }
    
    // 17. Delete branch aliases FIRST (must delete before branches)
    console.log('   Deleting branch aliases...')
    results.branchAliases = 0
    try {
      const aliasData = await apiGet('/stacks/branch_aliases')
      if (aliasData?.branch_aliases) {
        for (const alias of aliasData.branch_aliases) {
          // Use force=true to confirm deletion
          if (await apiDelete(`/stacks/branch_aliases/${alias.uid}?force=true`)) {
            results.branchAliases++
            await wait(3000)
          }
        }
      }
    } catch (e) {
      console.log('   Branch aliases cleanup error:', e.message)
    }
    
    // 18. Delete branches (keep main - IMPORTANT: max 10 branches allowed)
    console.log('   Deleting branches (except main)...')
    results.branches = 0
    try {
      const branchData = await apiGet('/stacks/branches')
      if (branchData?.branches) {
        for (const branch of branchData.branches) {
          if (branch.uid === 'main') continue // Keep main branch
          // Use force=true to confirm deletion without prompt
          if (await apiDelete(`/stacks/branches/${branch.uid}?force=true`)) {
            results.branches++
            await wait(3000) // Branches need time to delete
          }
        }
      }
    } catch (e) {
      console.log('   Branches cleanup error:', e.message)
    }
    
    // Print cleanup summary
    console.log('\n   📊 Cleanup Summary:')
    Object.entries(results).forEach(([resource, count]) => {
      if (count > 0) {
        console.log(`      ${resource}: ${count} deleted`)
      }
    })
    
  } catch (error) {
    console.error(`   ❌ Cleanup error: ${error.message}`)
  }
  
  console.log(`\n✅ Stack cleanup complete: ${testContext.stackName}`)
  console.log(`   Stack preserved with API Key: ${testContext.stackApiKey}`)
}

/**
 * Logout and invalidate authtoken
 */
export async function logout() {
  if (!testContext.isLoggedIn || !testContext.authtoken) {
    return
  }
  
  console.log('🚪 Logging out...')
  
  try {
    await testContext.client.logout(testContext.authtoken)
    console.log('✅ Logged out successfully')
    testContext.isLoggedIn = false
  } catch (error) {
    console.error(`⚠️ Logout warning: ${error.message}`)
  }
}

/**
 * Get the Contentstack client (authenticated)
 */
export function getClient() {
  if (!testContext.client) {
    throw new Error('Client not initialized. Call setup() first.')
  }
  return testContext.client
}

/**
 * Get the test stack reference
 */
export function getStack() {
  if (!testContext.stack) {
    throw new Error('Stack not initialized. Call setup() first.')
  }
  return testContext.stack
}

/**
 * Get test context
 */
export function getContext() {
  return testContext
}

/**
 * Full setup - Login and connect to existing stack
 */
export async function setup() {
  // Initialize context from environment at runtime
  testContext.organizationUid = process.env.ORGANIZATION
  testContext.clientId = process.env.CLIENT_ID
  testContext.appId = process.env.APP_ID
  testContext.redirectUri = process.env.REDIRECT_URI
  testContext.personalizeProjectUid = process.env.PERSONALIZE_PROJECT_UID
  
  console.log('\n' + '='.repeat(60))
  console.log('🚀 CMA SDK Test Suite - Setup')
  console.log('='.repeat(60))
  console.log(`Host: ${process.env.HOST || 'api.contentstack.io'}`)
  console.log(`Organization: ${testContext.organizationUid}`)
  console.log(`Stack API Key: ${process.env.API_KEY}`)
  if (testContext.personalizeProjectUid) {
    console.log(`Personalize Project: ${testContext.personalizeProjectUid}`)
  }
  console.log('='.repeat(60) + '\n')
  
  // Step 1: Initialize client and login
  initializeClient()
  await login()
  
  // Step 2: Connect to existing stack
  await useExistingStack()
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Setup Complete - Running Tests')
  console.log('='.repeat(60) + '\n')
  
  return testContext
}

/**
 * Full teardown - Logout (stack is preserved)
 */
export async function teardown() {
  console.log('\n' + '='.repeat(60))
  console.log('🧹 CMA SDK Test Suite - Cleanup')
  console.log('='.repeat(60) + '\n')
  
  // Step 1: Stack is preserved (not deleted)
  await cleanupStack()
  
  // Step 2: Logout
  await logout()
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Cleanup Complete')
  console.log('='.repeat(60) + '\n')
}

/**
 * Utility: Wait for specified milliseconds
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  const required = ['EMAIL', 'PASSWORD', 'HOST', 'API_KEY', 'ORGANIZATION']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return true
}
