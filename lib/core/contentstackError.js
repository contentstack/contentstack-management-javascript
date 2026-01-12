/**
 * Formats and throws an error from an HTTP error response.
 * @param {Object} errorResponse - Error response object from HTTP request.
 * @param {Object} errorResponse.config - Request configuration object.
 * @param {Object} errorResponse.response - HTTP response object.
 * @param {number} errorResponse.response.status - HTTP status code.
 * @param {string} errorResponse.response.statusText - HTTP status text.
 * @param {Object} errorResponse.response.data - Response data containing error details.
 * @throws {Error} Formatted error object with request and response details.
 */
export default function error (errorResponse) {
  const config = errorResponse.config
  const response = errorResponse.response
  if (!config || !response) {
    throw errorResponse
  }
  const data = response.data

  var errorDetails = {
    status: response.status,
    statusText: response.statusText
  }

  if (config.headers && config.headers.authtoken) {
    const token = `...${config.headers.authtoken.substr(-5)}`
    config.headers.authtoken = token
  }

  if (config.headers && config.headers.authorization) {
    const token = `...${config.headers.authorization.substr(-5)}`
    config.headers.authorization = token
  }

  errorDetails.request = {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  }

  if (data) {
    errorDetails.errorMessage = data.error_message || data.message || ''
    errorDetails.errorCode = data.error_code || 0
    errorDetails.errors = data.errors || {}
    errorDetails.error = data.error || ''
    errorDetails.tfa_type = data.tfa_type
  }

  var error = new Error()
  Object.assign(error, errorDetails)
  error.message = JSON.stringify(errorDetails)
  throw error
}
