"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Folder = Folder;
exports.FolderCollection = FolderCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../../entity");

/**
 * Folders refer to Asset Folders.
 * @namespace Folder
 */
function Folder(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (data.stackHeaders) {
    this.stackHeaders = data.stackHeaders;
  }

  this.urlPath = "/assets/folders";

  if (data.asset) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.asset));
    this.urlPath = "/assets/folders/".concat(this.uid);
    /**
     * @description The Update Folder call lets you update the name and description of an existing Folder.
     * @memberof Folder
     * @func update
     * @returns {Promise<Folder.Folder>} Promise for Folder instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').fetch()
     * .then((folder) => {
     *  folder.name = 'My New folder'
     *  return folder.update()
     * })
     * .then((folder) => console.log(folder))
     *
     */

    this.update = (0, _entity.update)(http, 'asset');
    /**
     * @description The Delete folder call will delete an existing folder from the stack.
     * @memberof Folder
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Folder
     * @func fetch
     * @returns {Promise<Folder.Folder>} Promise for Folder instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').fetch()
     * .then((folder) => console.log(folder))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'asset');
  } else {
    /**
     * @description The Create a folder into the assets.
     * @memberof Folder
     * @func create
     * @returns {Promise<Folder.Folder>} Promise for Folder instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const asset = {name: 'My New contentType'}
     * client.stack().asset().folders().create({ asset })
     * .then((folder) => console.log(folder))
     */
    this.create = (0, _entity.create)({
      http: http
    });
  }
}

function FolderCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.assets) || [];
  var assetCollection = obj.map(function (userdata) {
    return new Folder(http, {
      asset: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return assetCollection;
}