import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

export default function contentstckRetry(axios, defaultOptions) {
  var retryLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var retryDelay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 300;
  var networkError = 0;
  axios.interceptors.request.use(function (config) {
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
    var response = error.response;

    if (!response) {
      if (error.code === 'ECONNABORTED') {
        error.response = _objectSpread(_objectSpread({}, error.response), {}, {
          status: 408,
          statusText: "timeout of ".concat(defaultOptions.timeout, "ms exceeded")
        });
      } else {
        return Promise.reject(error);
      }
    }

    if (!defaultOptions.retryOnError) {
      return Promise.reject(error);
    }

    if (defaultOptions.retryCondition && defaultOptions.retryCondition(error)) {
      retryErrorType = "Error with status: ".concat(error.response.status);
      networkError++;

      if (networkError > retryLimit) {
        networkError = 0;
        return Promise.reject(error);
      }

      if (defaultOptions.retryDelayOptions) {
        if (defaultOptions.retryDelayOptions.customBackoff) {
          wait = defaultOptions.retryDelayOptions.customBackoff(networkError, error);

          if (wait && wait <= 0) {
            networkError = 0;
            return Promise.reject(error);
          }
        } else if (defaultOptions.retryDelayOptions.base) {
          wait = defaultOptions.retryDelayOptions.base * networkError;
        }
      } else {
        wait = retryDelay;
      }
    } else {
      networkError = 0;
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