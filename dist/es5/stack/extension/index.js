"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("@babel/runtime/helpers/typeof");

var _typeof3 = (0, _interopRequireDefault2["default"])(_typeof2);

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.Extension = Extension;
exports.ExtensionCollection = ExtensionCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

var _contentstackError = require("../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _formData = require("form-data");

var _formData2 = (0, _interopRequireDefault2["default"])(_formData);

var _fs = require("fs");

/**
 * Extensions let you create custom fields and custom widgets that lets you customize Contentstack's default UI and behavior. Read more about <a href='https://www.contentstack.com/docs/developers/about-experience-extensions/'>Extensions</a>.
 */
function Extension(http, data) {
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/extensions";

  if (data.extension) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.extension));
    this.urlPath = "/extensions/".concat(this.uid);
    /**
     * @description The Update Extension call lets you update an existing Extension.
     * @memberof Extension
     * @func update
     * @returns {Promise<Extension.Extension>} Promise for Extension instance.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').extension('extension_uid').fetch()
     * .then((extension) => {
     *  extension.title = 'My Extension Type'
     *  return extension.update()
     * })
     * .then((extension) => console.log(extension))
     *
     */

    this.update = (0, _entity.update)(http, 'extension');
    /**
     * @description The Delete Extension call is used to delete an existing Extension permanently from your Stack.
     * @memberof Extension
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').extension('extension_uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch Extension call fetches Extension details.
     * @memberof Extension
     * @func fetch
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').extension('extension_uid').fetch()
     * .then((extension) => console.log(extension))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'extension');
  } else {
    /**
     * @description The Upload is used to upload a new custom widget, custom field, dashboard Widget to a stack.
     * @memberof Extension
     * @func upload
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const extension = {
     *  upload: 'path/to/file',
     *  title: 'Title',
     *  tags: [
     *    'tag1',
     *    'tag2'
     *  ],
     *  data_type: 'text',
     *  title: 'Old Extension',
     *  multiple: false,
     *  config: {},
     *  type: 'Type of extenstion you want to create widget/dashboard/field'
     * }
     *
     * client.stack('api_key').extension().upload(extension)
     * .then((extension) => console.log(extension))
     */
    this.upload = /*#__PURE__*/function () {
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
                  formData: createExtensionFormData(data),
                  params: params
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
     * @description The Create a extension call creates a new extension in a particular stack of your Contentstack account.
     * @memberof Extension
     * @func create
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     * const extensionJson = {
     *  tags: [
     *    'tag1',
     *    'tag2'
     *  ],
     *  data_type: 'text',
     *  title: 'Old Extension',
     *  src: "Enter either the source code (use 'srcdoc') or the external hosting link of the extension depending on the hosting method you selected.",
     *  multiple: false,
     *  config: {},
     *  type: 'field'
     * }
     *
     * client.stack().extension().create({ extension: ...extensionJson })
     * .then((extension) => console.log(extension))
     */


    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The Query on Content Type will allow to fetch details of all or specific Content Type
     * @memberof Extension
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Array<Extension>} Array of ContentTyoe.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().extension().query({ query={"type":"field"}})
     * .then((extensions) => console.log(extensions))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: ExtensionCollection
    });
  }
}

function ExtensionCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.extensions);
  var extensionCollection = obj.map(function (extensiondata) {
    return new Extension(http, {
      extension: extensiondata,
      stackHeaders: data.stackHeaders
    });
  });
  return extensionCollection;
}

function createExtensionFormData(data) {
  var formData = new _formData2["default"]();

  if (typeof data.title === 'string') {
    formData.append('extension[title]', data.title);
  }

  if ((0, _typeof3["default"])(data.scope) === 'object') {
    formData.append('extension[scope]', "".concat(data.scope));
  }

  if (typeof data['data_type'] === 'string') {
    formData.append('extension[data_type]', data['data_type']);
  }

  if (typeof data.type === 'string') {
    formData.append('extension[type]', data.type);
  }

  if (data.tags instanceof Array) {
    formData.append('extension[tags]', data.tags.join(','));
  } else if (typeof data.tags === 'string') {
    formData.append('extension[tags]', data.tags);
  }

  if (typeof data.multiple === 'boolean') {
    formData.append('extension[multiple]', "".concat(data.multiple));
  }

  if (typeof data.enable === 'boolean') {
    formData.append('extension[enable]', "".concat(data.enable));
  }

  var uploadStream = (0, _fs.createReadStream)(data.upload);
  formData.append('extension[upload]', uploadStream);
  return formData;
}