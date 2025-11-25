import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'
import { fetchAll } from '../../entity'

/**
 *
 * @namespace AuditLog
 */
export function AuditLog (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/audit-logs`
  if (data.logs) {
    Object.assign(this, cloneDeep(data.logs))
    this.urlPath = `/audit-logs/${this.uid}`

    /**
     * @description The fetch AuditLog call fetches AuditLog details.
     * @memberof AuditLog
     * @func fetch
     * @returns {Promise<Branch.Branch>} Promise for AuditLog instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).auditLog('audit_log_item_uid').fetch()
     * .then((log) => console.log(log))
     *
     */
    this.fetch = async function (param = {}) {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  } else {
    /**
     * @description The Get all AuditLog request retrieves the details of all the AuditLog entries of a stack.
     * @memberof AuditLog
     * @func fetchAll
     * @param {Int} limit The limit parameter will return a specific number of AuditLog entries in the output.
     * @param {Int} skip The skip parameter will skip a specific number of AuditLog entries in the output.
     * @param {Boolean} include_count - To retrieve the count of AuditLog entries.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).auditLog().fetchAll()
     * .then((logs) => console.log(logs))
     *
     */
    this.fetchAll = fetchAll(http, LogCollection)
  }
  return this
}

export function LogCollection (http, data) {
  const obj = cloneDeep(data.logs) || []
  const logCollection = obj.map((userdata) => {
    return new AuditLog(http, { logs: userdata, stackHeaders: data.stackHeaders })
  })
  return logCollection
}
