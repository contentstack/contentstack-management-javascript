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

exports.Entry = Entry;
exports.EntryCollection = EntryCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../../entity");

var _formData = require("form-data");

var _formData2 = (0, _interopRequireDefault2["default"])(_formData);

var _fs = require("fs");

var _contentstackError = require("../../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

/**
 * An entry is the actual piece of content created using one of the defined content types. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Entries</a>.
 * @namespace Entry
 */
function Entry(http, data) {
  var _this = this;

  this.stackHeaders = data.stackHeaders;
  this.content_type_uid = data.content_type_uid;
  this.urlPath = "/content_types/".concat(this.content_type_uid, "/entries");

  if (data && data.entry) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.entry));
    this.urlPath = "/content_types/".concat(this.content_type_uid, "/entries/").concat(this.uid);
    /**
     * @description The Create an entry call creates a new entry for the selected content type.
     * @memberof Entry
     * @func update
     * @param locale - Locale code to localized entry
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.description = 'Entry description'
     *  return Entry.update()
     * })
     * .then((entry) => console.log(entry))
     *
     * @example
     * // To Localize Entry pass locale in parameter
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.description = 'Entry description'
     *  return Entry.update({ locale: 'en-at' })
     * })
     * .then((entry) => console.log(entry))
     *
     */

    this.update = (0, _entity.update)(http, 'entry');
    /**
     * @description The Delete an entry call is used to delete a specific entry from a content type.
     * @memberof Entry
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch Entry call fetches Entry details.
     * @memberof Entry
     * @func fetch
     * @param {Int} version Enter the version number of the entry that you want to retrieve. However, to retrieve a specific version of an entry, you need to keep the environment parameter blank.
     * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
     * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
     * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => console.log(entry))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'entry');
    /**
     * @description The Publish an asset call is used to publish a specific version of an asset on the desired environment either immediately or at a later date/time.
     * @memberof Entry
     * @func publish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').publish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */

    this.publish = (0, _entity.publish)(http, 'entry');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Entry
     * @func unpublish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').unpublish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */

    this.unpublish = (0, _entity.unpublish)(http, 'entry');
  } else {
    /**
     * @description The Create an entry call creates a new entry for the selected content type.
     * @memberof Entry
     * @func create
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const entry  = {
     *  title: 'Sample Entry',
     *  url: '/sampleEntry'
     * }
     * client.stack().contentType('content_type_uid').entry().create({ entry })
     * .then((entry) => console.log(entry))
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
    * @description The Query on Entry will allow to fetch details of all or specific Entry
    * @memberof Entry
    * @func query
    * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
    * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
    * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
    * @param {Object} query Queries that you can use to fetch filtered results.
    * @returns {Array<Entry>} Array of Entry.
    *
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    *
    * client.stack().contentType('content_type_uid').entry().query({ query: { title: 'Entry title' } }).find()
    * .then((entries) => console.log(entries))
    */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: EntryCollection
    });
  }
  /**
   * @description The Import Entry calls given below help you to import entries by uploading JSON files.
   * @memberof Entry
   * @func import
   * @param {String} entry Select the JSON file of the entry that you wish to import.
   * @param {String} locale Enter the code of the language to import the entry of that particular language.
   * @param {Boolean} overwrite Select 'true' to replace an existing entry with the imported entry file.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry()
   * .import({
   *  entry: 'path/to/file.json',
   *  overright: true
   * })
   * .then((entry) => console.log(entry))
   *
   */


  this["import"] = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(_ref) {
      var entry, _ref$locale, locale, _ref$overwrite, overwrite, importUrl, response;

      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              entry = _ref.entry, _ref$locale = _ref.locale, locale = _ref$locale === void 0 ? null : _ref$locale, _ref$overwrite = _ref.overwrite, overwrite = _ref$overwrite === void 0 ? false : _ref$overwrite;
              importUrl = "".concat(_this.urlPath, "/import?overwrite=").concat(overwrite);

              if (locale) {
                importUrl = "".concat(importUrl, "&locale=").concat(locale);
              }

              _context.prev = 3;
              _context.next = 6;
              return (0, _entity.upload)({
                http: http,
                urlPath: importUrl,
                stackHeaders: _this.stackHeaders,
                formData: createFormData(entry)
              });

            case 6:
              response = _context.sent;

              if (!response.data) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", new _this.constructor(http, (0, _entity.parseData)(response, _this.stackHeaders)));

            case 11:
              throw (0, _contentstackError2["default"])(response);

            case 12:
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](3);
              throw (0, _contentstackError2["default"])(_context.t0);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 14]]);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  return this;
}

function EntryCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.entries) || [];
  var entryCollection = obj.map(function (entry) {
    return new Entry(http, {
      entry: entry,
      content_type_uid: 'uid',
      stackHeaders: data.stackHeaders
    });
  });
  return entryCollection;
}

function createFormData(entry) {
  var formData = new _formData2["default"]();
  var uploadStream = (0, _fs.createReadStream)(entry);
  formData.append('entry', uploadStream);
  return formData;
}