"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

exports["default"] = Query;

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _contentstackError = require("../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _contentstackCollection = require("../contentstackCollection");

var _contentstackCollection2 = (0, _interopRequireDefault2["default"])(_contentstackCollection);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Query(http, urlPath, param) {
  var stackHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var wrapperCollection = arguments.length > 4 ? arguments[4] : undefined;
  var headers = {};

  if (stackHeaders) {
    headers.headers = stackHeaders;
  }

  var contentTypeUid = null;

  if (param) {
    if (param.content_type_uid) {
      contentTypeUid = param.content_type_uid;
      delete param.content_type_uid;
    }

    headers.params = _objectSpread({}, (0, _cloneDeep2["default"])(param));
  }
  /**
   * @description This method will fetch content of query on specified module.
   * @returns {ContentstackCollection} Result collection of content of specified module.
   * @example All Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().find()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query( { query: { name: 'Stack name' } }).find()
   * .then((collection) => console.log(collection))
   *
   */


  var find = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee() {
      var response;
      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return http.get(urlPath, headers);

            case 3:
              response = _context.sent;

              if (!response.data) {
                _context.next = 9;
                break;
              }

              if (contentTypeUid) {
                response.data.content_type_uid = contentTypeUid;
              }

              return _context.abrupt("return", new _contentstackCollection2["default"](response, http, stackHeaders, wrapperCollection));

            case 9:
              throw (0, _contentstackError2["default"])(response);

            case 10:
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              throw (0, _contentstackError2["default"])(_context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 12]]);
    }));

    return function find() {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * @description This method will fetch count of content for query on specified module.
   * @returns {Object} Result is Object of content of specified module.
   * @example All Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().count()
   * .then((response) => console.log(response))
   *
   * @example Query on Asset
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).query({ query: { title: 'Stack name' } }).count()
   * .then((response) => console.log(response))
   *
   */


  var count = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2() {
      var response;
      return _regenerator2["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              headers.params = _objectSpread(_objectSpread({}, headers.params), {}, {
                count: true
              });
              _context2.prev = 1;
              _context2.next = 4;
              return http.get(urlPath, headers);

            case 4:
              response = _context2.sent;

              if (!response.data) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", response.data);

            case 9:
              throw (0, _contentstackError2["default"])(response);

            case 10:
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](1);
              throw (0, _contentstackError2["default"])(_context2.t0);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 12]]);
    }));

    return function count() {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * @description This method will fetch content of query on specified module.
   * @returns {ContentstackCollection} Result content of specified module.
   * @example Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().findOne()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query({ query: { title: 'Stack name' } }).findOne()
   * .then((collection) => console.log(collection))
   *
   */


  var findOne = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3() {
      var limitHeader, response;
      return _regenerator2["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              limitHeader = headers;
              limitHeader.params.limit = 1;
              _context3.prev = 2;
              _context3.next = 5;
              return http.get(urlPath, limitHeader);

            case 5:
              response = _context3.sent;

              if (!response.data) {
                _context3.next = 11;
                break;
              }

              if (contentTypeUid) {
                response.data.content_type_uid = contentTypeUid;
              }

              return _context3.abrupt("return", new _contentstackCollection2["default"](response, http, stackHeaders, wrapperCollection));

            case 11:
              throw (0, _contentstackError2["default"])(response);

            case 12:
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](2);
              throw (0, _contentstackError2["default"])(_context3.t0);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 14]]);
    }));

    return function findOne() {
      return _ref3.apply(this, arguments);
    };
  }();

  return {
    count: count,
    find: find,
    findOne: findOne
  };
}

module.exports = exports.default;