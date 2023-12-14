import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'

/**
 * Management tokens provide read-only access to the associated environments. Read more about <a href='https://www.contentstack.com/docs/developers/create-tokens/about-management-tokens'>ManagementToken</a>.
 * @namespace ManagementToken
 */
export function ManagementToken (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/management_tokens`
  if (data.token) {
    Object.assign(this, cloneDeep(data.token))
    this.urlPath = `/stacks/management_tokens/${this.uid}`
    /**
     * @description The Update ManagementToken call lets you update the name and description of an existing ManagementToken.
     * @memberof ManagementToken
     * @func update
     * @returns {Promise<ManagementToken.ManagementToken>} Promise for ManagementToken instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).managementToken('management_token_uid').fetch()
     * .then((managementToken) => {
     *  managementToken.title = 'My New management token'
     *  managementToken.description = 'management token description'
     *  return managementToken.update()
     * })
     * .then((managementToken) => console.log(managementToken))
     *
     */
    this.update = update(http, 'token')

    /**
     * @description The Delete ManagementToken call is used to delete an existing ManagementToken permanently from your Stack.
     * @memberof ManagementToken
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).managementToken('management_token_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch ManagementToken call fetches ManagementToken details.
     * @memberof ManagementToken
     * @func fetch
     * @returns {Promise<ManagementToken.ManagementToken>} Promise for ManagementToken instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).managementToken('management_token_uid').fetch()
     * .then((managementToken) => console.log(managementToken))
     *
     */
    this.fetch = fetch(http, 'token')
  } else {
    /**
     * @description The Create a ManagementToken call creates a new ManagementToken in a particular stack of your Contentstack account.
     * @memberof ManagementToken
     * @func create
     * @returns {Promise<ManagementToken.ManagementToken>} Promise for ManagementToken instance
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
     * client.stack().managementToken().create({ token })
     * .then((managementToken) => console.log(managementToken))
     */
    this.create = create({ http: http })

    /**
     * @description The ‘Get all managementToken’ request returns comprehensive information about all managementToken created in a stack.
     * @memberof ManagementToken
     * @func query
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().managementToken().query({ query: { name: 'token_name' } })).find()
     * .then((contentstackCollection) => console.log(contentstackCollection))
     */
    this.query = query({ http: http, wrapperCollection: ManagementTokenCollection })
  }
}

export function ManagementTokenCollection (http, data) {
  const obj = cloneDeep(data.tokens) || []
  const managementTokenCollection = obj.map((userdata) => {
    return new ManagementToken(http, { token: userdata, stackHeaders: data.stackHeaders })
  })
  return managementTokenCollection
}
