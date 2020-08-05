import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, query } from '../../entity'; // import ContentstackCollection from '../../contentstackCollection'
// import error from '../../core/contentstackError'

export function DeliveryToken(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/stacks/delivery_tokens";

  if (data.token) {
    Object.assign(this, cloneDeep(data.token));
    this.urlPath = "/stacks/delivery_tokens/".concat(this.uid);
    /**
     * @description The Update DeliveryToken call lets you update the name and description of an existing DeliveryToken.
     * @memberof DeliveryToken
     * @func update
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken('delivery_token_uid').fetch()
     * .then((deliveryToken) => {
     *  deliveryToken.title = 'My New Content Type'
     *  deliveryToken.description = 'Content Type description'
     *  return deliveryToken.update()
     * })
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     */

    this.update = update(http, 'token');
    /**
     * @description The Delete DeliveryToken call is used to delete an existing DeliveryToken permanently from your Stack.
     * @memberof DeliveryToken
     * @func delete
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken('delivery_token_uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch DeliveryToken call fetches DeliveryToken details.
     * @memberof DeliveryToken
     * @func fetch
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken('delivery_token_uid').fetch()
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     */

    this.fetch = fetch(http, 'token');
  } else {
    /**
     * @description The Create a DeliveryToken call creates a new deliveryToken in a particular stack of your Contentstack account.
     * @memberof DeliveryToken
     * @func create
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().deliveryToken().create({name: 'My New deliveryToken'})
     * .then((deliveryToken) => console.log(deliveryToken))
     */
    this.create = create({
      http: http
    });
    /**
     * @description The ‘Get all deliveryToken’ request returns comprehensive information about all deliveryToken created in a stack.
     * @memberof DeliveryToken
     * @func query
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().deliveryToken().query({ query: { name: 'token_name' } })).find()
     * .then((contentstackCollection) => console.log(contentstackCollection))
     */

    this.query = query({
      http: http,
      wrapperCollection: DeliveryTokenCollection
    });
  }
}
export function DeliveryTokenCollection(http, data) {
  var obj = cloneDeep(data.tokens);
  var deliveryTokenCollection = obj.map(function (userdata) {
    return new DeliveryToken(http, {
      token: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return deliveryTokenCollection;
}