/**
 * @namespace ContentstackClient
 */
import { Stack } from './stack/index.js'
import { Organization } from './organization/index'
import cloneDeep from 'lodash/cloneDeep'
import { User } from './user/index'
import error from './core/contentstackError'
import OAuthHandler from './core/oauthHandler'
import { authenticator } from 'otplib'

export default function contentstackClient ({ http }) {
  /**
   * @description The login call is used to sign in to your Contentstack account and obtain the authtoken.
   * @memberof ContentstackClient
   * @func login
   * @param {Object} parameters - login parameters
   * @prop {string} parameters.email - email id for user to login
   * @prop {string} parameters.password - password for user to login
   * @prop {string} parameters.tfa_token - tfa token for user to login (2FA token)
   * @prop {string} parameters.mfaSecret - TOTP secret key for generating 2FA token
   * @returns {Promise}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.login({ email: <emailid>, password: <password> })
   * .then(() => console.log('Logged in successfully'))
   *
   * @example
   * client.login({ email: <emailid>, password: <password>, tfa_token: <tfa_token> })
   * .then(() => console.log('Logged in successfully'))
   *
   * @example
   * client.login({ email: <emailid>, password: <password>, mfaSecret: <mfa_secret> })
   * .then(() => console.log('Logged in successfully'))
   */
  function login (requestBody = {}, params = {}) {
    http.defaults.versioningStrategy = 'path'

    const { mfaSecret, ...credentials } = requestBody
    requestBody = credentials

    if (!requestBody.tfa_token && mfaSecret) {
      requestBody.tfa_token = authenticator.generate(mfaSecret)
    }
    return http.post('/user-session', { user: requestBody }, { params: params })
      .then((response) => {
        if (response.data.user != null && response.data.user.authtoken != null) {
          http.defaults.headers.common.authtoken = response.data.user.authtoken
          response.data.user = new User(http, response.data)
        }
        return response.data
      }, error)
  }

  /**
   * @description The Get user call returns comprehensive information of an existing user account.
   * The information returned includes details of the stacks owned by and shared with the specified user account.
   * @memberof ContentstackClient
   * @func getUser
   * @returns {Promise}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.getUser()
   * .then((user) => console.log(user))
   *
   */
  function getUser (params = {}) {
    http.defaults.versioningStrategy = 'path'
    return http.get('/user', { params: params }).then((response) => {
      return new User(http, response.data)
    }, error)
  }
  /**
   * @description Get Stack instance. A stack is a space that stores the content of a project.
   * @memberof ContentstackClient
   * @func stack
   * @param {String} api_key - Stack API Key
   * @param {String} management_token - Management token for Stack.
   * @param {String} branch_name - Branch name or alias to access specific branch. Default is master.
   * @returns {Stack} Instance of Stack
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * const stack = {name: 'My New Stack'}
   * client.stack().create({ stack }, { organization_uid: 'org_uid' })
   * .then((stack) => console.log(stack))
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).fetch()
   * .then((stack) => console.log(stack))
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key', management_token: 'management_token' }).contentType('content_type_uid').fetch()
   * .then((stack) => console.log(stack))
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key', management_token: 'management_token', branch_uid: 'branch_uid' }).contentType('content_type_uid').fetch()
   * .then((stack) => console.log(stack))
   */
  function stack (params = {}) {
    http.defaults.versioningStrategy = 'path'
    const stack = { ...cloneDeep(params) }
    return new Stack(http, { stack })
  }

  /**
   * @description Organization is the top-level entity in the hierarchy of Contentstack, consisting of stacks and stack resources, and users.
   * @memberof ContentstackClient
   * @func organization
   * @param {String} uid - Organization UID.
   * @returns {Organization} Instance of Organization.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.organization().findAll()
   * .then((organization) => console.log(organization))
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.organization('org_uid').fetch()
   * .then((organization) => console.log(organization))
   *
   */
  function organization (uid = null) {
    http.defaults.versioningStrategy = 'path'
    return new Organization(
      http,
      uid !== null ? { organization: { uid: uid } } : null
    )
  }

  /**
   * @description The Log out of your account call is used to sign out the user of Contentstack account.
   * @memberof ContentstackClient
   * @param {String} authtoken - Authtoken to logout from.
   * @func logout
   * @returns {Object} Response object.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * client.logout()
   * .then((response) => console.log(response))
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * client.logout('AUTHTOKEN')
   * .then((response) => console.log(response))
   *   */
  function logout (authtoken) {
    http.defaults.versioningStrategy = 'path'
    if (authtoken !== undefined) {
      return http
        .delete('/user-session', {
          headers: {
            authtoken: authtoken
          }
        })
        .then((response) => {
          return response.data
        }, error)
    }
    return http.delete('/user-session').then((response) => {
      if (http.defaults.headers.common) {
        delete http.defaults.headers.common.authtoken
      }
      delete http.defaults.headers.authtoken
      delete http.httpClientParams.authtoken
      delete http.httpClientParams.headers.authtoken
      return response.data
    }, error)
  }

  /**
   * @description The oauth call is used to sign in to your Contentstack account and obtain the accesstoken.
   * @memberof ContentstackClient
   * @func oauth
   * @param {Object} parameters - oauth parameters
   * @prop {string} parameters.appId - appId of the application
   * @prop {string} parameters.clientId - clientId of the application
   * @prop {string} parameters.clientId - clientId of the application
   * @prop {string} parameters.responseType - responseType
   * @prop {string} parameters.scope - scope
   * @prop {string} parameters.clientSecret - clientSecret of the application
   * @returns {OAuthHandler} Instance of OAuthHandler
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.oauth({ appId: <appId>, clientId: <clientId>, redirectUri: <redirectUri>, clientSecret: <clientSecret>, responseType: <responseType>, scope: <scope> })
   * .then(() => console.log('Logged in successfully'))
   *
   */
  function oauth (params = {}) {
    http.defaults.versioningStrategy = 'path'
    const appId = params.appId || '6400aa06db64de001a31c8a9'
    const clientId = params.clientId || 'Ie0FEfTzlfAHL4xM'
    const redirectUri = params.redirectUri || 'http://localhost:8184'
    const responseType = params.responseType || 'code'
    const scope = params.scope
    const clientSecret = params.clientSecret
    return new OAuthHandler(
      http,
      appId,
      clientId,
      redirectUri,
      clientSecret,
      responseType,
      scope
    )
  }

  return {
    login: login,
    logout: logout,
    getUser: getUser,
    stack: stack,
    organization: organization,
    axiosInstance: http,
    oauth
  }
}
