import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetch,
  query,
  upload,
  parseData
} from '../../entity'
import { Entry } from './entry/index'
import error from '../../core/contentstackError'

import FormData from 'form-data'
import { createReadStream } from 'fs'
/**
 * Content type defines the structure or schema of a page or a section of your web or mobile property. To create content for your application, you are required to first create a content type, and then create entries using the content type. Read more about <a href='https://www.contentstack.com/docs/guide/content-types'>Content Types</a>.
 * @namespace ContentType
 */

export function ContentType (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/content_types`

  if (data.content_type) {
    Object.assign(this, cloneDeep(data.content_type))
    this.urlPath = `/content_types/${this.uid}`
    /**
     * @description The Update ContentType call lets you update the name and description of an existing ContentType.
     * You can also update the JSON schema of a content type, including fields and different features associated with the content type.
     * @memberof ContentType
     * @func update
     * @returns {Promise<ContentType>} Promise for ContentType instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').fetch()
     * .then((contentType) => {
     *  contentType.title = 'My New Content Type'
     *  contentType.description = 'Content Type description'
     *  return contentType.update()
     * })
     * .then((contentType) => console.log(contentType))
     *
     */
    this.update = update(http, 'content_type')

    /**
     * @description The Update ContentType call lets you update the name and description of an existing ContentType.
     * You can also update the JSON schema of a content type, including fields and different features associated with the content type.
     * @memberof ContentType
     * @func updateCT
     * @async
     * @param {Object} config - Content type configuration object containing the content_type object with updated fields.
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const data = {
     *       "content_type": {
     *         "title": "Page",
     *         "uid": "page",
     *         "schema": [{
     *             "display_name": "Title",
     *             "uid": "title",
     *             "data_type": "text",
     *             "field_metadata": {
     *               "_default": true
     *             },
     *             "unique": false,
     *             "mandatory": true,
     *             "multiple": false
     *           }
     *         ],
     *         "options": {
     *           "title": "title",
     *           "publishable": true,
     *           "is_page": true,
     *           "singleton": false,
     *           "sub_title": [
     *             "url"
     *           ],
     *           "url_pattern": "/:title",
     *           "url_prefix": "/"
     *         }
     *       }
     *     }
     * }
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').updateCT(data)
     * .then((response) => {
     *   console.log(response)
     * })
     */
    this.updateCT = async (config) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) }
        }
        const response = await http.put(`${this.urlPath}`, config, headers)
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
     * @description The Delete ContentType call is used to delete an existing ContentType permanently from your Stack.
     * @memberof ContentType
     * @func delete
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch ContentType call fetches ContentType details.
     * @memberof ContentType
     * @func fetch
     * @returns {Promise<ContentType>} Promise for ContentType instance
     * @param {Object=} param - Query parameters
     * @prop {Int} param.version - Enter the version number of the content type you want to retrieve.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     *
     */
    this.fetch = fetch(http, 'content_type')

    /**
     * @description Entry defines the actual piece of content created using one of the defined content types.
     * @param {String=} uid - The UID of the Entry you want to get details.
     * @param {Object} options - Optional configuration object.
     * @prop {string} options.api_version - API version to use for the request.
     * @returns {Entry} Instance of Entry.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').fetch()
     * .then((entry) => console.log(entry))
     */
    this.entry = (uid = null, options = {}) => {
      const data = { stackHeaders: this.stackHeaders }
      data.content_type_uid = this.uid
      if (uid) {
        data.entry = { uid: uid }
      }
      options = options || {} // Ensure `options` is always an object
      if (options && typeof options === 'object' && options.api_version) {
        data.api_version = options.api_version
      }
      return new Entry(http, data)
    }

    /**
     * @description References call will fetch all the content types in which a specified content type is referenced.
     * @async
     * @returns {Promise<Object>} Promise for ContentType references
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').references()
     * .then((contentType) => console.log(contentType))
     */
    this.references = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) }
        }

        const response = await http.get(`/content_types/${this.uid}/references`, headers)
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
    * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
    * @memberof ContentType
    * @func generateUid
    * @param {*} name Name for content type you want to create.
    * @example
    * import * as contentstack from '@contentstack/management'
    * const client = contentstack.client()
    * const contentType = client.stack().contentType()
    * const contentTypeName = 'My New contentType'
    * const content_type = {
    *   name: name,
    *   uid: contentType.generateUid(name)
    * }
    * contentType
    * .create({ content_type })
    * .then((contenttype) => console.log(contenttype))
    *
    */
    this.generateUid = (name) => {
      if (!name) {
        throw new TypeError('Expected parameter name')
      }
      return name.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
    }

    /**
     * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
     * @memberof ContentType
     * @func create
     * @returns {Promise<ContentType>} Promise for ContentType instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const content_type = {name: 'My New contentType'}
     * client.stack().contentType().create({ content_type })
     * .then((contentType) => console.log(contentType))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on Content Type will allow you to fetch details of all or specific Content Types.
     * @memberof ContentType
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType().query({ query: { name: 'Content Type Name' } }).find()
     * .then((contentTypes) => console.log(contentTypes))
     */
    this.query = query({ http: http, wrapperCollection: ContentTypeCollection })

    /**
     * @description The Import a content type call imports a content type into a stack.
     * @memberof ContentType
     * @func import
     * @async
     * @param {Object} data - Import data object.
     * @prop {string} data.content_type - Path to content type file.
     * @param {Object=} params - Optional request parameters.
     * @returns {Promise<ContentType>} Promise for ContentType instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const data = {
     *  content_type: 'path/to/file.json',
     * }
     * client.stack({ api_key: 'api_key'}).contentType().import(data, { overwrite: true })
     * .then((contentType) => console.log(contentType))
     *
     */
    this.import = async function (data, params = {}) {
      try {
        const response = await upload({
          http: http,
          urlPath: `${this.urlPath}/import`,
          stackHeaders: this.stackHeaders,
          formData: createFormData(data),
          params: params
        })
        if (response.data) {
          return new this.constructor(http, parseData(response, this.stackHeaders))
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
  return this
}

export function ContentTypeCollection (http, data) {
  const obj = cloneDeep(data.content_types) || []
  const contentTypeCollection = obj.map((userdata) => {
    return new ContentType(http, { content_type: userdata, stackHeaders: data.stackHeaders })
  })
  return contentTypeCollection
}

export function createFormData (data) {
  return () => {
    const formData = new FormData()
    const uploadStream = createReadStream(data.content_type)
    formData.append('content_type', uploadStream)
    return formData
  }
}
