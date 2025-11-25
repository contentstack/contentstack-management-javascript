import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query, upload, parseData } from '../../entity'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'

/**
 * Extensions let you create custom fields and custom widgets that lets you customize Contentstack's default UI and behavior. Read more about <a href='https://www.contentstack.com/docs/developers/about-experience-extensions/'>Extensions</a>.
 * @namespace Extension
 *  */

export function Extension (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/extensions`
  if (data.extension) {
    Object.assign(this, cloneDeep(data.extension))
    this.urlPath = `/extensions/${this.uid}`
    /**
     * @description The Update Extension call lets you update an existing Extension.
     * @memberof Extension
     * @func update
     * @returns {Promise<Extension.Extension>} Promise for Extension instance.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).extension('extension_uid').fetch()
     * .then((extension) => {
     *  extension.title = 'My Extension Type'
     *  return extension.update()
     * })
     * .then((extension) => console.log(extension))
     *
     */
    this.update = update(http, 'extension')

    /**
     * @description The Delete Extension call is used to delete an existing Extension permanently from your Stack.
     * @memberof Extension
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).extension('extension_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Extension call fetches Extension details.
     * @memberof Extension
     * @func fetch
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).extension('extension_uid').fetch()
     * .then((extension) => console.log(extension))
     *
     */
    this.fetch = fetch(http, 'extension')
  } else {
    /**
     * @description The Upload is used to upload a new custom widget, custom field, dashboard Widget to a stack.
     * @memberof Extension
     * @func upload
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const extension = {
     *  upload: 'path/to/file',
     *  tags: [
     *    'tag1',
     *    'tag2'
     *  ],
     *  data_type: 'text',
     *  multiple: false,
     *  config: {},
     *  type: 'Type of extension you want to create widget/dashboard/field'
     * }
     *
     * client.stack({ api_key: 'api_key'}).extension().upload(extension)
     * .then((extension) => console.log(extension))
     */
    this.upload = async function (data, params) {
      try {
        const response = await upload({ http: http, urlPath: this.urlPath, stackHeaders: this.stackHeaders, formData: createExtensionFormData(data), params: params })
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
     * @description The Create a extension call creates a new extension in a particular stack of your Contentstack account.
     * @memberof Extension
     * @func create
     * @returns {Promise<Extension.Extension>} Promise for Extension instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const extension = {
     *  tags: [
     *    'tag1',
     *    'tag2'
     *  ],
     *  data_type: 'text',
     *  title: 'Old Extension',
     *  src: "Enter either the source code (use 'srcdoc') or the external hosting link of the extension depending on the hosting method you selected.",
     *  multiple: false,
     *  config: {},
     *  type: 'field'
     * }
     *
     * client.stack().extension().create({ extension })
     * .then((extension) => console.log(extension))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on Extension will allow to fetch details of all or specific Extensions.
     * @memberof Extension
     * @func query
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results for extensions.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().extension().query({ query: { type: "field" } }).find()
     * .then((extensions) => console.log(extensions))
     */
    this.query = query({ http: http, wrapperCollection: ExtensionCollection })
  }
}

export function ExtensionCollection (http, data) {
  const obj = cloneDeep(data.extensions) || []
  const extensionCollection = obj.map((extensiondata) => {
    return new Extension(http, { extension: extensiondata, stackHeaders: data.stackHeaders })
  })
  return extensionCollection
}

export function createExtensionFormData (data) {
  return () => {
    const formData = new FormData()

    if (typeof data.title === 'string') {
      formData.append('extension[title]', data.title)
    }
    if (typeof data.scope === 'object') {
      formData.append('extension[scope]', `${data.scope}`)
    }
    if (typeof data['data_type'] === 'string') {
      formData.append('extension[data_type]', data['data_type'])
    }
    if (typeof data.type === 'string') {
      formData.append('extension[type]', data.type)
    }
    if (data.tags instanceof Array) {
      formData.append('extension[tags]', data.tags.join(','))
    } else if (typeof data.tags === 'string') {
      formData.append('extension[tags]', data.tags)
    }
    if (typeof data.multiple === 'boolean') {
      formData.append('extension[multiple]', `${data.multiple}`)
    }
    if (typeof data.enable === 'boolean') {
      formData.append('extension[enable]', `${data.enable}`)
    }
    const uploadStream = createReadStream(data.upload)
    formData.append('extension[upload]', uploadStream)
    return formData
  }
}
