/**
 * Sanity Test Suite - Main Orchestrator
 *
 * This file orchestrates all API test suites for the CMA JavaScript SDK.
 *
 * The test suite is FULLY SELF-CONTAINED and dynamically creates:
 * 1. Logs in using EMAIL/PASSWORD to get authtoken
 * 2. Creates a NEW test stack (no pre-existing stack required)
 * 3. Creates a Management Token for the stack
 * 4. Creates a Personalize Project linked to the stack
 * 5. Runs all API tests against the stack
 * 6. Cleans up all created resources within the stack
 * 7. Conditionally deletes stack and personalize project (based on env flag)
 * 8. Logs out
 *
 * Environment Variables Required:
 * - EMAIL: User email for login
 * - PASSWORD: User password for login
 * - HOST: API host URL (e.g., api.contentstack.io, eu-api.contentstack.com)
 * - ORGANIZATION: Organization UID (for stack creation and personalize)
 *
 * Optional:
 * - PERSONALIZE_HOST: Personalize API host (default: personalize-api.contentstack.com)
 * - DELETE_DYNAMIC_RESOURCES: Toggle for deleting stack/personalize (default: true)
 *   Set to 'false' to preserve resources for debugging
 * - MEMBER_EMAIL: For team member operations
 * - CLIENT_ID: OAuth client ID
 * - APP_ID: OAuth app ID
 * - REDIRECT_URI: OAuth redirect URI
 *
 * NO LONGER REQUIRED (dynamically created):
 * - API_KEY: Generated when test stack is created
 * - MANAGEMENT_TOKEN: Generated for the test stack
 * - PERSONALIZE_PROJECT_UID: Generated when personalize project is created
 *
 * Usage:
 *   npm run test:sanity
 *
 * Or run individual test files:
 *   npm run test -- --grep "Content Type API Tests"
 *
 * To preserve resources for debugging:
 *   DELETE_DYNAMIC_RESOURCES=false npm run test:sanity
 */

import dotenv from 'dotenv'

import fs from 'fs'
import path from 'path'
import { before, after, afterEach, beforeEach } from 'mocha'
import addContext from 'mochawesome/addContext.js'
import * as testSetup from './utility/testSetup.js'
import { testData, errorToCurl, assertionTracker, globalAssertionStore } from './utility/testHelpers.js'
import * as requestLogger from './utility/requestLogger.js'

// ============================================================================
// TEST SUITE EXECUTION ORDER
//
// Dependency Order (as per user specification):
// Locales → Environments → Assets → Taxonomies → Extensions → Marketplace Apps →
// Webhooks → Global Fields → Content Types → Labels → Personalize (variant groups) →
// Entries → Variant Entries → Branches → Roles → Workflows → Releases → Bulk Operations
// Teams depend on users/roles
// ============================================================================

// Phase 1: User Profile (login already done in setup)
import './api/user-test.js'

// Phase 2: Organization (Teams moved to after Roles due to dependency)
import './api/organization-test.js'

// Phase 3: Stack Operations
import './api/stack-test.js'

// Phase 4: Locales (needed for environments and entries)
import './api/locale-test.js'

// Phase 5: Environments (needed for tokens, publishing)
import './api/environment-test.js'

// Phase 6: Assets (needed for entries with file fields)
import './api/asset-test.js'

// Phase 7: Taxonomies (needed for content types with taxonomy fields)
import './api/taxonomy-test.js'
import './api/terms-test.js'

// Phase 8: Extensions (needed for content types with custom fields)
import './api/extension-test.js'

// Phase 9: Webhooks (no schema dependencies)
import './api/webhook-test.js'

// Phase 10: Global Fields (needed before content types that reference them)
import './api/globalfield-test.js'

// Phase 11: Content Types (depends on global fields, taxonomy, extensions)
import './api/contentType-test.js'

// Phase 12: Labels (depends on content types)
import './api/label-test.js'

// Phase 13: Entries (depends on content types, assets, environments)
// NOTE: Entries MUST run BEFORE Variants as variants are created based on entries
import './api/entry-test.js'

// Phase 14: Personalize / Variant Groups (depends on content types, entries)
import './api/variantGroup-test.js'
import './api/variants-test.js'
import './api/ungroupedVariants-test.js'
import './api/entryVariants-test.js'

