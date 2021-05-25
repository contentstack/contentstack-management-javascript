import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, fetchAll } from '../../entity';
import error from '../../core/contentstackError';
import ContentstackCollection from '../../contentstackCollection';
import { PublishRules, PublishRulesCollection } from './publishRules';
/**
 * Workflow is a tool that allows you to streamline the process of content creation and publishing, and lets you manage the content lifecycle of your project smoothly. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-workflows-and-publish-rules'>Workflows and Publish Rules</a>.
 * @namespace Workflow
 */

export function Workflow(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/workflows";

  if (data.workflow) {
    Object.assign(this, cloneDeep(data.workflow));
    this.urlPath = "/workflows/".concat(this.uid);
    /**
     * @description The Update Workflow request allows you to add a workflow stage or update the details of the existing stages of a workflow.
     * @memberof Workflow
     * @func update
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').fetch()
     * .then((workflow) => {
     *  workflow.name = 'My New Workflow'
     *  workflow.description = 'Workflow description'
     *  return workflow.update()
     * })
     * .then((workflow) => console.log(workflow))
     *
     */

    this.update = update(http, 'workflow');
    /**
     * @description The Disable Workflow request allows you to disable a workflow.
     * @memberof Workflow
     * @func disable
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').disable()
     * .then((workflow) => console.log(workflow))
     *
     */

    this.disable = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var response;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return http.get("/workflows/".concat(this.uid, "/disable"), {
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              });

            case 3:
              response = _context.sent;

              if (!response.data) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", response.data);

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
    /**
     * @description The Enable Workflow request allows you to enable a workflow.
     * @memberof Workflow
     * @func enable
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').enable()
     * .then((workflow) => console.log(workflow))
     *
     */

    this.enable = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var response;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return http.get("/workflows/".concat(this.uid, "/enable"), {
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              });

            case 3:
              response = _context2.sent;

              if (!response.data) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", response.data);

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
    /**
     * @description The Delete Workflow call is used to delete an existing Workflow permanently from your Stack.
     * @memberof Workflow
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch workflow retrieves the comprehensive details of a specific Workflow of a stack.
     * @memberof Workflow
     * @func fetch
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').fetch()
     * .then((workflow) => console.log(workflow))
     *
     */

    this.fetch = fetch(http, 'workflow');
  } else {
    this.contentType = function (contentTypeUID) {
      if (contentTypeUID) {
        /**
             * @description The Delete Workflow call is used to delete an existing Workflow permanently from your Stack.
             * @memberof Workflow
             * @func getPublishRules
             * @returns {Object} Returns Object.
             * @param {string} action Enter the action that has been set in the Publishing Rule. Example:publish/unpublish
             * @param {string} locale Enter the code of the locale where your Publishing Rule will be applicable.
             * @param {string} environment Enter the UID of the environment where your Publishing Rule will be applicable.
             * @returns {ContentstackCollection} Result collection of content of PublishRules.
             * @example
             * import * as contentstack from '@contentstack/management'
             * const client = contentstack.client()
             *
             * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').contentType('contentType_uid').getPublishRules()
             * .then((collection) => console.log(collection))
             */
        var getPublishRules = /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(params) {
            var headers, response;
            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    headers = {};

                    if (this.stackHeaders) {
                      headers.headers = this.stackHeaders;
                    }

                    if (params) {
                      headers.params = _objectSpread({}, cloneDeep(params));
                    }

                    _context3.prev = 3;
                    _context3.next = 6;
                    return http.get("/workflows/content_type/".concat(contentTypeUID), headers);

                  case 6:
                    response = _context3.sent;

                    if (!response.data) {
                      _context3.next = 11;
                      break;
                    }

                    return _context3.abrupt("return", new ContentstackCollection(response, http, this.stackHeaders, PublishRulesCollection));

                  case 11:
                    throw error(response);

                  case 12:
                    _context3.next = 17;
                    break;

                  case 14:
                    _context3.prev = 14;
                    _context3.t0 = _context3["catch"](3);
                    throw error(_context3.t0);

                  case 17:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this, [[3, 14]]);
          }));

          return function getPublishRules(_x) {
            return _ref3.apply(this, arguments);
          };
        }();

        return {
          getPublishRules: getPublishRules,
          stackHeaders: _objectSpread({}, _this.stackHeaders)
        };
      }
    };
    /**
         * @description The Create a Workflow request allows you to create a Workflow.
         * @memberof Workflow
         * @func create
         * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * const workflow = {
         *"workflow_stages": [
         *      {
         *        "color": "#2196f3",
         *        "SYS_ACL": {
         *          "roles": {
         *            "uids": []
         *          },
         *          "users": {
         *          "uids": [
         *            "$all"
         *          ]
         *        },
         *        "others": {}
         *      },
         *      "next_available_stages": [
         *        "$all"
         *      ],
         *      "allStages": true,
         *      "allUsers": true,
         *      "specificStages": false,
         *      "specificUsers": false,
         *      "entry_lock": "$none", //assign any one of the assign any one of the ($none/$others/$all)
         *      "name": "Review"
         *    },
         *    {
         *      "color": "#74ba76",
         *      "SYS_ACL": {
         *        "roles": {
         *          "uids": []
         *        },
         *        "users": {
         *          "uids": [
         *            "$all"
         *          ]
         *        },
         *        "others": {}
         *      },
         *      "allStages": true,
         *      "allUsers": true,
         *      "specificStages": false,
         *      "specificUsers": false,
         *      "next_available_stages": [
         *          "$all"
         *        ],
         *        "entry_lock": "$none",
         *        "name": "Complete"
         *      }
         *    ],
         *    "admin_users": {
         *      "users": []
         *    },
         *      "name": "Workflow Name",
         *      "enabled": true,
         *      "content_types": [
         *        "$all"
         *      ]
         *  }
         *  client.stack().workflow().create({ workflow })
         * .then((workflow) => console.log(workflow))
         */


    this.create = create({
      http: http
    });
    /**
         * @description The Get all Workflows request retrieves the details of all the Workflows of a stack.
         * @memberof Workflow
         * @func fetchAll
         * @param {Int} limit The limit parameter will return a specific number of Workflows in the output.
         * @param {Int} skip The skip parameter will skip a specific number of Workflows in the output.
         * @param {Boolean}include_count To retrieve the count of Workflows.
         * @returns {ContentstackCollection} Result collection of content of specified module.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).workflow().fetchAll()
         * .then((collection) => console.log(collection))
         *
         */

    this.fetchAll = fetchAll(http, WorkflowCollection);
    /**
         * @description The Publish rule allow you to create, fetch, delete, update the publish rules.
         * @memberof Workflow
         * @func publishRule
         * @param {Int} ruleUid The UID of the Publish rules you want to get details.
         * @returns {PublishRules} Instace of PublishRules.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).workflow().publishRule().fetchAll()
         * .then((collection) => console.log(collection))
         *
         * client.stack({ api_key: 'api_key'}).workflow().publishRule('rule_uid').fetch()
         * .then((publishrule) => console.log(publishrule))
         *
         */

    this.publishRule = function () {
      var ruleUid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var publishInfo = {
        stackHeaders: _this.stackHeaders
      };

      if (ruleUid) {
        publishInfo.publishing_rule = {
          uid: ruleUid
        };
      }

      return new PublishRules(http, publishInfo);
    };
  }
}
export function WorkflowCollection(http, data) {
  var obj = cloneDeep(data.workflows) || [];
  var workflowCollection = obj.map(function (userdata) {
    return new Workflow(http, {
      workflow: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return workflowCollection;
}