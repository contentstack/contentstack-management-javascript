"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

exports.client = client;

var _contentstackHTTPClient = require("./core/contentstackHTTPClient.js");

var _contentstackHTTPClient2 = (0, _interopRequireDefault2["default"])(_contentstackHTTPClient);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _Util = require("./core/Util.js");

var _Util2 = (0, _interopRequireDefault2["default"])(_Util);

var _contentstackClient = require("./contentstackClient.js");

var _contentstackClient2 = (0, _interopRequireDefault2["default"])(_contentstackClient);

var _package = require("../package.json");

var _package2 = (0, _interopRequireDefault2["default"])(_package);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Create client instance
 * @name client
 * @memberof Contentstack
 * @param {Object} axios - Axios Object
 * @param {object} params - Client initialization parameters
 * @prop {string} params.host - API host (default: api.contentstack.com)
 * @prop {object} params.headers - Optional additional headers
 * @prop {number} params.timeout - Optional number of milliseconds before the request times out. Default is 30000
 * @prop {number} params.retryLimit - Optional number of retries before failure. Default is 5
 * @prop {number} params.maxContentLength - Optional maximum content length in bytes (default: 1073741824 i.e. 1GB)
 * @prop {string} params.application - Application name and version e.g myApp/version
 * @prop {string} params.integration - Integration name and version e.g react/version
 * @returns Contentstack.Client
 * @example
 * import * as contentstack from 'contentstack'
 * const client = contentstack.client({
 *
 * })
 */
function client(axios, params) {
  var defaultParameter = {
    defaultHostName: 'api.contentstack.io'
  };
  var sdkAgent = "".concat(_package2["default"].name, "-javascript/").concat(_package2["default"].version);
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
  var http = (0, _contentstackHTTPClient2["default"])(axios, params);
  var api = (0, _contentstackClient2["default"])({
    http: http
  });
  return api;
}