import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetch,
  query
} from '../../entity'
import { Entry } from './entry/index'

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
     * @memberof ContentType
     * @func update
     * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack('api_key').contentType('content_type_uid').fetch()
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
     * @description The Delete ContentType call is used to delete an existing ContentType permanently from your Stack.
     * @memberof ContentType
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack('api_key').contentType('content_type_uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch ContentType call fetches ContentType details.
     * @memberof ContentType
     * @func fetch
     * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
     * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack('api_key').contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     *
     */
    this.fetch = fetch(http, 'content_type')

    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContenType} Instace of ContentType.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack('api_key').contentType('content_type_uid').entry('entry_uid').fetch()
     * .then((contentType) => console.log(contentType))
     */
    this.entry = (uid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      data.content_type_uid = this.uid
      if (uid) {
        data.entry = { uid: uid }
      }
      return new Entry(http, data)
    }
  } else {
  /**
   * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
   * @memberof ContentType
   * @func create
   * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
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
   * @description The Query on Content Type will allow to fetch details of all or specific Content Type
   * @memberof ContentType
   * @func query
   * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
   * @returns {Array<ContentType>} Array of ContentTyoe.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack('api_key').contentType().query({ query: { name: 'Content Type Name' } }).find()
   * .then((contentTypes) => console.log(contentTypes))
   */
    this.query = query({ http: http, wrapperCollection: ContentTypeCollection })
  }
  return this
}

export function ContentTypeCollection (http, data) {
  const obj = cloneDeep(data.content_types)
  const contentTypeCollection = obj.map((userdata) => {
    return new ContentType(http, { content_type: userdata, stackHeaders: data.stackHeaders })
  })
  return contentTypeCollection
}
