import cloneDeep from 'lodash/cloneDeep'
import {
  update,
  deleteEntity,
  fetch,
  query,
  parseData,
  upload,
  publish,
  unpublish } from '../../entity'
import { Folder } from './folders'
import error from '../../core/contentstackError'
import { ERROR_MESSAGES } from '../../core/errorMessages'
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
    this.urlPath = `/assets/${this.uid}`

    /**
     * @description The Update Asset call lets you update the name and description of an existing Asset.
     * @memberof Asset
     * @func update
     * @returns {Promise<Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').fetch()
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
     * @description The Delete asset call deletes an existing asset from the stack.
     * @memberof Asset
     * @func delete
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Asset
     * @func fetch
     * @returns {Promise<Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').fetch()
     * .then((asset) => console.log(asset))
     *
     */
    this.fetch = fetch(http, 'asset')

    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Asset
     * @func replace
     * @async
     * @returns {Promise<Asset>} Promise for Asset instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').replace(asset)
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
    /**
     * @description The Publish an asset call is used to publish a specific version of an asset on the desired environment either immediately or at a later date/time.
     * @memberof Asset
     * @func publish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').publish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */
    this.publish = publish(http, 'asset')

    /**
     * @description The Unpublish an asset call is used to unpublish a specific version of an asset from the desired environment either immediately or at a later date/time.
     * @memberof Asset
     * @func unpublish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset('uid').unpublish({ publishDetails: asset, version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */
    this.unpublish = unpublish(http, 'asset')

    /**
     * @description The References function will get all the references for the asset.
     * @memberof Asset
     * @func getReferences
     * @async
     * @returns {Promise<Object>} Promise for references data.
     * @param {Object} param - Query parameters
     * @example
     * client.stack({ api_key: 'api_key'}).asset('uid').getReferences({ include_publish_details: true })
     * .then((references) => console.log(references))
     */
    this.getReferences = async function (param = {}) {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        const response = await http.get(this.urlPath + '/references', headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  } else {
    /**
     *  @description The Folder method allows you to fetch and create folders in assets.
     * @memberof Asset
     * @func folder
     * @returns {Folder} Instance of Folder.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const asset = {name: 'My New contentType'}
     * client.stack({ api_key: 'api_key'}).asset('uid').folder().create({ asset })
     * .then((folder) => console.log(folder))
    */
    this.folder = (folderUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (folderUid) {
        data.asset = { uid: folderUid }
      }
      return new Folder(http, data)
    }

    /**
     * @description The Create an asset call creates a new asset.
     * @memberof Asset
     * @func create
     * @async
     * @returns {Promise<Asset>} Promise for Asset instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const asset = {
     *  upload: 'path/to/file.png',
     *  title: 'Title',
     *  description: 'Desc'
     * }
     *
     * client.stack({ api_key: 'api_key'}).asset().create(asset)
     * .then((asset) => console.log(asset))
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
     * @description The Query on Asset will allow you to fetch details of all or specific Assets.
     * @memberof Asset
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @func query
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().query({ query: { filename: 'Asset Name' } }).find()
     * .then((asset) => console.log(asset))
     */
    this.query = query({ http: http, wrapperCollection: AssetCollection })
  }
  /**
   * @description The Download function will get downloadable file in specified format.
   * @memberof Asset
   * @func download
   * @async
   * @returns {Promise<Object>} Promise for download response.
   * @param {*} param.url The url for the asset to download
   * @param {*} param.responseType Optional parameter to specify the response type.
   * @example
   *
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).asset('uid').fetch()
   * .then((asset) => asset.download({responseType: 'blob'}))
   * .then((response) => // Write response data to destination file. )
   * @example
   *
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).asset().download({url: 'asset_url_to_download', responseType: 'blob'})
   * .then((response) => // Write response data to destination file. )
   */
  this.download = async function ({ url, responseType, params }) {
    try {
      const headers = {
        headers: {
          ...params,
          ...cloneDeep(this.stackHeaders)
        },
        responseType
      } || { responseType }
      const requestUrl = url || this.url
      if (!requestUrl || requestUrl === undefined) {
        throw new Error(ERROR_MESSAGES.ASSET_URL_REQUIRED)
      }
      return http.get(requestUrl, headers)
    } catch (err) {
      throw error(err)
    }
  }
  return this
}

export function AssetCollection (http, data) {
  const obj = cloneDeep(data.assets) || []
  const assetCollection = obj.map((userdata) => {
    return new Asset(http, { asset: userdata, stackHeaders: data.stackHeaders })
  })
  return assetCollection
}

export function createFormData (data) {
  return () => {
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
    // Handle Buffer Upload
    if (Buffer.isBuffer(data.upload)) {
      formData.append('asset[upload]', data.upload, {
        filename: data.filename || 'uploaded_file',
        contentType: data.content_type || 'application/octet-stream'
      })
    } else if (typeof data.upload === 'string') { // Handle File Path Upload
      const uploadStream = createReadStream(data.upload)
      if (typeof data.content_type === 'string') {
        formData.append('asset[upload]', uploadStream, { contentType: data.content_type })
      } else {
        formData.append('asset[upload]', uploadStream)
      }
    } else {
      throw new Error(ERROR_MESSAGES.INVALID_UPLOAD_FORMAT)
    }
    return formData
  }
}
