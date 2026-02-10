/**
 * Test Setup Module
 * 
 * This module handles the complete lifecycle of test setup and teardown:
 * 1. Login with credentials to get authtoken
 * 2. Create a NEW test stack dynamically (no pre-existing stack required)
 * 3. Create a Management Token for the test stack
 * 4. Create a Personalize Project linked to the test stack
 * 5. Store credentials for all test files
 * 6. Cleanup: Delete all resources within the stack
 * 7. Conditionally delete the test stack and Personalize Project (based on env flag)
 * 8. Logout
 * 
 * Environment Variables Required:
 * - EMAIL: User email for login
 * - PASSWORD: User password for login
 * - HOST: API host URL (e.g., api.contentstack.io)
 * - ORGANIZATION: Organization UID (for stack creation and personalize)
 * 
 * Optional:
 * - PERSONALIZE_HOST: Personalize API host (default: personalize-api.contentstack.com)
 * - DELETE_DYNAMIC_RESOURCES: Toggle for deleting stack/personalize project (default: true)
 * - CLIENT_ID, APP_ID, REDIRECT_URI: For OAuth tests
 * - MEMBER_EMAIL: For team member operations
 * 
 * NO LONGER REQUIRED (dynamically created):
 * - API_KEY: Generated when test stack is created
 * - MANAGEMENT_TOKEN: Generated for the test stack
 * - PERSONALIZE_PROJECT_UID: Generated when personalize project is created
 */

// Import from dist (built package) - tests the exact artifact customers use
// Ensures we catch real-world bugs from build/bundling
import * as contentstack from '../../../dist/node/contentstack-management.js'

// Global test context - shared across all test files
export const testContext = {
  // Authentication
  authtoken: null,
  userUid: null,
  
  // Stack details (dynamically created)
  stackApiKey: null,
  stackUid: null,
  stackName: null,
  
  // Management Token (dynamically created)
  managementToken: null,
  managementTokenUid: null,
  
  // Organization - will be set at runtime
  organizationUid: null,
  
  // Personalize (dynamically created)
  personalizeProjectUid: null,
  personalizeProjectName: null,
  
  // Client instance
  client: null,
  stack: null,
  
  // Feature flags
  isLoggedIn: false,
  isDynamicStackCreated: false,
  isDynamicPersonalizeCreated: false,
  
  // OAuth (optional) - will be set at runtime
  clientId: null,
  appId: null,
  redirectUri: null
}

/**
 * Utility: Wait for specified milliseconds
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate a short unique ID for naming resources
 */
function shortId() {
  return Math.random().toString(36).substring(2, 7)
}

/**
 * Request capture plugin for SDK
 * Captures all requests/responses for cURL generation and test reporting
 */
let capturedRequests = []

export function getCapturedRequests() {
  return capturedRequests
}

export function getLastCapturedRequest() {
  return capturedRequests.length > 0 ? capturedRequests[capturedRequests.length - 1] : null
}

export function clearCapturedRequests() {
  capturedRequests = []
}

function buildFullUrl(config) {
  try {
    let url = config.url || ''
    const baseURL = config.baseURL || ''
    if (url.startsWith('http')) return url
    if (baseURL) {
      const base = baseURL.replace(/\/+$/, '')
      const path = (url.startsWith('/') ? url : `/${url}`).replace(/^\/+/, '/')
      return `${base}${path}`
    }
    const host = process.env.HOST || 'api.contentstack.io'
    return `https://${host}${url.startsWith('/') ? '' : '/'}${url}`
  } catch (e) {
    return config.url || 'unknown'
  }
}

