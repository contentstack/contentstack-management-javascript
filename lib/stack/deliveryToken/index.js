import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'
import { PreviewToken } from './previewToken'

/**
 * Delivery tokens provide read-only access to the associated environments. Read more about <a href='https://www.contentstack.com/docs/developers/create-tokens/about-delivery-tokens'>DeliveryToken</a>.
 * @namespace DeliveryToken
 */
export function DeliveryToken (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/delivery_tokens`
  if (data.token) {
    Object.assign(this, cloneDeep(data.token))
    this.urlPath = `/stacks/delivery_tokens/${this.uid}`
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
    this.update = update(http, 'token')

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
    this.delete = deleteEntity(http)

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
    this.fetch = fetch(http, 'token')

    /**
     * @description The Create a PreviewToken call creates a new previewToken in a particular stack of your Contentstack account.
     * @memberof DeliveryToken
     * @func previewToken
     * @returns {PreviewToken} Instance of PreviewToken.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const deliveryToken = client.stack({ api_key: 'api_key'}).deliveryToken('delivery_token_uid')
     * const previewToken = deliveryToken.previewToken()
     * console.log(previewToken)
     */
    this.previewToken = () => {
      return new PreviewToken(http, { stackHeaders: this.stackHeaders, token: { uid: this.uid } })
    }

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
    this.create = create({ http: http })

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
    this.query = query({ http: http, wrapperCollection: DeliveryTokenCollection })
  }
}

export function DeliveryTokenCollection (http, data) {
  const obj = cloneDeep(data.tokens) || []
  const deliveryTokenCollection = obj.map((userdata) => {
    return new DeliveryToken(http, { token: userdata, stackHeaders: data.stackHeaders })
  })
  return deliveryTokenCollection
}
