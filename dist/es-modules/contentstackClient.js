import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @namespace ContentstackClient
 */
import { Stack } from './stack/index.js';
import { Organization } from './organization/index';
import cloneDeep from 'lodash/cloneDeep';
import { User } from './user/index';
import error from './core/contentstackError';
export default function contentstackClient(_ref) {
  var http = _ref.http;

  /**
   * @description The login call is used to sign in to your Contentstack account and obtain the authtoken.
   * @memberof ContentstackClient
   * @func login
   * @param {Object} parameters - login parameters
   * @prop {string} parameters.email - email id for user to login
   * @prop {string} parameters.password - password for user to login
   * @prop {string} parameters.token - token for user to login
   * @returns {Promise}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.login({ email: <emailid>, password: <password> })
   * .then(() => console.log('Logged in successfully'))
   *
   */
  function login(requestBody) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return http.post('/user-session', {
      user: requestBody
    }, {
      params: params
    }).then(function (response) {
      if (response.data.user != null && response.data.user.authtoken != null) {
        http.defaults.headers.common.authtoken = response.data.user.authtoken;
        response.data.user = new User(http, response.data);
      }

      return response.data;
    }, error);
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


  function getUser() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return http.get('/user', {
      params: params
    }).then(function (response) {
      return new User(http, response.data);
    }, error);
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


  function stack() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var stack = _objectSpread({}, cloneDeep(params));

    return new Stack(http, {
      stack: stack
    });
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


  function organization() {
    var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return new Organization(http, uid !== null ? {
      organization: {
        uid: uid
      }
    } : null);
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


  function logout(authtoken) {
    if (authtoken !== undefined) {
      return http["delete"]('/user-session', {
        headers: {
          authtoken: authtoken
        }
      }).then(function (response) {
        return response.data;
      }, error);
    }

    return http["delete"]('/user-session').then(function (response) {
      if (http.defaults.headers.common) {
        delete http.defaults.headers.common.authtoken;
      }

      delete http.defaults.headers.authtoken;
      delete http.httpClientParams.authtoken;
      delete http.httpClientParams.headers.authtoken;
      return response.data;
    }, error);
  }

  return {
    login: login,
    logout: logout,
    getUser: getUser,
    stack: stack,
    organization: organization,
    axiosInstance: http
  };
}