function generateCurl(config) {
  try {
    const url = buildFullUrl(config)
    
    let curl = `curl -X ${(config.method || 'GET').toUpperCase()} '${url}'`
    
    const headers = config.headers || {}
    for (const [key, value] of Object.entries(headers)) {
      if (value && typeof value === 'string') {
        // Mask sensitive values
        let displayValue = value
        if (key.toLowerCase() === 'authtoken' || key.toLowerCase() === 'authorization') {
          if (value.length > 15) {
            displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 5)
          }
        }
        curl += ` \\\n  -H '${key}: ${displayValue}'`
      }
    }
    
    if (config.data) {
      let dataStr = typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
      dataStr = dataStr.replace(/'/g, "'\\''")
      curl += ` \\\n  -d '${dataStr}'`
    }
    
    return curl
  } catch (e) {
    return `# Could not generate cURL: ${e.message}`
  }
}

function detectSdkMethod(method, url) {
  if (!method || !url) return 'Unknown'
  
  const httpMethod = method.toUpperCase()
  let path = url
  try {
    const urlObj = new URL(url)
    path = urlObj.pathname
  } catch (e) {
    if (url.includes('://')) {
      path = url.split('://')[1].replace(/^[^\/]+/, '')
    }
  }
  path = path.replace(/^\/v\d+/, '')
  
  const patterns = [
    { pattern: /\/user-session$/, method: 'POST', sdk: 'client.login()' },
    { pattern: /\/user-session$/, method: 'DELETE', sdk: 'client.logout()' },
    { pattern: /\/user$/, method: 'GET', sdk: 'client.getUser()' },
    { pattern: /\/stacks$/, method: 'POST', sdk: 'client.stack().create()' },
    { pattern: /\/content_types$/, method: 'POST', sdk: 'stack.contentType().create()' },
    { pattern: /\/content_types$/, method: 'GET', sdk: 'stack.contentType().query().find()' },
    { pattern: /\/content_types\/[^\/]+$/, method: 'GET', sdk: 'stack.contentType(uid).fetch()' },
    { pattern: /\/content_types\/[^\/]+\/entries$/, method: 'POST', sdk: 'contentType.entry().create()' },
    { pattern: /\/content_types\/[^\/]+\/entries$/, method: 'GET', sdk: 'contentType.entry().query().find()' },
    { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+$/, method: 'GET', sdk: 'contentType.entry(uid).fetch()' },
    { pattern: /\/assets$/, method: 'POST', sdk: 'stack.asset().create()' },
    { pattern: /\/assets$/, method: 'GET', sdk: 'stack.asset().query().find()' },
    { pattern: /\/global_fields$/, method: 'POST', sdk: 'stack.globalField().create()' },
    { pattern: /\/global_fields$/, method: 'GET', sdk: 'stack.globalField().query().find()' },
    { pattern: /\/environments$/, method: 'POST', sdk: 'stack.environment().create()' },
    { pattern: /\/environments$/, method: 'GET', sdk: 'stack.environment().query().find()' },
    { pattern: /\/locales$/, method: 'POST', sdk: 'stack.locale().create()' },
    { pattern: /\/locales$/, method: 'GET', sdk: 'stack.locale().query().find()' },
    { pattern: /\/webhooks$/, method: 'POST', sdk: 'stack.webhook().create()' },
    { pattern: /\/webhooks$/, method: 'GET', sdk: 'stack.webhook().query().find()' },
    { pattern: /\/workflows$/, method: 'POST', sdk: 'stack.workflow().create()' },
    { pattern: /\/workflows$/, method: 'GET', sdk: 'stack.workflow().fetchAll()' },
    { pattern: /\/taxonomies$/, method: 'POST', sdk: 'stack.taxonomy().create()' },
    { pattern: /\/taxonomies$/, method: 'GET', sdk: 'stack.taxonomy().query().find()' },
    { pattern: /\/stacks\/branches$/, method: 'GET', sdk: 'stack.branch().query().find()' },
    { pattern: /\/stacks\/branches$/, method: 'POST', sdk: 'stack.branch().create()' },
    { pattern: /\/bulk\/publish$/, method: 'POST', sdk: 'stack.bulkOperation().publish()' },
    { pattern: /\/roles$/, method: 'GET', sdk: 'stack.role().query().find()' },
    { pattern: /\/releases$/, method: 'POST', sdk: 'stack.release().create()' },
    { pattern: /\/releases$/, method: 'GET', sdk: 'stack.release().query().find()' },
    { pattern: /\/organizations$/, method: 'GET', sdk: 'client.organization().fetchAll()' },
    { pattern: /\/organizations\/[^\/]+$/, method: 'GET', sdk: 'client.organization(uid).fetch()' },
    { pattern: /\/variant_groups$/, method: 'POST', sdk: 'stack.variantGroup().create()' },
    { pattern: /\/variant_groups$/, method: 'GET', sdk: 'stack.variantGroup().query().find()' },
  ]
  
  for (const mapping of patterns) {
    if (mapping.method === httpMethod && mapping.pattern.test(path)) {
      return mapping.sdk
    }
  }
  
  return `${httpMethod} ${path}`
}

