/**
 * @namespace ContentstackCollection
 */
export default class ContentstackCollection {
  /**
   * Creates a ContentstackCollection instance.
   * @param {Object} response - HTTP response object.
   * @param {Object} http - HTTP client instance.
   * @param {Object=} stackHeaders - Stack headers to include in data.
   * @param {Function=} wrapperCollection - Collection wrapper function to transform items.
   */
  constructor (response, http, stackHeaders = null, wrapperCollection) {
    const data = response.data || {}
    if (stackHeaders) {
      data.stackHeaders = stackHeaders
    }
    if (http?.httpClientParams?.headers?.includeResHeaders === true) {
      data.stackHeaders = {
        ...data.stackHeaders,
        responseHeaders: response.headers
      }
    }
    if (wrapperCollection) {
      this.items = wrapperCollection(http, data)
    }

    if (data.schema !== undefined) {
      this.schema = data.schema
    }
    if (data.content_type !== undefined) {
      this.content_type = data.content_type
    }
    if (data.count !== undefined) {
      this.count = data.count
    }
    if (data.notice !== undefined) {
      this.notice = data.notice
    }
  }
}
