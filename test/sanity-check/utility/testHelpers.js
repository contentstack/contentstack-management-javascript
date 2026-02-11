/**
 * Test Helper Utilities
 *
 * Provides helper functions for:
 * - Schema validation
 * - Response validation
 * - Error handling
 * - Test data generation
 * - Cleanup utilities
 * - Automatic assertion tracking
 */

import { expect } from 'chai'

// ============================================================================
// GLOBAL ASSERTION TRACKING
// ============================================================================

/**
 * Store for automatic assertion tracking
 * Used by trackedExpect and manual tracking
 */
export const globalAssertionStore = {
  assertions: [],
  maxAssertions: 50,

  clear () {
    this.assertions = []
  },

  add (assertion) {
    if (this.assertions.length < this.maxAssertions) {
      this.assertions.push(assertion)
    }
  },

  getData () {
    return [...this.assertions]
  }
}

// ============================================================================
// CONFIGURABLE DELAYS
// ============================================================================

/**
 * Default delay between dependent API operations (in milliseconds)
 * This helps with slower environments where APIs need time to propagate
 */
export const API_DELAY = 5000 // 5 seconds

/**
 * Short delay for quick operations
 */
export const SHORT_DELAY = 2000 // 2 seconds

/**
 * Long delay for operations that need more time (like branch creation)
 */
export const LONG_DELAY = 10000 // 10 seconds

// ============================================================================
// RESPONSE VALIDATORS
// ============================================================================

/**
 * Validates that a response has the expected structure for a content type
 * @param {Object} response - The API response
 * @param {string} expectedUid - Expected content type UID
 */
export function validateContentTypeResponse (response, expectedUid = null) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.title).to.be.a('string')
  expect(response.schema).to.be.an('array')

  if (expectedUid) {
    expect(response.uid).to.equal(expectedUid)
  }

  // Validate UID format
  expect(response.uid).to.match(/^[a-z][a-z0-9_]*$/, 'UID should be lowercase with underscores')

  // Validate timestamps exist
  if (response.created_at) {
    expect(new Date(response.created_at)).to.be.instanceof(Date)
  }
  if (response.updated_at) {
    expect(new Date(response.updated_at)).to.be.instanceof(Date)
  }
}

/**
 * Validates that a response has the expected structure for an entry
 * @param {Object} response - The API response
 * @param {string} contentTypeUid - Expected content type UID
 */
export function validateEntryResponse (response, contentTypeUid = null) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.title).to.be.a('string')
  expect(response.locale).to.be.a('string')

  // Validate UID format (entries have blt prefix)
  expect(response.uid).to.match(/^blt[a-f0-9]+$/, 'Entry UID should have blt prefix')

  // Validate required fields
  expect(response._version).to.be.a('number')

  // Validate content type if provided
  if (contentTypeUid) {
    expect(response._content_type_uid).to.equal(contentTypeUid)
  }

  // Validate timestamps
  expect(response.created_at).to.be.a('string')
  expect(response.updated_at).to.be.a('string')
  expect(new Date(response.created_at)).to.be.instanceof(Date)
  expect(new Date(response.updated_at)).to.be.instanceof(Date)
}

/**
 * Validates that a response has the expected structure for an asset
 * @param {Object} response - The API response
 */
export function validateAssetResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.filename).to.be.a('string')
  expect(response.url).to.be.a('string')
  expect(response.content_type).to.be.a('string')
  expect(response.file_size).to.be.a('string')

  // Validate UID format
  expect(response.uid).to.match(/^blt[a-f0-9]+$/, 'Asset UID should have blt prefix')

  // Validate timestamps
  expect(response.created_at).to.be.a('string')
  expect(response.updated_at).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for a global field
 * @param {Object} response - The API response
 * @param {string} expectedUid - Expected global field UID
 */
export function validateGlobalFieldResponse (response, expectedUid = null) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.title).to.be.a('string')
  expect(response.schema).to.be.an('array')

  if (expectedUid) {
    expect(response.uid).to.equal(expectedUid)
  }

  // Validate UID format
  expect(response.uid).to.match(/^[a-z][a-z0-9_]*$/, 'UID should be lowercase with underscores')
}

/**
 * Validates that a response has the expected structure for a taxonomy
 * @param {Object} response - The API response
 */
export function validateTaxonomyResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for a taxonomy term
 * @param {Object} response - The API response
 */
export function validateTermResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for an environment
 * @param {Object} response - The API response
 */
export function validateEnvironmentResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
  expect(response.urls).to.be.an('array')
}

