import cloneDeep from 'lodash/cloneDeep'
import error from '../../../core/contentstackError'
import { Release } from '..'
/**
 * A ReleaseItem is a set of entries and assets that needs to be deployed (published or unpublished) all at once to a particular environment.
 * @namespace ReleaseItem
 */

export function ReleaseItem (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  if (data.releaseUid) {
    this.urlPath = `releases/${data.releaseUid}/items`
    if (data.item) {
      Object.assign(this, cloneDeep(data.item))
    } else {
      /**
       * @description The Delete method request deletes one or more items (entries and/or assets) from a specific Release.
       * @memberof ContentType
       * @func delete
       * @param {Object} param.items Add multiple items to a Release
       * @param {Object} param.items Add multiple items to a Release
       * @returns {String} Success message.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').release('release_uid').delete()
       * .then((notice) => console.log(notice))
       */
      this.delete = async (param) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.stackHeaders) },
            params: {
              all: true,
              ...cloneDeep(param)
            }
          } || {}

          const response = await http.delete(this.urlPath, headers)
          if (response.data) {
            return response.data.notice
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
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * const item = {
       *        item: {
       *            version: 1,
       *            uid: "entry_or_asset_uid",
       *            content_type_uid: "your_content_type_uid",
       *            action: "publish",
       *            locale: "en-us"
       *        }
       * }
       * client.stack('api_key').release('release_uid').item().create(item)
       * .then((release) => console.log(release))
       *
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * const items = {
       * items: [
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
       * ]}
       * client.stack('api_key').release('release_uid').item().create(items)
       * .then((release) => console.log(release))
       */
      this.create = async (param) => {
        const headers = {
          headers: {
            ...cloneDeep(this.stackHeaders)
          },
          params: {
            ...cloneDeep(param)
          }
        } || {}

        try {
          const response = await http.post(param.item ? `releases/${data.releaseUid}/item` : this.urlPath, data, headers)
          if (response.data) {
            if (response.data) {
              return new Release(http, response.data)
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
       * @returns {Promise<ReleaseItem.ReleaseItem>} Promise for ContentType instance
       * @param {Boolean} param.include_count ‘include_count’ parameter includes the count of total number of items in Release, along with the details of each items.
       * @param {Int} param.limit The ‘limit’ parameter will return a specific number of release items in the output.
       * @param {Int} param.skip The ‘skip’ parameter will skip a specific number of release items in the response.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').release('release_uid').item().fetchAll()
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

          const response = await http.get(this.urlPath, headers)
          if (response.data) {
            console.log(response.data)
          } else {
            throw error(response)
          }
        } catch (err) {
          error(err)
        }
      }
    }
  }
  return this
}

export function ReleaseItemCollection (http, data, releaseUID) {
  const obj = cloneDeep(data.items)
  const contentTypeCollection = obj.map((userdata) => {
    return new ReleaseItem(http, { releaseUID: releaseUID, item: userdata, stackHeaders: data.stackHeaders })
  })
  return contentTypeCollection
}