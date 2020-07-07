import error from '../core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import ContentstackCollection from '../contentstackCollection'

export default function Query (http, urlPath, param, stackHeaders = null, wrapperCollection) {
  const headers = {}
  if (stackHeaders) {
    headers.headers = stackHeaders
  }
  if (param) {
    headers.params = {
      ...cloneDeep(param)
    }
  }
  /**
   * @description This method will fetch content of query on specified module.
   * @returns {ContentstackCollection} Result collection of content of specified module.
   * @example All Stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().find()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query( { query: { name: 'Stack name' } }).find()
   * .then((collection) => console.log(collection))
   *
   */
  const find = async () => {
    try {
      const response = await http.get(urlPath, headers)
      if (response.data) {
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
   * @returns {Object} Result is Object of content of specified module.
   * @example All Stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().count()
   * .then((response) => console.log(response))
   *
   * @example Query on Asset
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').query({ query: { title: 'Stack name' } }).count()
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
   * @returns {ContentstackCollection} Result content of specified module.
   * @example Stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query().findOne()
   * .then((collection) => console.log(collection))
   *
   * @example Query on stack
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
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
