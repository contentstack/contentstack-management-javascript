import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import cloneDeep from 'lodash/cloneDeep';
import { update, deleteEntity, fetch, query, parseData, upload, publish, unpublish } from '../../entity';
import { Folder } from './folders';
import error from '../../core/contentstackError';
import FormData from 'form-data';
import { createReadStream } from 'fs';
/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */

export function Asset(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/assets";

  if (data.asset) {
    Object.assign(this, cloneDeep(data.asset));
    this.urlPath = "/assets/".concat(this.uid);
    /**
     * @description The Update Asset call lets you update the name and description of an existing Asset.
     * @memberof Asset
     * @func update
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').fetch()
     * .then((asset) => {
     *  asset.title = 'My New asset'
     *  asset.description = 'Asset description'
     *  return asset.update()
     * })
     * .then((asset) => console.log(asset))
     *
     */

    this.update = update(http, 'asset');
    /**
     * @description The Delete asset call will delete an existing asset from the stack.
     * @memberof Asset
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').fetch()
     * .then((asset) => console.log(asset))
     *
     */

    this.fetch = fetch(http, 'asset');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func replace
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').replace(asset)
     * .then((asset) => console.log(asset))
     *
     */

    this.replace = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(data, params) {
        var response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return upload({
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

                return _context.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders)));

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
     * const client = contentstack.client()
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
     * client.stack({ api_key: 'api_key'}).asset('uid').publish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */


    this.publish = publish(http, 'asset');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func unpublish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
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
     * client.stack({ api_key: 'api_key'}).asset('uid').unpublish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */

    this.unpublish = unpublish(http, 'asset');
  } else {
    /**
     *  @description The Folder allows to fetch and create folders in assets.
     * @memberof Asset
     * @func folder
     * @returns {Promise<Folder.Folder>} Promise for Entry instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const asset = {name: 'My New contentType'}
     * client.stack({ api_key: 'api_key'}).asset('uid').folder().create({ asset })
     * .then((folder) => console.log(folder))
    */
    this.folder = function () {
      var folderUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (folderUid) {
        data.asset = {
          uid: folderUid
        };
      }

      return new Folder(http, data);
    };
    /**
     * @description The Create an asset call creates a new asset.
     * @memberof Asset
     * @func create
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     *  title: 'Title',
     *  description: 'Desc'
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset().create(asset)
     * .then((asset) => console.log(asset))
     */


    this.create = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(data, params) {
        var response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return upload({
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

                return _context2.abrupt("return", new this.constructor(http, parseData(response, this.stackHeaders)));

              case 8:
                throw error(response);

              case 9:
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                throw error(_context2.t0);

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
    * const client = contentstack.client()
    *
    * client.stack().asset().query({ query: { filename: 'Asset Name' } }).find()
    * .then((asset) => console.log(asset))
    */


    this.query = query({
      http: http,
      wrapperCollection: AssetCollection
    });
  }

  return this;
}
export function AssetCollection(http, data) {
  var obj = cloneDeep(data.assets) || [];
  var assetCollection = obj.map(function (userdata) {
    return new Asset(http, {
      asset: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return assetCollection;
}

function createFormData(data) {
  var formData = new FormData();

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

  console.log(data.upload);
  var uploadStream = createReadStream(data.upload);
  formData.append('asset[upload]', uploadStream);
  return formData;
}