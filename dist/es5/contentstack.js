"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

exports.client = client;

var _package = require("../package.json");

var _package2 = (0, _interopRequireDefault2["default"])(_package);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _Util = require("./core/Util.js");

var _Util2 = (0, _interopRequireDefault2["default"])(_Util);

var _contentstackClient = require("./contentstackClient.js");

var _contentstackClient2 = (0, _interopRequireDefault2["default"])(_contentstackClient);

var _contentstackHTTPClient = require("./core/contentstackHTTPClient.js");

var _contentstackHTTPClient2 = (0, _interopRequireDefault2["default"])(_contentstackHTTPClient);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Create client instance
 * @name client
 * @memberof Contentstack
 *
 * @example
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client()
 *
 * @param {object} params - Client initialization parameters
 * @param {Object=} param.proxy -
 * @prop {string=} params.endpoint - API endpoint that a service will talk to
 * @example //Set the `endpoint` to 'https://api.contentstack.io:{port}/{version}'
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ endpoint: 'https://api.contentstack.io:{port}/{version}' })
 *
 * @prop {string=} params.host - API host (default: api.contentstack.io)
 * @example //Set the `host` to 'api.contentstack.io'
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ host: 'api.contentstack.io' })
 *
 * @prop {object=} params.headers - Optional additional headers
 * @example //Set the `headers` to { 'headerkey': 'value'}
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ headers: { 'headerkey': 'value'} })
 *
 * @prop {number=} params.timeout - Optional number of milliseconds before the request times out. Default is 30000ms
 * @example //Set the `timeout` to 50000ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ timeout: 50000 })
 *
 * @prop {number=} params.maxRequests - Optional maximum number of requests SDK should send concurrently. Default is 10 request.
 * @example //Set the `maxRequests` to 50000ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxRequests: 5 })
 * 
 * @prop {boolean=} params.retryOnError - Optional boolean for retry on failuer. Default is true
 * @example //Set the `retryOnError` to false
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryOnError: false })
 *
 * @prop {number=} params.retryLimit - Optional number of retries before failure. Default is 5
 * @example //Set the `retryLimit` to 2
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryLimit: 2 })
 *
 * @prop {number=} params.retryDelay - The number of miliseconds to use for operation retries. Default is 300ms
 * @example //Set the `retryDelay` to 500ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryDelay: 500 })
 *
 * @prop {Function=} params.retryCondition - A function to determine if the error can be retried. Default retry is on status 429.
 * @example //Set the `retryCondition` on error status 429
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryCondition: (error) => {
 *      if (error.response && error.response.status === 429) {
 *        return true
 *      }
 *      return false
 *    }
 *  })
 *
 * @prop {number=} params.retryDelayOptions.base - The base number of milliseconds to use in the exponential backoff for operation retries.
 * @example Set  base retry delay for all services to 300 ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({retryDelayOptions: {base: 300}})
 *
 * @prop {Function=} params.retryDelayOptions.customBackoff - A custom function that accepts a retry count and error and returns the amount of time to delay in milliseconds. (if you want not to retry for specific condition return -1)
 * @example Set a custom backoff function to provide delay of 500 ms on retryCount < 3 and -1 for retryCount >= 3values on retries
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({retryDelayOptions: {customBackoff: function(retryCount, err) {
 *        if (retryCount < 3) {
 *          return 500
 *        } else {
 *          return -1 //returning -1 will hold next retry for request
 *        }
 *     }}}
 * )
 *
 * @prop {number=} params.maxContentLength - Optional maximum content length in bytes (default: 1073741824 i.e. 1 GB)
 * @example //Set the `maxContentLength` to 1024 ** 3
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxContentLength: 1024 ** 3 })
 *
 * @prop {number=} params.maxBodyLength - Optional maximum body length in bytes (default: 10 MB)
 * @example //Set the `maxContentLength` to 1024 ** 2 * 10 // 10 MB
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxBodyLength: 1024 ** 2 * 10 })
 *
 * @prop {function=} params.logHandler - A log handler function to process given log messages & errors.
 * @example //Set the `logHandler`
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ logHandler: (level, data) => {
      if (level === 'error' && data) {
        const title = [data.name, data.message].filter((a) => a).join(' - ')
        console.error(`[error] ${title}`)
        return
      }
      console.log(`[${level}] ${data}`)
    } })
 *
 * @prop {string=} params.application - Application name and version e.g myApp/version
 * @prop {string=} params.integration - Integration name and version e.g react/version
 * @returns Contentstack.Client
 */
function client() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultParameter = {
    defaultHostName: 'api.contentstack.io'
  };
  var sdkAgent = "contentstack-management-javascript/".concat(_package2["default"].version);
  var userAgentHeader = (0, _Util2["default"])(sdkAgent, params.application, params.integration, params.feature);
  var requiredHeaders = {
    'X-User-Agent': sdkAgent,
    'User-Agent': userAgentHeader
  };

  if (params.authtoken) {
    requiredHeaders.authtoken = params.authtoken;
  }

  params = _objectSpread(_objectSpread({}, defaultParameter), (0, _cloneDeep2["default"])(params));
  params.headers = _objectSpread(_objectSpread({}, params.headers), requiredHeaders);
  var http = (0, _contentstackHTTPClient2["default"])(params);
  var api = (0, _contentstackClient2["default"])({
    http: http
  });
  return api;
}