/**
 * Validates that a response has the expected structure for a locale
 * @param {Object} response - The API response
 */
export function validateLocaleResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.code).to.be.a('string')
  expect(response.name).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for a workflow
 * @param {Object} response - The API response
 */
export function validateWorkflowResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
  expect(response.workflow_stages).to.be.an('array')
  expect(response.workflow_stages.length).to.be.at.least(1)
}

/**
 * Validates that a response has the expected structure for a webhook
 * @param {Object} response - The API response
 */
export function validateWebhookResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
  expect(response.destinations).to.be.an('array')
  expect(response.channels).to.be.an('array')
}

/**
 * Validates that a response has the expected structure for a role
 * @param {Object} response - The API response
 */
export function validateRoleResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
  expect(response.rules).to.be.an('array')
}

/**
 * Validates that a response has the expected structure for a release
 * @param {Object} response - The API response
 */
export function validateReleaseResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for a token
 * @param {Object} response - The API response
 */
export function validateTokenResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.name).to.be.a('string')
  expect(response.token).to.be.a('string')
}

/**
 * Validates that a response has the expected structure for a branch
 * @param {Object} response - The API response
 */
export function validateBranchResponse (response) {
  expect(response).to.be.an('object')
  expect(response.uid).to.be.a('string')
  expect(response.source).to.be.a('string')
}

// ============================================================================
// ERROR VALIDATORS
// ============================================================================

/**
 * Validates that an error response has the expected structure
 * @param {Object} error - The error object
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} expectedCode - Expected error code (optional)
 */
export function validateErrorResponse (error, expectedStatus, expectedCode = null) {
  expect(error).to.be.an('object')
  expect(error.status).to.equal(expectedStatus)
  expect(error.errorMessage).to.be.a('string')
  expect(error.errorCode).to.be.a('number')

  if (expectedCode) {
    expect(error.errorCode).to.equal(expectedCode)
  }
}

/**
 * Validates a 404 Not Found error
 * @param {Object} error - The error object
 */
export function validateNotFoundError (error) {
  validateErrorResponse(error, 404)
}

/**
 * Validates a 401 Unauthorized error
 * @param {Object} error - The error object
 */
export function validateUnauthorizedError (error) {
  validateErrorResponse(error, 401)
}

/**
 * Validates a 403 Forbidden error
 * @param {Object} error - The error object
 */
export function validateForbiddenError (error) {
  validateErrorResponse(error, 403)
}

/**
 * Validates a 422 Unprocessable Entity error
 * @param {Object} error - The error object
 */
export function validateValidationError (error) {
  validateErrorResponse(error, 422)
}

/**
 * Validates a 409 Conflict error
 * @param {Object} error - The error object
 */
export function validateConflictError (error) {
  validateErrorResponse(error, 409)
}

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

/**
 * Generates a short unique suffix (4-5 chars)
 * @returns {string} Short unique suffix
 */
export function shortId () {
  return Math.random().toString(36).substring(2, 6)
}

/**
 * Generates a unique identifier for test data (short format)
 * @param {string} prefix - Prefix for the identifier
 * @returns {string} Unique identifier (e.g., test_a1b2)
 */
export function generateUniqueId (prefix = 'test') {
  return `${prefix}_${shortId()}`
}

/**
 * Generates a unique title for test entries (short format)
 * @param {string} base - Base title
 * @returns {string} Unique title
 */
export function generateUniqueTitle (base = 'Test Entry') {
  return `${base} ${shortId()}`
}

/**
 * Generates a unique UID compliant with Contentstack requirements (short format)
 * @param {string} prefix - Prefix for the UID
 * @returns {string} Valid UID (e.g., test_a1b2)
 */
export function generateValidUid (prefix = 'test') {
  return `${prefix}_${shortId()}`.toLowerCase()
}

/**
 * Generates a random email address
 * @returns {string} Random email
 */
export function generateRandomEmail () {
  const random = Math.random().toString(36).substring(2, 10)
  return `test_${random}@example.com`
}

/**
 * Generates a future date ISO string
 * @param {number} daysFromNow - Number of days from now
 * @returns {string} ISO date string
 */
export function generateFutureDate (daysFromNow = 7) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}

/**
 * Generates a past date ISO string
 * @param {number} daysAgo - Number of days ago
 * @returns {string} ISO date string
 */
export function generatePastDate (daysAgo = 7) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// ============================================================================
// WAIT/DELAY UTILITIES
// ============================================================================

/**
 * Waits for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the delay
 */
export function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retries a function until it succeeds or max attempts reached
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delayMs - Delay between attempts in milliseconds
 * @returns {Promise} Result of the function
 */
