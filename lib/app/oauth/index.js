import error from '../../core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
export function Oauth (http, data, params) {
  http.defaults.versioningStrategy = undefined
  this.params = params || {}
  if (data) {
    if (data.organization_uid) {
      this.params = {
        organization_uid: data.organization_uid
      }
    }
    if (data.app_uid) {
      this.urlPath = `/manifests/${data.app_uid}/oauth`
      /**
       * @description The get oauth call is used to fetch the OAuth details of the app.
       * @memberof Oauth
       * @func fetch
       * @returns {Promise<AppOAuth>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').oauth().fetch()
       * .then((oAuthConfig) => console.log(oAuthConfig))
       */
      this.fetch = async (param = {}) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: {
              ...cloneDeep(param)
            }
          } || {}

          const response = await http.get(this.urlPath, headers)
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
       * @memberof Oauth
       * @func update
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
       * client.organization('organization_uid').app('manifest_uid').oauth().update({ config })
       * .then((oAuthConfig) => console.log(oAuthConfig))
       */
      this.update = async ({ config, param = {} }) => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) },
            params: {
              ...cloneDeep(param)
            }
          } || {}

          const response = await http.put(this.urlPath, config, headers)
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
       * @memberof Oauth
       * @func getScopes
       * @returns {Promise<AppOAuth>}
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({ authtoken: 'TOKEN'})
       *
       * client.organization('organization_uid').app('manifest_uid').oauth().getScopes()
       * .then((scopes) => console.log(scopes))
       */
      this.getScopes = async () => {
        try {
          const headers = {
            headers: { ...cloneDeep(this.params) }
          } || {}

          const response = await http.get('/manifests/oauth/scopes', headers)
          if (response.data) {
            return response.data.data || {}
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
