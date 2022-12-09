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

  // Request interceptor to queue the request
  const requestHandler = (request) => {
    if (typeof request.data === 'function') {
      request.formdata = request.data
      request.data = transformFormData(request)
    }
    request.retryCount = request.retryCount || 0
    if (request.headers.authorization && request.headers.authorization !== undefined) {
      if (this.config.authorization && this.config.authorization !== undefined) {
        request.headers.authorization = this.config.authorization
        request.authorization = this.config.authorization
      }
      delete request.headers.authtoken
    } else if (request.headers.authtoken && request.headers.authtoken !== undefined && this.config.authtoken && this.config.authtoken !== undefined) {
      request.headers.authtoken = this.config.authtoken
      request.authtoken = this.config.authtoken
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
      request.onComplete = () => {
        this.running.pop({ request, resolve })
      }
      this.push({ request, resolve })
    })
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
      throw error
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
    if (!this.config.retryOnError || networkError > this.config.retryLimit) {
      return Promise.reject(responseHandler(error))
    }

    // Error handling
    const wait = this.config.retryDelay
    var response = error.response
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        error.response = {
          ...error.response,
          status: 408,
          statusText: `timeout of ${this.config.timeout}ms exceeded`
        }
        response = error.response
      } else {
        return Promise.reject(responseHandler(error))
      }
    } else if (response.status === 429 || (response.status === 401 && this.config.refreshToken)) {
      retryErrorType = `Error with status: ${response.status}`
      networkError++

      if (networkError > this.config.retryLimit) {
        return Promise.reject(responseHandler(error))
      }
      this.running.shift()
      // Cool down the running requests
      delay(wait, response.status === 401)
      error.config.retryCount = networkError
      // deepcode ignore Ssrf: URL is dynamic
      return axios(updateRequestConfig(error, retryErrorType, wait))
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
        // deepcode ignore Ssrf: URL is dynamic
        return resolve(axios(updateRequestConfig(error, retryErrorType, delaytime)))
      }, delaytime)
    })
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