/**
 * Initialize Contentstack client with request capture plugin
 */
export function initializeClient() {
  const host = process.env.HOST || 'api.contentstack.io'
  
  // Request capture plugin - onResponse receives (response) on success or (error) on failure
  const requestCapturePlugin = {
    onRequest: (request) => {
      request._startTime = Date.now()
      return request
    },
    onResponse: (responseOrError) => {
      // SDK passes response on success, error object on failure - both have .config
      const config = responseOrError?.config
      if (!config) return responseOrError
      
      const isError = responseOrError?.isAxiosError || responseOrError?.response
      const res = responseOrError?.response || responseOrError
      const duration = config._startTime ? Date.now() - config._startTime : null
      const fullUrl = buildFullUrl(config)
      
      const captured = {
        timestamp: new Date().toISOString(),
        method: (config.method || 'GET').toUpperCase(),
        url: fullUrl,
        headers: config.headers || {},
        data: config.data,
        status: res?.status || null,
        statusText: res?.statusText || null,
        responseData: res?.data,
        success: !isError,
        duration: duration,
        curl: generateCurl(config),
        sdkMethod: detectSdkMethod(config.method, fullUrl)
      }
      capturedRequests.push(captured)
      
      if (capturedRequests.length > 100) {
        capturedRequests.shift()
      }
      
      return responseOrError
    }
  }
  
  testContext.client = contentstack.client({
    host: host,
    timeout: 60000,
    plugins: [requestCapturePlugin]
  })
  
  return testContext.client
}

/**
 * Login with email/password and store authtoken
 * Uses direct API call instead of SDK to get the raw authtoken
 */
