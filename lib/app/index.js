import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { create, deleteEntity, fetch, fetchAll, update } from '../entity'
import { Authorization } from './authorization'
import { Hosting } from './hosting'
import { Installation } from './installation'

export function App (http, data) {
  http.defaults.versioningStrategy = undefined
  this.urlPath = '/manifests'
  this.params = {}
  if (data) {
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
      this.urlPath = `/manifests/${this.uid}`

      /**
       * @description The update manifest call is used to update the app details such as name, description, icon, and so on.
       * @memberof App
       * @func update
       * @returns {Promise<App>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * const updateApp = {
       *  name: 'APP_NAME',
       *  description: 'APP_DESCRIPTION',
       *  target_type: 'stack'/'organization',
       * }
       * const app = client.organization('organization_uid').app('manifest_uid')
       * app = Object.assign(app, updateApp)
       * app.update()
       * .then((app) => console.log(app))
       *
       */
      this.update = update(http, undefined, this.params)

      /**
       * @description  The get manifest call is used to fetch details of a particular app with its ID.
       * @memberof App
       * @func fetch
       * @returns {Promise<App>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').fetch()
       * .then((app) => console.log(app))
       *
       */
      this.fetch = fetch(http, 'data', this.params)

      /**
       * @description The delete manifest call is used to delete the app.
       * @memberof App
       * @func delete
       * @returns {Promise<Response>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').delete()
       * .then((response) => console.log(response))
       */
      this.delete = deleteEntity(http, false, this.params)

      /**
       * @description The get oauth call is used to fetch the OAuth details of the app.
       * @memberof App
       * @func fetchOAuth
       * @returns {Promise<AppOAuth>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').fetchOAuth()
       * .then((oAuthConfig) => console.log(oAuthConfig))
       */
      this.fetchOAuth = async (param = {}) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: {
              ...cloneDeep(param)
            }
          } || {}

          const response = await http.get(`${this.urlPath}/oauth`, headers)
          if (response.data) {
            return response.data.data || {}
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
       * @description The change oauth details call is used to update the OAuth details, (redirect url and permission scope) of an app.
       * @memberof App
       * @func updateOAuth
       * @returns {Promise<AppOAuth>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * const config = {
       *  redirect_uri: 'REDIRECT_URI',
       *  app_token_config: {
       *    enabled: true,
       *    scopes: ['scope1', 'scope2']
       *   },
       *   user_token_config: {
       *    enabled: true,
       *    scopes: ['scope1', 'scope2']
       *   }
       *  }
       * client.organization('organization_uid').app('manifest_uid').updateOAuth({ config })
       * .then((oAuthConfig) => console.log(oAuthConfig))
       */
      this.updateOAuth = async ({ config, param = {} }) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: {
              ...cloneDeep(param)
            }
          } || {}

          const response = await http.put(`${this.urlPath}/oauth`, config, headers)
          if (response.data) {
            return response.data.data || {}
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
       * @description The hosting will allow you get, update, deploy manifest.
       * @memberof App
       * @func updateOAuth
       * @returns {Promise<AppOAuth>}
       * @returns {Hosting}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').hosting()
       */
      this.hosting = () => {
        return new Hosting(http, { app_uid: this.uid }, this.params)
      }

      /**
       * @description The install call is used to initiate the installation of the app
       * @memberof App
       * @func install
       * @param {String} param.targetType - The target on which app needs to be installed, stack or ogranization.
       * @param {String} param.targetUid - The uid of the target, on which the app will be installed
       * @returns Promise<Installation>
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').install({ targetUid: 'STACK_API_KEY', targetType: 'stack' })
       * .then((installation) => console.log(installation))
       */
      this.install = async ({ targetUid, targetType }) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          } || {}

          const response = await http.post(`${this.urlPath}/install`, { target_type: targetType, target_uid: targetUid }, headers)
          if (response.data) {
            return new Installation(http, response.data, this.params) || {}
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }

      /**
       * @description The Installation will allow you to fetch, update and delete of the app installation.
       * @memberof App
       * @func installation
       * @param {String} uid Installation uid
       * @returns Installation
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').installation().findAll()
       * .then((installations) => console.log(installations))
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').installation('installation_uid').fetch()
       * .then((installation) => console.log(installation))
       */
      this.installation = (uid = null) => {
        return new Installation(http, uid ? { data: { uid } } : { app_uid: this.uid }, this.params)
      }
      /**
        * @description  The GET app requests of an app call is used to retrieve all requests of an app.
        * @returns Promise<Response>
        * @memberof App
        * @func getRequests
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app('app_uid').getRequests()
        * .then((response) => console.log(response))
        *
         */
      this.getRequests = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }

          const response = await http.get(`${this.urlPath}/requests`, headers)
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
        * @description  The App authorization allow to authorize app for specific scope.
        * @returns Promise<Response>
        * @param {string} param.responseType Desired grant type
        * @param {string} param.clientId Client id of the app
        * @param {string} param.redirectUri Redirect URL of the app
        * @param {string} param.scope Scopes of the app
        * @param {string} param.state Local state provided by the client
        *
        * @memberof App
        * @func authorize
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client({ authtoken: 'TOKEN'})
        *
        * client.organization('organization_uid').app('app_uid').authorize()
        * .then((response) => console.log(response))
        *
         */
      this.authorize = async ({ responseType, clientId, redirectUri, scope, state }) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          }
          const content = {
            response_type: responseType,
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: scope
          }
          if (state) {
            content.state = state
          }
          const response = await http.post(`${this.urlPath}/authorize`, content, headers)
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
       * @description The Authorization will allow you to get all authorization, revoke specific or all authorization
       * @memberof App
       * @func authorization
       * @returns {Authorization}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * client.organization('organization_uid').app('manifest_uid').authorization()
       */
      this.authorization = () => {
        return new Authorization(http, { app_uid: this.uid }, this.params)
      }
    } else {
      /**
       * @description The create manifest call is used for creating a new app/manifest in your Contentstack organization.
       * @memberof App
       * @func create
       * @returns {Promise<App>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       * const app = {
       *  name: 'APP_NAME',
       *  description: 'APP_DESCRIPTION',
       *  target_type: 'stack'/'organization',
       *  webhook: // optional
       *   {
       *     target_url: 'TARGET_URL',
       *     channel: 'CHANNEL'
       *   },
       *  oauth: // optional
       *   {
       *     redirect_uri: 'REDIRECT_URI',
       *     enabled: true,
       *   }
       * }
       *
       * client.organization('organization_uid').app().create(app)
       * .then((app) => console.log(app))
       *
       */
      this.create = create({ http, params: this.params })

      /**
       * @description The get all manifest call is used to fetch all the apps in your Contentstack organization.
       * @memberof App
       * @func findAll
       * @returns {Promise<ContentstackCollection<App>>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app().fetchAll()
       * .then((collection) => console.log(collection))
       *
       */
      this.findAll = fetchAll(http, AppCollection, this.params)

      /**
       * @description To get the apps list of authorized apps for the particular organization
       * @memberof Organization
       * @func authorizedApps
       * @param {number} skip - Offset for skipping content in the response.
       * @param {number} limit - Limit on api response to provide content in list.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').authorizedApps({ skip: 10 })
       * .then((roles) => console.log(roles))
       *
       */
      this.findAllAuthorized = async (param = {}) => {
        const headers = {
          headers: { ...cloneDeep(this.params) }
        }

        headers.params = { ...param }
        try {
          const response = await http.get(`/authorized-apps`, headers)
          if (response.data) {
            return response.data
          } else {
            return error(response)
          }
        } catch (err) {
          return error(err)
        }
      }
    }
  }
  return this
}

export function AppCollection (http, data) {
  const obj = cloneDeep(data.data) || []
  return obj.map((appData) => {
    return new App(http, { data: appData })
  })
}
