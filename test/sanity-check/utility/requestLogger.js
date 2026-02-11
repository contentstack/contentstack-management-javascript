/**
 * Request Logger Utility
 *
 * Intercepts and logs all HTTP requests made during tests.
 * This allows capturing cURL commands for both passed and failed tests.
 * Also maps HTTP requests to SDK method names for coverage tracking.
 */

// Store for captured requests
const requestLog = []
let isLogging = false
let interceptorId = null

// ============================================================================
// SDK METHOD MAPPING
// Maps HTTP method + URL pattern to SDK method names
// ============================================================================

const SDK_METHOD_PATTERNS = [
  // User & Authentication
  { pattern: /\/user-session$/, method: 'POST', sdk: 'client.login()' },
  { pattern: /\/user-session$/, method: 'DELETE', sdk: 'client.logout()' },
  { pattern: /\/user$/, method: 'GET', sdk: 'client.getUser()' },
  { pattern: /\/user$/, method: 'PUT', sdk: 'user.update()' },

  // Stacks
  { pattern: /\/stacks$/, method: 'POST', sdk: 'client.stack().create()' },
  { pattern: /\/stacks$/, method: 'GET', sdk: 'client.stack().query().find()' },
  { pattern: /\/stacks\/[^\/]+$/, method: 'GET', sdk: 'stack.fetch()' },
  { pattern: /\/stacks\/[^\/]+$/, method: 'PUT', sdk: 'stack.update()' },
  { pattern: /\/stacks\/[^\/]+$/, method: 'DELETE', sdk: 'stack.delete()' },
  { pattern: /\/stacks\/transfer_ownership$/, method: 'POST', sdk: 'stack.transferOwnership()' },
  { pattern: /\/stacks\/settings$/, method: 'GET', sdk: 'stack.settings()' },
  { pattern: /\/stacks\/settings$/, method: 'POST', sdk: 'stack.updateSettings()' },

  // Content Types
  { pattern: /\/content_types$/, method: 'POST', sdk: 'stack.contentType().create()' },
  { pattern: /\/content_types$/, method: 'GET', sdk: 'stack.contentType().query().find()' },
  { pattern: /\/content_types\/[^\/]+$/, method: 'GET', sdk: 'stack.contentType(uid).fetch()' },
  { pattern: /\/content_types\/[^\/]+$/, method: 'PUT', sdk: 'stack.contentType(uid).update()' },
  { pattern: /\/content_types\/[^\/]+$/, method: 'DELETE', sdk: 'stack.contentType(uid).delete()' },
  { pattern: /\/content_types\/[^\/]+\/import$/, method: 'POST', sdk: 'stack.contentType().import()' },
  { pattern: /\/content_types\/[^\/]+\/export$/, method: 'GET', sdk: 'stack.contentType(uid).export()' },

  // Entries
  { pattern: /\/content_types\/[^\/]+\/entries$/, method: 'POST', sdk: 'contentType.entry().create()' },
  { pattern: /\/content_types\/[^\/]+\/entries$/, method: 'GET', sdk: 'contentType.entry().query().find()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+$/, method: 'GET', sdk: 'contentType.entry(uid).fetch()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+$/, method: 'PUT', sdk: 'contentType.entry(uid).update()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+$/, method: 'DELETE', sdk: 'contentType.entry(uid).delete()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+\/publish$/, method: 'POST', sdk: 'entry.publish()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+\/unpublish$/, method: 'POST', sdk: 'entry.unpublish()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+\/locales$/, method: 'GET', sdk: 'entry.locales()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+\/versions$/, method: 'GET', sdk: 'entry.versions()' },
  { pattern: /\/content_types\/[^\/]+\/entries\/[^\/]+\/import$/, method: 'POST', sdk: 'contentType.entry().import()' },

  // Entry Variants
  { pattern: /\/entries\/[^\/]+\/variants$/, method: 'GET', sdk: 'entry.variants().query().find()' },
  { pattern: /\/entries\/[^\/]+\/variants\/[^\/]+$/, method: 'GET', sdk: 'entry.variants(uid).fetch()' },
  { pattern: /\/entries\/[^\/]+\/variants\/[^\/]+$/, method: 'PUT', sdk: 'entry.variants(uid).update()' },
  { pattern: /\/entries\/[^\/]+\/variants\/[^\/]+$/, method: 'DELETE', sdk: 'entry.variants(uid).delete()' },

  // Assets
  { pattern: /\/assets$/, method: 'POST', sdk: 'stack.asset().create()' },
  { pattern: /\/assets$/, method: 'GET', sdk: 'stack.asset().query().find()' },
  { pattern: /\/assets\/[^\/]+$/, method: 'GET', sdk: 'stack.asset(uid).fetch()' },
  { pattern: /\/assets\/[^\/]+$/, method: 'PUT', sdk: 'stack.asset(uid).update()' },
  { pattern: /\/assets\/[^\/]+$/, method: 'DELETE', sdk: 'stack.asset(uid).delete()' },
  { pattern: /\/assets\/[^\/]+\/publish$/, method: 'POST', sdk: 'asset.publish()' },
  { pattern: /\/assets\/[^\/]+\/unpublish$/, method: 'POST', sdk: 'asset.unpublish()' },
  { pattern: /\/assets\/folders$/, method: 'POST', sdk: 'stack.asset().folder().create()' },
  { pattern: /\/assets\/folders$/, method: 'GET', sdk: 'stack.asset().folder().query().find()' },

  // Global Fields
  { pattern: /\/global_fields$/, method: 'POST', sdk: 'stack.globalField().create()' },
  { pattern: /\/global_fields$/, method: 'GET', sdk: 'stack.globalField().query().find()' },
  { pattern: /\/global_fields\/[^\/]+$/, method: 'GET', sdk: 'stack.globalField(uid).fetch()' },
  { pattern: /\/global_fields\/[^\/]+$/, method: 'PUT', sdk: 'stack.globalField(uid).update()' },
  { pattern: /\/global_fields\/[^\/]+$/, method: 'DELETE', sdk: 'stack.globalField(uid).delete()' },
  { pattern: /\/global_fields\/import$/, method: 'POST', sdk: 'stack.globalField().import()' },

  // Environments
  { pattern: /\/environments$/, method: 'POST', sdk: 'stack.environment().create()' },
  { pattern: /\/environments$/, method: 'GET', sdk: 'stack.environment().query().find()' },
  { pattern: /\/environments\/[^\/]+$/, method: 'GET', sdk: 'stack.environment(name).fetch()' },
  { pattern: /\/environments\/[^\/]+$/, method: 'PUT', sdk: 'stack.environment(name).update()' },
  { pattern: /\/environments\/[^\/]+$/, method: 'DELETE', sdk: 'stack.environment(name).delete()' },

  // Locales
  { pattern: /\/locales$/, method: 'POST', sdk: 'stack.locale().create()' },
  { pattern: /\/locales$/, method: 'GET', sdk: 'stack.locale().query().find()' },
  { pattern: /\/locales\/[^\/]+$/, method: 'GET', sdk: 'stack.locale(code).fetch()' },
  { pattern: /\/locales\/[^\/]+$/, method: 'PUT', sdk: 'stack.locale(code).update()' },
  { pattern: /\/locales\/[^\/]+$/, method: 'DELETE', sdk: 'stack.locale(code).delete()' },

  // Branches
  { pattern: /\/stacks\/branches$/, method: 'POST', sdk: 'stack.branch().create()' },
  { pattern: /\/stacks\/branches$/, method: 'GET', sdk: 'stack.branch().query().find()' },
  { pattern: /\/stacks\/branches\/[^\/]+$/, method: 'GET', sdk: 'stack.branch(uid).fetch()' },
  { pattern: /\/stacks\/branches\/[^\/]+$/, method: 'DELETE', sdk: 'stack.branch(uid).delete()' },
  { pattern: /\/stacks\/branches_merge$/, method: 'POST', sdk: 'stack.branch().merge()' },
  { pattern: /\/stacks\/branches\/[^\/]+\/compare$/, method: 'GET', sdk: 'stack.branch(uid).compare()' },

  // Branch Aliases
  { pattern: /\/stacks\/branch_aliases$/, method: 'POST', sdk: 'stack.branchAlias().create()' },
  { pattern: /\/stacks\/branch_aliases$/, method: 'GET', sdk: 'stack.branchAlias().query().find()' },
  { pattern: /\/stacks\/branch_aliases\/[^\/]+$/, method: 'GET', sdk: 'stack.branchAlias(uid).fetch()' },
  { pattern: /\/stacks\/branch_aliases\/[^\/]+$/, method: 'PUT', sdk: 'stack.branchAlias(uid).update()' },
  { pattern: /\/stacks\/branch_aliases\/[^\/]+$/, method: 'DELETE', sdk: 'stack.branchAlias(uid).delete()' },

  // Workflows
  { pattern: /\/workflows$/, method: 'POST', sdk: 'stack.workflow().create()' },
  { pattern: /\/workflows$/, method: 'GET', sdk: 'stack.workflow().fetchAll()' },
  { pattern: /\/workflows\/[^\/]+$/, method: 'GET', sdk: 'stack.workflow(uid).fetch()' },
  { pattern: /\/workflows\/[^\/]+$/, method: 'PUT', sdk: 'stack.workflow(uid).update()' },
  { pattern: /\/workflows\/[^\/]+$/, method: 'DELETE', sdk: 'stack.workflow(uid).delete()' },
  { pattern: /\/workflows\/publishing_rules$/, method: 'GET', sdk: 'stack.workflow().publishRule().fetchAll()' },
  { pattern: /\/workflows\/publishing_rules$/, method: 'POST', sdk: 'stack.workflow().publishRule().create()' },

  // Webhooks
  { pattern: /\/webhooks$/, method: 'POST', sdk: 'stack.webhook().create()' },
  { pattern: /\/webhooks$/, method: 'GET', sdk: 'stack.webhook().query().find()' },
  { pattern: /\/webhooks\/[^\/]+$/, method: 'GET', sdk: 'stack.webhook(uid).fetch()' },
  { pattern: /\/webhooks\/[^\/]+$/, method: 'PUT', sdk: 'stack.webhook(uid).update()' },
  { pattern: /\/webhooks\/[^\/]+$/, method: 'DELETE', sdk: 'stack.webhook(uid).delete()' },
  { pattern: /\/webhooks\/[^\/]+\/executions$/, method: 'GET', sdk: 'stack.webhook(uid).executions()' },

  // Extensions
  { pattern: /\/extensions$/, method: 'POST', sdk: 'stack.extension().create()' },
  { pattern: /\/extensions$/, method: 'GET', sdk: 'stack.extension().query().find()' },
  { pattern: /\/extensions\/[^\/]+$/, method: 'GET', sdk: 'stack.extension(uid).fetch()' },
  { pattern: /\/extensions\/[^\/]+$/, method: 'PUT', sdk: 'stack.extension(uid).update()' },
  { pattern: /\/extensions\/[^\/]+$/, method: 'DELETE', sdk: 'stack.extension(uid).delete()' },
  { pattern: /\/extensions\/upload$/, method: 'POST', sdk: 'stack.extension().upload()' },

  // Labels
  { pattern: /\/labels$/, method: 'POST', sdk: 'stack.label().create()' },
  { pattern: /\/labels$/, method: 'GET', sdk: 'stack.label().query().find()' },
  { pattern: /\/labels\/[^\/]+$/, method: 'GET', sdk: 'stack.label(uid).fetch()' },
  { pattern: /\/labels\/[^\/]+$/, method: 'PUT', sdk: 'stack.label(uid).update()' },
  { pattern: /\/labels\/[^\/]+$/, method: 'DELETE', sdk: 'stack.label(uid).delete()' },

  // Releases
  { pattern: /\/releases$/, method: 'POST', sdk: 'stack.release().create()' },
  { pattern: /\/releases$/, method: 'GET', sdk: 'stack.release().query().find()' },
  { pattern: /\/releases\/[^\/]+$/, method: 'GET', sdk: 'stack.release(uid).fetch()' },
  { pattern: /\/releases\/[^\/]+$/, method: 'PUT', sdk: 'stack.release(uid).update()' },
  { pattern: /\/releases\/[^\/]+$/, method: 'DELETE', sdk: 'stack.release(uid).delete()' },
  { pattern: /\/releases\/[^\/]+\/deploy$/, method: 'POST', sdk: 'release.deploy()' },
  { pattern: /\/releases\/[^\/]+\/clone$/, method: 'POST', sdk: 'release.clone()' },
  { pattern: /\/releases\/[^\/]+\/items$/, method: 'GET', sdk: 'release.item().fetchAll()' },
  { pattern: /\/releases\/[^\/]+\/items$/, method: 'POST', sdk: 'release.item().create()' },
  { pattern: /\/releases\/[^\/]+\/items\/[^\/]+$/, method: 'DELETE', sdk: 'release.item(uid).delete()' },

  // Roles
  { pattern: /\/roles$/, method: 'POST', sdk: 'stack.role().create()' },
  { pattern: /\/roles$/, method: 'GET', sdk: 'stack.role().query().find()' },
  { pattern: /\/roles\/[^\/]+$/, method: 'GET', sdk: 'stack.role(uid).fetch()' },
  { pattern: /\/roles\/[^\/]+$/, method: 'PUT', sdk: 'stack.role(uid).update()' },
  { pattern: /\/roles\/[^\/]+$/, method: 'DELETE', sdk: 'stack.role(uid).delete()' },

  // Tokens - Delivery
  { pattern: /\/stacks\/delivery_tokens$/, method: 'POST', sdk: 'stack.deliveryToken().create()' },
  { pattern: /\/stacks\/delivery_tokens$/, method: 'GET', sdk: 'stack.deliveryToken().query().find()' },
  { pattern: /\/stacks\/delivery_tokens\/[^\/]+$/, method: 'GET', sdk: 'stack.deliveryToken(uid).fetch()' },
  { pattern: /\/stacks\/delivery_tokens\/[^\/]+$/, method: 'PUT', sdk: 'stack.deliveryToken(uid).update()' },
  { pattern: /\/stacks\/delivery_tokens\/[^\/]+$/, method: 'DELETE', sdk: 'stack.deliveryToken(uid).delete()' },

  // Tokens - Management
  { pattern: /\/stacks\/management_tokens$/, method: 'POST', sdk: 'stack.managementToken().create()' },
  { pattern: /\/stacks\/management_tokens$/, method: 'GET', sdk: 'stack.managementToken().query().find()' },
  { pattern: /\/stacks\/management_tokens\/[^\/]+$/, method: 'GET', sdk: 'stack.managementToken(uid).fetch()' },
  { pattern: /\/stacks\/management_tokens\/[^\/]+$/, method: 'PUT', sdk: 'stack.managementToken(uid).update()' },
  { pattern: /\/stacks\/management_tokens\/[^\/]+$/, method: 'DELETE', sdk: 'stack.managementToken(uid).delete()' },

  // Taxonomies
  { pattern: /\/taxonomies$/, method: 'POST', sdk: 'stack.taxonomy().create()' },
  { pattern: /\/taxonomies$/, method: 'GET', sdk: 'stack.taxonomy().query().find()' },
  { pattern: /\/taxonomies\/[^\/]+$/, method: 'GET', sdk: 'stack.taxonomy(uid).fetch()' },
  { pattern: /\/taxonomies\/[^\/]+$/, method: 'PUT', sdk: 'stack.taxonomy(uid).update()' },
  { pattern: /\/taxonomies\/[^\/]+$/, method: 'DELETE', sdk: 'stack.taxonomy(uid).delete()' },
  { pattern: /\/taxonomies\/[^\/]+\/terms$/, method: 'POST', sdk: 'taxonomy.terms().create()' },
  { pattern: /\/taxonomies\/[^\/]+\/terms$/, method: 'GET', sdk: 'taxonomy.terms().query().find()' },
  { pattern: /\/taxonomies\/[^\/]+\/terms\/[^\/]+$/, method: 'GET', sdk: 'taxonomy.terms(uid).fetch()' },
  { pattern: /\/taxonomies\/[^\/]+\/terms\/[^\/]+$/, method: 'PUT', sdk: 'taxonomy.terms(uid).update()' },
  { pattern: /\/taxonomies\/[^\/]+\/terms\/[^\/]+$/, method: 'DELETE', sdk: 'taxonomy.terms(uid).delete()' },

  // Variant Groups
  { pattern: /\/variant_groups$/, method: 'POST', sdk: 'stack.variantGroup().create()' },
  { pattern: /\/variant_groups$/, method: 'GET', sdk: 'stack.variantGroup().query().find()' },
  { pattern: /\/variant_groups\/[^\/]+$/, method: 'GET', sdk: 'stack.variantGroup(uid).fetch()' },
  { pattern: /\/variant_groups\/[^\/]+$/, method: 'PUT', sdk: 'stack.variantGroup(uid).update()' },
  { pattern: /\/variant_groups\/[^\/]+$/, method: 'DELETE', sdk: 'stack.variantGroup(uid).delete()' },

  // Variants
  { pattern: /\/variants$/, method: 'POST', sdk: 'variantGroup.variants().create()' },
  { pattern: /\/variants$/, method: 'GET', sdk: 'variantGroup.variants().query().find()' },
  { pattern: /\/variants\/[^\/]+$/, method: 'GET', sdk: 'variantGroup.variants(uid).fetch()' },
  { pattern: /\/variants\/[^\/]+$/, method: 'PUT', sdk: 'variantGroup.variants(uid).update()' },
  { pattern: /\/variants\/[^\/]+$/, method: 'DELETE', sdk: 'variantGroup.variants(uid).delete()' },

  // Bulk Operations
  { pattern: /\/bulk\/publish$/, method: 'POST', sdk: 'stack.bulkOperation().publish()' },
  { pattern: /\/bulk\/unpublish$/, method: 'POST', sdk: 'stack.bulkOperation().unpublish()' },
  { pattern: /\/bulk\/delete$/, method: 'DELETE', sdk: 'stack.bulkOperation().delete()' },
  { pattern: /\/bulk\/workflow$/, method: 'POST', sdk: 'stack.bulkOperation().updateWorkflow()' },

  // Audit Logs
  { pattern: /\/audit-logs$/, method: 'GET', sdk: 'stack.auditLog().query().find()' },
  { pattern: /\/audit-logs\/[^\/]+$/, method: 'GET', sdk: 'stack.auditLog(uid).fetch()' },

  // Organizations
  { pattern: /\/organizations$/, method: 'GET', sdk: 'client.organization().fetchAll()' },
  { pattern: /\/organizations\/[^\/]+$/, method: 'GET', sdk: 'client.organization(uid).fetch()' },
  { pattern: /\/organizations\/[^\/]+\/stacks$/, method: 'GET', sdk: 'organization.stacks()' },
  { pattern: /\/organizations\/[^\/]+\/roles$/, method: 'GET', sdk: 'organization.roles()' },
  { pattern: /\/organizations\/[^\/]+\/share$/, method: 'POST', sdk: 'organization.addUser()' },

  // Teams
  { pattern: /\/organizations\/[^\/]+\/teams$/, method: 'POST', sdk: 'organization.teams().create()' },
  { pattern: /\/organizations\/[^\/]+\/teams$/, method: 'GET', sdk: 'organization.teams().fetchAll()' },
  { pattern: /\/organizations\/[^\/]+\/teams\/[^\/]+$/, method: 'GET', sdk: 'organization.teams(uid).fetch()' },
  { pattern: /\/organizations\/[^\/]+\/teams\/[^\/]+$/, method: 'PUT', sdk: 'organization.teams(uid).update()' },
  { pattern: /\/organizations\/[^\/]+\/teams\/[^\/]+$/, method: 'DELETE', sdk: 'organization.teams(uid).delete()' },
  { pattern: /\/organizations\/[^\/]+\/teams\/[^\/]+\/users$/, method: 'POST', sdk: 'team.users().add()' },
  { pattern: /\/organizations\/[^\/]+\/teams\/[^\/]+\/users\/[^\/]+$/, method: 'DELETE', sdk: 'team.users(uid).remove()' }
]

/**
 * Detects the SDK method from HTTP request details
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - Request URL
 * @returns {string} - SDK method name or 'Unknown'
 */
export function detectSdkMethod (method, url) {
  if (!method || !url) return 'Unknown'

  const httpMethod = method.toUpperCase()

  // Extract path from URL (remove host/base URL)
  let path = url
  try {
    const urlObj = new URL(url)
    path = urlObj.pathname
  } catch (e) {
    // If not a valid URL, use as-is (might be a path)
    if (url.includes('://')) {
      path = url.split('://')[1].replace(/^[^\/]+/, '')
    }
  }

  // Remove version prefix like /v3/
  path = path.replace(/^\/v\d+/, '')

  // Find matching pattern
  for (const mapping of SDK_METHOD_PATTERNS) {
    if (mapping.method === httpMethod && mapping.pattern.test(path)) {
      return mapping.sdk
    }
  }

  return `Unknown (${httpMethod} ${path})`
}

/**
 * Converts a request config to cURL format
 * @param {Object} config - Axios request config
 * @returns {string} - cURL command
 */
export function requestToCurl (config) {
  try {
    if (!config) return '# No request config available'

    const host = process.env.HOST || 'https://api.contentstack.io'

    // Build URL
    let url = config.url || ''
    if (!url.startsWith('http')) {
      const baseURL = config.baseURL || host
      url = `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`
    }

    // Start cURL command
    let curl = `curl -X ${(config.method || 'GET').toUpperCase()} '${url}'`

    // Add headers
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

    // Add data if present
    if (config.data) {
      let dataStr = typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
      // Escape single quotes
      dataStr = dataStr.replace(/'/g, "'\\''")
      curl += ` \\\n  -d '${dataStr}'`
    }

    return curl
  } catch (e) {
    return `# Could not generate cURL: ${e.message}`
  }
}

/**
 * Logs a request
 * @param {Object} config - Request config
 * @param {Object} response - Response object (optional)
 * @param {Object} error - Error object (optional)
 */
export function logRequest (config, response = null, error = null) {
  if (!isLogging) return

  const httpMethod = config?.method?.toUpperCase() || 'UNKNOWN'
  const url = config?.url || 'unknown'

  const entry = {
    timestamp: new Date().toISOString(),
    method: httpMethod,
    url: url,
    curl: requestToCurl(config),
    status: response?.status || error?.status || null,
    success: !error,
    duration: null,
    sdkMethod: detectSdkMethod(httpMethod, url)
  }

  // Calculate duration if we have timing info
  if (config?._startTime) {
    entry.duration = Date.now() - config._startTime
  }

  requestLog.push(entry)

  // Keep only last 100 requests to avoid memory issues
  if (requestLog.length > 100) {
    requestLog.shift()
  }
}

/**
 * Gets all logged requests
 * @returns {Array} - Array of logged requests
 */
export function getRequestLog () {
  return [...requestLog]
}

/**
 * Gets the last N requests
 * @param {number} n - Number of requests to return
 * @returns {Array} - Array of logged requests
 */
export function getLastRequests (n = 5) {
  return requestLog.slice(-n)
}

/**
 * Gets the last request
 * @returns {Object|null} - Last logged request or null
 */
export function getLastRequest () {
  return requestLog.length > 0 ? requestLog[requestLog.length - 1] : null
}

/**
 * Clears the request log
 */
export function clearRequestLog () {
  requestLog.length = 0
}

/**
 * Starts logging requests
 */
export function startLogging () {
  isLogging = true
  clearRequestLog()
}

/**
 * Stops logging requests
 */
export function stopLogging () {
  isLogging = false
}

/**
 * Checks if logging is active
 * @returns {boolean}
 */
export function isLoggingActive () {
  return isLogging
}

/**
 * Sets up axios interceptors to capture all requests
 * @param {Object} axiosInstance - The axios instance to intercept
 */
export function setupAxiosInterceptor (axiosInstance) {
  if (!axiosInstance || interceptorId !== null) return

  // Request interceptor - add start time
  axiosInstance.interceptors.request.use(
    (config) => {
      config._startTime = Date.now()
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - log successful requests
  interceptorId = axiosInstance.interceptors.response.use(
    (response) => {
      logRequest(response.config, response, null)
      return response
    },
    (error) => {
      logRequest(error.config, null, error)
      return Promise.reject(error)
    }
  )
}

/**
 * Formats request log entry for display
 * @param {Object} entry - Request log entry
 * @returns {string} - Formatted string
 */
export function formatRequestEntry (entry) {
  const status = entry.success ? '✅' : '❌'
  const duration = entry.duration ? `${entry.duration}ms` : 'N/A'
  const sdk = entry.sdkMethod ? `\n📦 SDK Method: ${entry.sdkMethod}` : ''

  return `${status} ${entry.method} ${entry.url} [${entry.status || 'N/A'}] (${duration})${sdk}\n${entry.curl}`
}

/**
 * Get all unique SDK methods that were called
 * @returns {Array<string>} - Array of SDK method names
 */
export function getCalledSdkMethods () {
  const methods = new Set()
  for (const entry of requestLog) {
    if (entry.sdkMethod && !entry.sdkMethod.startsWith('Unknown')) {
      methods.add(entry.sdkMethod)
    }
  }
  return Array.from(methods).sort()
}

/**
 * Get SDK method coverage summary
 * @returns {Object} - Coverage summary with counts
 */
export function getSdkMethodCoverage () {
  const coverage = {}
  for (const entry of requestLog) {
    if (entry.sdkMethod) {
      coverage[entry.sdkMethod] = (coverage[entry.sdkMethod] || 0) + 1
    }
  }
  return coverage
}

export default {
  requestToCurl,
  logRequest,
  getRequestLog,
  getLastRequests,
  getLastRequest,
  clearRequestLog,
  startLogging,
  stopLogging,
  isLoggingActive,
  setupAxiosInterceptor,
  formatRequestEntry,
  detectSdkMethod,
  getCalledSdkMethods,
  getSdkMethodCoverage
}
