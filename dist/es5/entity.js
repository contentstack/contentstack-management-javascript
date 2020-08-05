"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = exports.deleteEntity = exports.update = exports.query = exports.exportObject = exports.create = exports.upload = exports.publishUnpublish = exports.unpublish = exports.publish = undefined;

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.parseData = parseData;

var _contentstackError = require("./core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _index = require("./query/index");

var _index2 = (0, _interopRequireDefault2["default"])(_index);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var publish = exports.publish = function publish(http, type) {
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(_ref) {
      var publishDetails, _ref$locale, locale, _ref$version, version, _ref$scheduledAt, scheduledAt, url, headers, httpBody;

      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              publishDetails = _ref.publishDetails, _ref$locale = _ref.locale, locale = _ref$locale === void 0 ? null : _ref$locale, _ref$version = _ref.version, version = _ref$version === void 0 ? null : _ref$version, _ref$scheduledAt = _ref.scheduledAt, scheduledAt = _ref$scheduledAt === void 0 ? null : _ref$scheduledAt;
              url = this.urlPath + '/publish';
              headers = {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders))
              } || {};
              httpBody = {};
              httpBody[type] = (0, _cloneDeep2["default"])(publishDetails);
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

var unpublish = exports.unpublish = function unpublish(http, type) {
  return /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(_ref3) {
      var publishDetails, _ref3$locale, locale, _ref3$version, version, _ref3$scheduledAt, scheduledAt, url, headers, httpBody;

      return _regenerator2["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              publishDetails = _ref3.publishDetails, _ref3$locale = _ref3.locale, locale = _ref3$locale === void 0 ? null : _ref3$locale, _ref3$version = _ref3.version, version = _ref3$version === void 0 ? null : _ref3$version, _ref3$scheduledAt = _ref3.scheduledAt, scheduledAt = _ref3$scheduledAt === void 0 ? null : _ref3$scheduledAt;
              url = this.urlPath + '/unpublish';
              headers = {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders))
              } || {};
              httpBody = {};
              httpBody[type] = (0, _cloneDeep2["default"])(publishDetails);
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

var publishUnpublish = /*#__PURE__*/exports.publishUnpublish = function () {
  var _ref5 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3(http, url, httpBody, headers) {
    var locale,
        version,
        scheduledAt,
        response,
        _args3 = arguments;
    return _regenerator2["default"].wrap(function _callee3$(_context3) {
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

            return _context3.abrupt("return", response.data.notice);

          case 14:
            throw (0, _contentstackError2["default"])(response);

          case 15:
            _context3.next = 20;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](6);
            throw (0, _contentstackError2["default"])(_context3.t0);

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

var upload = /*#__PURE__*/exports.upload = function () {
  var _ref7 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee4(_ref6) {
    var http, urlPath, stackHeaders, formData, params, _ref6$method, method, headers;

    return _regenerator2["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            http = _ref6.http, urlPath = _ref6.urlPath, stackHeaders = _ref6.stackHeaders, formData = _ref6.formData, params = _ref6.params, _ref6$method = _ref6.method, method = _ref6$method === void 0 ? 'POST' : _ref6$method;
            headers = {
              headers: _objectSpread(_objectSpread(_objectSpread({}, params), formData.getHeaders()), (0, _cloneDeep2["default"])(stackHeaders))
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

var create = exports.create = function create(_ref8) {
  var http = _ref8.http,
      params = _ref8.params;
  return /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee5(data, param) {
      var headers, response;
      return _regenerator2["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              headers = {
                headers: _objectSpread(_objectSpread({}, (0, _cloneDeep2["default"])(params)), (0, _cloneDeep2["default"])(this.stackHeaders)),
                params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
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
              throw (0, _contentstackError2["default"])(response);

            case 10:
              _context5.next = 15;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](1);
              throw (0, _contentstackError2["default"])(_context5.t0);

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

var exportObject = exports.exportObject = function exportObject(_ref10) {
  var http = _ref10.http;
  return /*#__PURE__*/function () {
    var _ref11 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee6(param) {
      var headers, response;
      return _regenerator2["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              headers = {
                params: _objectSpread({}, (0, _cloneDeep2["default"])(param)),
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders))
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
              throw (0, _contentstackError2["default"])(response);

            case 10:
              _context6.next = 15;
              break;

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](1);
              throw (0, _contentstackError2["default"])(_context6.t0);

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

var query = exports.query = function query(_ref12) {
  var http = _ref12.http,
      wrapperCollection = _ref12.wrapperCollection;
  return function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this.organization_uid) {
      params.query['org_uid'] = this.organization_uid;
    }

    return (0, _index2["default"])(http, this.urlPath, params, this.stackHeaders, wrapperCollection);
  };
};

var update = exports.update = function update(http, type) {
  return /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee7() {
    var param,
        updateData,
        response,
        _args7 = arguments;
    return _regenerator2["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            param = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
            updateData = {};
            updateData[type] = (0, _cloneDeep2["default"])(this);
            _context7.prev = 3;
            _context7.next = 6;
            return http.put(this.urlPath, updateData, {
              headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders)),
              params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
            });

          case 6:
            response = _context7.sent;

            if (!response.data) {
              _context7.next = 11;
              break;
            }

            return _context7.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders, this.contentType_uid)));

          case 11:
            throw (0, _contentstackError2["default"])(response);

          case 12:
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](3);
            throw (0, _contentstackError2["default"])(_context7.t0);

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[3, 14]]);
  }));
};

var deleteEntity = exports.deleteEntity = function deleteEntity(http) {
  return /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee8() {
    var param,
        headers,
        response,
        _args8 = arguments;
    return _regenerator2["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            param = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            _context8.prev = 1;
            headers = {
              headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders)),
              params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
            } || {};
            _context8.next = 5;
            return http["delete"](this.urlPath, headers);

          case 5:
            response = _context8.sent;

            if (!response.data) {
              _context8.next = 10;
              break;
            }

            return _context8.abrupt("return", response.data.notice);

          case 10:
            throw (0, _contentstackError2["default"])(response);

          case 11:
            _context8.next = 16;
            break;

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](1);
            throw (0, _contentstackError2["default"])(_context8.t0);

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this, [[1, 13]]);
  }));
};

var fetch = exports.fetch = function fetch(http, type) {
  return /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee9() {
    var param,
        headers,
        response,
        _args9 = arguments;
    return _regenerator2["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            param = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
            _context9.prev = 1;
            headers = {
              headers: _objectSpread({}, (0, _cloneDeep2["default"])(this.stackHeaders)),
              params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
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

            return _context9.abrupt("return", Object.assign(this, (0, _cloneDeep2["default"])(response.data[type])));

          case 11:
            throw (0, _contentstackError2["default"])(response);

          case 12:
            _context9.next = 17;
            break;

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](1);
            throw (0, _contentstackError2["default"])(_context9.t0);

          case 17:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this, [[1, 14]]);
  }));
};

function parseData(response, stackHeaders, contentTypeUID) {
  var data = response.data || {};

  if (stackHeaders) {
    data.stackHeaders = stackHeaders;
  }

  if (contentTypeUID) {
    data.content_type = contentTypeUID;
  }

  return data;
}