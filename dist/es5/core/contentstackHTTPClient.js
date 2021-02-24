"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("@babel/runtime/helpers/slicedToArray");

var _slicedToArray3 = (0, _interopRequireDefault2["default"])(_slicedToArray2);

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

exports["default"] = contentstackHttpClient;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _qs = require("qs");

var _qs2 = (0, _interopRequireDefault2["default"])(_qs);

var _axios = require("axios");

var _axios2 = (0, _interopRequireDefault2["default"])(_axios);

var _Util = require("./Util");

var _concurrencyQueue = require("./concurrency-queue");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function contentstackHttpClient(options) {
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
    retryCondition: function retryCondition(error) {
      if (error.response && error.response.status === 429) {
        return true;
      }

      return false;
    },
    headers: {},
    basePath: '',
    proxy: false,
    httpAgent: false,
    httpsAgent: false,
    adapter: false,
    timeout: 30000
  };

  var config = _objectSpread(_objectSpread({}, defaultConfig), (0, _cloneDeep2["default"])(options));

  if (config.apiKey) {
    config.headers['apiKey'] = config.apiKey;
  }

  if (config.accessToken) {
    config.headers['accessToken'] = config.accessToken;
  }

  var protocol = config.insecure ? 'http' : 'https';
  var hostname = config.defaultHostName;
  var port = config.port || 443;
  var version = config.version || 'v3';

  if ((0, _Util.isHost)(config.host)) {
    var parsed = config.host.split(':');

    if (parsed.length === 2) {
      var _parsed = (0, _slicedToArray3["default"])(parsed, 2);

      hostname = _parsed[0];
      port = _parsed[1];
    } else {
      hostname = parsed[0];
    }
  }

  if (config.basePath) {
    config.basePath = "/".concat(config.basePath.split('/').filter(Boolean).join('/'));
  }

  var baseURL = config.endpoint || "".concat(protocol, "://").concat(hostname, ":").concat(port).concat(config.basePath, "/").concat(version);

  var axiosOptions = _objectSpread(_objectSpread({
    // Axios
    baseURL: baseURL
  }, config), {}, {
    paramsSerializer: function paramsSerializer(params) {
      var query = params.query;
      delete params.query;

      var qs = _qs2["default"].stringify(params, {
        arrayFormat: 'brackets'
      });

      if (query) {
        qs = qs + "&query=".concat(encodeURI(JSON.stringify(query)));
      }

      return qs;
    }
  });

  var instance = _axios2["default"].create(axiosOptions);

  instance.httpClientParams = options;
  instance.concurrencyQueue = new _concurrencyQueue.ConcurrencyQueue({
    axios: instance,
    config: config
  });
  return instance;
}

module.exports = exports.default;