import cloneDeep from 'lodash/cloneDeep'
import { create, deleteEntity } from '../../../entity'

/**
 * Preview tokens provide read-only access to the associated environments. Read more about <a href='https://www.contentstack.com/docs/developers/create-tokens/about-preview-tokens'>PreviewToken</a>.
 * @namespace PreviewToken
 */
export function PreviewToken (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  if (data.token) {
    Object.assign(this, cloneDeep(data.token))
    this.urlPath = `/stacks/delivery_tokens/${this.uid}/preview_token`

    /**
     * @description The Delete PreviewToken call is used to delete an existing PreviewToken permanently from your Stack.
     * @memberof PreviewToken
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken('delivery_token_uid').previewToken().delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The Create a PreviewToken call creates a new previewToken in a particular stack of your Contentstack account.
     * @memberof PreviewToken
     * @func create
     * @returns {Promise<PreviewToken.PreviewToken>} Promise for PreviewToken instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.stack().deliveryToken('delivery_token_uid').previewToken().create()
     * .then((previewToken) => console.log(previewToken))
     */
    this.create = create({ http: http })
  }
}

export function PreviewTokenCollection (http, data) {
  const obj = cloneDeep(data.tokens) || []
  const previewTokenCollection = obj.map((userdata) => {
    return new PreviewToken(http, { token: userdata, stackHeaders: data.stackHeaders })
  })
  return previewTokenCollection
}
