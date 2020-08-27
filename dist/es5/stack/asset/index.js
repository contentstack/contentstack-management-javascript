"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.Asset = Asset;
exports.AssetCollection = AssetCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

var _folders = require("./folders");

var _contentstackError = require("../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _formData = require("form-data");

var _formData2 = (0, _interopRequireDefault2["default"])(_formData);

var _fs = require("fs");

/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */
function Asset(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/assets";

  if (data.asset) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.asset));
    this.urlPath = "assets/".concat(this.uid);
    /**
     * @description The Update Asset call lets you update the name and description of an existing Asset.
     * @memberof Asset
     * @func update
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').fetch()
     * .then((asset) => {
     *  asset.title = 'My New asset'
     *  asset.description = 'Asset description'
     *  return asset.update()
     * })
     * .then((asset) => console.log(asset))
     *
     */

    this.update = (0, _entity.update)(http, 'asset');
    /**
     * @description The Delete asset call will delete an existing asset from the stack.
     * @memberof Asset
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').fetch()
     * .then((asset) => console.log(asset))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'asset');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     * }
     *
     * client.stack('api_key').asset('uid').replace(asset)
     * .then((asset) => console.log(asset))
     *
     */

    this.replace = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(data, params) {
        var response;
        return _regenerator2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return (0, _entity.upload)({
                  http: http,
                  urlPath: this.urlPath,
                  stackHeaders: this.stackHeaders,
                  formData: createFormData(data),
                  params: params,
                  method: 'PUT'
                });

              case 3:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", new this.constructor(http, (0, _entity.parseData)(response, this.stackHeaders)));

              case 8:
                throw (0, _contentstackError2["default"])(response);

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                throw (0, _contentstackError2["default"])(_context.t0);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
    /**
     * @description The Publish an asset call is used to publish a specific version of an asset on the desired environment either immediately or at a later date/time.
     * @memberof Asset
     * @func publish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack('api_key').asset('uid').publish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((notice) => console.log(notice))
     *
     */


    this.publish = (0, _entity.publish)(http, 'asset');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func unpublish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack('api_key').asset('uid').unpublish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((notice) => console.log(notice))
     *
     */

    this.unpublish = (0, _entity.unpublish)(http, 'asset');
  } else {
    /**
    *  @description The Folder allows to fetch and create folders in assets.
    * @memberof Folder
    * @func create
    * @returns {Promise<Folder.Folder>} Promise for Entry instance
    *
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client({})
    */
    this.folder = function () {
      var data = {
        stackHeaders: _this.stackHeaders
      };
      return new _folders.Folder(http, data);
    };
    /**
     * @description The Create an asset call creates a new asset.
     * @memberof Asset
     * @func create
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     *  title: 'Title',
     *  description: 'Desc'
     * }
     *
     * client.stack('api_key').asset().create(asset)
     * .then((asset) => console.log(asset))
     */


    this.create = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(data, params) {
        var response;
        return _regenerator2["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return (0, _entity.upload)({
                  http: http,
                  urlPath: this.urlPath,
                  stackHeaders: this.stackHeaders,
                  formData: createFormData(data),
                  params: params
                });

              case 3:
                response = _context2.sent;

                if (!response.data) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", new this.constructor(http, (0, _entity.parseData)(response, this.stackHeaders)));

              case 8:
                throw (0, _contentstackError2["default"])(response);

              case 9:
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                throw (0, _contentstackError2["default"])(_context2.t0);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 11]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();
    /**
    * @description The Query on Asset will allow to fetch details of all or specific Asset.
    * @memberof Asset
    * @param {Object} params - URI parameters
    * @prop {Object} params.query - Queries that you can use to fetch filtered results.
    * @func query
    * @returns {Array<Asset>} Array of Asset.
    *
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client({})
    *
    * client.stack().asset().query({ query: { filename: 'Asset Name' } }).find()
    * .then((asset) => console.log(asset))
    */


    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: AssetCollection
    });
  }

  return this;
}

function AssetCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.assets);
  var assetCollection = obj.map(function (userdata) {
    return new Asset(http, {
      asset: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return assetCollection;
}

function createFormData(data) {
  var formData = new _formData2["default"]();

  if (typeof data['parent_uid'] === 'string') {
    formData.append('asset[parent_uid]', data['parent_uid']);
  }

  if (typeof data.description === 'string') {
    formData.append('asset[description]', data.description);
  }

  if (data.tags instanceof Array) {
    formData.append('asset[tags]', data.tags.join(','));
  } else if (typeof data.tags === 'string') {
    formData.append('asset[tags]', data.tags);
  }

  if (typeof data.title === 'string') {
    formData.append('asset[title]', data.title);
  }

  var uploadStream = (0, _fs.createReadStream)(data.upload);
  formData.append('asset[upload]', uploadStream);
  return formData;
}