// Example: Configuring Robust Error Handling for Transient Network Failures
// This example shows how to use the enhanced retry mechanisms in the Contentstack Management SDK

const contentstack = require('../lib/contentstack')

// Example 1: Basic configuration with enhanced network retry
const clientWithBasicRetry = contentstack.client({
  api_key: 'your_api_key',
  management_token: 'your_management_token',
  // Enhanced network retry configuration
  retryOnNetworkFailure: true, // Enable network failure retries
  maxNetworkRetries: 3, // Max 3 attempts for network failures
  networkRetryDelay: 100, // Start with 100ms delay
  networkBackoffStrategy: 'exponential' // Use exponential backoff (100ms, 200ms, 400ms)
})

// Example 2: Advanced configuration with fine-grained control
const clientWithAdvancedRetry = contentstack.client({
  api_key: 'your_api_key',
  management_token: 'your_management_token',
  // Network failure retry settings
  retryOnNetworkFailure: true,
  retryOnDnsFailure: true, // Retry on DNS resolution failures (EAI_AGAIN)
  retryOnSocketFailure: true, // Retry on socket errors (ECONNRESET, ETIMEDOUT, etc.)
  retryOnHttpServerError: true, // Retry on HTTP 5xx errors
  maxNetworkRetries: 5, // Allow up to 5 network retries
  networkRetryDelay: 200, // Start with 200ms delay
  networkBackoffStrategy: 'exponential',

  // Original retry settings (for non-network errors)
  retryOnError: true,
  retryLimit: 3,
  retryDelay: 500,

  // Custom logging
  logHandler: (level, message) => {
    console.log(`[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`)
  }
})

// Example 3: Conservative configuration for production
const clientForProduction = contentstack.client({
  api_key: 'your_api_key',
  management_token: 'your_management_token',
  // Conservative retry settings for production
  retryOnNetworkFailure: true,
  maxNetworkRetries: 2, // Only 2 retries to avoid long delays
  networkRetryDelay: 300, // Longer initial delay
  networkBackoffStrategy: 'fixed', // Fixed delay instead of exponential

  // Custom retry condition for additional control
  retryCondition: (error) => {
    // Custom logic: only retry on specific conditions
    return error.response && error.response.status >= 500
  }
})

// Example usage with error handling
async function demonstrateRobustErrorHandling () {
  try {
    const stack = clientWithAdvancedRetry.stack('your_stack_api_key')
    const contentTypes = await stack.contentType().query().find()
    console.log('Content types retrieved successfully:', contentTypes.items.length)
  } catch (error) {
    if (error.retryAttempts) {
      console.error(`Request failed after ${error.retryAttempts} retry attempts:`, error.message)
      console.error('Original error:', error.originalError?.code)
    } else {
      console.error('Request failed:', error.message)
    }
  }
}

// The SDK will now automatically handle:
// ✅ DNS resolution failures (EAI_AGAIN)
// ✅ Socket errors (ECONNRESET, ETIMEDOUT, ECONNREFUSED)
// ✅ HTTP timeouts (ECONNABORTED)
// ✅ HTTP 5xx server errors (500-599)
// ✅ Exponential backoff with configurable delays
// ✅ Clear logging and user-friendly error messages

module.exports = {
  clientWithBasicRetry,
  clientWithAdvancedRetry,
  clientForProduction,
  demonstrateRobustErrorHandling
} 