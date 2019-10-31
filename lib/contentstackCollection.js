export default class ContentstackCollection {
  constructor (response, http, stackHeaders = null, wrapperCollection) {
    const data = response.data || {}
    if (stackHeaders) {
      data.stackHeaders = stackHeaders
    }
    this.items = wrapperCollection(http, data)
    if (response.data.schema) {
      this.schema = response.data.schema
    }
  }
}
