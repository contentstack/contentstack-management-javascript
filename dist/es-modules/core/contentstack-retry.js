export default function contentstckRetry(axios, defaultOptions) {
  var retryLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var retryDelay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var networkError = 0;
  axios.interceptors.request.use(function (config) {
    // var currentState = config['contentstack'] || {}
    // config['contentstack'] = currentState
    if (config.headers.authorization && config.headers.authorization !== undefined) {
      delete config.headers.authtoken;
    }

    return config;
  });
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    var wait = retryDelay;
    var retryErrorType = null;

    if (!defaultOptions.retryOnError) {
      return Promise.reject(error);
    }

    var response = error.response;

    if (!response) {
      retryErrorType = "Server connection";
      networkError++;

      if (networkError > retryLimit) {
        return Promise.reject(error);
      }
    } else {
      networkError = 0;
    }

    if (response && response.status === 429) {
      retryErrorType = 'Rate Limit';
      wait = retryDelay;
    }

    if (retryErrorType && error.config !== undefined) {
      var config = error.config;
      defaultOptions.logHandler('warning', "".concat(retryErrorType, " error occurred. Waiting for ").concat(wait, " ms before retrying..."));

      if (axios !== undefined && axios.defaults !== undefined) {
        if (axios.defaults.agent === config.agent) {
          delete config.agent;
        }

        if (axios.defaults.httpAgent === config.httpAgent) {
          delete config.httpAgent;
        }

        if (axios.defaults.httpsAgent === config.httpsAgent) {
          delete config.httpsAgent;
        }
      }

      config.transformRequest = [function (data) {
        return data;
      }];
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(axios(config));
        }, wait);
      });
    }

    return Promise.reject(error);
  });
}