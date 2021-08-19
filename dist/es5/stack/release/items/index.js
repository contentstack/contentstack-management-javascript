"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.ReleaseItem = ReleaseItem;
exports.ReleaseItemCollection = ReleaseItemCollection;

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _contentstackError = require("../../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _contentstackCollection = require("../../../contentstackCollection");

var _contentstackCollection2 = (0, _interopRequireDefault2["default"])(_contentstackCollection);

var _ = require("..");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * A ReleaseItem is a set of entries and assets that needs to be deployed (published or unpublished) all at once to a particular environment.
 * @namespace ReleaseItem
 */
function ReleaseItem(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;

  if (data.item) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.item));
  }

  if (data.releaseUid) {
    this.urlPath = "releases/".concat(data.releaseUid, "/items");
    /**
     * @description The Delete method request deletes one or more items (entries and/or assets) from a specific Release.
     * @memberof ReleaseItem
     * @func delete
     * @param {Object} param.items Add multiple items to a Release
     * @param {Object} param.items Add multiple items to a Release
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * // To delete all the items from release
     * client.stack({ api_key: 'api_key'}).release('release_uid').delete()
     * .then((response) => console.log(response.notice))
     *      
     * @example
     * // Delete specific items from delete
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client() 
     * 
     * const items =  [
     *     {
     *        uid: "entry_or_asset_uid1",
     *        version: 1,
     *        locale: "en-us",
     *        content_type_uid: "demo1",
     *        action: "publish"
     *     },
     *     {
     *        uid: "entry_or_asset_uid2",
     *        version: 4,
     *        locale: "fr-fr",
     *        content_type_uid: "demo2",
     *        action: "publish"
     *      }
     * ]
     * client.stack({ api_key: 'api_key'}).release('release_uid').delete({items})
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(items) {
        var param, headers, response;
        return _regenerator2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                param = {};

                if (items === undefined) {
                  param = {
                    all: true
                  };
                }

                _context.prev = 2;
                headers = {
                  headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders)),
                  data: _objectSpread({}, (0, _cloneDeep2["default"])(items)),
                  params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
                } || {};
                _context.next = 6;
                return http["delete"](_this.urlPath, headers);

              case 6:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", new _.Release(http, _objectSpread(_objectSpread({}, response.data), {}, {
                  stackHeaders: data.stackHeaders
                })));

              case 11:
                throw (0, _contentstackError2["default"])(response);

              case 12:
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                throw (0, _contentstackError2["default"])(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 14]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
    /**
     * @description The Create method allows you to add an one or more items items (entry or asset) to a Release.
     * @memberof ReleaseItem
     * @func create
     * @param {Object} param.item Add a single item to a Release
     * @param {Object} param.items Add multiple items to a Release
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const item = {
     *            version: 1,
     *            uid: "entry_or_asset_uid",
     *            content_type_uid: "your_content_type_uid",
     *            action: "publish",
     *            locale: "en-us"
     * }
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().create({ item })
     * .then((release) => console.log(release))
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const items =  [
     *     {
     *        uid: "entry_or_asset_uid1",
     *        version: 1,
     *        locale: "en-us",
     *        content_type_uid: "demo1",
     *        action: "publish"
     *     },
     *     {
     *        uid: "entry_or_asset_uid2",
     *        version: 4,
     *        locale: "fr-fr",
     *        content_type_uid: "demo2",
     *        action: "publish"
     *      }
     * ]
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().create({ items })
     * .then((release) => console.log(release))
     */


    this.create = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(param) {
        var headers, response;
        return _regenerator2["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                headers = {
                  headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
                } || {};
                _context2.prev = 1;
                _context2.next = 4;
                return http.post(param.item ? "releases/".concat(data.releaseUid, "/item") : _this.urlPath, param, headers);

              case 4:
                response = _context2.sent;

                if (!response.data) {
                  _context2.next = 10;
                  break;
                }

                if (!response.data) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", new _.Release(http, _objectSpread(_objectSpread({}, response.data), {}, {
                  stackHeaders: data.stackHeaders
                })));

              case 8:
                _context2.next = 11;
                break;

              case 10:
                throw (0, _contentstackError2["default"])(response);

              case 11:
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](1);
                throw (0, _contentstackError2["default"])(_context2.t0);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 13]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();
    /**
     * @description The Get all items in a Release request retrieves a list of all items (entries and assets) that are part of a specific Release.
     * @memberof ReleaseItem
     * @func findAll
     * @returns {Promise<ContentstackCollection.ContentstackCollection>} Promise for ContentType instance
     * @param {Boolean} param.include_count ‘include_count’ parameter includes the count of total number of items in Release, along with the details of each items.
     * @param {Int} param.limit The ‘limit’ parameter will return a specific number of release items in the output.
     * @param {Int} param.skip The ‘skip’ parameter will skip a specific number of release items in the response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().fetchAll()
     * .then((items) => console.log(items))
     */


    this.findAll = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3() {
      var param,
          headers,
          response,
          _args3 = arguments;
      return _regenerator2["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              param = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              _context3.prev = 1;
              headers = {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders)),
                params: _objectSpread({}, (0, _cloneDeep2["default"])(param))
              } || {};
              _context3.next = 5;
              return http.get(_this.urlPath, headers);

            case 5:
              response = _context3.sent;

              if (!response.data) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt("return", new _contentstackCollection2["default"](response, http, _this.stackHeaders, ReleaseItemCollection));

            case 10:
              throw (0, _contentstackError2["default"])(response);

            case 11:
              _context3.next = 16;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](1);
              (0, _contentstackError2["default"])(_context3.t0);

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 13]]);
    }));
  }

  return this;
}

function ReleaseItemCollection(http, data, releaseUid) {
  var obj = (0, _cloneDeep2["default"])(data.items) || [];
  var contentTypeCollection = obj.map(function (userdata) {
    return new ReleaseItem(http, {
      releaseUid: releaseUid,
      item: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return contentTypeCollection;
}