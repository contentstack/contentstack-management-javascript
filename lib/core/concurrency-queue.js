import Axios from 'axios'
const defaultConfig = {
  maxRequests: 5,
  retryLimit: 5,
  retryDelay: 300
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
  }

  this.config = Object.assign({}, defaultConfig, config)
  this.queue = []
  this.running = []
  this.paused = false

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

  // Request interseptor to queue the request
  const requestHandler = request => {
    request.retryCount = request.retryCount || 0
    if (request.headers.authorization && request.headers.authorization !== undefined) {
      delete request.headers.authtoken
    }

    if (request.cancelToken === undefined) {
      const source = Axios.CancelToken.source()
      request.cancelToken = source.token
      request.source = source
    }

    if (this.paused && request.retryCount > 0) {
      return new Promise(resolve => {
        this.unshift({ request, resolve })
      })
    } else if (request.retryCount > 0) {
      return request
    }

    return new Promise(resolve => {
      this.push({ request, resolve })
    })
  }

  const delay = (time) => {
    if (!this.paused) {
      this.paused = true
      // Check for current running request.
      // Wait for running queue to complete.
      // Wait and prosed the Queued request.
      if (this.running.length > 0) {
        setTimeout(() => {
          delay(time)
        }, time)
      }
      return new Promise(resolve => setTimeout(() => {
        this.paused = false
        for (let i = 0; i < this.config.maxRequests; i++) {
          this.initialShift()
        }
      }, time))
    }
  }

  // Response interceptor used for
  const responseHandler = (response) => {
    this.running.shift()
    shift()
    return response
  }

  const responseErrorHandler = error => {
    let networkError = error.config.retryCount
    let retryErrorType = null
    if (!this.config.retryOnError || networkError > this.config.retryLimit) {
      return Promise.reject(responseHandler(error))
    }

    // Error handling
    let wait = this.config.retryDelay
    const response = error.response
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        error.response = {
          ...error.response,
          status: 408,
          statusText: `timeout of ${this.config.timeout}ms exceeded`
        }
      } else {
        return Promise.reject(responseHandler(error))
      }
    } else if (response.status === 429) {
      retryErrorType = `Error with status: ${response.status}`
      networkError++

      if (networkError > this.config.retryLimit) {
        return Promise.reject(responseHandler(error))
      }
      this.running.shift()
      wait = 1000
      // Cooldown the running requests
      delay(wait)
      error.config.retryCount = networkError

      return axios(updateRequestConfig(error, retryErrorType, wait))
    } else if (this.config.retryCondition && this.config.retryCondition(error)) {
      retryErrorType = `Error with status: ${response.status}`
      networkError++
      if (networkError > this.config.retryLimit) {
        return Promise.reject(responseHandler(error))
      }
      if (this.config.retryDelayOptions) {
        if (this.config.retryDelayOptions.customBackoff) {
          wait = this.config.retryDelayOptions.customBackoff(networkError, error)
          if (wait && wait <= 0) {
            return Promise.reject(responseHandler(error))
          }
        } else if (this.config.retryDelayOptions.base) {
          wait = this.config.retryDelayOptions.base * networkError
        }
      } else {
        wait = this.config.retryDelay
      }
      error.config.retryCount = networkError
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(axios(updateRequestConfig(error, retryErrorType, wait)))
        }, wait)
      })
    }
    return Promise.reject(responseHandler(error))
  }

  this.interceptors = {
    request: null,
    response: null
  }

  const updateRequestConfig = (error, retryErrorType, wait) => {
    const requestConfig = error.config
    this.config.logHandler('warning', `${retryErrorType} error occurred. Waiting for ${wait} ms before retrying...`)
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

    requestConfig.transformRequest = [function (data) {
      return data
    }]
    return requestConfig
  }

  // Adds interseptors in axios to queue request
  this.interceptors.request = axios.interceptors.request.use(requestHandler)
  this.interceptors.response = axios.interceptors.response.use(responseHandler, responseErrorHandler)
}
