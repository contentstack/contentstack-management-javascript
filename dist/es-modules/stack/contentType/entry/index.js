import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, query, upload, parseData, publish, unpublish } from '../../../entity';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import error from '../../../core/contentstackError';
/**
 * An entry is the actual piece of content created using one of the defined content types. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Entries</a>.
 * @namespace Entry
 */

export function Entry(http, data) {
  var _this = this;

  this.stackHeaders = data.stackHeaders;
  this.content_type_uid = data.content_type_uid;
  this.urlPath = "/content_types/".concat(this.content_type_uid, "/entries");

  if (data && data.entry) {
    Object.assign(this, cloneDeep(data.entry));
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
     *  return entry.update()
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
     *  return entry.update({ locale: 'en-at' })
     * })
     * .then((entry) => console.log(entry))
     *
     */

    this.update = update(http, 'entry');
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

    this["delete"] = deleteEntity(http);
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

    this.fetch = fetch(http, 'entry');
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

    this.publish = publish(http, 'entry');
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

    this.unpublish = unpublish(http, 'entry');
    /**
     * @description This multipurpose request allows you to either send a publish request or accept/reject a received publish request.
     * @memberof Entry
     * @func publishRequest
     * @returns {Promise<Object>} Response Object.
     * @param {Object} publishing_rule Details for the publish request
     * @param {String} locale Enter the code of the locale that the entry belongs to.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const publishing_rule = {
     * "uid": "blt9b9253297f117e84",
     * "action": "publish" //(‘publish’, ‘unpublish’, or ’both’)
     * "status": 1, //(this could be ‘0’ for Approval Requested, ‘1’ for ‘Approval Accepted’, and ‘-1’ for ‘Approval Rejected’),
     * "notify": false,
     * comment": "Please review this."
     * }
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').publishRequest({ publishing_rule, locale: 'en-us'})
     * .then((response) => console.log(response.notice))
     */

    this.publishRequest = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
        var publishing_rule, locale, publishDetails, headers, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                publishing_rule = _ref.publishing_rule, locale = _ref.locale;
                publishDetails = {
                  workflow: {
                    publishing_rule: publishing_rule
                  }
                };
                headers = {};

                if (_this.stackHeaders) {
                  headers.headers = _this.stackHeaders;
                }

                headers.params = {
                  locale: locale
                };
                _context.prev = 5;
                _context.next = 8;
                return http.post("".concat(_this.urlPath, "/workflow"), publishDetails, headers);

              case 8:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", response.data);

              case 13:
                throw error(response);

              case 14:
                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](5);
                throw error(_context.t0);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 16]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
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
    this.create = create({
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

    this.query = query({
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
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref3) {
      var entry, _ref3$locale, locale, _ref3$overwrite, overwrite, importUrl, response;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              entry = _ref3.entry, _ref3$locale = _ref3.locale, locale = _ref3$locale === void 0 ? null : _ref3$locale, _ref3$overwrite = _ref3.overwrite, overwrite = _ref3$overwrite === void 0 ? false : _ref3$overwrite;
              importUrl = "".concat(_this.urlPath, "/import?overwrite=").concat(overwrite);

              if (locale) {
                importUrl = "".concat(importUrl, "&locale=").concat(locale);
              }

              _context2.prev = 3;
              _context2.next = 6;
              return upload({
                http: http,
                urlPath: importUrl,
                stackHeaders: _this.stackHeaders,
                formData: createFormData(entry)
              });

            case 6:
              response = _context2.sent;

              if (!response.data) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", new _this.constructor(http, parseData(response, _this.stackHeaders)));

            case 11:
              throw error(response);

            case 12:
              _context2.next = 17;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](3);
              throw error(_context2.t0);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 14]]);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  return this;
}
export function EntryCollection(http, data) {
  var obj = cloneDeep(data.entries) || [];
  var entryCollection = obj.map(function (entry) {
    return new Entry(http, {
      entry: entry,
      content_type_uid: data.content_type_uid,
      stackHeaders: data.stackHeaders
    });
  });
  return entryCollection;
}
export function createFormData(entry) {
  return function () {
    var formData = new FormData();
    var uploadStream = createReadStream(entry);
    formData.append('entry', uploadStream);
    return formData;
  };
}