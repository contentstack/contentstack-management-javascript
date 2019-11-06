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
      query: {
        ...cloneDeep(param)
      }
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
  function find () {
    return http.get(urlPath, headers)
      .then((response) => {
        return new ContentstackCollection(response, http, stackHeaders, wrapperCollection)
      }, error)
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
  function findOne () {
    const limitHeader = headers
    limitHeader.params.limit = 1
    return http.get(urlPath, limitHeader)
      .then((response) => {
        return new ContentstackCollection(response, http, stackHeaders, wrapperCollection)
      }, error)
  }

  return {
    find: find,
    findOne: findOne
  }
}
