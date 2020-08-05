"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.Stack = Stack;
exports.StackCollection = StackCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _contentstackError = require("../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _index = require("../user/index");

var _index2 = require("./roles/index");

var _entity = require("../entity");

var _index3 = require("./contentType/index");

var _index4 = require("./globalField/index");

var _index5 = require("./deliveryToken/index");

var _environment = require("./environment");

var _asset = require("./asset");

var _locale = require("./locale");

var _extension = require("./extension");

var _webhook = require("./webhook");

var _release = require("./release");

var _bulkOperation = require("./bulkOperation");

var _label = require("./label");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// import { format } from 'util'

/**
 * A stack is a space that stores the content of a project (a web or mobile property). Within a stack, you can create content structures, content entries, users, etc. related to the project. Read more about <a href='https://www.contentstack.com/docs/guide/stack'>Stacks</a>.
 * @namespace Stack
 */
function Stack(http, data) {
  var _this = this;

  this.urlPath = '/stacks';

  if (data) {
    if (data.stack) {
      Object.assign(this, (0, _cloneDeep2["default"])(data.stack));
    } else if (data.organization_uid) {
      this.organization_uid = data.organization_uid;
    }
  }

  if (data && data.stack && data.stack.api_key) {
    this.stackHeaders = {
      api_key: this.api_key
    };

    if (this.authorization && this.authorization) {
      this.stackHeaders.authorization = this.authorization;
    }
    /**
     * @description The Update stack call lets you update the name and description of an existing stack.
     * @memberof Stack
     * @func update
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').fetch()
     * .then((stack) => {
     *  stack.name = 'My New Stack'
     *  stack.description = 'My new test stack'
     *  return stack.update()
     * })
     * .then((stack) => console.log(stack))
     *
     */


    this.update = (0, _entity.update)(http, 'stack');
    /**
     * @description The Delete stack call is used to delete an existing stack permanently from your Contentstack account.
     * @memberof Stack
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch stack call fetches stack details.
     * @memberof Stack
     * @func fetch
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').fetch()
     * .then((stack) => console.log(stack))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'stack');
    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContenType} Instace of ContentType.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').contentType().create()
     * .then((contentType) => console.log(contentType))
     *
     * client.stack('api_key').contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     */

    this.contentType = function () {
      var contentTypeUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (contentTypeUid) {
        data.content_type = {
          uid: contentTypeUid
        };
      }

      return new _index3.ContentType(http, data);
    };
    /**
     * @description Locale allows you to create and publish entries in any language.
     * @param {String} uid The UID of the Locale you want to get details.
     * @returns {Locale} Instace of Locale.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').locale().create()
     * .then((locale) => console.log(locale))
     *
     * client.stack('api_key').locale('locale_code').fetch()
     * .then((locale) => console.log(locale))
     */


    this.locale = function () {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (code) {
        data.locale = {
          code: code
        };
      }

      return new _locale.Locale(http, data);
    };
    /**
     * @description Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
     * @param {String} uid The UID of the Asset you want to get details.
     * @returns {Asset} Instace of Asset.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset().create()
     * .then((asset) => console.log(asset))
     *
     * client.stack('api_key').asset('asset_uid').fetch()
     * .then((asset) => console.log(asset))
     */


    this.asset = function () {
      var assetUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (assetUid) {
        data.asset = {
          uid: assetUid
        };
      }

      return new _asset.Asset(http, data);
    };
    /**
     * @description Global field defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the Global field you want to get details.
     * @returns {ContenType} Instace of Global field.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField().create()
     * .then((globalField) => console.log(globalField))
     *
     * client.stack('api_key').globalField('globalField_uid').fetch()
     * .then((globalField) => console.log(globalField))
     */


    this.globalField = function () {
      var globalFieldUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (globalFieldUid) {
        data.global_field = {
          uid: globalFieldUid
        };
      }

      return new _index4.GlobalField(http, data);
    };
    /**
     * @description Environment corresponds to one or more deployment servers or a content delivery destination where the entries need to be published.
     * @param {String} uid The UID of the Environment you want to get details.
     * @returns {Environment} Instace of Environment.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField().create()
     * .then((globalField) => console.log(globalField))
     *
     * client.stack('api_key').globalField('globalField_uid').fetch()
     * .then((globalField) => console.log(globalField))
     */


    this.environment = function () {
      var environmentUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (environmentUid) {
        data.environment = {
          name: environmentUid
        };
      }

      return new _environment.Environment(http, data);
    };
    /**
     * @description Delivery Tokens provide read-only access to the associated environments.
     * @param {String} deliveryTokenUid The UID of the Delivery Token field you want to get details.
     * @returns {DeliveryToken} Instace of DeliveryToken.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken().create()
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     * client.stack('api_key').deliveryToken('deliveryToken_uid').fetch()
     * .then((deliveryToken) => console.log(deliveryToken))
     */


    this.deliveryToken = function () {
      var deliveryTokenUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (deliveryTokenUid) {
        data.token = {
          uid: deliveryTokenUid
        };
      }

      return new _index5.DeliveryToken(http, data);
    };
    /**
     * @description Extensions let you create custom fields and custom widgets that lets you customize Contentstack's default UI and behavior.
     * @param {String} extensionUid The UID of the Extension you want to get details.
     * @returns {Extension} Instace of Extension.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').extension().create()
     * .then((extension) => console.log(extension))
     *
     * client.stack('api_key').extension('extension_uid').fetch()
     * .then((extension) => console.log(extension))
     */


    this.extension = function () {
      var extensionUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (extensionUid) {
        data.extension = {
          uid: extensionUid
        };
      }

      return new _extension.Extension(http, data);
    };
    /**
     * @description  Webhooks allow you to specify a URL to which you would like Contentstack to post data when an event happens.
     * @param {String} webhookUid The UID of the Webhook you want to get details.
     * @returns {Webhook} Instace of Webhook.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').webhook().create()
     * .then((webhook) => console.log(webhook))
     *
     * client.stack('api_key').webhook('webhook_uid').fetch()
     * .then((webhook) => console.log(webhook))
     */


    this.webhook = function () {
      var webhookUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (webhookUid) {
        data.webhook = {
          uid: webhookUid
        };
      }

      return new _webhook.Webhook(http, data);
    };
    /**
     * @description Labels allow you to group a collection of content within a stack. Using labels you can group content types that need to work together
     * @param {String} uid The UID of the Label you want to get details.
     * @returns {Label} Instace of Label.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').label().create()
     * .then((label) => console.log(label))
     *
     * client.stack('api_key').label('label_uid').fetch()
     * .then((label) => console.log(label))
     */


    this.label = function () {
      var labelUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (labelUid) {
        data.label = {
          uid: labelUid
        };
      }

      return new _label.Label(http, data);
    };
    /**
     * @description You can pin a set of entries and assets (along with the deploy action, i.e., publish/unpublish) to a ‘release’, and then deploy this release to an environment.
     * @param {String} releaseUid The UID of the Releases you want to get details.
     * @returns {Release} Instance of Release.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release().create()
     * .then((release) => console.log(release))
     *
     * client.stack('api_key').release('release_uid').fetch()
     * .then((release) => console.log(release))
     */


    this.release = function () {
      var releaseUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (releaseUid) {
        data.release = {
          uid: releaseUid
        };
      }

      return new _release.Release(http, data);
    };
    /**
     * Bulk operations such as Publish, Unpublish, and Delete on multiple entries or assets.
     * @returns {BulkOperation} Instance of BulkOperation.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const publishDetails = {
     *   entries: [
     *     {
     *       uid: '{{entry_uid}}',
     *       content_type: '{{content_type_uid}}',
     *       version: '{{version}}',
     *       locale: '{{entry_locale}}'
     *     }
     *   ],
     *   assets: [{
     *     uid: '{{uid}}'
     *   }],
     *   locales: [
     *     'en'
     *   ],
     *   environments: [
     *     '{{env_name}}/env_uid}}'
     *   ]
     * }
     * client.stack('api_key').publish({ details:  publishDetails })
     * .then((notice) => {  console.log(notice) })
     *
     */


    this.bulkOperation = function () {
      var data = {
        stackHeaders: _this.stackHeaders
      };
      return new _bulkOperation.BulkOperation(http, data);
    };
    /**
     * @description The Get all users of a stack call fetches the list of all users of a particular stack
     * @memberof Stack
     * @func users
     * @returns {Array<User>} Array of User's including owner of Stack
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').users()
     * .then((users) => console.log(users))
     *
     */


    this.users = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee() {
      var response;
      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return http.get(_this.urlPath, {
                params: {
                  include_collaborators: true
                },
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              });

            case 3:
              response = _context.sent;

              if (!response.data) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", (0, _index.UserCollection)(http, response.data.stack));

            case 8:
              return _context.abrupt("return", (0, _contentstackError2["default"])(response));

            case 9:
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", (0, _contentstackError2["default"])(_context.t0));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 11]]);
    }));
    /**
     * @description The Transfer stack ownership to other users call sends the specified user an email invitation for accepting the ownership of a particular stack.
     * @memberof Stack
     * @func transferOwnership
     * @param {String} email The email address of the user to whom you wish to transfer the ownership of the stack.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').transferOwnership('emailId')
     * .then((notice) => console.log(notice))
     *
     */

    this.transferOwnership = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(email) {
        var response;
        return _regenerator2["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return http.post("".concat(_this.urlPath, "/transfer_ownership"), {
                  transfer_to: email
                }, {
                  headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
                });

              case 3:
                response = _context2.sent;

                if (!response.data) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", response.data);

              case 8:
                return _context2.abrupt("return", (0, _contentstackError2["default"])(response));

              case 9:
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", (0, _contentstackError2["default"])(_context2.t0));

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 11]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
    /**
     * @description The Get stack settings call retrieves the configuration settings of an existing stack.
     * @memberof Stack
     * @func settings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').settings()
     * .then((settings) => console.log(settings))
     *
     */


    this.settings = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3() {
      var response;
      return _regenerator2["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return http.get("".concat(_this.urlPath, "/settings"), {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              });

            case 3:
              response = _context3.sent;

              if (!response.data) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", response.data.stack_settings);

            case 8:
              return _context3.abrupt("return", (0, _contentstackError2["default"])(response));

            case 9:
              _context3.next = 14;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", (0, _contentstackError2["default"])(_context3.t0));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 11]]);
    }));
    /**
     * @description The Reset stack settings call resets your stack to default settings, and additionally, lets you add parameters to or modify the settings of an existing stack.
     * @memberof Stack
     * @func resetSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').resetSettings()
     * .then((settings) => console.log(settings))
     *
     */

    this.resetSettings = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee4() {
      var response;
      return _regenerator2["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return http.post("".concat(_this.urlPath, "/settings"), {
                stack_settings: {
                  discrete_variables: {},
                  stack_variables: {}
                }
              }, {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              });

            case 3:
              response = _context4.sent;

              if (!response.data) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return", response.data.stack_settings);

            case 8:
              return _context4.abrupt("return", (0, _contentstackError2["default"])(response));

            case 9:
              _context4.next = 14;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", (0, _contentstackError2["default"])(_context4.t0));

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 11]]);
    }));
    /**
     * @description The Add stack settings call lets you add settings for an existing stack.
     * @memberof Stack
     * @func addSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').addSettings({ key: 'value' })
     * .then((settings) => console.log(settings))
     *
     */

    this.addSettings = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee5() {
      var stackVariables,
          response,
          _args5 = arguments;
      return _regenerator2["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              stackVariables = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {};
              _context5.prev = 1;
              _context5.next = 4;
              return http.post("".concat(_this.urlPath, "/settings"), {
                stack_settings: {
                  stack_variables: stackVariables
                }
              }, {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              });

            case 4:
              response = _context5.sent;

              if (!response.data) {
                _context5.next = 9;
                break;
              }

              return _context5.abrupt("return", response.data.stack_settings);

            case 9:
              return _context5.abrupt("return", (0, _contentstackError2["default"])(response));

            case 10:
              _context5.next = 15;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](1);
              return _context5.abrupt("return", (0, _contentstackError2["default"])(_context5.t0));

            case 15:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 12]]);
    }));
    /**
     * @description The Share a stack call shares a stack with the specified user to collaborate on the stack.
     * @memberof Stack
     * @func share
     * @param {Array<String>} emails - Email ID of the user with whom you wish to share the stack
     * @param {Array<String>} roles - The role uid that you wish to assign the user.
     * @returns {Object} Response Object.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').share([ "manager@example.com" ], { "manager@example.com": [ "abcdefhgi1234567890" ] })
     * .then((notice) => console.log(notice))
     *
     */

    this.share = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee6() {
      var emails,
          roles,
          response,
          _args6 = arguments;
      return _regenerator2["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              emails = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : [];
              roles = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
              _context6.prev = 2;
              _context6.next = 5;
              return http.post("".concat(_this.urlPath, "/share"), {
                emails: emails,
                roles: roles
              }, {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              });

            case 5:
              response = _context6.sent;

              if (!response.data) {
                _context6.next = 10;
                break;
              }

              return _context6.abrupt("return", response.data);

            case 10:
              return _context6.abrupt("return", (0, _contentstackError2["default"])(response));

            case 11:
              _context6.next = 16;
              break;

            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](2);
              return _context6.abrupt("return", (0, _contentstackError2["default"])(_context6.t0));

            case 16:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[2, 13]]);
    }));
    /**
     * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
     * @memberof Stack
     * @func unShare
     * @param {String} email The email ID of the user from whom you wish to unshare the stack.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').unShare('email@id.com')
     * .then((notice) => console.log(notice))
     *
     */

    this.unShare = /*#__PURE__*/function () {
      var _ref7 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee7(email) {
        var response;
        return _regenerator2["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return http.post("".concat(_this.urlPath, "/unshare"), {
                  email: email
                }, {
                  headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
                });

              case 3:
                response = _context7.sent;

                if (!response.data) {
                  _context7.next = 8;
                  break;
                }

                return _context7.abrupt("return", response.data);

              case 8:
                return _context7.abrupt("return", (0, _contentstackError2["default"])(response));

              case 9:
                _context7.next = 14;
                break;

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                return _context7.abrupt("return", (0, _contentstackError2["default"])(_context7.t0));

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 11]]);
      }));

      return function (_x2) {
        return _ref7.apply(this, arguments);
      };
    }();
    /**
     * @description A role is a collection of permissions that will be applicable to all the users who are assigned this role.
     * @memberof Stack
     * @func role
     * @param {String} uid The UID of the role you want to get details.
     * @returns {Role} Instance of Role.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').role().create({
     * "role":
     *       {
     *        "name":"testRole",
     *        "description":"",
     *        "rules":[...],
     *       }
     * })
     * .then((role) => console.log(role))
     *
     * client.stack('api_key').role('role_uid').fetch())
     * .then((role) => console.log(role))
     *
     */


    this.role = function () {
      var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = {
        stackHeaders: _this.stackHeaders
      };

      if (uid) {
        data.role = {
          uid: uid
        };
      }

      return new _index2.Role(http, data);
    };
  } else {
    /**
     * @description The Create stack call creates a new stack in your Contentstack account.
     * @memberof Stack
     * @func create
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('org_uid').stack().create({name: 'My New Stack'})
     * .then((stack) => console.log(stack))
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().create({name: 'My New Stack'}, { organization_uid: 'org_uid' })
     * .then((stack) => console.log(stack))
     */
    this.create = (0, _entity.create)({
      http: http,
      params: this.organization_uid ? {
        organization_uid: this.organization_uid
      } : null
    });
    /**
     * @description The Query on Stack will allow to fetch details of all or specific Stack.
     * @memberof Stack
     * @func query
     * @param {Boolean} include_collaborators Set this parameter to 'true' to include the details of the stack collaborators.
     * @param {Boolean} include_stack_variablesSet this to 'true' to display the stack variables. Stack variables are extra information about the stack, such as the description, format of date, format of time, and so on. Users can include or exclude stack variables in the response.
     * @param {Boolean} include_discrete_variables Set this to 'true' to view the access token of your stack.
     * @param {Boolean} include_count Set this to 'true' to include in the response the total count of the stacks owned by or shared with a user account.
     * @param {Object} query Queries that you can use to fetch filtered results.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().query({ query: { name: 'Stack Name' } }).find()
     * .then((stack) => console.log(stack))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: StackCollection
    });
  }

  return this;
}

function StackCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.stacks);
  var stackCollection = obj.map(function (userdata) {
    return new Stack(http, {
      stack: userdata
    });
  });
  return stackCollection;
}