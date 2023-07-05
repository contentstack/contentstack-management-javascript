import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'

export function AppRequest (http, data, param) {
  http.defaults.versioningStrategy = undefined
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
      * @memberof AppRequest
      * @func delete
      *
      * @example
      * import * as contentstack from '@contentstack/management'
      * const client = contentstack.client({ authtoken: 'TOKEN'})
      *
      * client.organization('organization_uid').request().delete('request_uid`)
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
    /**
      * @description The Create call is used to create a app request for an app.
      * @param {string} appUid The uid for the app for request
      * @param {string} targetUid The uid of the target, on which the app will be installed
      * @returns Promise<Response>
      * @memberof AppRequest
      * @func create
      *
      * @example
      * import * as contentstack from '@contentstack/management'
      * const client = contentstack.client({ authtoken: 'TOKEN'})
      *
      * client.organization('organization_uid').request().create({ appUid: 'app_uid', targetUid: 'target_uid' })
      * .then((response) => console.log(response))
      *
        */
    this.create = async ({ appUid, targetUid }) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        }

        const response = await http.post(`/requests`, { app_uid: appUid, target_uid: targetUid }, headers)
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
      * @description The GET all app requests call is used to retrieve all requests of all apps in an organization.
      * @param {object} param object for query params
      * @returns Promise<Response>
      * @memberof AppRequest
      * @func findAll
      *
      * @example
      * import * as contentstack from '@contentstack/management'
      * const client = contentstack.client({ authtoken: 'TOKEN'})
      *
      * client.organization('organization_uid').request().findAll()
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
