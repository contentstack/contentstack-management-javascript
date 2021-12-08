import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, upload, parseData, fetchAll } from '../../entity';
import error from '../../core/contentstackError';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import ContentstackCollection from '../../contentstackCollection';
/**
 * A webhook is a mechanism that sends real-time information to any third-party app or service to keep your application in sync with your Contentstack account. Webhooks allow you to specify a URL to which you would like Contentstack to post data when an event happens. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-webhooks'>Webhooks</a>.
 * @namespace Webhook
 */

export function Webhook(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/webhooks";

  if (data.webhook) {
    Object.assign(this, cloneDeep(data.webhook));
    this.urlPath = "/webhooks/".concat(this.uid);
    /**
     * @description The Update Webhook call lets you update the name and description of an existing Webhook.
     * @memberof Webhook
     * @func update
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').fetch()
     * .then((webhook) => {
     *  webhook.title = 'My New Webhook'
     *  webhook.description = 'Webhook description'
     *  return webhook.update()
     * })
     * .then((webhook) => console.log(webhook))
     *
     */

    this.update = update(http, 'webhook');
    /**
     * @description The Delete Webhook call is used to delete an existing Webhook permanently from your Stack.
     * @memberof Webhook
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch Webhook call fetches Webhook details.
     * @memberof Webhook
     * @func fetch
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').fetch()
     * .then((webhook) => console.log(webhook))
     *
     */

    this.fetch = fetch(http, 'webhook');
    /**
     * @description The Get executions of a webhook call will provide the execution details of a specific webhook, which includes the execution UID.
     * @memberof Webhook
     * @returns {Promise<JSON.JSON>} JSON response for webhook execution
     * @func executions
     * @param {*} param.skip - to skip number of data
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').executions()
     * .then((webhook) => console.log(webhook))
     */

    this.executions = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(params) {
        var headers, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = {};

                if (_this.stackHeaders) {
                  headers.headers = _this.stackHeaders;
                }

                if (params) {
                  headers.params = _objectSpread({}, cloneDeep(params));
                }

                _context.prev = 3;
                _context.next = 6;
                return http.get("".concat(_this.urlPath, "/executions"), headers);

              case 6:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", response.data);

              case 11:
                throw error(response);

              case 12:
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](3);
                throw error(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 14]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
    /**
     *
     * @param {String} executionUid execution UID that you receive when you execute the 'Get executions of webhooks' call.
     */


    this.retry = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(executionUid) {
        var headers, response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                headers = {};

                if (_this.stackHeaders) {
                  headers.headers = _this.stackHeaders;
                }

                _context2.prev = 2;
                _context2.next = 5;
                return http.post("".concat(_this.urlPath, "/retry"), {
                  execution_uid: executionUid
                }, headers);

              case 5:
                response = _context2.sent;

                if (!response.data) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", response.data);

              case 10:
                throw error(response);

              case 11:
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](2);
                throw error(_context2.t0);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 13]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();
  } else {
    /**
     * @description The Create a webhook request allows you to create a new webhook in a specific stack.
     * @memberof Webhook
     * @func create
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const webhook = {
     * name: 'Test',
     * destinations: [{
     *   target_url: 'http://example.com',
     *   http_basic_auth: 'basic',
     *   http_basic_password: 'test',
     *   custom_header: [{
     *     header_name: 'Custom',
     *     value: 'testing'
     *   }]
     * }],
     *  channels: [
     *    'assets.create'
     *  ],
     *  retry_policy: 'manual',
     *  disabled: false
     * }
     * client.stack().webhook().create({ webhook })
     * .then((webhook) => console.log(webhook))
     */
    this.create = create({
      http: http
    });
    /**
     * @description The Get all Webhook call lists all Webhooks from Stack.
     * @memberof Webhook
     * @func fetchAll
     * @param {Int} limit The limit parameter will return a specific number of webhooks in the output.
     * @param {Int} skip The skip parameter will skip a specific number of webhooks in the output.
     * @param {String} asc When fetching webhooks, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @param {String} desc When fetching webhooks, you can sort them in the decending order with respect to the value of a specific field in the response body.
     * @param {Boolean}include_count To retrieve the count of webhooks.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */

    this.fetchAll = fetchAll(http, WebhookCollection);
  }
  /**
   * @description The 'Import Webhook' section consists of the following two requests that will help you to import new Webhooks or update existing ones by uploading JSON files.
   * @memberof Webhook
   * @func import
   * @param {String} data.webhook path to file
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const data = {
   *  webhook: 'path/to/file.png',
   * }
   * // Import a Webhook
   * client.stack({ api_key: 'api_key'}).webhook().import(data)
   * .then((webhook) => console.log(webhook))
   *
   * // Import an Existing Webhook
   * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').import(data)
   * .then((webhook) => console.log(webhook))
   */


  this["import"] = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(data) {
      var response;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return upload({
                http: http,
                urlPath: "".concat(_this.urlPath, "/import"),
                stackHeaders: _this.stackHeaders,
                formData: createFormData(data)
              });

            case 3:
              response = _context3.sent;

              if (!response.data) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", new _this.constructor(http, parseData(response, _this.stackHeaders)));

            case 8:
              throw error(response);

            case 9:
              _context3.next = 14;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              throw error(_context3.t0);

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 11]]);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  return this;
}
export function WebhookCollection(http, data) {
  var obj = cloneDeep(data.webhooks) || [];
  var webhookCollection = obj.map(function (userdata) {
    return new Webhook(http, {
      webhook: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return webhookCollection;
}
export function createFormData(data) {
  return function () {
    var formData = new FormData();
    var uploadStream = createReadStream(data.webhook);
    formData.append('webhook', uploadStream);
    return formData;
  };
}