import cloneDeep from 'lodash/cloneDeep'
import error from '../../../core/contentstackError'
import ContentstackCollection from '../../../contentstackCollection'
import { Release } from '..'
/**
 * A ReleaseItem is a set of entries and assets that needs to be deployed (published or unpublished) all at once to a particular environment.
 * @namespace ReleaseItem
 */

export function ReleaseItem (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  if (data.item) {
    Object.assign(this, cloneDeep(data.item))
  }
  if (data.releaseUid) {
    this.urlPath = `releases/${data.releaseUid}/items`
    /**
     * @description The Delete method request deletes one or more items (entries and/or assets) from a specific Release.
     * @memberof ReleaseItem
     * @func delete
     * @param {Object} param.items Add multiple items to a Release
     * @param {Object} param.items Add multiple items to a Release
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * // To delete all the items from release
     * client.stack({ api_key: 'api_key'}).release('release_uid').delete()
     * .then((response) => console.log(response.notice))
     *      
     * @example
     * // Delete specific items from delete
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client() 
     * 
     * const items =  [
     *     {
     *        uid: "entry_or_asset_uid1",
     *        version: 1,
     *        locale: "en-us",
     *        content_type_uid: "demo1",
     *        action: "publish"
     *     },
     *     {
     *        uid: "entry_or_asset_uid2",
     *        version: 4,
     *        locale: "fr-fr",
     *        content_type_uid: "demo2",
     *        action: "publish"
     *      }
     * ]
     * client.stack({ api_key: 'api_key'}).release('release_uid').delete({items})
     * .then((response) => console.log(response.notice))
     */
    this.delete = async (params) => {
      let param = {}
      if (params.items === undefined && params.item === undefined) {
        param = {all: true}
        params.items = []
      }
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          data: {
            ...cloneDeep(params)
          },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        
        if (params.release_version) {
          headers.headers['release_version'] = params.release_version;
        }
        
        if (params.item) {
          this.urlPath = `releases/${data.releaseUid}/item`
          headers.data['item'] = params.item
        } else
        headers.data['items'] = params.items

        const response = await http.delete(this.urlPath, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The Create method allows you to add an one or more items items (entry or asset) to a Release.
     * @memberof ReleaseItem
     * @func create
     * @param {Object} param.item Add a single item to a Release
     * @param {Object} param.items Add multiple items to a Release
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const item = {
     *            version: 1,
     *            uid: "entry_or_asset_uid",
     *            content_type_uid: "your_content_type_uid",
     *            action: "publish",
     *            locale: "en-us"
     * }
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().create({ item })
     * .then((release) => console.log(release))
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const items =  [
     *     {
     *        uid: "entry_or_asset_uid1",
     *        version: 1,
     *        locale: "en-us",
     *        content_type_uid: "demo1",
     *        action: "publish"
     *     },
     *     {
     *        uid: "entry_or_asset_uid2",
     *        version: 4,
     *        locale: "fr-fr",
     *        content_type_uid: "demo2",
     *        action: "publish"
     *      }
     * ]
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().create({ items })
     * .then((release) => console.log(release))
     */
    this.create = async (param) => {
      const headers = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      } || {}
      
      if (param.release_version) { 
        headers.headers['release_version'] = param.release_version;
      }
      if (param.item) {
        this.urlPath = `releases/${data.releaseUid}/item`
        param['item'] = param.item
      } else
        param['items'] = param.items

      try {
        const response = await http.post(this.urlPath, param, headers)
        if (response.data) {
          if (response.data) {
            return new Release(http, { ...response.data, stackHeaders: data.stackHeaders })
          }
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
    /**
     * @description The Get all items in a Release request retrieves a list of all items (entries and assets) that are part of a specific Release.
     * @memberof ReleaseItem
     * @func findAll
     * @returns {Promise<ContentstackCollection.ContentstackCollection>} Promise for ContentType instance
     * @param {Boolean} param.include_count ‘include_count’ parameter includes the count of total number of items in Release, along with the details of each items.
     * @param {Int} param.limit The ‘limit’ parameter will return a specific number of release items in the output.
     * @param {Int} param.skip The ‘skip’ parameter will skip a specific number of release items in the response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().fetchAll()
     * .then((items) => console.log(items))
     */
    this.findAll = async (param = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        if (param.release_version) {
          headers.headers['release_version'] = param.release_version;
          delete headers.params.release_version;
        }
        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return new ContentstackCollection(response, http, this.stackHeaders, ReleaseItemCollection)
        } else {
          throw error(response)
        }
      } catch (err) {
        error(err) 
      }
    }

    /**
     * The move request allows you to move multiple items within a release.
     * @memberof ReleaseItem
     * @func move
     * @returns {Promise<Object>} Response Object.
     * @param {Object} params.param - The data containing the items to be moved within the release.
     * @param {String} [params.release_version] - The release version.
     * @example
     * const moveData = {
     *   items: [
     *     {
     *       uid: '{{entry_uid}}',
     *       content_type: '{{content_type_uid}}'
     *     }
     *   ]
     * }
     * client.stack({ api_key: 'api_key'}).release('release_uid').item().move({ param: moveData, release_version: '1.0' })
     * .then((response) => { console.log(response) })
     */
    this.move = async ({ param, release_version = '' }) => {
      const headers = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      } || {}
      if (release_version) {
        headers.headers['release_version'] = release_version;
      }
      try {
        const response = await http.put(`${this.urlPath}/move`, param, headers)
        if (response.data) {
          return response.data
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
  return this
}

export function ReleaseItemCollection (http, data, releaseUid) {
  const obj = cloneDeep(data.items) || []
  const contentTypeCollection = obj.map((userdata) => {
    return new ReleaseItem(http, { releaseUid, item: userdata, stackHeaders: data.stackHeaders })
  })
  return contentTypeCollection
}