// Phase 15: Branches (after entries are created)
import './api/branch-test.js'
import './api/branchAlias-test.js'

// Phase 16: Roles (depends on content types, environments, branches)
import './api/role-test.js'

// Phase 17: Teams (depends on users/roles)
import './api/team-test.js'

// Phase 18: Workflows (depends on content types, environments)
import './api/workflow-test.js'

// Phase 19: Tokens (depends on environments, branches)
import './api/token-test.js'
import './api/previewToken-test.js'

// Phase 20: Releases (depends on entries, assets)
import './api/release-test.js'

// Phase 21: Bulk Operations (depends on entries, assets, environments)
import './api/bulkOperation-test.js'

// Phase 22: Audit Log (runs after most operations for logs)
import './api/auditlog-test.js'

// Phase 23: OAuth Authentication
import './api/oauth-test.js'
dotenv.config()

// Max length for response body in report (avoid huge payloads)
const MAX_RESPONSE_BODY_DISPLAY = 4000

function formatRequestHeadersForReport (headers) {
  if (!headers || typeof headers !== 'object') return ''
  const lines = []
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) continue
    let display = String(value)
    if (key.toLowerCase() === 'authtoken' || key.toLowerCase() === 'authorization') {
      display = display.length > 15 ? display.substring(0, 10) + '...' + display.substring(display.length - 5) : '***'
    }
    lines.push(`${key}: ${display}`)
  }
  return lines.join('\n')
}

function formatResponseForReport (lastRequest) {
  const parts = []
  if (lastRequest.headers && Object.keys(lastRequest.headers).length > 0) {
    const requestHeaderLines = formatRequestHeadersForReport(lastRequest.headers)
    if (requestHeaderLines) {
      parts.push({ title: '📤 Request Headers', value: requestHeaderLines })
    }
  }
  if (lastRequest.responseHeaders && Object.keys(lastRequest.responseHeaders).length > 0) {
    const headerLines = Object.entries(lastRequest.responseHeaders)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    parts.push({ title: '📥 Response Headers', value: headerLines })
  }
  if (lastRequest.responseData !== undefined && lastRequest.responseData !== null) {
    let bodyStr
    try {
      bodyStr = typeof lastRequest.responseData === 'object'
        ? JSON.stringify(lastRequest.responseData, null, 2)
        : String(lastRequest.responseData)
    } catch (e) {
      bodyStr = String(lastRequest.responseData)
    }
    if (bodyStr.length > MAX_RESPONSE_BODY_DISPLAY) {
      bodyStr = bodyStr.slice(0, MAX_RESPONSE_BODY_DISPLAY) + '\n... (truncated)'
    }
    parts.push({ title: '📥 Response Body', value: bodyStr })
  }
  return parts
}

// Store test cURLs for the final report
const testCurls = []

// File to save cURLs
const curlOutputFile = path.join(process.cwd(), 'test-curls.txt')

// ============================================================================
// GLOBAL SETUP - Login and Create Test Stack
// ============================================================================

before(async function () {
  // Increase timeout for setup (login + stack creation)
  this.timeout(120000) // 2 minutes

  // Start request logging to capture cURL for all tests
  requestLogger.startLogging()

  try {
    // Validate environment variables
    testSetup.validateEnvironment()

    // Setup: Login and create test stack
    await testSetup.setup()

    // Store in process.env for backward compatibility with existing tests
    process.env.API_KEY = testSetup.testContext.stackApiKey
    process.env.AUTHTOKEN = testSetup.testContext.authtoken
  } catch (error) {
    console.error('\n❌ SETUP FAILED:', error.message)
    console.error('\nPlease ensure your .env file contains:')
    console.error('  EMAIL=your-email@example.com')
    console.error('  PASSWORD=your-password')
    console.error('  HOST=api.contentstack.io')
    console.error('  ORGANIZATION=your-org-uid')
    console.error('\nOptional settings:')
    console.error('  PERSONALIZE_HOST=personalize-api.contentstack.com')
    console.error('  DELETE_DYNAMIC_RESOURCES=true (set to false to preserve for debugging)')
    console.error('\nNote: API_KEY, MANAGEMENT_TOKEN, and PERSONALIZE_PROJECT_UID')
    console.error('are now dynamically created and no longer required in .env')
    throw error
  }
})

