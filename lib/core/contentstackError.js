
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
  }

  var error = new Error()
  Object.assign(error, errorDetails)
  error.message = JSON.stringify(errorDetails)
  throw error
}
