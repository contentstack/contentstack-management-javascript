import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import error from '../core/contentstackError';
import cloneDeep from 'lodash/cloneDeep';
import ContentstackCollection from '../contentstackCollection';
export default function Query(http, urlPath, param) {
  var stackHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var wrapperCollection = arguments.length > 4 ? arguments[4] : undefined;
  var headers = {};

  if (stackHeaders) {
    headers.headers = stackHeaders;
  }

  if (param) {
    headers.params = _objectSpread({}, cloneDeep(param));
  }
  /**
   * @description This method will fetch content of query on specified module.
   * @returns {ContentstackCollection} Result collection of content of specified module.
   * @example All Stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().find()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query( { query: { name: 'Stack name' } }).find()
   * .then((collection) => console.log(collection))
   *
   */


  var find = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var response;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return http.get(urlPath, headers);

            case 3:
              response = _context.sent;

              if (!response.data) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", new ContentstackCollection(response, http, stackHeaders, wrapperCollection));

            case 8:
              throw error(response);

            case 9:
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              throw error(_context.t0);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 11]]);
    }));

    return function find() {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * @description This method will fetch count of content for query on specified module.
   * @returns {Object} Result is Object of content of specified module.
   * @example All Stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().count()
   * .then((response) => console.log(response))
   *
   * @example Query on Asset
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').query({ query: { title: 'Stack name' } }).count()
   * .then((response) => console.log(response))
   *
   */


  var count = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var response;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
              throw error(response);

            case 10:
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](1);
              throw error(_context2.t0);

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
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().findOne()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query({ query: { title: 'Stack name' } }).findOne()
   * .then((collection) => console.log(collection))
   *
   */


  var findOne = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var limitHeader, response;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
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
                _context3.next = 10;
                break;
              }

              return _context3.abrupt("return", new ContentstackCollection(response, http, stackHeaders, wrapperCollection));

            case 10:
              throw error(response);

            case 11:
              _context3.next = 16;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](2);
              throw error(_context3.t0);

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 13]]);
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