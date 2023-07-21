import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'

export function Authorization (http, data, params) {
  http.defaults.versioningStrategy = undefined
  this.params = params || {}
  if (data) {
    if (data.organization_uid) {
      this.params = {
        organization_uid: data.organization_uid
      }
    }
    if (data.app_uid) {
      this.urlPath = `/manifests/${data.app_uid}/authorizations`
      /**
       * @description List all user authorizations made to an authorized app under a particular organization
       * @memberof Authorization
       * @func findAll
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').authorization().findAll()
       * .then((response) => console.log(response))
       */
      this.findAll = async (param = {}) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: {
              ...cloneDeep(param)
            }
          }

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
      /**
       * @description Revoke all users tokens issued to an authorized app for the particular organization
       * @memberof Authorization
       * @func revokeAll
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').authorization().revokeAll()
       * .then((response) => console.log(response))
       */
      this.revokeAll = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.delete(this.urlPath, headers)
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
       * @description  Revoke user token issued to an authorized app for the particular organization
       * @memberof Authorization
       * @func revoke
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').authorization().revoke('authorization_uid')
       * .then((response) => console.log(response))
       */
      this.revoke = async (authorizationUid) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.delete(`${this.urlPath}/${authorizationUid}`, headers)
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
}
