import cloneDeep from 'lodash/cloneDeep'
import error from '../../../core/contentstackError'

export function WebHooks (http, data, params = {}) {
  this.params = params
  if (data) {
    Object.assign(this, cloneDeep(data))
    if (this.organization_uid) {
      this.params = {
        organization_uid: this.organization_uid
      }
    }
    if (this.uid) {
      this.urlPath = `installations/${this.installationUid}/webhooks/${this.uid}`

      /**
       * @description The GET installation call is used to retrieve a specific installation of an app.
       * @memberof WebHook
       * @func listExecutionLogs
       * @returns {Promise<WebHook>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').marketplace().installation('installation_uid').listExecutionLogs()
       * .then((installation) => console.log(installation))
       *
       */
      this.listExecutionLogs = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(params) }
          } || {}
          const response = await http.get(`${this.urlPath}/executions`, headers)
          if (response.data) {
            return response.data
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
       * @description The GET installation call is used to retrieve a specific installation of an app.
       * @memberof WebHook
       * @func getExecutionLog
       * @param {string} executionUid uid of the execution
       * @returns {Promise<WebHook>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').marketplace().installation('installation_uid').getExecutionLog('executionUid')
       * .then((installation) => console.log(installation))
       *
       */
      this.getExecutionLog = async (executionUid) => {
        try {
          const headers = {
            headers: { ...cloneDeep(params) }
          } || {}
          const response = await http.get(`${this.urlPath}/executions/${executionUid}`, headers)
          if (response.data) {
            return response.data
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
       * @description The GET installation call is used to retrieve a specific installation of an app.
       * @memberof WebHook
       * @func retryExecution
       * @param {string} executionUid uid of the execution
       * @returns {Promise<WebHook>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').marketplace().installation('installation_uid').retryExecution('executionUid')
       * .then((installation) => console.log(installation))
       *
       */
      this.retryExecution = async (executionUid) => {
        try {
          const headers = {
            headers: { ...cloneDeep(params) }
          } || {}
          const response = await http.post(`${this.urlPath}/executions/${executionUid}/retry`, headers)
          if (response.data) {
            return response.data
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }
    }
  }
  return this
}