export async function retry (fn, maxAttempts = 3, delayMs = 1000) {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        await wait(delayMs * attempt) // Exponential backoff
      }
    }
  }

  throw lastError
}

// ============================================================================
// CLEANUP UTILITIES
// ============================================================================

/**
 * Safely deletes an entry (ignores 404 errors)
 * @param {Object} entry - Entry object with delete method
 */
export async function safeDeleteEntry (entry) {
  try {
    await entry.delete()
  } catch (error) {
    if (error.status !== 404) {
      throw error
    }
  }
}

/**
 * Safely deletes a content type (ignores 404 errors)
 * @param {Object} contentType - Content type object with delete method
 */
export async function safeDeleteContentType (contentType) {
  try {
    await contentType.delete()
  } catch (error) {
    if (error.status !== 404) {
      throw error
    }
  }
}

/**
 * Safely deletes an asset (ignores 404 errors)
 * @param {Object} asset - Asset object with delete method
 */
export async function safeDeleteAsset (asset) {
  try {
    await asset.delete()
  } catch (error) {
    if (error.status !== 404) {
      throw error
    }
  }
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Asserts that two arrays have the same elements (order independent)
 * @param {Array} actual - Actual array
 * @param {Array} expected - Expected array
 */
export function assertArraysEqual (actual, expected) {
  expect(actual).to.have.lengthOf(expected.length)
  expected.forEach(item => {
    expect(actual).to.include(item)
  })
}

/**
 * Asserts that an object has all the expected keys
 * @param {Object} obj - Object to check
 * @param {Array} keys - Expected keys
 */
export function assertHasKeys (obj, keys) {
  keys.forEach(key => {
    expect(obj).to.have.property(key)
  })
}

/**
 * Asserts that a value is a valid ISO date string
 * @param {string} value - Value to check
 */
export function assertValidIsoDate (value) {
  expect(value).to.be.a('string')
  const date = new Date(value)
  expect(date.toISOString()).to.equal(value)
}

// ============================================================================
// TEST DATA STORAGE
// ============================================================================

/**
 * In-memory storage for test data (UIDs, etc.)
 * Used to pass data between test cases
 */
export const testData = {
  contentTypes: {},
  entries: {},
  assets: {},
  globalFields: {},
  taxonomies: {},
  environments: {},
  locales: {},
  workflows: {},
  webhooks: {},
  roles: {},
  tokens: {},
  releases: {},
  branches: {},

  // Reset all stored data
  reset () {
    this.contentTypes = {}
    this.entries = {}
    this.assets = {}
    this.globalFields = {}
    this.taxonomies = {}
    this.environments = {}
    this.locales = {}
    this.workflows = {}
    this.webhooks = {}
    this.roles = {}
    this.tokens = {}
    this.releases = {}
    this.branches = {}
  }
}

// Export all
export default {
  // Response validators
  validateContentTypeResponse,
  validateEntryResponse,
  validateAssetResponse,
  validateGlobalFieldResponse,
  validateTaxonomyResponse,
  validateTermResponse,
  validateEnvironmentResponse,
  validateLocaleResponse,
  validateWorkflowResponse,
  validateWebhookResponse,
  validateRoleResponse,
  validateReleaseResponse,
  validateTokenResponse,
  validateBranchResponse,
  // Error validators
  validateErrorResponse,
  validateNotFoundError,
  validateUnauthorizedError,
  validateForbiddenError,
  validateValidationError,
  validateConflictError,
  // Generators
  generateUniqueId,
  generateUniqueTitle,
  generateValidUid,
  generateRandomEmail,
  generateFutureDate,
  generatePastDate,
  // Wait utilities
  wait,
  retry,
  // Cleanup utilities
  safeDeleteEntry,
  safeDeleteContentType,
  safeDeleteAsset,
  // Assertion helpers
  assertArraysEqual,
  assertHasKeys,
  assertValidIsoDate,
  // Test data storage
  testData,
  // cURL utilities
  errorToCurl,
  formatErrorWithCurl,
  createTestWrapper
}

// ============================================================================
// cURL CAPTURE UTILITIES
// ============================================================================

/**
 * Converts a Contentstack SDK error to cURL format
 * @param {Object} error - The error object from SDK
 * @returns {string} - cURL command string
 */
export function errorToCurl (error) {
  try {
    // Extract request info from error
    const request = error.request || error.config || {}

    // Get base URL from environment or default
    const host = process.env.HOST || 'https://api.contentstack.io'

    // Build URL
    let url = request.url || ''
    if (!url.startsWith('http')) {
      url = `${host}/v3${url.startsWith('/') ? '' : '/'}${url}`
    }

    // Start building cURL
    let curl = `curl -X ${(request.method || 'GET').toUpperCase()} '${url}'`

    // Add headers
    const headers = request.headers || {}

    for (const [key, value] of Object.entries(headers)) {
      if (value && typeof value === 'string') {
        // Mask sensitive values
        let displayValue = value
        if (key.toLowerCase() === 'authtoken' || key.toLowerCase() === 'authorization') {
          displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 5)
        }
        curl += ` \\\n  -H '${key}: ${displayValue}'`
      }
    }

    // Add data if present
    const data = request.data
    if (data) {
      let dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 0)
      // Escape single quotes in data
      dataStr = dataStr.replace(/'/g, "'\\''")
      curl += ` \\\n  -d '${dataStr}'`
    }

    return curl
  } catch (e) {
    return `# Could not generate cURL: ${e.message}\n# Original error: ${JSON.stringify(error, null, 2)}`
  }
}

