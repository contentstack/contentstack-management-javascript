"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Branch = Branch;
exports.BranchCollection = BranchCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

/**
 *
 * @namespace Branch
 */
function Branch(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/stacks/branches";
  data.branch = data.branch || data.branch_alias;
  delete data.branch_alias;

  if (data.branch) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.branch));
    this.urlPath = "/stacks/branches/".concat(this.uid);
    /**
     * @description The Delete Branch call is used to delete an existing Branch permanently from your Stack.
     * @memberof Branch
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_name').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch Branch call fetches Branch details.
     * @memberof Branch
     * @func fetch
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_name').fetch()
     * .then((branch) => console.log(branch))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'branch');
  } else {
    /**
     * @description The Create a Branch call creates a new branch in a particular stack of your Contentstack account.
     * @memberof Branch
     * @func create
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const branch = {
     *      name: 'branch_name',
     *      source: 'master'
     * }
     * client.stack({ api_key: 'api_key'}).branch().create({ branch })
     * .then((branch) => { console.log(branch) })
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The 'Get all Branch' request returns comprehensive information about branch created in a Stack.
     * @memberof Branch
     * @func query
     * @returns {Promise<ContentstackCollection.ContentstackCollection>} Promise for ContentstackCollection instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().query().find()
     * .then((collection) => { console.log(collection) })
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: BranchCollection
    });
  }

  return this;
}

function BranchCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.branches) || data.branch_aliases || [];
  return obj.map(function (branchData) {
    return new Branch(http, {
      branch: branchData,
      stackHeaders: data.stackHeaders
    });
  });
}