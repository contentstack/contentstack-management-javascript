import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'

export function Hosting (http, data, params) {
  http.defaults.versioningStrategy = undefined

  this.params = params | {}
  if (data) {
    this.urlPath = `/manifests/${data.app_uid}/hosting`
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

    /**
       * @description The get hosting call is used to fetch to know whether the hosting is enabled or not.
       * @memberof Hosting
       * @func isEnable
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting().isEnable()
       * .then((data) => {})
       */
    this.isEnable = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
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

    /**
       * @description The toggle hosting call is used to enable the hosting of an app.
       * @memberof Hosting
       * @func updateOAuth
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting().enable()
       * .then((data) => {})
       */
    this.enable = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        } || {}

        const response = await http.put(`${this.urlPath}/enable`, {}, headers)
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
       * @description The toggle hosting call is used to disable the hosting of an app.
       * @memberof Hosting
       * @func disable
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting().disable()
       * .then((data) => {})
       */
    this.disable = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        } || {}

        const response = await http.put(`${this.urlPath}/disable`, {}, headers)
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
       * @descriptionThe create signed upload url call is used to create an signed upload url for the files in hosting.
       * @memberof Hosting
       * @func createUploadUrl
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting().createUploadUrl()
       * .then((data) => {})
       */
    this.createUploadUrl = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        } || {}

        const response = await http.post(`${this.urlPath}/signedUploadUrl`, { }, headers)
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
