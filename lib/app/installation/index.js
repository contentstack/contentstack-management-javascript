import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'
import { deleteEntity, fetch, fetchAll, update } from '../../entity'

export function Installation (http, data, params = {}) {
  this.params = params
  if (data.data) {
    Object.assign(this, cloneDeep(data.data))
    if (this.installation_uid) {
      this.uid = this.installation_uid
    }
    if (this.organization_uid) {
      this.params = {
        organization_uid: this.organization_uid
      }
    }
    this.urlPath = `/installations/${this.uid}`

    /**
     * @description The GET installation call is used to retrieve a specific installation of an app.
     * @memberof Installation
     * @func fetch
     * @returns {Promise<Installation>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').fetch()
     * .then((installation) => console.log(installation))
     *
     */
    this.fetch = fetch(http, 'data', this.params)

    /**
     * @description The Update installation call is used to update information of an installation.
     * @memberof Installation
     * @func update
     * @returns {Promise<Installation>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * const updateInstallation = {
     *  name: 'APP_NAME',
     *  description: 'APP_DESCRIPTION',
     *  target_type: 'stack'/'organization',
     * }
     *
     * const installation = client.organization('organization_uid').app('app_uid').installation('installation_uid')
     * installation = Object.assign(installation, updateInstallation)
     * installation.update()
     * .then((installation) => console.log(installation))
     */
    this.update = update(http, 'data', this.params)

    /**
     * @description The Uninstall installation call is used to uninstall the installation.
     * @memberof Installation
     * @func uninstall
     * @returns {Promise<Response>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').uninstall()
     * .then((response) => console.log(response))
     */
    this.uninstall = deleteEntity(http, false, this.params)

    /**
     * @description To fetch organization level app installation configuration.
     * @memberof Installation
     * @func configuration
     * @param {*} param
     * @returns {Promise<Response>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').configuration()
     * .then((response) => console.log(response))
     */
    this.configuration = async (param = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(params) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        const response = await http.get(`${this.urlPath}/configuration`, headers)
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
     * @description To update organization level app installation configuration.
     * @memberof Installation
     * @func setConfiguration
     * @param {*} config Config that needs to be updated
     * @returns {Promise<Response>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').setConfiguration({<configuration_details>})
     * .then((response) => console.log(response))
     */
    this.setConfiguration = async (config) => {
      try {
        const headers = {
          headers: { ...cloneDeep(params) }
        } || {}
        const response = await http.put(`${this.urlPath}/configuration`, config, headers)
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
     * @description To fetch server side organization level config required for the app.
     * @memberof Installation
     * @func getServerConfig
     * @param {*} param
     * @returns {Promise<Response>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').serverConfig()
     * .then((response) => console.log(response))
     */
    this.serverConfig = async (param = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(params) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        const response = await http.get(`${this.urlPath}/server-configuration`, headers)
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
   * @description To update server side organization level config required for the app.
   * @memberof Installation
   * @func setServerConfig
   * @param {*} config Config that needs to be updated
   * @returns {Promise<Response>}
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client({ authtoken: 'TOKEN'})
   *
   * client.organization('organization_uid').app('app_uid').installation('installation_uid').setServerConfig({<configuration_details>})
   * .then((response) => console.log(response))
   */
    this.setServerConfig = async (config) => {
      try {
        const headers = {
          headers: { ...cloneDeep(params) }
        } || {}
        const response = await http.put(`${this.urlPath}/server-configuration`, config, headers)
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
     * @description To fetch installation data of an app configuration.
     * @memberof Installation
     * @func installationData
     * @returns {Promise<Response>}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({ authtoken: 'TOKEN'})
     *
     * client.organization('organization_uid').app('app_uid').installation('installation_uid').installationData()
     * .then((response) => console.log(response))
     */
    this.installationData = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(params) }
        } || {}
        const response = await http.get(`${this.urlPath}/installationData`, headers)
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
  return this
}
