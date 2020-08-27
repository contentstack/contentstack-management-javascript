
export default function contentstckRetry (axios, defaultOptions, retryLimit = 5, retryDelay = 2) {
  var networkError = 0
  axios.interceptors.request.use(function (config) {
    if (config.headers.authorization && config.headers.authorization !== undefined) {
      delete config.headers.authtoken
    }
    return config
  })

  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    var wait = retryDelay
    let retryErrorType = null
    if (!defaultOptions.retryOnError) {
      return Promise.reject(error)
    }

    var response = error.response
    if (!response) {
      retryErrorType = `Server connection`
      return Promise.reject(error)
    }

    if (response && response.status === 429) {
      retryErrorType = 'Rate Limit'
      networkError++
      if (networkError > retryLimit) {
        networkError = 0
        return Promise.reject(error)
      }
      wait = retryDelay
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
