import Axios from 'axios'
import OAuthHandler from './oauthHandler'
import { validateAndSanitizeConfig } from './Util'

const defaultConfig = {
  maxRequests: 5,
  retryLimit: 5,
  retryDelay: 300,
  // Enhanced retry configuration for transient network failures
  retryOnError: true,
  retryOnNetworkFailure: true,
  retryOnDnsFailure: true,
  retryOnSocketFailure: true,
  retryOnHttpServerError: true,
  maxNetworkRetries: 3,
  networkRetryDelay: 100, // Base delay for network retries (ms)
  networkBackoffStrategy: 'exponential' // 'exponential' or 'fixed'
}

export function ConcurrencyQueue ({ axios, config }) {
  if (!axios) {
    throw Error('Axios instance is not present')
  }

  if (config) {
    if (config.maxRequests && config.maxRequests <= 0) {
      throw Error('Concurrency Manager Error: minimum concurrent requests is 1')
    } else if (config.retryLimit && config.retryLimit <= 0) {
      throw Error('Retry Policy Error: minimum retry limit is 1')
    } else if (config.retryDelay && config.retryDelay < 300) {
      throw Error('Retry Policy Error: minimum retry delay for requests is 300')
    }
    // Validate network retry configuration
    if (config.maxNetworkRetries && config.maxNetworkRetries < 0) {
      throw Error('Network Retry Policy Error: maxNetworkRetries cannot be negative')
    }
    if (config.networkRetryDelay && config.networkRetryDelay < 50) {
      throw Error('Network Retry Policy Error: minimum network retry delay is 50ms')
    }
  }

  this.config = Object.assign({}, defaultConfig, config)
  this.queue = []
  this.running = []
  this.paused = false

  // Helper function to determine if an error is a transient network failure
  const isTransientNetworkError = (error) => {
    // DNS resolution failures
    if (this.config.retryOnDnsFailure && error.code === 'EAI_AGAIN') {
      return { type: 'DNS_RESOLUTION', reason: 'DNS resolution failure (EAI_AGAIN)' }
    }

    // Socket and connection errors
    if (this.config.retryOnSocketFailure) {
      const socketErrorCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EHOSTUNREACH']
      if (socketErrorCodes.includes(error.code)) {
        return { type: 'SOCKET_ERROR', reason: `Socket error: ${error.code}` }
      }
    }

    // Connection timeouts
    if (this.config.retryOnNetworkFailure && error.code === 'ECONNABORTED') {
      return { type: 'TIMEOUT', reason: 'Connection timeout' }
    }

    // HTTP 5xx server errors
    if (this.config.retryOnHttpServerError && error.response && error.response.status >= 500 && error.response.status <= 599) {
      return { type: 'HTTP_SERVER_ERROR', reason: `HTTP ${error.response.status} server error` }
    }

    return null
  }

  // Calculate retry delay with jitter and backoff strategy
  const calculateNetworkRetryDelay = (attempt) => {
    const baseDelay = this.config.networkRetryDelay
    let delay

    if (this.config.networkBackoffStrategy === 'exponential') {
      delay = baseDelay * Math.pow(2, attempt - 1)
    } else {
      delay = baseDelay // Fixed delay
    }

    const jitter = (Math.random() * 100)
    return delay + jitter
  }

  // Log retry attempts
  const logRetryAttempt = (errorInfo, attempt, delay) => {
    const message = `Transient ${errorInfo.type} detected: ${errorInfo.reason}. Retry attempt ${attempt}/${this.config.maxNetworkRetries} in ${delay}ms`
    if (this.config.logHandler) {
      this.config.logHandler('warning', message)
    } else {
      console.warn(`[Contentstack SDK] ${message}`)
    }
  }

  // Log final failure
  const logFinalFailure = (errorInfo, maxRetries) => {
    const message = `Final retry failed for ${errorInfo.type}: ${errorInfo.reason}. Exceeded max retries (${maxRetries}).`
    if (this.config.logHandler) {
      this.config.logHandler('error', message)
    } else {
      console.error(`[Contentstack SDK] ${message}`)
    }
  }

  // Enhanced retry function for network errors
  const retryNetworkError = (error, errorInfo, attempt) => {
    if (attempt > this.config.maxNetworkRetries) {
      logFinalFailure(errorInfo, this.config.maxNetworkRetries)
      // Final error message
      const finalError = new Error(`Network request failed after ${this.config.maxNetworkRetries} retries: ${errorInfo.reason}`)
      finalError.code = error.code
      finalError.originalError = error
      finalError.retryAttempts = attempt - 1
      return Promise.reject(finalError)
    }

    const delay = calculateNetworkRetryDelay(attempt)
    logRetryAttempt(errorInfo, attempt, delay)

    // Initialize retry count if not present
    if (!error.config.networkRetryCount) {
      error.config.networkRetryCount = 0
    }
    error.config.networkRetryCount = attempt

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Remove the failed request from running queue
        const runningIndex = this.running.findIndex(item => item.request === error.config)
        if (runningIndex !== -1) {
          this.running.splice(runningIndex, 1)
        }

        // Retry the request
        const sanitizedConfig = validateAndSanitizeConfig(updateRequestConfig(error, `Network retry ${attempt}`, delay))
        axios(sanitizedConfig)
          .then(resolve)
          .catch((retryError) => {
            // Check if this is still a transient error and we can retry again
            const retryErrorInfo = isTransientNetworkError(retryError)
            if (retryErrorInfo) {
              retryNetworkError(retryError, retryErrorInfo, attempt + 1)
                .then(resolve)
                .catch(reject)
            } else {
              reject(retryError)
            }
          })
      }, delay)
    })
  }

  // Initial shift will check running request,
  // and adds request to running queue if max requests are not running
  this.initialShift = () => {
    if (this.running.length < this.config.maxRequests && !this.paused) {
      shift()
    }
  }

  // INTERNAL: Shift the queued item to running queue
  const shift = () => {
    if (this.queue.length && !this.paused) {
      const queueItem = this.queue.shift()
      queueItem.resolve(queueItem.request)
      this.running.push(queueItem)
    }
  }

  // Append the request at start of queue
  this.unshift = requestPromise => {
    this.queue.unshift(requestPromise)
  }

  this.push = requestPromise => {
    this.queue.push(requestPromise)
    this.initialShift()
  }

  this.clear = () => {
    const requests = this.queue.splice(0, this.queue.length)
    requests.forEach((element) => {
      element.request.source.cancel()
    })
  }

  // Detach the interceptors
  this.detach = () => {
    axios.interceptors.request.eject(this.interceptors.request)
    axios.interceptors.response.eject(this.interceptors.response)
    this.interceptors = {
      request: null,
      response: null
    }
  }

  // Request interceptor to queue the request
  const requestHandler = (request) => {
    if (typeof request.data === 'function') {
      request.formdata = request.data
      request.data = transformFormData(request)
    }
    if (axios?.oauth?.accessToken) {
      const isTokenExpired = axios.oauth.tokenExpiryTime && Date.now() > axios.oauth.tokenExpiryTime
      if (isTokenExpired) {
        return refreshAccessToken().catch((error) => {
          throw new Error('Failed to refresh access token: ' + error.message)
        })
      }
    }

    request.retryCount = request?.retryCount || 0
    setAuthorizationHeaders(request)
    if (request.cancelToken === undefined) {
      const source = Axios.CancelToken.source()
      request.cancelToken = source.token
      request.source = source
    }

    if (this.paused && request.retryCount > 0) {
      return new Promise((resolve, reject) => {
        this.unshift({ request, resolve, reject })
      })
    } else if (request.retryCount > 0) {
      return request
    }

    return new Promise((resolve, reject) => {
      request.onComplete = () => {
        this.running.pop({ request, resolve, reject })
      }
      this.push({ request, resolve, reject })
    })
  }

  const setAuthorizationHeaders = (request) => {
    if (request.headers.authorization && request.headers.authorization !== undefined) {
      if (this.config.authorization && this.config.authorization !== undefined) {
        request.headers.authorization = this.config.authorization
        request.authorization = this.config.authorization
      }
      delete request.headers.authtoken
    } else if (request.headers.authtoken && request.headers.authtoken !== undefined && this.config.authtoken && this.config.authtoken !== undefined) {
      request.headers.authtoken = this.config.authtoken
      request.authtoken = this.config.authtoken
    } else if (axios?.oauth?.accessToken) {
      // If OAuth access token is available in axios instance
      request.headers.authorization = `Bearer ${axios.oauth.accessToken}`
      request.authorization = `Bearer ${axios.oauth.accessToken}`
      delete request.headers.authtoken
    }
  }

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      // Try to refresh the token
      await new OAuthHandler(axios).refreshAccessToken()
      this.paused = false // Resume the request queue once the token is refreshed

      // Retry the requests that were pending due to token expiration
      this.running.forEach(({ request, resolve, reject }) => {
      // Retry the request
        axios(request).then(resolve).catch(reject)
      })
      this.running = [] // Clear the running queue after retrying requests
    } catch (error) {
      this.paused = false // stop queueing requests on failure
      this.running.forEach(({ reject }) => reject(error)) // Reject all queued requests
      this.running = [] // Clear the running queue
    }
  }

  const delay = (time, isRefreshToken = false) => {
    if (!this.paused) {
      this.paused = true
      // Check for current running request.
      // Wait for running queue to complete.
      // Wait and prosed the Queued request.
      if (this.running.length > 0) {
        setTimeout(() => {
          delay(time, isRefreshToken)
        }, time)
      }
      return new Promise(resolve => setTimeout(() => {
        this.paused = false
        if (isRefreshToken) {
          return refreshToken()
        } else {
          for (let i = 0; i < this.config.maxRequests; i++) {
            this.initialShift()
          }
        }
      }, time))
    }
  }

  const refreshToken = () => {
    return config.refreshToken().then((token) => {
      if (token.authorization) {
        axios.defaults.headers.authorization = token.authorization
        axios.defaults.authorization = token.authorization
        axios.httpClientParams.authorization = token.authorization
        axios.httpClientParams.headers.authorization = token.authorization
        this.config.authorization = token.authorization
      } else if (token.authtoken) {
        axios.defaults.headers.authtoken = token.authtoken
        axios.defaults.authtoken = token.authtoken
        axios.httpClientParams.authtoken = token.authtoken
        axios.httpClientParams.headers.authtoken = token.authtoken
        this.config.authtoken = token.authtoken
      }
    }).catch((error) => {
      this.queue.forEach(queueItem => {
        queueItem.reject({
          errorCode: '401',
          errorMessage: (error instanceof Error) ? error.message : error,
          code: 'Unauthorized',
          message: 'Unable to refresh token',
          name: 'Token Error',
          config: queueItem.request,
          stack: (error instanceof Error) ? error.stack : null
        })
      })
      this.queue = []
      this.running = []
    }).finally(() => {
      this.queue.forEach((queueItem) => {
        if (this.config.authorization) {
          queueItem.request.headers.authorization = this.config.authorization
          queueItem.request.authorization = this.config.authorization
        }
        if (this.config.authtoken) {
          queueItem.request.headers.authtoken = this.config.authtoken
          queueItem.request.authtoken = this.config.authtoken
        }
      })
      for (let i = 0; i < this.config.maxRequests; i++) {
        this.initialShift()
      }
    })
  }
  // Response interceptor used for
  const responseHandler = (response) => {
    response.config.onComplete()
    shift()
    return response
  }

  const responseErrorHandler = error => {
    let networkError = error.config.retryCount
    let retryErrorType = null

    // First, check for transient network errors
    const networkErrorInfo = isTransientNetworkError(error)
    if (networkErrorInfo && this.config.retryOnNetworkFailure) {
      const networkRetryCount = error.config.networkRetryCount || 0
      return retryNetworkError(error, networkErrorInfo, networkRetryCount + 1)
    }

    // Original retry logic for non-network errors
    if (!this.config.retryOnError || networkError > this.config.retryLimit) {
      return Promise.reject(responseHandler(error))
    }

    // Check rate limit remaining header before retrying
    const wait = this.config.retryDelay
    var response = error.response
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        const timeoutMs = error.config.timeout || this.config.timeout || 'unknown'
        error.response = {
          ...error.response,
          status: 408,
          statusText: `timeout of ${timeoutMs}ms exceeded`
        }
        response = error.response
      } else {
        return Promise.reject(responseHandler(error))
      }
    } else if ((response.status === 401 && this.config.refreshToken)) {
      retryErrorType = `Error with status: ${response.status}`
      networkError++

      if (networkError > this.config.retryLimit) {
        return Promise.reject(responseHandler(error))
      }
      this.running.shift()
      // Cool down the running requests
      delay(wait, response.status === 401)
      error.config.retryCount = networkError
      // SSRF Prevention: Validate URL before making request
      const sanitizedConfig = validateAndSanitizeConfig(updateRequestConfig(error, retryErrorType, wait))
      return axios(sanitizedConfig)
    }
    if (this.config.retryCondition && this.config.retryCondition(error)) {
      retryErrorType = error.response ? `Error with status: ${response.status}` : `Error Code:${error.code}`
      networkError++
      return this.retry(error, retryErrorType, networkError, wait)
    }
    return Promise.reject(responseHandler(error))
  }

  this.retry = (error, retryErrorType, retryCount, waittime) => {
    let delaytime = waittime
    if (retryCount > this.config.retryLimit) {
      return Promise.reject(responseHandler(error))
    }
    if (this.config.retryDelayOptions) {
      if (this.config.retryDelayOptions.customBackoff) {
        delaytime = this.config.retryDelayOptions.customBackoff(retryCount, error)
        if (delaytime && delaytime <= 0) {
          return Promise.reject(responseHandler(error))
        }
      } else if (this.config.retryDelayOptions.base) {
        delaytime = this.config.retryDelayOptions.base * retryCount
      }
    } else {
      delaytime = this.config.retryDelay
    }
    error.config.retryCount = retryCount
    return new Promise(function (resolve) {
      return setTimeout(function () {
        // SSRF Prevention: Validate URL before making request
        const sanitizedConfig = validateAndSanitizeConfig(updateRequestConfig(error, retryErrorType, delaytime))
        return resolve(axios(sanitizedConfig))
      }, delaytime)
    })
  }

  this.interceptors = {
    request: null,
    response: null
  }

  const updateRequestConfig = (error, retryErrorType, wait) => {
    const requestConfig = error.config
    const message = `${retryErrorType} error occurred. Waiting for ${wait} ms before retrying...`
    if (this.config.logHandler) {
      this.config.logHandler('warning', message)
    } else {
      console.warn(`[Contentstack SDK] ${message}`)
    }
    if (axios !== undefined && axios.defaults !== undefined) {
      if (axios.defaults.agent === requestConfig.agent) {
        delete requestConfig.agent
      }
      if (axios.defaults.httpAgent === requestConfig.httpAgent) {
        delete requestConfig.httpAgent
      }
      if (axios.defaults.httpsAgent === requestConfig.httpsAgent) {
        delete requestConfig.httpsAgent
      }
    }

    requestConfig.data = transformFormData(requestConfig)
    requestConfig.transformRequest = [function (data) {
      return data
    }]
    return requestConfig
  }

  const transformFormData = (request) => {
    if (request.formdata) {
      const formdata = request.formdata()
      request.headers = {
        ...request.headers,
        ...formdata.getHeaders()
      }
      return formdata
    }
    return request.data
  }

  // Adds interseptors in axios to queue request
  this.interceptors.request = axios.interceptors.request.use(requestHandler)
  this.interceptors.response = axios.interceptors.response.use(responseHandler, responseErrorHandler)
}