// ============================================================================
// GLOBAL CURL CAPTURE FOR ALL TESTS (PASSED AND FAILED)
// ============================================================================

// Clear request log and assertion tracker before each test
beforeEach(function () {
  // Clear SDK plugin request capture
  testSetup.clearCapturedRequests()

  try {
    requestLogger.clearRequestLog()
  } catch (e) {
    // Ignore if request logger not available
  }

  // Clear assertion trackers for fresh tracking in each test
  assertionTracker.clear()
  globalAssertionStore.clear()
})

afterEach(function () {
  const test = this.currentTest
  if (!test) return

  const testTitle = test.fullTitle()
  const testState = test.state // 'passed', 'failed', or undefined (pending)
  const error = test.err

  // Try to extract API error/request info from errors (for failed tests)
  let apiInfo = null

  if (error) {
    // Check error message for JSON API response
    if (error.message) {
      const jsonMatch = error.message.match(/\{[\s\S]*"status"[\s\S]*\}/)
      if (jsonMatch) {
        try {
          apiInfo = JSON.parse(jsonMatch[0])
        } catch (e) {
          // Not valid JSON
        }
      }
    }

    // Check direct error properties
    if (!apiInfo && (error.request || error.config || error.status)) {
      apiInfo = error.originalError || error
    }

    // Check for nested errors
    if (!apiInfo && error.actual && typeof error.actual === 'object') {
      if (error.actual.request || error.actual.status) {
        apiInfo = error.actual
      }
    }
  }

  // Get the last request from SDK plugin capture or fallback to request logger
  let lastRequest = testSetup.getLastCapturedRequest()
  if (!lastRequest) {
    try {
      lastRequest = requestLogger.getLastRequest()
    } catch (e) {
      // Request logger might not be active
    }
  }

  // Add context to Mochawesome report
  try {
    // Get tracked assertions (from trackedExpect)
    const trackedAssertions = assertionTracker.getData()

    // Build Expected vs Actual value once so we never skip it
    let expectedVsActualTitle = '📊 Expected vs Actual'
    let expectedVsActualValue = ''

    if (testState === 'passed') {
      addContext(this, {
        title: '✅ Test Result',
        value: 'PASSED'
      })

      if (trackedAssertions.length > 0) {
        expectedVsActualTitle = '📊 Assertions Verified (Expected vs Actual)'
        expectedVsActualValue = trackedAssertions.map(a =>
          `✓ ${a.description}\n   Expected: ${a.expected}\n   Actual: ${a.actual}`
        ).join('\n\n')
      } else if (lastRequest) {
        expectedVsActualValue = `Expected: Successful API response\nActual: ${lastRequest.status ?? 'OK'} - ${lastRequest.method || '?'} ${lastRequest.url || '?'}`
      } else {
        expectedVsActualValue = 'Expected: Success\nActual: Test passed (no SDK request captured for this test)'
      }
      // Always add Expected vs Actual for every passed test
      addContext(this, { title: expectedVsActualTitle, value: expectedVsActualValue })

      // For passed tests, add the last request curl if available
      if (lastRequest && lastRequest.curl) {
        testCurls.push({
          test: testTitle,
          state: testState,
          curl: lastRequest.curl,
          sdkMethod: lastRequest.sdkMethod,
          details: {
            status: lastRequest.status,
            method: lastRequest.method,
            url: lastRequest.url
          }
        })

        // Add SDK Method being tested
        if (lastRequest.sdkMethod && !lastRequest.sdkMethod.startsWith('Unknown')) {
          addContext(this, {
            title: '📦 SDK Method Tested',
            value: lastRequest.sdkMethod
          })
        }

        addContext(this, {
          title: '📡 API Request',
          value: `${lastRequest.method} ${lastRequest.url} [${lastRequest.status || 'OK'}]`
        })

        addContext(this, {
          title: '📋 cURL Command (copy-paste ready)',
          value: lastRequest.curl
        })
      }
    } else if (testState === 'failed') {
      addContext(this, {
        title: '❌ Test Result',
        value: 'FAILED'
      })

      // Add Expected vs Actual for failed tests
      if (error) {
        if (error.expected !== undefined || error.actual !== undefined) {
          // Chai assertion error
          addContext(this, {
            title: '❌ Expected vs Actual',
            value: `Expected: ${JSON.stringify(error.expected)}\nActual: ${JSON.stringify(error.actual)}`
          })
        } else if (error.status || error.errorMessage || apiInfo) {
          // API/SDK error (e.g. 422 from API)
          const status = error.status ?? apiInfo?.status ?? error.response?.status
          const msg = error.errorMessage ?? apiInfo?.errorMessage ?? error.message ?? 'Error'
          const errDetails = error.errors || apiInfo?.errors || {}
          const detailsStr = Object.keys(errDetails).length ? `\nDetails: ${JSON.stringify(errDetails)}` : ''
          addContext(this, {
            title: '❌ Expected vs Actual',
            value: `Expected: Success\nActual: ${status} - ${msg}${detailsStr}`
          })
        } else {
          // Fallback: any other error (e.g. thrown Error, assertion in test code)
          const msg = error.message || String(error)
          addContext(this, {
            title: '❌ Expected vs Actual',
            value: `Expected: Success\nActual: ${msg}`
          })
        }
      }

      // Add assertion details for failed tests (from trackedExpect)
      if (trackedAssertions.length > 0) {
        const passedAssertions = trackedAssertions.filter(a => a.passed)
        const failedAssertion = trackedAssertions.find(a => !a.passed)

        if (passedAssertions.length > 0) {
          addContext(this, {
            title: '📊 Assertions Passed Before Failure',
            value: passedAssertions.map(a =>
              `✓ ${a.description}\n   Expected: ${a.expected}\n   Actual: ${a.actual}`
            ).join('\n\n')
          })
        }

        if (failedAssertion) {
          addContext(this, {
            title: '❌ Failed Assertion (Expected vs Actual)',
            value: `✗ ${failedAssertion.description}\n   Expected: ${failedAssertion.expected}\n   Actual: ${failedAssertion.actual}`
          })
        }
      }

      // Add cURL from captured request (for ALL failed tests - from SDK plugin)
      if (lastRequest && lastRequest.curl) {
        addContext(this, {
          title: '📋 cURL Command (copy-paste ready)',
          value: lastRequest.curl
        })
        addContext(this, {
          title: '📡 API Request',
          value: `${lastRequest.method} ${lastRequest.url} [${lastRequest.status || 'N/A'}]`
        })
        if (lastRequest.sdkMethod && !lastRequest.sdkMethod.startsWith('Unknown')) {
          addContext(this, {
            title: '📦 SDK Method Tested',
            value: lastRequest.sdkMethod
          })
        }
      }
    }

    // Add request headers, response headers & body when available
    if (lastRequest && (lastRequest.headers || lastRequest.responseHeaders || lastRequest.responseData !== undefined)) {
      const reportParts = formatResponseForReport(lastRequest)
      reportParts.forEach(p => addContext(this, p))
    }

    // Add API error details if available (for failed tests with API error in response)
    if (apiInfo) {
      const curl = errorToCurl(apiInfo)

      testCurls.push({
        test: testTitle,
        state: testState,
        curl: curl || (lastRequest?.curl),
        sdkMethod: lastRequest?.sdkMethod,
        details: {
          status: apiInfo.status,
          message: apiInfo.errorMessage || apiInfo.message,
          errors: apiInfo.errors
        }
      })

      // Add error/response details (skip cURL if already added from lastRequest)
      addContext(this, {
        title: '❌ API Error Details',
        value: {
          status: apiInfo.status || 'N/A',
          statusText: apiInfo.statusText || 'N/A',
          errorCode: apiInfo.errorCode || 'N/A',
          message: apiInfo.errorMessage || apiInfo.message || 'N/A',
          errors: apiInfo.errors || {}
        }
      })

      // Add cURL from apiInfo only if we didn't already add from lastRequest
      if (!lastRequest?.curl && curl) {
        addContext(this, {
          title: '📋 cURL Command (copy-paste ready)',
          value: curl
        })
      }

      if (apiInfo.request && apiInfo.request.url) {
        addContext(this, {
          title: '🔗 Request',
          value: `${(apiInfo.request.method || 'GET').toUpperCase()} ${apiInfo.request.url}`
        })
      }
    }
  } catch (e) {
    // addContext might fail if mochawesome is not properly loaded
  }
})

