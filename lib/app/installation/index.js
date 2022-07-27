import cloneDeep from 'lodash/cloneDeep'
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
     * @description The GET installation call is used to retrieve a specific installation of an app
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
     * @description The Update installation call is used to update information of an app
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
     * .then((app) => console.log(app))
     */
    this.uninstall = deleteEntity(http, false, this.params)
  } else {
    if (data.app_uid) {
      this.urlPath = `apps/${data.app_uid}/installations`
      /**
       * @description The create an app call is used for creating a new app in your Contentstack organization.
       * @memberof Installation
       * @func create
       * @returns {Promise<ContentstackCollection<Installation>>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('app_uid').installation().fetchAll()
       * .then((app) => console.log(app))
       *
       */
      this.findAll = fetchAll(http, InstallationCollection, this.params)
    }
  }
  return this
}

export function InstallationCollection (http, data) {
  const obj = cloneDeep(data.data) || []
  return obj.map((installationData) => {
    return new Installation(http, { data: installationData })
  })
}
