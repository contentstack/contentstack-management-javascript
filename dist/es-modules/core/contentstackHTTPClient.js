import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import clonedeep from 'lodash/cloneDeep';
import Qs from 'qs';
import axios from 'axios';
import { isHost } from './Util';
import { ConcurrencyQueue } from './concurrency-queue';
export default function contentstackHttpClient(options) {
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

  var config = _objectSpread(_objectSpread({}, defaultConfig), clonedeep(options));

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

  if (isHost(config.host)) {
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

  var baseURL = config.endpoint || "".concat(protocol, "://").concat(hostname, ":").concat(port).concat(config.basePath, "/").concat(version);

  var axiosOptions = _objectSpread(_objectSpread({
    // Axios
    baseURL: baseURL
  }, config), {}, {
    paramsSerializer: function paramsSerializer(params) {
      var query = params.query;
      delete params.query;
      var qs = Qs.stringify(params, {
        arrayFormat: 'brackets'
      });

      if (query) {
        qs = qs + "&query=".concat(encodeURI(JSON.stringify(query)));
      }

      params.query = query;
      return qs;
    }
  });

  var instance = axios.create(axiosOptions);
  instance.httpClientParams = options;
  instance.concurrencyQueue = new ConcurrencyQueue({
    axios: instance,
    config: config
  });
  return instance;
}