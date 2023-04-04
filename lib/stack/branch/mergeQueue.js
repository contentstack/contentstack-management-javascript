import { get } from '../../entity'

export function MergeQueue (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/branches/merge-queue`

  if (data.uid) {
    this.fetch = async () => {
      const url = `${this.urlPath}/${data.uid}`
      return await get(http, url, {}, data)
    }
  } else {
    this.find = async (params = {}) => {
      return await get(http, this.urlPath, params, data)
    }
  }

  return this
}