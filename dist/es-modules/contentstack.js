import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * The Content Management API (CMA) is used to manage the content of your Contentstack account. This includes creating, updating, deleting, and fetching content of your account.
 * @namespace Contentstack
 */
import httpClient from './core/contentstackHTTPClient.js';
import clonedeep from 'lodash/cloneDeep';
import getUserAgent from './core/Util.js';
import contentstackClient from './contentstackClient.js';
import packages from '../package.json';
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
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({
 *
 * })
 */

export function client(axios, params) {
  var defaultParameter = {
    defaultHostName: 'api.contentstack.io'
  };
  var sdkAgent = "".concat(packages.name, "-javascript/").concat(packages.version);
  var userAgentHeader = getUserAgent(sdkAgent, params.application, params.integration, params.feature);
  var requiredHeaders = {
    'X-User-Agent': sdkAgent,
    'User-Agent': userAgentHeader
  };

  if (params.authtoken) {
    requiredHeaders.authtoken = params.authtoken;
  }

  params = _objectSpread(_objectSpread({}, defaultParameter), clonedeep(params));
  params.headers = _objectSpread(_objectSpread({}, params.headers), requiredHeaders);
  var http = httpClient(axios, params);
  var api = contentstackClient({
    http: http
  });
  return api;
}