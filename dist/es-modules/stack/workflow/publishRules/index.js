import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch } from '../../../entity';
import error from '../../../core/contentstackError';
import ContentstackCollection from '../../../contentstackCollection';
/**
 * PublishRules is a tool that allows you to streamline the process of content creation and publishing, and lets you manage the content lifecycle of your project smoothly. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-publish ruless-and-publish-rules'>PublishRuless and Publish Rules</a>.
 * @namespace PublishRules
 */

export function PublishRules(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/workflows/publishing_rules";

  if (data.publishing_rule) {
    Object.assign(this, cloneDeep(data.publishing_rule));
    this.urlPath = "/workflows/publishing_rules/".concat(this.uid);
    /**
     * @description The Update Publish Rules request allows you to add a publish rules stage or update the details of the existing stages of a publish rules.
     * @memberof Publish Rules
     * @func update
     * @returns {Promise<PublishRules.PublishRules>} Promise for Publish Rules instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).publishRules('publish_rules_uid').fetch()
     * .then((publish_rules) => {
     *  publish_rules.name = 'My New Publish Rules'
     *  publish_rules.description = 'Publish Rules description'
     *  return publish_rules.update()
     * })
     * .then((publish_rules) => console.log(publish_rules))
     *
     */

    this.update = update(http, 'publishing_rule');
    /**
     * @description The Delete Publish Rules call is used to delete an existing Publish Rules permanently from your Stack.
     * @memberof Publish Rules
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).publishRules('publish_rules_uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch publish rules retrieves the comprehensive details of a specific Publish Rules of a stack.
     * @memberof Publish Rules
     * @func fetch
     * @returns {Promise<PublishRules.PublishRules>} Promise for Publish Rules instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).publishRules('publish_rules_uid').fetch()
     * .then((publish_rules) => console.log(publish_rules))
     *
     */

    this.fetch = fetch(http, 'publishing_rule');
  } else {
    /**
     * @description The Create Publish Rules request allows you to create publish rules for the publish rules of a stack.
     * @memberof PublishRules
     * @func create
     * @returns {Promise<PublishRules.PublishRules>} Promise for PublishRules instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const publishing_rule = {
     *    	"publish rules": "publish rules_uid",
     *        "actions": [],
     *        "content_types": ["$all"],
     *        "locales": ["en-us"],
     *        "environment": "environment_uid",
     *         "approvers": {
     *        	"users": ["user_uid"],
     *        	"roles": ["role_uid"]
     *        },
     *        "publish rules_stage": "publish rules_stage_uid",
     *         "disable_approver_publishing": false
     *    }
     * client.stack().publishRules().create({ publishing_rule })
     * .then((publishRules) => console.log(publishRules))
     */
    this.create = create({
      http: http
    });
    /**
     * @description The Get all Publish Rules request retrieves the details of all the Publish rules of a workflow. 
     * @memberof Publish Rules
     * @func fetchAll
     * @param {String} content_types Enter a comma-separated list of content type UIDs for filtering publish rules on its basis.
     * @param {Int} limit The limit parameter will return a specific number of Publish Ruless in the output.
     * @param {Int} skip The skip parameter will skip a specific number of Publish Ruless in the output.
     * @param {Boolean}include_count To retrieve the count of Publish Ruless.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).publishRules().fetchAll({ content_types: 'content_type_uid1,content_type_uid2' })
     * .then((collection) => console.log(collection))
     *
     */

    this.fetchAll = /*#__PURE__*/function () {
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
                return http.get(_this.urlPath, headers);

              case 6:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", new ContentstackCollection(response, http, null, PublishRulesCollection));

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
  }
}
export function PublishRulesCollection(http, data) {
  var obj = cloneDeep(data.publishing_rules) || [];
  var publishRulesollection = obj.map(function (userdata) {
    return new PublishRules(http, {
      publishing_rule: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return publishRulesollection;
}