export async function login() {
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  const host = process.env.HOST || 'api.contentstack.io'
  
  if (!email || !password) {
    throw new Error('EMAIL and PASSWORD environment variables are required')
  }
  
  console.log('🔐 Logging in...')
  
  // Import axios for direct API call
  const axios = (await import('axios')).default
  
  try {
    // Use CMA Login API
    const response = await axios.post(`https://${host}/v3/user-session`, {
      user: {
        email: email,
        password: password
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    testContext.authtoken = response.data.user.authtoken
    testContext.userUid = response.data.user.uid
    testContext.isLoggedIn = true
    
    // Set authtoken on the client (created by initializeClient with plugin)
    if (testContext.client?.axiosInstance?.defaults?.headers) {
      testContext.client.axiosInstance.defaults.headers.common.authtoken = testContext.authtoken
    }
    
    console.log(`✅ Logged in successfully as: ${email}`)
    
    return testContext.authtoken
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.message
    throw new Error(`Login failed: ${errorMsg}`)
  }
}

/**
 * Create a new test stack dynamically
 * Uses CMA API: POST /v3/stacks
 */
export async function createDynamicStack() {
  if (!testContext.isLoggedIn || !testContext.authtoken) {
    throw new Error('Must login before creating stack')
  }
  
  const organizationUid = process.env.ORGANIZATION
  if (!organizationUid) {
    throw new Error('ORGANIZATION environment variable is required for stack creation')
  }
  
  const host = process.env.HOST || 'api.contentstack.io'
  const axios = (await import('axios')).default
  
  // Generate unique stack name
  const stackName = `SDK_Test_${shortId()}`
  
  console.log(`📦 Creating test stack: ${stackName}...`)
  
  try {
    const response = await axios.post(`https://${host}/v3/stacks`, {
      stack: {
        name: stackName,
        description: `Automated test stack created at ${new Date().toISOString()}`,
        master_locale: 'en-us'
      }
    }, {
      headers: {
        'authtoken': testContext.authtoken,
        'organization_uid': organizationUid,
        'Content-Type': 'application/json'
      }
    })
    
    const stack = response.data.stack
    testContext.stackApiKey = stack.api_key
    testContext.stackUid = stack.uid
    testContext.stackName = stack.name
    testContext.organizationUid = organizationUid
    testContext.isDynamicStackCreated = true
    
    // Initialize stack reference in SDK
    testContext.stack = testContext.client.stack({ api_key: testContext.stackApiKey })
    
    console.log(`✅ Created stack: ${testContext.stackName}`)
    console.log(`   API Key: ${testContext.stackApiKey}`)
    
    // Wait for stack to be fully provisioned (branches-enabled orgs create main branch)
    // Management token creation requires stack to be fully ready
    console.log('⏳ Waiting for stack provisioning (5 seconds)...')
    await wait(5000)
    console.log('✅ Stack provisioning complete')
    
    return {
      apiKey: testContext.stackApiKey,
      uid: testContext.stackUid,
      name: testContext.stackName
    }
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.message
    const errors = error.response?.data?.errors
    throw new Error(`Stack creation failed: ${errorMsg}${errors ? ' - ' + JSON.stringify(errors) : ''}`)
  }
}

/**
 * Create a Management Token for the test stack
 * Uses CMA API: POST /v3/stacks/management_tokens
 */
export async function createManagementToken() {
  if (!testContext.stackApiKey || !testContext.authtoken) {
    throw new Error('Must create stack before creating management token')
  }
  
  const host = process.env.HOST || 'api.contentstack.io'
  const axios = (await import('axios')).default
  
  const tokenName = `SDK_Test_Token_${shortId()}`
  
  console.log(`🔑 Creating management token: ${tokenName}...`)
  
  try {
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    const response = await axios.post(`https://${host}/v3/stacks/management_tokens`, {
      token: {
        name: tokenName,
        description: `Auto-generated test token at ${new Date().toISOString()}`,
        scope: [
          // Core content modules - these are confirmed valid
          { module: 'content_type', acl: { read: true, write: true } },
          { module: 'entry', acl: { read: true, write: true } },
          { module: 'asset', acl: { read: true, write: true } },
          { module: 'environment', acl: { read: true, write: true } },
          { module: 'locale', acl: { read: true, write: true } },
          // Branch scope - required for branches-enabled organizations
          { module: 'branch', branches: ['main'], acl: { read: true } },
          { module: 'branch_alias', branch_aliases: [], acl: { read: true } }
        ],
        expires_on: expiryDate.toISOString()
      }
    }, {
      headers: {
        'api_key': testContext.stackApiKey,
        'authtoken': testContext.authtoken,
        'Content-Type': 'application/json'
      }
    })
    
    const token = response.data.token
    testContext.managementToken = token.token
    testContext.managementTokenUid = token.uid
    
    console.log(`✅ Created management token: ${tokenName}`)
    
    return {
      token: testContext.managementToken,
      uid: testContext.managementTokenUid
    }
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.message
    const errorDetails = error.response?.data?.errors || {}
    console.log(`⚠️ Management token creation attempt 1 failed: ${errorMsg}`)
    if (Object.keys(errorDetails).length > 0) {
      console.log(`   Error details: ${JSON.stringify(errorDetails)}`)
    }
    if (error.response?.status) {
      console.log(`   HTTP Status: ${error.response.status}`)
    }
    
    // Retry after waiting - stack may still be initializing
    console.log('⏳ Waiting 5 seconds and retrying...')
    await wait(5000)
    
    try {
      // Calculate expiry date (30 days from now) for retry
      const retryExpiryDate = new Date()
      retryExpiryDate.setDate(retryExpiryDate.getDate() + 30)
      
      const retryResponse = await axios.post(`https://${host}/v3/stacks/management_tokens`, {
        token: {
          name: `${tokenName}_retry`,
          description: `Auto-generated test token (retry) at ${new Date().toISOString()}`,
          scope: [
            // Core content modules - confirmed valid
            { module: 'content_type', acl: { read: true, write: true } },
            { module: 'entry', acl: { read: true, write: true } },
            { module: 'asset', acl: { read: true, write: true } },
            { module: 'environment', acl: { read: true, write: true } },
            { module: 'locale', acl: { read: true, write: true } },
            // Branch scope - required for branches-enabled organizations
            { module: 'branch', branches: ['main'], acl: { read: true } },
            { module: 'branch_alias', branch_aliases: [], acl: { read: true } }
          ],
          expires_on: retryExpiryDate.toISOString()
        }
      }, {
        headers: {
          'api_key': testContext.stackApiKey,
          'authtoken': testContext.authtoken,
          'Content-Type': 'application/json'
        }
      })
      
      const token = retryResponse.data.token
      testContext.managementToken = token.token
      testContext.managementTokenUid = token.uid
      
      console.log(`✅ Created management token on retry: ${tokenName}_retry`)
      
      return {
        token: testContext.managementToken,
        uid: testContext.managementTokenUid
      }
    } catch (retryError) {
      const retryErrorMsg = retryError.response?.data?.error_message || retryError.message
      const retryErrorDetails = retryError.response?.data?.errors || {}
      console.log(`⚠️ Management token creation retry failed: ${retryErrorMsg}`)
      if (Object.keys(retryErrorDetails).length > 0) {
        console.log(`   Error details: ${JSON.stringify(retryErrorDetails)}`)
      }
      if (retryError.response?.status) {
        console.log(`   HTTP Status: ${retryError.response.status}`)
      }
      // Non-fatal - some tests may not need management token
      return null
    }
  }
}

/**
 * Create a Personalize Project linked to the test stack
 * Uses Personalize API: POST /projects
 */
export async function createPersonalizeProject() {
  if (!testContext.stackApiKey || !testContext.authtoken || !testContext.organizationUid) {
    throw new Error('Must create stack before creating personalize project')
  }
  
  const personalizeHost = process.env.PERSONALIZE_HOST || 'personalize-api.contentstack.com'
  const axios = (await import('axios')).default
  
  const projectName = `SDK_Test_Proj_${shortId()}`
  
  console.log(`🎯 Creating personalize project: ${projectName}...`)
  
  try {
    const response = await axios.post(`https://${personalizeHost}/projects`, {
      name: projectName,
      description: `Auto-generated test project at ${new Date().toISOString()}`,
      connectedStackApiKey: testContext.stackApiKey
    }, {
      headers: {
        'Authtoken': testContext.authtoken,
        'Organization_uid': testContext.organizationUid,
        'Content-Type': 'application/json'
      }
    })
    
    const project = response.data
    testContext.personalizeProjectUid = project.uid || project.project_uid || project._id
    testContext.personalizeProjectName = project.name || projectName
    testContext.isDynamicPersonalizeCreated = true
    
    console.log(`✅ Created personalize project: ${testContext.personalizeProjectName}`)
    console.log(`   Project UID: ${testContext.personalizeProjectUid}`)
    
    // Wait for project to be fully linked
    await wait(2000)
    
    return {
      uid: testContext.personalizeProjectUid,
      name: testContext.personalizeProjectName
    }
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.response?.data?.message || error.message
    console.log(`⚠️ Personalize project creation failed: ${errorMsg}`)
    // Non-fatal - variant tests will be skipped if no personalize project
    return null
  }
}

/**
 * Delete the Personalize Project
 * Uses Personalize API: DELETE /projects/{project_uid}
 */
export async function deletePersonalizeProject() {
  if (!testContext.personalizeProjectUid || !testContext.authtoken || !testContext.organizationUid) {
    console.log('   No personalize project to delete')
    return false
  }
  
  const personalizeHost = process.env.PERSONALIZE_HOST || 'personalize-api.contentstack.com'
  const axios = (await import('axios')).default
  
  console.log(`🗑️  Deleting personalize project: ${testContext.personalizeProjectName}...`)
  
  try {
    await axios.delete(`https://${personalizeHost}/projects/${testContext.personalizeProjectUid}`, {
      headers: {
        'Authtoken': testContext.authtoken,
        'Organization_uid': testContext.organizationUid
      }
    })
    
    console.log(`✅ Deleted personalize project: ${testContext.personalizeProjectName}`)
    testContext.personalizeProjectUid = null
    testContext.personalizeProjectName = null
    testContext.isDynamicPersonalizeCreated = false
    
    return true
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.response?.data?.message || error.message
    console.log(`⚠️ Personalize project deletion failed: ${errorMsg}`)
    return false
  }
}

/**
 * Delete the test stack
 * Uses CMA API: DELETE /v3/stacks
 */
export async function deleteStack() {
  if (!testContext.stackApiKey || !testContext.authtoken) {
    console.log('   No stack to delete')
    return false
  }
  
  const host = process.env.HOST || 'api.contentstack.io'
  const axios = (await import('axios')).default
  
  console.log(`🗑️  Deleting test stack: ${testContext.stackName}...`)
  
  try {
    await axios.delete(`https://${host}/v3/stacks`, {
      headers: {
        'api_key': testContext.stackApiKey,
        'authtoken': testContext.authtoken
      }
    })
    
    console.log(`✅ Deleted test stack: ${testContext.stackName}`)
    testContext.stackApiKey = null
    testContext.stackUid = null
    testContext.stackName = null
    testContext.isDynamicStackCreated = false
    
    return true
    
  } catch (error) {
    const errorMsg = error.response?.data?.error_message || error.message
    console.log(`⚠️ Stack deletion failed: ${errorMsg}`)
    return false
  }
}

/**
 * Stack cleanup - Delete all resources within the stack (but keep the stack)
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
    deliveryTokens: 0, managementTokens: 0, releases: 0,
    branches: 0, branchAliases: 0, variantGroups: 0
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
    
    // 2. Variant Groups - Delete all (since we're cleaning up everything)
    console.log('   Deleting variant groups...')
    try {
      const vgData = await apiGet('/variant_groups')
      if (vgData?.variant_groups) {
        for (const vg of vgData.variant_groups) {
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
        const deleted = await apiDelete(`/webhooks/${wh.uid}`)
        if (deleted) {
          results.webhooks++
          console.log(`      Deleted webhook: ${wh.uid}`)
        }
        await new Promise(r => setTimeout(r, 500))
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
    
    // 13. Delete Management Tokens (all of them since this is a dynamic stack)
    console.log('   Deleting management tokens...')
    const mtData = await apiGet('/stacks/management_tokens')
    if (mtData?.tokens) {
      await Promise.all(mtData.tokens.map(async (token) => {
        if (await apiDelete(`/stacks/management_tokens/${token.uid}`)) {
          results.managementTokens++
          console.log(`      Deleted token: ${token.name}`)
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
    try {
      const aliasData = await apiGet('/stacks/branch_aliases')
      if (aliasData?.branch_aliases) {
        for (const alias of aliasData.branch_aliases) {
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
    try {
      const branchData = await apiGet('/stacks/branches')
      if (branchData?.branches) {
        for (const branch of branchData.branches) {
          if (branch.uid === 'main') continue // Keep main branch
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
 * Full setup - Login, create stack, management token, and personalize project
 */
export async function setup() {
  // Initialize context from environment at runtime
  testContext.organizationUid = process.env.ORGANIZATION
  testContext.clientId = process.env.CLIENT_ID
  testContext.appId = process.env.APP_ID
  testContext.redirectUri = process.env.REDIRECT_URI
  
  console.log('\n' + '='.repeat(60))
  console.log('🚀 CMA SDK Test Suite - Dynamic Setup')
  console.log('='.repeat(60))
  console.log(`Host: ${process.env.HOST || 'api.contentstack.io'}`)
  console.log(`Organization: ${testContext.organizationUid}`)
  console.log(`Personalize Host: ${process.env.PERSONALIZE_HOST || 'personalize-api.contentstack.com'}`)
  console.log(`Delete Resources After: ${process.env.DELETE_DYNAMIC_RESOURCES !== 'false'}`)
  console.log('='.repeat(60) + '\n')
  
  // Step 1: Initialize client and login
  initializeClient()
  await login()
  
  // Step 2: Create a new test stack dynamically
  await createDynamicStack()
  
  // Step 3: Create a Management Token for the stack
  await createManagementToken()
  
  // Step 4: Create a Personalize Project linked to the stack
  await createPersonalizeProject()
  
  // Update environment variables for backward compatibility with existing tests
  process.env.API_KEY = testContext.stackApiKey
  process.env.AUTHTOKEN = testContext.authtoken
  if (testContext.managementToken) {
    process.env.MANAGEMENT_TOKEN = testContext.managementToken
  }
  if (testContext.personalizeProjectUid) {
    process.env.PERSONALIZE_PROJECT_UID = testContext.personalizeProjectUid
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Dynamic Setup Complete - Running Tests')
  console.log('='.repeat(60))
  console.log(`   Stack: ${testContext.stackName} (${testContext.stackApiKey})`)
  console.log(`   Management Token: ${testContext.managementToken ? 'Created' : 'Not created'}`)
  console.log(`   Personalize Project: ${testContext.personalizeProjectUid || 'Not created'}`)
  console.log('='.repeat(60) + '\n')
  
  return testContext
}

/**
 * Full teardown - Cleanup resources and conditionally delete stack/personalize project
 */
export async function teardown() {
  console.log('\n' + '='.repeat(60))
  console.log('🧹 CMA SDK Test Suite - Cleanup')
  console.log('='.repeat(60) + '\n')
  
  // Check if we should delete the dynamic resources
  const shouldDeleteResources = process.env.DELETE_DYNAMIC_RESOURCES !== 'false'
  
  if (shouldDeleteResources) {
    // Delete the stack (this deletes all resources inside automatically)
    console.log('📦 Deleting dynamically created resources...')
    
    // Delete Personalize Project first (it's linked to the stack)
    if (testContext.isDynamicPersonalizeCreated) {
      await deletePersonalizeProject()
    }
    
    // Delete the test stack
    if (testContext.isDynamicStackCreated) {
      await deleteStack()
    }
    
    // Logout
    await logout()
  } else {
    // Preserve everything for debugging - don't delete anything
    console.log('📦 DELETE_DYNAMIC_RESOURCES=false - Preserving all resources for debugging')
    console.log('')
    console.log('   Resources preserved for debugging:')
    console.log(`   Stack: ${testContext.stackName}`)
    console.log(`   API Key: ${testContext.stackApiKey}`)
    if (testContext.managementToken) {
      console.log(`   Management Token: ${testContext.managementToken}`)
    }
    if (testContext.personalizeProjectUid) {
      console.log(`   Personalize Project: ${testContext.personalizeProjectUid}`)
    }
    console.log('')
    console.log('   ⚠️  Remember to manually delete these resources when done debugging!')
    
    // Still logout to revoke the authtoken
    await logout()
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Cleanup Complete')
  console.log('='.repeat(60) + '\n')
}

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  // Only require auth credentials and organization - stack is created dynamically
  const required = ['EMAIL', 'PASSWORD', 'HOST', 'ORGANIZATION']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return true
}
