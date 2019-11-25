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
   * client.stack().query({name: 'Stack name'}).find()
   * .then((collection) => console.log(collection))
   *
   */
  const find = async () => {
    try {
      console.log(headers)
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
   * client.stack().query({name: 'Stack name'}).findOne()
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
    find: find,
    findOne: findOne
  }
}
