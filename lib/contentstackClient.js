/**
 * @namespace ContentstackClientAPI
 */
import { Stack, StackCollection } from './stack/index.js'
import { entity } from './entity'
import { User } from './user/index'
import error from './core/contentstackError'

export default function contentstackClient ({ http }) {
  /**
   * @description The Log in to your account request is used to sign in to your Contentstack account and obtain the authtoken.
   * @memberof ContentstackClientAPI
   * @func login
   * @param {Object} parameters - login parameters
   * @prop {string} paramters.email - email id for user to login
   * @prop {string} paramters.password - password for user to login
   * @prop {string} paramters.token - token for user to login
   * @returns {Promise}
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.login({ email: <emailid>, password: <password> })
   * .then(() => console.log('Logged in successfully'))
   *
   */
  function login (parameters) {
    return http.post('/user-session', { user: parameters })
      .then((response) => {
        if (response.data.user != null && response.data.user.authtoken != null) {
          http.defaults.headers.common.authtoken = response.data.user.authtoken
          response.data.user = User(http, response.data)
        }
        return response.data
      }, error)
  }

  /**
   * @description The Get user call returns comprehensive information of an existing user account.
   * The information returned includes details of the stacks owned by and shared with the specified user account.
   * @memberof ContentstackClientAPI
   * @func getUser
   * @returns {Promise}
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.getUser()
   * .then((user) => console.log(user))
   *
   */
  function getUser () {
    return http.get('/user')
      .then((response) => {
        return response.data
      }, error)
  }
  /**
   * @description Get Stack instance. A stack is a space that stores the content of a project.
   * @memberof ContentstackClientAPI
   * @func Stack
   * @param {String} api_key - Stack API Key
   * @returns {Stack} Instance of Stack
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().create({name: 'My New Stack'}, { organization_uid: 'org_uid' })
   * .then((stack) => console.log(stack))
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').fetch()
   * .then((stack) => console.log(stack))
   *
   */
  function stack (apiKey = null) {
    if (!apiKey) {
      return entity({ http: http, urlPath: '/stacks', wrapper: Stack, wrapperCollection: StackCollection })
    }
    return Stack(http, { stack: { api_key: apiKey } })
  }

  return {
    login: login,
    getUser: getUser,
    stack: stack
  }
}
