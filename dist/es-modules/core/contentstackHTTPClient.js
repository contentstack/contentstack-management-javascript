import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import clonedeep from 'lodash/cloneDeep';
import Qs from 'qs'; // import axiosRetry from 'axios-retry'

import contentstackRetry from './contentstack-retry';
var HOST_REGEX = /^(?!\w+:\/\/)([^\s:]+\.[^\s:]+)(?::(\d+))?(?!:)$/;
export default function contentstackHttpClient(axios, options) {
  var defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: function logHandler(level, data) {
      if (level === 'error' && data) {
        var title = [data.name, data.message].filter(function (a) {
          return a;
        }).join(' - ');
        console.error("[error] ".concat(title));
        return;
      }

      console.log("[".concat(level, "] ").concat(data));
    },
    headers: {},
    basePath: '',
    proxy: false,
    httpAgent: false,
    httpsAgent: false,
    adapter: false,
    timeout: 30000
  };

  var config = _objectSpread(_objectSpread({}, defaultConfig), clonedeep(options));

  if (config.apiKey) {
    config.headers['apiKey'] = config.apiKey;
  }

  if (config.accessToken) {
    config.headers['accessToken'] = config.accessToken;
  }

  var protocol = 'https';
  var hostname = config.defaultHostName;
  var port = 443;
  var version = 'v3';

  if (HOST_REGEX.test(config.host)) {
    var parsed = config.host.split(':');

    if (parsed.length === 2) {
      var _parsed = _slicedToArray(parsed, 2);

      hostname = _parsed[0];
      port = _parsed[1];
    } else {
      hostname = parsed[0];
    }
  }

  if (config.basePath) {
    config.basePath = "/".concat(config.basePath.split('/').filter(Boolean).join('/'));
  }

  var baseURL = "".concat(protocol, "://").concat(hostname, ":").concat(port).concat(config.basePath, "/").concat(version);
  var axiosOptions = {
    // Axios
    baseURL: baseURL,
    headers: config.headers,
    httpAgent: config.httpAgent,
    httpsAgent: config.httpsAgent,
    proxy: config.proxy,
    timeout: config.timeout,
    adapter: config.adapter,
    maxContentLength: config.maxContentLength,
    // Contentstack
    logHandler: config.logHandler,
    responseLogger: config.responseLogger,
    requestLogger: config.requestLogger,
    retryOnError: config.retryOnError,
    paramsSerializer: function paramsSerializer(params) {
      var query = params.query;
      delete params.query;
      var qs = Qs.stringify(params, {
        arrayFormat: 'brackets'
      });

      if (query) {
        qs = qs + "&query=".concat(encodeURI(JSON.stringify(query)));
      }

      return qs;
    }
  };
  var instance = axios.create(axiosOptions);
  instance.httpClientParams = options;
  contentstackRetry(instance, axiosOptions, config.retyLimit, config.retryDelay);
  return instance;
}