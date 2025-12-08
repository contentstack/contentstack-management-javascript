import error from '../core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import ContentstackCollection from '../contentstackCollection'

export default function Query (http, urlPath, param, stackHeaders = null, wrapperCollection) {
  const headers = {}
  if (stackHeaders) {
    headers.headers = stackHeaders
  }
  var contentTypeUid = null
  if (param) {
    if (param.content_type_uid) {
      contentTypeUid = param.content_type_uid
      delete param.content_type_uid
    }
    headers.params = {
      ...cloneDeep(param)
    }
  }
  /**
   * @description This method will fetch content of query on specified module.
   * @async
   * @returns {Promise<ContentstackCollection>} Promise for ContentstackCollection instance.
   * @example All Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().find()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query( { query: { name: 'Stack name' } }).find()
   * .then((collection) => console.log(collection))
   *
   */
  const find = async () => {
    try {
      const response = await http.get(urlPath, headers)
      if (response.data) {
        if (contentTypeUid) {
          response.data.content_type_uid = contentTypeUid
        }
        return new ContentstackCollection(response, http, stackHeaders, wrapperCollection)
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
  /**
   * @description This method will fetch count of content for query on specified module.
   * @async
   * @returns {Promise<Object>} Promise for count result.
   * @example All Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().count()
   * .then((response) => console.log(response))
   *
   * @example Query on Asset
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).query({ query: { title: 'Stack name' } }).count()
   * .then((response) => console.log(response))
   *
   */
  const count = async () => {
    headers.params = {
      ...headers.params,
      count: true
    }
    try {
      const response = await http.get(urlPath, headers)
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
   * @description This method will fetch content of query on specified module.
   * @async
   * @returns {Promise<ContentstackCollection>} Promise for ContentstackCollection instance.
   * @example Stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query().findOne()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().query({ query: { title: 'Stack name' } }).findOne()
   * .then((collection) => console.log(collection))
   *
   */
  const findOne = async () => {
    const limitHeader = headers
    limitHeader.params.limit = 1
    try {
      const response = await http.get(urlPath, limitHeader)
      if (response.data) {
        if (contentTypeUid) {
          response.data.content_type_uid = contentTypeUid
        }
        return new ContentstackCollection(response, http, stackHeaders, wrapperCollection)
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }

  return {
    count: count,
    find: find,
    findOne: findOne
  }
}
