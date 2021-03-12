"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

exports.ConcurrencyQueue = ConcurrencyQueue;

var _axios = require("axios");

var _axios2 = (0, _interopRequireDefault2["default"])(_axios);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultConfig = {
  maxRequests: 5,
  retryLimit: 5,
  retryDelay: 300
};

function ConcurrencyQueue(_ref) {
  var _this = this;

  var axios = _ref.axios,
      config = _ref.config;

  if (!axios) {
    throw Error('Axios instance is not present');
  }

  if (config) {
    if (config.maxRequests && config.maxRequests <= 0) {
      throw Error('Concurrency Manager Error: minimum concurrent requests is 1');
    } else if (config.retryLimit && config.retryLimit <= 0) {
      throw Error('Retry Policy Error: minimum retry limit is 1');
    } else if (config.retryDelay && config.retryDelay < 300) {
      throw Error('Retry Policy Error: minimum retry delay for requests is 300');
    }
  }

  this.config = Object.assign({}, defaultConfig, config);
  this.queue = [];
  this.running = [];
  this.paused = false; // Initial shift will check running request,
  // and adds request to running queue if max requests are not running

  this.initialShift = function () {
    if (_this.running.length < _this.config.maxRequests && !_this.paused) {
      shift();
    }
  }; // INTERNAL: Shift the queued item to running queue


  var shift = function shift() {
    if (_this.queue.length && !_this.paused) {
      var queueItem = _this.queue.shift();

      queueItem.resolve(queueItem.request);

      _this.running.push(queueItem);
    }
  }; // Append the request at start of queue


  this.unshift = function (requestPromise) {
    _this.queue.unshift(requestPromise);
  };

  this.push = function (requestPromise) {
    _this.queue.push(requestPromise);

    _this.initialShift();
  };

  this.clear = function () {
    var requests = _this.queue.splice(0, _this.queue.length);

    requests.forEach(function (element) {
      element.request.source.cancel();
    });
  }; // Detach the interceptors


  this.detach = function () {
    axios.interceptors.request.eject(_this.interceptors.request);
    axios.interceptors.response.eject(_this.interceptors.response);
    _this.interceptors = {
      request: null,
      response: null
    };
  }; // Request interseptor to queue the request


  var requestHandler = function requestHandler(request) {
    request.retryCount = request.retryCount || 0;

    if (request.headers.authorization && request.headers.authorization !== undefined) {
      delete request.headers.authtoken;
    }

    if (request.cancelToken === undefined) {
      var source = _axios2["default"].CancelToken.source();

      request.cancelToken = source.token;
      request.source = source;
    }

    if (_this.paused && request.retryCount > 0) {
      return new Promise(function (resolve) {
        _this.unshift({
          request: request,
          resolve: resolve
        });
      });
    } else if (request.retryCount > 0) {
      return request;
    }

    return new Promise(function (resolve) {
      _this.push({
        request: request,
        resolve: resolve
      });
    });
  };

  var delay = function delay(time) {
    if (!_this.paused) {
      _this.paused = true; // Check for current running request.
      // Wait for running queue to complete.
      // Wait and prosed the Queued request.

      if (_this.running.length > 0) {
        setTimeout(function () {
          delay(time);
        }, time);
      }

      return new Promise(function (resolve) {
        return setTimeout(function () {
          _this.paused = false;

          for (var i = 0; i < _this.config.maxRequests; i++) {
            _this.initialShift();
          }
        }, time);
      });
    }
  }; // Response interceptor used for


  var responseHandler = function responseHandler(response) {
    _this.running.shift();

    shift();
    return response;
  };

  var responseErrorHandler = function responseErrorHandler(error) {
    var networkError = error.config.retryCount;
    var retryErrorType = null;

    if (!_this.config.retryOnError || networkError > _this.config.retryLimit) {
      return Promise.reject(responseHandler(error));
    } // Error handling


    var wait = _this.config.retryDelay;
    var response = error.response;

    if (!response) {
      if (error.code === 'ECONNABORTED') {
        error.response = _objectSpread(_objectSpread({}, error.response), {}, {
          status: 408,
          statusText: "timeout of ".concat(_this.config.timeout, "ms exceeded")
        });
      } else {
        return Promise.reject(responseHandler(error));
      }
    } else if (response.status === 429) {
      retryErrorType = "Error with status: ".concat(response.status);
      networkError++;

      if (networkError > _this.config.retryLimit) {
        return Promise.reject(responseHandler(error));
      }

      _this.running.shift();

      wait = 1000; // Cooldown the running requests

      delay(wait);
      error.config.retryCount = networkError;
      return axios(updateRequestConfig(error, retryErrorType, wait));
    } else if (_this.config.retryCondition && _this.config.retryCondition(error)) {
      retryErrorType = "Error with status: ".concat(response.status);
      networkError++;

      if (networkError > _this.config.retryLimit) {
        return Promise.reject(responseHandler(error));
      }

      if (_this.config.retryDelayOptions) {
        if (_this.config.retryDelayOptions.customBackoff) {
          wait = _this.config.retryDelayOptions.customBackoff(networkError, error);

          if (wait && wait <= 0) {
            return Promise.reject(responseHandler(error));
          }
        } else if (_this.config.retryDelayOptions.base) {
          wait = _this.config.retryDelayOptions.base * networkError;
        }
      } else {
        wait = _this.config.retryDelay;
      }

      error.config.retryCount = networkError;
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(axios(updateRequestConfig(error, retryErrorType, wait)));
        }, wait);
      });
    }

    return Promise.reject(responseHandler(error));
  };

  this.interceptors = {
    request: null,
    response: null
  };

  var updateRequestConfig = function updateRequestConfig(error, retryErrorType, wait) {
    var requestConfig = error.config;

    _this.config.logHandler('warning', "".concat(retryErrorType, " error occurred. Waiting for ").concat(wait, " ms before retrying..."));

    if (axios !== undefined && axios.defaults !== undefined) {
      if (axios.defaults.agent === requestConfig.agent) {
        delete requestConfig.agent;
      }

      if (axios.defaults.httpAgent === requestConfig.httpAgent) {
        delete requestConfig.httpAgent;
      }

      if (axios.defaults.httpsAgent === requestConfig.httpsAgent) {
        delete requestConfig.httpsAgent;
      }
    }

    requestConfig.transformRequest = [function (data) {
      return data;
    }];
    return requestConfig;
  }; // Adds interseptors in axios to queue request


  this.interceptors.request = axios.interceptors.request.use(requestHandler);
  this.interceptors.response = axios.interceptors.response.use(responseHandler, responseErrorHandler);
}