/**
 * Formats an error with cURL for easy debugging
 * @param {Object} error - The error object
 * @returns {string} - Formatted error message with cURL
 */
export function formatErrorWithCurl (error) {
  const curl = errorToCurl(error)

  let message = '\n' + '='.repeat(80) + '\n'
  message += '❌ API REQUEST FAILED\n'
  message += '='.repeat(80) + '\n\n'

  // Error details
  message += `Status: ${error.status || error.statusCode || 'N/A'}\n`
  message += `Status Text: ${error.statusText || 'N/A'}\n`
  message += `Error Code: ${error.errorCode || 'N/A'}\n`
  message += `Error Message: ${error.errorMessage || error.message || 'N/A'}\n`

  // Errors object
  if (error.errors && Object.keys(error.errors).length > 0) {
    message += `\nValidation Errors:\n`
    for (const [field, fieldErrors] of Object.entries(error.errors)) {
      const errorList = Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors
      message += `  - ${field}: ${errorList}\n`
    }
  }

  // cURL
  message += '\n' + '-'.repeat(40) + '\n'
  message += '📋 cURL Command (copy-paste ready):\n'
  message += '-'.repeat(40) + '\n\n'
  message += curl + '\n'
  message += '\n' + '='.repeat(80) + '\n'

  return message
}

/**
 * Creates a test wrapper that captures cURL on failure
 * Use this to wrap your test functions
 * @param {Function} testFn - The async test function
 * @returns {Function} - Wrapped test function
 *
 * @example
 * it('should create entry', createTestWrapper(async () => {
 *   const response = await stack.contentType('blog').entry().create(data)
 *   expect(response.uid).to.exist
 * }))
 */
export function createTestWrapper (testFn) {
  return async function () {
    try {
      await testFn.call(this)
    } catch (error) {
      // Check if it's an API error with request info
      if (error.request || error.config || error.status) {
        const formattedError = formatErrorWithCurl(error)
        console.error(formattedError)

        // Create enhanced error with cURL info
        const enhancedError = new Error(
          `${error.errorMessage || error.message}\n\ncURL:\n${errorToCurl(error)}`
        )
        enhancedError.originalError = error
        enhancedError.curl = errorToCurl(error)
        throw enhancedError
      }
      throw error
    }
  }
}

// ============================================================================
// ASSERTION TRACKING FOR TEST REPORTS
// ============================================================================

/**
 * Global assertion tracker to capture expected vs actual values
 * This data is used to enhance test reports with detailed assertion info
 */
export const assertionTracker = {
  assertions: [],

  /**
   * Clear all tracked assertions (call at start of each test)
   */
  clear () {
    this.assertions = []
  },

  /**
   * Add an assertion record
   * @param {string} description - What is being asserted
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {boolean} passed - Whether the assertion passed
   */
  add (description, expected, actual, passed) {
    this.assertions.push({
      description,
      expected: formatValue(expected),
      actual: formatValue(actual),
      passed
    })
  },

  /**
   * Get all assertions as formatted string for reports
   */
  getReport () {
    if (this.assertions.length === 0) return ''

    return this.assertions.map((a, i) => {
      const status = a.passed ? '✓' : '✗'
      return `${status} ${a.description}\n   Expected: ${a.expected}\n   Actual: ${a.actual}`
    }).join('\n\n')
  },

  /**
   * Get assertions as structured data
   */
  getData () {
    return [...this.assertions]
  }
}

/**
 * Format a value for display in reports
 * @param {*} value - Value to format
 * @returns {string} - Formatted string
 */
