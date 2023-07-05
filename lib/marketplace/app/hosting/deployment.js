import cloneDeep from 'lodash/cloneDeep'
import ContentstackCollection from '../../../contentstackCollection'
import error from '../../../core/contentstackError'

export function Deployment (http, data, params) {
  http.defaults.versioningStrategy = undefined

  if (data && data.app_uid) {
    this.params = params || {}
    this.urlPath = `/manifests/${data.app_uid}/hosting/deployments`
    if (data.organization_uid) {
      this.params = {
        organization_uid: data.organization_uid
      }
    }
    if (data.data) {
      Object.assign(this, cloneDeep(data.data))
      if (this.organization_uid) {
        this.params = {
          organization_uid: this.organization_uid
        }
      }
    }
    if (this.uid) {
      this.urlPath = `/manifests/${data.app_uid}/hosting/deployments/${this.uid}`
      /**
         * @descriptionThe The GET deployment call is used to get all the details of an deployment of an app
         * @memberof Deployment
         * @func fetch
         * @returns {Promise<Deployment>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().deployment('deployment_uid').fetch()
         * .then((data) => {})
         */
      this.fetch = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.get(`${this.urlPath}`, headers)
          if (response.data) {
            const content = response.data.data
            return new Deployment(http, { data: content, app_uid: data.app_uid }, this.params)
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
         * @descriptionThe The list deployment logs call is used to list logs of a deployment.
         * @memberof Deployment
         * @func logs
         * @returns {Promise<Response>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().deployment('deployment_uid').logs()
         * .then((data) => {})
         */
      this.logs = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.get(`${this.urlPath}/logs`, headers)
          if (response.data) {
            return response.data.data
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
         * @descriptionThe The create signed download url call is used to get the download url of the deployment source code.
         * @memberof signedDownloadUrl
         * @func logs
         * @returns {Promise<Response>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().deployment('deployment_uid').signedDownloadUrl()
         * .then((data) => {})
         */
      this.signedDownloadUrl = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.post(`${this.urlPath}/signedDownloadUrl`, {}, headers)
          if (response.data) {
            return response.data.data
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }
    } else {
      /**
         * @descriptionThe The create hosting deployments call is used to deploy the uploaded file in hosting
         * @memberof Deployment
         * @func create
         * @returns {Promise<Deployment>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().deployment().create()
         * .then((data) => {})
         */
      this.create = async ({ uploadUid, fileType, withAdvancedOptions }) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }
          if (withAdvancedOptions) {
            headers.params = {
              with_advanced_options: withAdvancedOptions
            }
          }
          const response = await http.post(`${this.urlPath}`, { upload_uid: uploadUid, file_type: fileType }, headers)
          if (response.data) {
            const content = response.data.data
            return new Deployment(http, { data: content, app_uid: data.app_uid }, this.params)
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
         * @descriptionThe The list deployments call is used to get all the available deployments made for an app.
         * @memberof Deployment
         * @func findAll
         * @returns {Promise<ContentstackCollection>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().deployment().create()
         * .then((data) => {})
         */
      this.findAll = async (param = {}) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: { ...cloneDeep(param) }
          }

          const response = await http.get(`${this.urlPath}`, headers)
          if (response.data) {
            const content = response.data
            const collection = new ContentstackCollection(response, http)
            collection.items = DeploymentCollection(http, content, data.app_uid, this.params)
            return collection
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

export function DeploymentCollection (http, data, appUid, param) {
  const obj = cloneDeep(data.data) || []
  return obj.map((content) => {
    return new Deployment(http, { data: content, app_uid: appUid }, param)
  })
}
