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

exports.ContentType = ContentType;
exports.ContentTypeCollection = ContentTypeCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

var _index = require("./entry/index");

var _contentstackError = require("../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _formData = require("form-data");

var _formData2 = (0, _interopRequireDefault2["default"])(_formData);

var _fs = require("fs");

/**
 * Content type defines the structure or schema of a page or a section of your web or mobile property. To create content for your application, you are required to first create a content type, and then create entries using the content type. Read more about <a href='https://www.contentstack.com/docs/guide/content-types'>Content Types</a>.
 * @namespace ContentType
 */
function ContentType(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/content_types";

  if (data.content_type) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.content_type));
    this.urlPath = "/content_types/".concat(this.uid);
    /**
     * @description The Update ContentType call lets you update the name and description of an existing ContentType.
     * @memberof ContentType
     * @func update
     * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').fetch()
     * .then((contentType) => {
     *  contentType.title = 'My New Content Type'
     *  contentType.description = 'Content Type description'
     *  return contentType.update()
     * })
     * .then((contentType) => console.log(contentType))
     *
     */

    this.update = (0, _entity.update)(http, 'content_type');
    /**
     * @description The Delete ContentType call is used to delete an existing ContentType permanently from your Stack.
     * @memberof ContentType
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch ContentType call fetches ContentType details.
     * @memberof ContentType
     * @func fetch
     * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
     * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'content_type');
    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContenType} Instace of ContentType.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').fetch()
     * .then((contentType) => console.log(contentType))
     */

    this.entry = function () {
      var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };
      data.content_type_uid = _this.uid;

      if (uid) {
        data.entry = {
          uid: uid
        };
      }

      return new _index.Entry(http, data);
    };
  } else {
    /**
    * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
    * @memberof ContentType
    * @func generateUid
    * @param {*} name Name for content type you want to create.
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    * const contentType = client.stack().contentType()
    * const contentTypeName = 'My New contentType'
    * const content_type = {
    *   name: name,
    *   uid: contentType.generateUid(name)
    * }
    * contentType
    * .create({ content_type })
    * .then((contenttype) => console.log(contenttype))
    *
    */
    this.generateUid = function (name) {
      if (!name) {
        throw new TypeError('Expected parameter name');
      }

      return name.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    };
    /**
    * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
    * @memberof ContentType
    * @func create
    * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
    *
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    * const content_type = {name: 'My New contentType'}
    * client.stack().contentType().create({ content_type })
    * .then((contentType) => console.log(contentType))
    */


    this.create = (0, _entity.create)({
      http: http
    });
    /**
    * @description The Query on Content Type will allow to fetch details of all or specific Content Type
    * @memberof ContentType
    * @func query
    * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
    * @returns {Array<ContentType>} Array of ContentTyoe.
    *
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    *
    * client.stack({ api_key: 'api_key'}).contentType().query({ query: { name: 'Content Type Name' } }).find()
    * .then((contentTypes) => console.log(contentTypes))
    */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: ContentTypeCollection
    });
    /**
    * @description The Import a content type call imports a content type into a stack.
    * @memberof ContentType
    * @func import
    * @param {String} data.content_type path to file
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    *
    * const data = {
    *  content_type: 'path/to/file.json',
    * }
    * client.stack({ api_key: 'api_key'}).contentType().import(data)
    * .then((contentType) => console.log(contentType))
    *
    */

    this["import"] = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(data) {
        var response;
        return _regenerator2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return (0, _entity.upload)({
                  http: http,
                  urlPath: "".concat(this.urlPath, "/import"),
                  stackHeaders: this.stackHeaders,
                  formData: createFormData(data)
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

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  }

  return this;
}

function ContentTypeCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.content_types) || [];
  var contentTypeCollection = obj.map(function (userdata) {
    return new ContentType(http, {
      content_type: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return contentTypeCollection;
}

function createFormData(data) {
  var formData = new _formData2["default"]();
  var uploadStream = (0, _fs.createReadStream)(data.content_type);
  formData.append('content_type', uploadStream);
  return formData;
}