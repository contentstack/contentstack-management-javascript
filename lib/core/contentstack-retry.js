
export default function contentstckRetry (axios, defaultOptions, retryLimit = 5, retryDelay = 2) {
  var networkError = 0
  axios.interceptors.request.use(function (config) {
    // var currentState = config['contentstack'] || {}
    // config['contentstack'] = currentState
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
      networkError++
      if (networkError > retryLimit) {
        return Promise.reject(error)
      }
    } else {
      networkError = 0
    }

    // Retry on server side error
    // if (retryCondition(error)) {
    //   retryErrorType = `Server ${response.status}`
    // var config = error.config
    // var currentState = config['contentstack'] || {}
    // console.log('retry count' + currentState.retryCount)
    // currentState.retryCount = currentState.retryCount || 0
    // currentState.retryCount += 1
    // config['contentstack'] = currentState
    // console.log('retry count' + config['contentstack'])
    // }

    if (response && response.status === 429) {
      retryErrorType = 'Rate Limit'
      wait = retryDelay
    }

    if (retryErrorType) {
      var config = error.config
      defaultOptions.logHandler('warning', `${retryErrorType} error occurred. Waiting for ${wait} ms before retrying...`)
      if (axios.defaults.agent === config.agent) {
        delete config.agent
      }
      if (axios.defaults.httpAgent === config.httpAgent) {
        delete config.httpAgent
      }
      if (axios.defaults.httpsAgent === config.httpsAgent) {
        delete config.httpsAgent
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

  // function retryCondition (error) {
  //   var response = error.response
  //   response.config['contentstack'].retryCount = response.config['contentstack'].retryCount || 0
  //   if (response.status >= 400 && response.status <= 599 && response.config['contentstack'].retryCount < retryLimit) {
  //     return true
  //   }
  //   return false
  // }
}
