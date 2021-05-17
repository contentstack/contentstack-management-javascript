"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeliveryToken = DeliveryToken;
exports.DeliveryTokenCollection = DeliveryTokenCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

/**
 * Delivery tokens provide read-only access to the associated environments. Read more about <a href='https://www.contentstack.com/docs/developers/create-tokens/about-delivery-tokens'>DeliveryToken</a>.
 * @namespace DeliveryToken
 */
function DeliveryToken(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/stacks/delivery_tokens";

  if (data.token) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.token));
    this.urlPath = "/stacks/delivery_tokens/".concat(this.uid);
    /**
     * @description The Update DeliveryToken call lets you update the name and description of an existing DeliveryToken.
     * @memberof DeliveryToken
     * @func update
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken('delivery_token_uid').fetch()
     * .then((deliveryToken) => {
     *  deliveryToken.title = 'My New Content Type'
     *  deliveryToken.description = 'Content Type description'
     *  return deliveryToken.update()
     * })
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     */

    this.update = (0, _entity.update)(http, 'token');
    /**
     * @description The Delete DeliveryToken call is used to delete an existing DeliveryToken permanently from your Stack.
     * @memberof DeliveryToken
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken('delivery_token_uid').delete()
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The fetch DeliveryToken call fetches DeliveryToken details.
     * @memberof DeliveryToken
     * @func fetch
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken('delivery_token_uid').fetch()
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'token');
  } else {
    /**
     * @description The Create a DeliveryToken call creates a new deliveryToken in a particular stack of your Contentstack account.
     * @memberof DeliveryToken
     * @func create
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const token = {
     *     name: 'Test',
     *     description: 'This is a demo token.',
     *     scope: [{
     *              module: 'environment',
     *              environments: ['development'],
     *              acl: {
     *                read: true
     *              }
     *            }]
     * }
     *
     * client.stack().deliveryToken().create({ token })
     * .then((deliveryToken) => console.log(deliveryToken))
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The ‘Get all deliveryToken’ request returns comprehensive information about all deliveryToken created in a stack.
     * @memberof DeliveryToken
     * @func query
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().deliveryToken().query({ query: { name: 'token_name' } })).find()
     * .then((contentstackCollection) => console.log(contentstackCollection))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: DeliveryTokenCollection
    });
  }
}

function DeliveryTokenCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.tokens) || [];
  var deliveryTokenCollection = obj.map(function (userdata) {
    return new DeliveryToken(http, {
      token: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return deliveryTokenCollection;
}