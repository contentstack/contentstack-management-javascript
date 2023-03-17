import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'

export function Request (http, data, param) {
  http.defaults.versioningStrategy = undefined
  this.urlPath = '/manifests'
  this.params = param || {}

  if (data) {
    if (data.organization_uid) {
      this.params = {
        organization_uid: data.organization_uid
      }
    }
    /**
        * @description The Delete app request call is used to delete an app request of an app in target_uid.
        * @param {string} requestUID The ID of the request to be deleted
        * @returns Promise<Response>
        * @memberof Request
        * @func delete
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app().request().delete('request_uid`)
        * .then((response) => console.log(response))
        *
         */
    this.delete = async (requestUid) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        }

        const response = await http.delete(`/requests/${requestUid}`, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
    if (data.app_uid) {
      /**
        * @description The Create installation call is used to create a app request for an app.
        * @param {string} targetUid The uid of the target, on which the app will be installed
        * @returns Promise<Response>
        * @memberof Request
        * @func create
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app('app_uid').request().create('target_uid')
        * .then((response) => console.log(response))
        *
         */
      this.create = async (targetUid) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.post(`/requests`, { app_uid: data.app_uid, target_uid: targetUid }, headers)
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
        * @description  The GET app requests of an app call is used to retrieve all requests of an app.
        * @returns Promise<Response>
        * @memberof Request
        * @func fetch
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app('app_uid').request().fetch()
        * .then((response) => console.log(response))
        *
         */
      this.fetch = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.get(`/manifests/${data.app_uid}/requests`, headers)
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
        * @description The GET all app requests call is used to retrieve all requests of all apps in an organization.
        * @param {object} param object for query params
        * @returns Promise<Response>
        * @memberof Request
        * @func findAll
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app('app_uid').request().findAll()
        * .then((response) => console.log(response))
        *
         */
      this.findAll = async (param = {}) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: { ...param }
          }

          const response = await http.get(`/requests`, headers)
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
