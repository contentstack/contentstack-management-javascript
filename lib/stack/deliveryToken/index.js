import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch } from '../../entity'
import ContentstackCollection from '../../contentstackCollection'
import error from '../../core/contentstackError'

export function DeliveryToken (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/delivery_tokens`
  if (data.token) {
    Object.assign(this, cloneDeep(data.token))
    this.urlPath = `/delivery_tokens/${this.uid}`
    /**
     * @description The Update DeliveryToken call lets you update the name and description of an existing DeliveryToken.
     * @memberof DeliveryToken
     * @func update
     * @returns {Promise<DeliveryToken.DeliveryToken>} Promise for DeliveryToken instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken('content_type_uid').fetch()
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
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken('delivery_token_uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

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
    this.fetch = fetch(http, 'token')
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
    this.create = create({ http: http })

    /**
     * @description The ‘Get all deliveryToken’ request returns comprehensive information about all deliveryToken created in a stack.
     * @memberof DeliveryToken
     * @func findAll
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().deliveryToken().findAll()
     * .then((contentstackCollection) => console.log(contentstackCollection))
     */
    this.fetchAll = async () => {
      const headers = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      } || {}
      try {
        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return new ContentstackCollection(response, http, this.stackHeaders, DeliveryTokenCollection)
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
}

export function DeliveryTokenCollection (http, data) {
  const obj = cloneDeep(data.tokens)
  const deliveryTokenCollection = obj.map((userdata) => {
    return new DeliveryToken(http, { token: userdata, stackHeaders: data.stackHeaders })
  })
  return deliveryTokenCollection
}
