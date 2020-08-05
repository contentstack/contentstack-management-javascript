"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Folder = Folder;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../../entity");

/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */
function Folder(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/assets/folders";

  if (data.asset) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.asset));
  } else {
    /**
    * @description The Create a folder into the assets.
    * @memberof Folder
    * @func create
    * @returns {Promise<Folder.Folder>} Promise for Folder instance
    *
    * @example
    * import * as contentstack from 'contentstack'
    * const client = contentstack.client({})
    *
    * client.stack().asset().folders().create({name: 'My New contentType'})
    * .then((folder) => console.log(folder))
    */
    this.create = (0, _entity.create)({
      http: http
    });
  }
}