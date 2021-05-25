"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublishRules = PublishRules;
exports.PublishRulesCollection = PublishRulesCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../../entity");

var _contentstackError = require("../../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _contentstackCollection = require("../../../contentstackCollection");

var _contentstackCollection2 = (0, _interopRequireDefault2["default"])(_contentstackCollection);

/**
 * PublishRules is a tool that allows you to streamline the process of content creation and publishing, and lets you manage the content lifecycle of your project smoothly. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-publish ruless-and-publish-rules'>PublishRuless and Publish Rules</a>.
 * @namespace PublishRules
 */
function PublishRules(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/workflows/publishing_rules";

  if (data.publishing_rule) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.publishing_rule));
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

    this.update = (0, _entity.update)(http, 'publishing_rule');
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

    this["delete"] = (0, _entity.deleteEntity)(http);
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

    this.fetch = (0, _entity.fetch)(http, 'publishing_rule');
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
    this.create = (0, _entity.create)({
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

    this.fetchAll = (0, _entity.fetchAll)(http, PublishRulesCollection);
  }
}

function PublishRulesCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.publishing_rules) || [];
  var publishRulesollection = obj.map(function (userdata) {
    return new PublishRules(http, {
      publishing_rule: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return publishRulesollection;
}