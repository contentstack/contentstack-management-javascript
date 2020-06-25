import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity, fetch, query, parseData, upload, publish } from '../../entity'
import { Folder } from './folders'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'

/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */

export function Asset (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/assets`

  if (data.asset) {
    Object.assign(this, cloneDeep(data.asset))
    this.urlPath = `assets/${this.uid}`

    /**
     * @description The Update Asset call lets you update the name and description of an existing Asset.
     * @memberof Asset
     * @func update
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').fetch()
     * .then((asset) => {
     *  asset.title = 'My New asset'
     *  asset.description = 'Asset description'
     *  return asset.update()
     * })
     * .then((asset) => console.log(asset))
     *
     */
    this.update = update(http, 'asset')

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
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').asset('uid').fetch()
     * .then((asset) => console.log(asset))
     *
     */
    this.fetch = fetch(http, 'asset')

    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Asset.Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     * }
     *
     * client.stack('api_key').asset('uid').replace(asset)
     * .then((asset) => console.log(asset))
     *
     */
    this.replace = async function (data, params) {
      try {
        const response = await upload({ http: http, urlPath: this.urlPath, stackHeaders: this.stackHeaders, formData: createFormData(data), params: params, method: 'PUT' })
        if (response.data) {
          return new this.constructor(http, parseData(response, this.stackHeaders))
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    this.publish = publish(http, 'asset')
  } else {
    /**
   *  @description The Folder allows to fetch and create folders in assets.
   * @memberof Folder
   * @func create
   * @returns {Promise<Folder.Folder>} Promise for Entry instance
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
    */
    this.folder = () => {
      const data = { stackHeaders: this.stackHeaders }
      return new Folder(http, data)
    }

    /**
     * @description The Create an asset call creates a new asset.
     * @memberof Asset
     * @func create
     * @returns {Promise<Asset.Asset>} Promise for Asest instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     *  title: 'Title',
     *  description: 'Desc'
     * }
     *
     * client.stack('api_key').asset().create(asset)
     * .then((asest) => console.log(asest))
     */
    this.create = async function (data, params) {
      try {
        const response = await upload({ http: http, urlPath: this.urlPath, stackHeaders: this.stackHeaders, formData: createFormData(data), params: params })
        if (response.data) {
          return new this.constructor(http, parseData(response, this.stackHeaders))
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
    /**
   * @description The Query on Asset will allow to fetch details of all or specific Asset.
   * @memberof Asset
   * @param {Object} params - URI parameters
   * @prop {Object} params.query - Query parameter to search asset.
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
  const obj = cloneDeep(data.assets)
  const assetCollection = obj.map((userdata) => {
    return new Asset(http, { asset: userdata, stackHeaders: data.stackHeaders })
  })
  return assetCollection
}

function createFormData (data) {
  const formData = new FormData()
  if (typeof data['parent_uid'] === 'string') {
    formData.append('asset[parent_uid]', data['parent_uid'])
  }

  if (typeof data.description === 'string') {
    formData.append('asset[description]', data.description)
  }

  if (data.tags instanceof Array) {
    formData.append('asset[tags]', data.tags.join(','))
  } else if (typeof data.tags === 'string') {
    formData.append('asset[tags]', data.tags)
  }

  if (typeof data.title === 'string') {
    formData.append('asset[title]', data.title)
  }

  const uploadStream = createReadStream(data.upload)
  formData.append('asset[upload]', uploadStream)

  return formData
}
