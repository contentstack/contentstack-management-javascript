import { get } from '../../entity'

/**
 *
 * @namespace Branch
 */
export function Compare (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/branches_compare`

  /**
     * @description List of content types and global fields that exist in only one branch or are different between the two branches.
     * @memberof Compare
     * @func all
     * @returns {Promise<Response>} Promise for response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').compare('compare_branch_uid').all({skip: 0, limit: 100})
     * .then((response) => console.log(response))
     * .catch((error) => console.error(error))
     *
   */
  this.all = async (params = {}) => {
    return get(http, this.urlPath, params, data)
  }

  /**
     * @description List of all or specific content types that exist in only one branch or are different between the two branches.
     * @memberof Compare
     * @func contentTypes
     * @param {string} params.uid Optional uid for Content Type to compare.
     * @returns {Promise<Response>} Promise for response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').compare('compare_branch_uid').contentTypes({skip: 0, limit: 100})
     * .then((response) => console.log(response))
     * .catch((error) => console.error(error))
     *
   */
  this.contentTypes = async (params = {}) => {
    let url = `${this.urlPath}/content_types`
    if (params.uid) {
      url = `${url}/${params.uid}`
      delete params.uid
    }
    return get(http, url, params, data)
  }

  /**
     * @description Compare allows you to compare any or specific ContentType or GlobalFields.
     * @memberof Compare
     * @func globalFields
     * @param {string} params.uid Optional uid for Global Field to compare.
     * @returns {Promise<Response>} Promise for response.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').compare('compare_branch_uid').globalFields({skip: 0, limit: 100})
     * .then((response) => console.log(response))
     * .catch((error) => console.error(error))
     *
   */
  this.globalFields = async (params = {}) => {
    let url = `${this.urlPath}/global_fields`
    if (params.uid) {
      url = `${url}/${params.uid}`
      delete params.uid
    }
    return get(http, url, params, data)
  }

  return this
}
