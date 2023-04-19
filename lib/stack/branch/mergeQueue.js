import { get } from '../../entity'

export function MergeQueue (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/branches/merge-queue`

  if (data.uid) {
    /**
     * @description Fetch function gets the status of a merge job and it's configuration details.
     * @memberof MergeQueue
     * @func fetch
     * @returns {Promise<Response>} Promise for response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().mergeQueue('UID').fetch()
     * .then(response)
     * .catch(error)
     *
    */
    this.fetch = async () => {
      const url = `${this.urlPath}/${data.uid}`
      return await get(http, url, {}, data)
    }
  } else {
    /**
     * @description Find function lists all recent merge jobs.
     * @memberof MergeQueue
     * @func find
     * @returns {Promise<Response>} Promise for response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().mergeQueue().find()
     * .then(response)
     * .catch(error)
     *
    */
    this.find = async (params = {}) => {
      return await get(http, this.urlPath, params, data)
    }
  }

  return this
}