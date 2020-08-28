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

exports.GlobalField = GlobalField;
exports.GlobalFieldCollection = GlobalFieldCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

var _contentstackError = require("../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _formData = require("form-data");

var _formData2 = (0, _interopRequireDefault2["default"])(_formData);

var _fs = require("fs");

/**
 * GlobalField defines the structure or schema of a page or a section of your web or mobile property. To create global Fields for your application, you are required to first create a gloabl field. Read more about <a href='https://www.contentstack.com/docs/guide/global-fields'>Global Fields</a>.
 * @namespace GlobalField
 */
function GlobalField(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/global_fields";

  if (data.global_field) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.global_field));
    this.urlPath = "/global_fields/".concat(this.uid);
    /**
     * @description The Update GlobalField call lets you update the name and description of an existing GlobalField.
     * @memberof GlobalField
     * @func update
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').fetch()
     * .then((globalField) => {
     *  globalField.title = 'My New Content Type'
     *  globalField.description = 'Content Type description'
     *  return globalField.update()
     * })
     * .then((globalField) => console.log(globalField))
     *
     */

    this.update = (0, _entity.update)(http, 'global_field');
    /**
     * @description The Delete GlobalField call is used to delete an existing GlobalField permanently from your Stack.
     * @memberof GlobalField
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch GlobalField call fetches GlobalField details.
     * @memberof GlobalField
     * @func fetch
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').fetch()
     * .then((globalField) => console.log(globalField))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'global_field');
  } else {
    /**
     * @description The Create a GlobalField call creates a new globalField in a particular stack of your Contentstack account.
     * @memberof GlobalField
     * @func create
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     *
     * @example
     * import * as contentstac k from '@contentstack/management'
     * const client = contentstack.client()
     * const global_field = {
     *      title: 'First',
     *      uid: 'first',
     *      schema: [{
     *          display_name: 'Name',
     *          uid: 'name',
     *          data_type: 'text'
     *      }]
     * }
     * client.stack().globalField().create({ global_field })
     * .then((globalField) => console.log(globalField))
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The Query on GlobalField will allow to fetch details of all or specific GlobalField
     * @memberof GlobalField
     * @func query
     * @returns {Array<GlobalField>} Array of GlobalField.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().globalField().query({ query: { name: 'Global Field Name' } }).find()
     * .then((globalFields) => console.log(globalFields))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: GlobalFieldCollection
    });
    /**
    * @description The Import a global field call imports a global field into a stack.
    * @memberof GlobalField
    * @func import
    * @param {String} data.global_field path to file
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    *
    * const data = {
    *  global_field: 'path/to/file.png',
    * }
    * client.stack({ api_key: 'api_key'}).globalField().import(data)
    * .then((globalField) => console.log(globalField))
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

function GlobalFieldCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.global_fields);
  var globalFieldCollection = obj.map(function (userdata) {
    return new GlobalField(http, {
      global_field: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return globalFieldCollection;
}

function createFormData(data) {
  var formData = new _formData2["default"]();
  var uploadStream = (0, _fs.createReadStream)(data.global_field);
  formData.append('global_field', uploadStream);
  return formData;
}