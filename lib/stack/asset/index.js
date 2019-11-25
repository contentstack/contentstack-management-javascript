import cloneDeep from 'lodash/cloneDeep'
import { deleteEntity, fetch, query } from '../../entity'

/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */

export function Asset (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/assets`

  if (data.asset) {
    Object.assign(this, cloneDeep(data.entry))
    this.urlPath = `assets/${this.uid}`

    /**
     * @description The Delete asset call will delete an existing asset from the stack.
     * @memberof Asset
     * @func delete
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').fetch()
     * .then((entry) => console.log(entry))
     *
     */
    this.fetch = fetch(http, 'assets')
  } else {
    /**
   * @description The Query on Asset will allow to fetch details of all or specific Asset.
   * @memberof Asset
   * @func query
   * @returns {Array<Asset>} Array of Asset.
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().asset().query({name: 'My Asset'})
   * .then((asset) => console.log(asset))
   */
    this.query = query({ http: http, wrapperCollection: AssetCollection })
  }
  return this
}

export function AssetCollection (http, data) {
  const obj = cloneDeep(data.content_types)
  const assetCollection = obj.map((userdata) => {
    return new Asset(http, { entry: userdata, content_type: 'uid', stackHeaders: data.stackHeaders })
  })
  return assetCollection
}
