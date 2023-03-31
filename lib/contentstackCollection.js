/**
 * @namespace ContentstackCollection
 */
export default class ContentstackCollection {
  constructor (response, http, stackHeaders = null, wrapperCollection) {
    const data = response.data || {}
    if (stackHeaders) {
      data.stackHeaders = stackHeaders
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
