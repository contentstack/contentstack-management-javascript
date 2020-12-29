
export default function contentstckRetry (axios, defaultOptions, retryLimit = 5, retryDelay = 300) {
  var networkError = 0
  axios.interceptors.request.use(function (config) {
    if (config.headers.authorization && config.headers.authorization !== undefined) {
      delete config.headers.authtoken
    }
    return config
  })

  axios.interceptors.response.use(function (response) {
    networkError = 0
    return response
  }, function (error) {
    var wait = retryDelay
    let retryErrorType = null
    var response = error.response

    if (!response) {
      if (error.code === 'ECONNABORTED') {
        error.response = {
          ...error.response,
          status: 408,
          statusText: `timeout of ${defaultOptions.timeout}ms exceeded`
        }
      }else {
        return Promise.reject(error)
      }
    }
    if (!defaultOptions.retryOnError) {
      return Promise.reject(error)
    }
      
    if (defaultOptions.retryCondition && defaultOptions.retryCondition(error)) {
      retryErrorType = `Error with status: ${error.response.status}`
      networkError++
      if (networkError > retryLimit) {
        networkError = 0
        return Promise.reject(error)
      }
      if (defaultOptions.retryDelayOptions) {
        if (defaultOptions.retryDelayOptions.customBackoff) {
          wait = defaultOptions.retryDelayOptions.customBackoff(networkError, error)
          if (wait && wait <= 0) {
            networkError = 0
            return Promise.reject(error)
          }
        } else if (defaultOptions.retryDelayOptions.base) {
          wait = defaultOptions.retryDelayOptions.base * networkError
        }
      } else {
        wait = retryDelay
      }
    } else {
      networkError = 0
    }

    if (retryErrorType && error.config !== undefined) {
      var config = error.config
      defaultOptions.logHandler('warning', `${retryErrorType} error occurred. Waiting for ${wait} ms before retrying...`)
      if (axios !== undefined && axios.defaults !== undefined) {
        if (axios.defaults.agent === config.agent) {
          delete config.agent
        }
        if (axios.defaults.httpAgent === config.httpAgent) {
          delete config.httpAgent
        }
        if (axios.defaults.httpsAgent === config.httpsAgent) {
          delete config.httpsAgent
        }
      }

      config.transformRequest = [function (data) {
        return data
      }]
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(axios(config))
        }, wait)
      })
    }
    return Promise.reject(error)
  })
}
