export default class ContentstackCollection {
  constructor (response, http, stackHeaders = null, wrapperCollection) {
    const data = response.data || {}
    if (stackHeaders) {
      data.stackHeaders = stackHeaders
    }
    this.items = wrapperCollection(http, data)
    if (response.data.schema !== undefined) {
      this.schema = response.data.schema
    }
    if (response.data.content_type !== undefined) {
      this.content_type = response.data.content_type
    }
    if (response.data.count !== undefined) {
      this.count = response.data.count
    }
    if (response.data.notice !== undefined) {
      this.notice = response.data.notice
    }
  }
}
