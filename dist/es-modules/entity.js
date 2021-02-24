import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import error from './core/contentstackError';
import cloneDeep from 'lodash/cloneDeep';
import Query from './query/index';
export var publish = function publish(http, type) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
      var publishDetails, _ref$locale, locale, _ref$version, version, _ref$scheduledAt, scheduledAt, url, headers, httpBody;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              publishDetails = _ref.publishDetails, _ref$locale = _ref.locale, locale = _ref$locale === void 0 ? null : _ref$locale, _ref$version = _ref.version, version = _ref$version === void 0 ? null : _ref$version, _ref$scheduledAt = _ref.scheduledAt, scheduledAt = _ref$scheduledAt === void 0 ? null : _ref$scheduledAt;
              url = this.urlPath + '/publish';
              headers = {
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              } || {};
              httpBody = {};
              httpBody[type] = cloneDeep(publishDetails);
              return _context.abrupt("return", publishUnpublish(http, url, httpBody, headers, locale, version, scheduledAt));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
};
export var unpublish = function unpublish(http, type) {
  return /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref3) {
      var publishDetails, _ref3$locale, locale, _ref3$version, version, _ref3$scheduledAt, scheduledAt, url, headers, httpBody;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              publishDetails = _ref3.publishDetails, _ref3$locale = _ref3.locale, locale = _ref3$locale === void 0 ? null : _ref3$locale, _ref3$version = _ref3.version, version = _ref3$version === void 0 ? null : _ref3$version, _ref3$scheduledAt = _ref3.scheduledAt, scheduledAt = _ref3$scheduledAt === void 0 ? null : _ref3$scheduledAt;
              url = this.urlPath + '/unpublish';
              headers = {
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              } || {};
              httpBody = {};
              httpBody[type] = cloneDeep(publishDetails);
              return _context2.abrupt("return", publishUnpublish(http, url, httpBody, headers, locale, version, scheduledAt));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
};
export var publishUnpublish = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(http, url, httpBody, headers) {
    var locale,
        version,
        scheduledAt,
        response,
        _args3 = arguments;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            locale = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : null;
            version = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : null;
            scheduledAt = _args3.length > 6 && _args3[6] !== undefined ? _args3[6] : null;

            if (locale !== null) {
              httpBody.locale = locale;
            }

            if (version !== null) {
              httpBody.version = version;
            }

            if (scheduledAt !== null) {
              httpBody.scheduled_at = scheduledAt;
            }

            _context3.prev = 6;
            _context3.next = 9;
            return http.post(url, httpBody, headers);

          case 9:
            response = _context3.sent;

            if (!response.data) {
              _context3.next = 14;
              break;
            }

            return _context3.abrupt("return", response.data);

          case 14:
            throw error(response);

          case 15:
            _context3.next = 20;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](6);
            throw error(_context3.t0);

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 17]]);
  }));

  return function publishUnpublish(_x3, _x4, _x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();
export var upload = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(_ref6) {
    var http, urlPath, stackHeaders, formData, params, _ref6$method, method, headers;

    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            http = _ref6.http, urlPath = _ref6.urlPath, stackHeaders = _ref6.stackHeaders, formData = _ref6.formData, params = _ref6.params, _ref6$method = _ref6.method, method = _ref6$method === void 0 ? 'POST' : _ref6$method;
            headers = {
              headers: _objectSpread(_objectSpread(_objectSpread({}, params), formData.getHeaders()), cloneDeep(stackHeaders))
            } || {};

            if (!(method === 'POST')) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", http.post(urlPath, formData, headers));

          case 6:
            return _context4.abrupt("return", http.put(urlPath, formData, headers));

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function upload(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
export var create = function create(_ref8) {
  var http = _ref8.http,
      params = _ref8.params;
  return /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(data, param) {
      var headers, response;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              headers = {
                headers: _objectSpread(_objectSpread({}, cloneDeep(params)), cloneDeep(this.stackHeaders)),
                params: _objectSpread({}, cloneDeep(param))
              } || {};
              _context5.prev = 1;
              _context5.next = 4;
              return http.post(this.urlPath, data, headers);

            case 4:
              response = _context5.sent;

              if (!response.data) {
                _context5.next = 9;
                break;
              }

              return _context5.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders)));

            case 9:
              throw error(response);

            case 10:
              _context5.next = 15;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](1);
              throw error(_context5.t0);

            case 15:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[1, 12]]);
    }));

    return function (_x8, _x9) {
      return _ref9.apply(this, arguments);
    };
  }();
};
export var exportObject = function exportObject(_ref10) {
  var http = _ref10.http;
  return /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(param) {
      var headers, response;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              headers = {
                params: _objectSpread({}, cloneDeep(param)),
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              } || {};
              _context6.prev = 1;
              _context6.next = 4;
              return http.get(this.urlPath, headers);

            case 4:
              response = _context6.sent;

              if (!response.data) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders)));

            case 9:
              throw error(response);

            case 10:
              _context6.next = 15;
              break;

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](1);
              throw error(_context6.t0);

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[1, 12]]);
    }));

    return function (_x10) {
      return _ref11.apply(this, arguments);
    };
  }();
};
export var query = function query(_ref12) {
  var http = _ref12.http,
      wrapperCollection = _ref12.wrapperCollection;
  return function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this.organization_uid) {
      params.query['org_uid'] = this.organization_uid;
    }

    return Query(http, this.urlPath, params, this.stackHeaders, wrapperCollection);
  };
};
export var update = function update(http, type) {
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
    var param,
        updateData,
        json,
        response,
        _args7 = arguments;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            param = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
            updateData = {};
            json = cloneDeep(this);
            delete json.stackHeaders;
            delete json.urlPath;
            delete json.uid;
            delete json.org_uid;
            delete json.api_key;
            delete json.created_at;
            delete json.created_by;
            delete json.deleted_at;
            delete json.updated_at;
            delete json.updated_by;
            delete json.updated_at;
            updateData[type] = json;
            _context7.prev = 15;
            _context7.next = 18;
            return http.put(this.urlPath, updateData, {
              headers: _objectSpread({}, cloneDeep(this.stackHeaders)),
              params: _objectSpread({}, cloneDeep(param))
            });

          case 18:
            response = _context7.sent;

            if (!response.data) {
              _context7.next = 23;
              break;
            }

            return _context7.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders, this.contentType_uid)));

          case 23:
            throw error(response);

          case 24:
            _context7.next = 29;
            break;

          case 26:
            _context7.prev = 26;
            _context7.t0 = _context7["catch"](15);
            throw error(_context7.t0);

          case 29:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[15, 26]]);
  }));
};
export var deleteEntity = function deleteEntity(http) {
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
    var param,
        headers,
        response,
        _args8 = arguments;
    return _regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            param = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            _context8.prev = 1;
            headers = {
              headers: _objectSpread({}, cloneDeep(this.stackHeaders)),
              params: _objectSpread({}, cloneDeep(param))
            } || {};
            _context8.next = 5;
            return http["delete"](this.urlPath, headers);

          case 5:
            response = _context8.sent;

            if (!response.data) {
              _context8.next = 10;
              break;
            }

            return _context8.abrupt("return", response.data);

          case 10:
            throw error(response);

          case 11:
            _context8.next = 16;
            break;

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](1);
            throw error(_context8.t0);

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this, [[1, 13]]);
  }));
};
export var fetch = function fetch(http, type) {
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
    var param,
        headers,
        response,
        _args9 = arguments;
    return _regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            param = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
            _context9.prev = 1;
            headers = {
              headers: _objectSpread({}, cloneDeep(this.stackHeaders)),
              params: _objectSpread({}, cloneDeep(param))
            } || {};
            _context9.next = 5;
            return http.get(this.urlPath, headers);

          case 5:
            response = _context9.sent;

            if (!response.data) {
              _context9.next = 11;
              break;
            }

            if (type === 'entry') {
              response.data[type]['content_type'] = response.data['content_type'];
              response.data[type]['schema'] = response.data['schema'];
            }

            return _context9.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders)));

          case 11:
            throw error(response);

          case 12:
            _context9.next = 17;
            break;

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](1);
            throw error(_context9.t0);

          case 17:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this, [[1, 14]]);
  }));
};
export function parseData(response, stackHeaders, contentTypeUID) {
  var data = response.data || {};

  if (stackHeaders) {
    data.stackHeaders = stackHeaders;
  }

  if (contentTypeUID) {
    data.content_type = contentTypeUID;
  }

  return data;
}