function formatValue (value) {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value.length > 100 ? value.substring(0, 100) + '...' : value}"`
  if (typeof value === 'object') {
    try {
      const str = JSON.stringify(value, null, 2)
      return str.length > 200 ? str.substring(0, 200) + '...' : str
    } catch (e) {
      return '[Object]'
    }
  }
  return String(value)
}

/**
 * Track an assertion and add to report
 * Use this to wrap important assertions you want to see in reports
 *
 * @param {string} description - Description of what's being asserted
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {Function} assertFn - The assertion function to execute
 *
 * @example
 * trackAssertion('Response should have uid', response.uid, 'string', () => {
 *   expect(response.uid).to.be.a('string')
 * })
 */
export function trackAssertion (description, actual, expected, assertFn) {
  try {
    assertFn()
    assertionTracker.add(description, expected, actual, true)
  } catch (error) {
    assertionTracker.add(description, expected, actual, false)
    throw error
  }
}

/**
 * Tracked assertion helper - tracks and logs assertions for reports
 * Use this instead of expect() for important assertions you want visible in reports
 *
 * @param {*} actual - The actual value to test
 * @param {string} description - Description for the assertion
 * @returns {Object} - Object with assertion methods
 *
 * @example
 * trackedExpect(response.uid, 'User UID').toBeA('string')
 * trackedExpect(response.email, 'User email').toEqual(expectedEmail)
 * trackedExpect(response.status, 'HTTP Status').toEqual(200)
 */
export function trackedExpect (actual, description = '') {
  return {
    /**
     * Assert value equals expected
     */
    toEqual (expected) {
      try {
        expect(actual).to.equal(expected)
        assertionTracker.add(description || 'Equal check', expected, actual, true)
      } catch (error) {
        assertionTracker.add(description || 'Equal check', expected, actual, false)
        throw error
      }
      return this
    },

    /**
     * Assert value deep equals expected
     */
    toDeepEqual (expected) {
      try {
        expect(actual).to.eql(expected)
        assertionTracker.add(description || 'Deep equal check', expected, actual, true)
      } catch (error) {
        assertionTracker.add(description || 'Deep equal check', expected, actual, false)
        throw error
      }
      return this
    },

    /**
     * Assert value is of type
     */
    toBeA (type) {
      try {
        expect(actual).to.be.a(type)
        assertionTracker.add(description || 'Type check', `a ${type}`, formatValue(actual), true)
      } catch (error) {
        assertionTracker.add(description || 'Type check', `a ${type}`, `${typeof actual}`, false)
        throw error
      }
      return this
    },

    /**
     * Alias for toBeA
     */
    toBeAn (type) {
      return this.toBeA(type)
    },

    /**
     * Assert value exists (not null/undefined)
     */
    toExist () {
      try {
        expect(actual).to.exist
        assertionTracker.add(description || 'Exists check', 'exists', formatValue(actual), true)
      } catch (error) {
        assertionTracker.add(description || 'Exists check', 'exists', 'null/undefined', false)
        throw error
      }
      return this
    },

    /**
     * Assert value is truthy
     */
    toBeTruthy () {
      try {
        expect(actual).to.be.ok
        assertionTracker.add(description || 'Truthy check', 'truthy', formatValue(actual), true)
      } catch (error) {
        assertionTracker.add(description || 'Truthy check', 'truthy', formatValue(actual), false)
        throw error
      }
      return this
    },

    /**
     * Assert array includes value
     */
    toInclude (value) {
      try {
        expect(actual).to.include(value)
        assertionTracker.add(description || 'Include check', `includes ${formatValue(value)}`, formatValue(actual), true)
      } catch (error) {
        assertionTracker.add(description || 'Include check', `includes ${formatValue(value)}`, formatValue(actual), false)
        throw error
      }
      return this
    },

    /**
     * Assert value matches regex
     */
    toMatch (regex) {
      try {
        expect(actual).to.match(regex)
        assertionTracker.add(description || 'Regex match', `matches ${regex}`, formatValue(actual), true)
      } catch (error) {
        assertionTracker.add(description || 'Regex match', `matches ${regex}`, formatValue(actual), false)
        throw error
      }
      return this
    },

    /**
     * Assert value is at least (>=)
     */
    toBeAtLeast (expected) {
      try {
        expect(actual).to.be.at.least(expected)
        assertionTracker.add(description || 'At least check', `>= ${expected}`, actual, true)
      } catch (error) {
        assertionTracker.add(description || 'At least check', `>= ${expected}`, actual, false)
        throw error
      }
      return this
    }
  }
}