// ============================================================================
// GLOBAL TEARDOWN - Delete Test Stack and Logout
// ============================================================================

after(async function () {
  // Timeout for cleanup (using direct API calls - much faster)
  this.timeout(120000) // 2 minutes should be enough with direct API calls

  // cURLs are captured in HTML report, just save to file for reference
  const failedWithCurl = testCurls.filter(t => t.state === 'failed')
  const passedWithCurl = testCurls.filter(t => t.state === 'passed')

  if (testCurls.length > 0) {
    // Save all cURLs to file (no console output - cURLs are in HTML report)
    try {
      let fileContent = `CMA SDK Test - API Requests Log\n`
      fileContent += `Generated: ${new Date().toISOString()}\n`
      fileContent += `Total Requests: ${testCurls.length}\n`
      fileContent += `Passed: ${passedWithCurl.length} | Failed: ${failedWithCurl.length}\n`
      fileContent += `${'═'.repeat(80)}\n\n`

      // Failed tests first
      if (failedWithCurl.length > 0) {
        fileContent += `\n${'═'.repeat(40)}\n`
        fileContent += `❌ FAILED TESTS (${failedWithCurl.length})\n`
        fileContent += `${'═'.repeat(40)}\n\n`

        failedWithCurl.forEach((item, index) => {
          fileContent += `${'─'.repeat(80)}\n`
          fileContent += `[${index + 1}] ${item.test}\n`
          fileContent += `${'─'.repeat(80)}\n`
          if (item.sdkMethod && !item.sdkMethod.startsWith('Unknown')) {
            fileContent += `SDK Method: ${item.sdkMethod}\n`
          }
          fileContent += `Status: ${item.details.status || 'N/A'}\n`
          fileContent += `Message: ${item.details.message || 'N/A'}\n`
          if (item.details.errors && Object.keys(item.details.errors).length > 0) {
            fileContent += 'Validation Errors:\n'
            Object.entries(item.details.errors).forEach(([field, errors]) => {
              fileContent += `  - ${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}\n`
            })
          }
          fileContent += '\ncURL:\n'
          fileContent += item.curl + '\n\n'
        })
      }

      // Passed tests
      if (passedWithCurl.length > 0) {
        fileContent += `\n${'═'.repeat(40)}\n`
        fileContent += `✅ PASSED TESTS (${passedWithCurl.length})\n`
        fileContent += `${'═'.repeat(40)}\n\n`

        passedWithCurl.forEach((item, index) => {
          fileContent += `${'─'.repeat(80)}\n`
          fileContent += `[${index + 1}] ${item.test}\n`
          fileContent += `${'─'.repeat(80)}\n`
          if (item.sdkMethod && !item.sdkMethod.startsWith('Unknown')) {
            fileContent += `SDK Method: ${item.sdkMethod}\n`
          }
          fileContent += `Status: ${item.details.status || 'N/A'}\n`
          fileContent += '\ncURL:\n'
          fileContent += item.curl + '\n\n'
        })
      }

      fs.writeFileSync(curlOutputFile, fileContent)
      // Silent file save - cURLs are in HTML report
    } catch (e) {
      // Ignore file save errors - cURLs are in HTML report
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Summary')
  console.log('='.repeat(60))

  // SDK Method Coverage Summary
  try {
    const sdkCoverage = requestLogger.getSdkMethodCoverage()
    const calledMethods = Object.keys(sdkCoverage).filter(m => !m.startsWith('Unknown'))

    if (calledMethods.length > 0) {
      console.log('\n📦 SDK Methods Tested:')
      calledMethods.sort().forEach(method => {
        console.log(`   ${method} (${sdkCoverage[method]}x)`)
      })
      console.log(`\n   Total unique SDK methods: ${calledMethods.length}`)
    }
  } catch (e) {
    // Ignore coverage summary errors
  }

  // Log test data created during tests
  const storedData = {
    contentTypes: Object.keys(testData.contentTypes || {}).length,
    entries: Object.keys(testData.entries || {}).length,
    assets: Object.keys(testData.assets || {}).length,
    globalFields: Object.keys(testData.globalFields || {}).length,
    taxonomies: Object.keys(testData.taxonomies || {}).length,
    environments: Object.keys(testData.environments || {}).length,
    locales: Object.keys(testData.locales || {}).length,
    workflows: Object.keys(testData.workflows || {}).length,
    webhooks: Object.keys(testData.webhooks || {}).length,
    roles: Object.keys(testData.roles || {}).length,
    tokens: Object.keys(testData.tokens || {}).length,
    releases: Object.keys(testData.releases || {}).length,
    branches: Object.keys(testData.branches || {}).length
  }

  console.log('Test Data Created During Run:')
  Object.entries(storedData).forEach(([key, count]) => {
    if (count > 0) {
      console.log(`  ${key}: ${count}`)
    }
  })
  console.log('='.repeat(60) + '\n')

  // Reset test data storage
  if (testData.reset) {
    testData.reset()
  }

  // Cleanup: Delete test stack and logout
  try {
    await testSetup.teardown()
  } catch (error) {
    console.error('⚠️ Cleanup warning:', error.message)
  }
})

/**
 * Test Suite Summary
 *
 * Total Test Files: 27
 *
 * ✅ Test Files:
 *   1. user-test.js - User profile, token validation
 *   2. organization-test.js - Organization fetch, stacks, users, roles
 *   3. team-test.js - Teams CRUD, Stack Role Mapping, Team Users
 *   4. stack-test.js - Stack CRUD, settings, users, share
 *   5. contentType-test.js - CRUD, all field types, nested structures
 *   6. globalfield-test.js - CRUD, nested schemas, embedding in CTs
 *   7. extension-test.js - Custom Fields, Widgets, Dashboards, Upload
 *   8. entry-test.js - CRUD, all field types, atomic ops, versioning, publishing
 *   9. asset-test.js - Upload, CRUD, folders, publishing, versioning
 *   10. taxonomy-test.js - CRUD, error handling
 *   11. terms-test.js - CRUD, hierarchical terms, movement
 *   12. locale-test.js - CRUD, fallback configuration
 *   13. environment-test.js - CRUD, URL configuration
 *   14. workflow-test.js - CRUD, stages, publish rules
 *   15. release-test.js - CRUD, items, deployment, clone
 *   16. bulkOperation-test.js - Bulk publish/unpublish, Job status
 *   17. webhook-test.js - CRUD, channels, executions
 *   18. role-test.js - CRUD, complex permissions
 *   19. token-test.js - Delivery, Management, Preview tokens
 *   20. branch-test.js - CRUD, compare, merge, alias
 *   21. label-test.js - CRUD, content type assignment
 *   22. auditlog-test.js - Fetch, filtering
 *   23. variantGroup-test.js - Variant Groups CRUD
 *   24. variants-test.js - Variants within groups
 *   25. entryVariants-test.js - Entry Variants CRUD, publishing
 *   26. ungroupedVariants-test.js - Ungrouped/Personalize Variants
 *   27. oauth-test.js - OAuth authentication flow
 *
 * SDK Modules Covered:
 *   - User & Authentication
 *   - OAuth Authentication
 *   - Organization
 *   - Teams (with Users & Role Mapping)
 *   - Stack
 *   - Content Type
 *   - Global Field
 *   - Extensions (Custom Fields, Widgets, Dashboards)
 *   - Entry (with all field types)
 *   - Asset
 *   - Taxonomy & Terms
 *   - Locale
 *   - Environment
 *   - Workflow & Publish Rules
 *   - Release
 *   - Bulk Operations & Job Status
 *   - Webhook
 *   - Role
 *   - Delivery Token
 *   - Management Token
 *   - Preview Token
 *   - Branch & Branch Alias
 *   - Label
 *   - Audit Log
 *   - Variant Groups
 *   - Variants
 *   - Entry Variants
 *   - Ungrouped Variants (Personalize)
 */
