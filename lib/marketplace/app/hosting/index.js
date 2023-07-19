import cloneDeep from 'lodash/cloneDeep'
import error from '../../../core/contentstackError'
import { Deployment } from './deployment'

export function Hosting (http, data, params) {
  http.defaults.versioningStrategy = undefined

  this.params = params || {}
  if (data && data.app_uid) {
    this.urlPath = `/manifests/${data.app_uid}/hosting`
    if (data.organization_uid) {
      this.params = {
        organization_uid: data.organization_uid
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
       * @description The toggle hosting call is used to enable the hosting of an app.
       * @memberof Hosting
       * @func enable
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
        }

        const response = await http.patch(`${this.urlPath}/enable`, {}, headers)
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
        }

        const response = await http.patch(`${this.urlPath}/disable`, {}, headers)
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
        }

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

    /**
         * @descriptionThe The GET latest live deployment call is used to get details of latest deployment of the source file.
         * @memberof Hosting
         * @func latestLiveDeployment
         * @returns {Promise<Deployment>}
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client({ authtoken: 'TOKEN'})
         * client.organization('organization_uid').app('manifest_uid').hosting().latestLiveDeployment()
         * .then((data) => {})
         */
    this.latestLiveDeployment = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        }

        const response = await http.get(`${this.urlPath}/latestLiveDeployment`, headers)
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
       * @description Create instance of Hosting deployment.
       * @memberof Hosting
       * @func deployment
       * @returns {Deployment}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting().deployment()
       *
       */
    this.deployment = (uid = null) => {
      const content = { app_uid: data.app_uid }
      if (uid) {
        content.data = {
          uid
        }
      }

      return new Deployment(http, content, this.params)
    }
  }
}
