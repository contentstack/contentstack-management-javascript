import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity, fetch } from '../../entity'

/**
 * Content type defines the structure or schema of a page or a section of your web or mobile property. To create content for your application, you are required to first create a content type, and then create entries using the content type. Read more about <a href='https://www.contentstack.com/docs/guide/content-types'>Content Types</a>.
 * @namespace ContentType
 */

export function ContentType (http, data) {
  const contentType = cloneDeep(data.content_type)
  const urlPath = `/content_types/${contentType.uid}`
  const stackHeaders = { headers: data.stackHeaders }

  /**
   * @description The Update ContentType call lets you update the name and description of an existing ContentType.
   * @memberof ContentType
   * @func update
   * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').contentType('content_type_uid').fetch()
   * .then((contentType) => {
   *  contentType.title = 'My New Content Type'
   *  contentType.description = 'Content Type description'
   *  return contentType.update
   * })
   * .then((contentType) => console.log(contentType))
   *
   */
  contentType.update = function () {
    const data = cloneDeep(this)
    const updateData = {
      content_type: data
    }
    return update(http, urlPath, updateData, stackHeaders, ContentType)
  }

  /**
   * @description The Delete ContentType call is used to delete an existing ContentType permanently from your Stack.
   * @memberof ContentType
   * @func delete
   * @returns {String} Success message.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').contentType('content_type_uid').delete()
   * .then((notice) => console.log(notice))
   */
  contentType.delete = function () {
    return deleteEntity(urlPath, stackHeaders)
  }

  /**
   * @description The fetch ContentType call fetches ContentType details.
   * @memberof ContentType
   * @func fetch
   * @returns {Promise<ContentType.ContentType>} Promise for ContentType instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').contentType('content_type_uid').fetch()
   * .then((contentType) => console.log(contentType))
   *
   */
  contentType.fetch = function () {
    return fetch(http, urlPath, stackHeaders, ContentType)
  }

  return contentType
}

export function ContentTypeCollection (http, data) {
  const obj = cloneDeep(data.content_types)
  const contentTypeCollection = obj.map((userdata) => {
    return ContentType(http, { content_type: userdata, stackHeaders: data.stackHeaders })
  })
  return contentTypeCollection
}
