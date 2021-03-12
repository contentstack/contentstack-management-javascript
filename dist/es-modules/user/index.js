import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { update, deleteEntity } from '../entity';
import error from '../core/contentstackError';
import { OrganizationCollection } from '../organization';
/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace User
 */

export function User(http, data) {
  Object.assign(this, cloneDeep(data.user));
  this.urlPath = '/user';

  if (this.authtoken) {
    /**
     * @description The Update User API Request updates the details of an existing user account.
     * @memberof User
     * @func update
     * @returns {Promise<User.User>} Promise for User instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).getUser()
     * .then((user) => {
     *  user.first_name = 'FirstName'
     *  user.last_name = 'LastName'
     *  user.company = 'Role description'
     *  return user.update()
     * })
     * .then((user) => console.log(user))
     */
    this.update = update(http, 'user');
    /**
     * @description The Delete user call deletes the current authenticated user permanently from your Contentstack account.
     * @memberof User
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).getUser()
     * .then((user) => {
     *  return user.delete()
     * })
     * .then((response) => console.log(response.notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The Request for a password call sends a request for a temporary password to log in to an account in case a user has forgotten the login password.
     * @memberof User
     * @func requestPassword
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).getUser()
     * .then((user) => {
     *  return user.requestPassword()
     * })
     * .then((response) => console.log(response.notice))
     *
     */

    this.requestPassword = function () {
      return http.post('/user/forgot_password', {
        user: {
          email: this.email
        }
      }).then(function (response) {
        return response.data;
      }, error);
    };
    /**
     * @description The Reset password call sends a request for resetting the password of your Contentstack account.
     * @memberof User
     * @func resetPassword
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).getUser()
     * .then((user) => {
     *  return user.resetPassword({ 'resetToken', 'new_password', 'new_password' })
     * })
     * .then((response) => console.log(response.notice))
     *
     */


    this.resetPassword = function (_ref) {
      var resetPasswordToken = _ref.resetPasswordToken,
          password = _ref.password,
          passwordConfirm = _ref.passwordConfirm;
      return http.post('/user/reset_password', {
        user: {
          reset_password_token: resetPasswordToken,
          password: password,
          password_confirmation: passwordConfirm
        }
      }).then(function (response) {
        return response.data;
      }, error);
    };

    if (this.organizations) {
      this.organizations = new OrganizationCollection(http, {
        organizations: this.organizations
      });
    }
    /**
     * @description The Get all Tasks request retrieves a list of all tasks assigned to you.
     * @memberof User
     * @func getTasks
     * @param {Object} query Enter the actual query that will be executed to retrieve the tasks. This query should be in JSON format.
     * @param {Object} sort Enter the field UID on the basis of which you want to sort your tasks.
     * @param {Int} limit Enter the maximum number of tasks that you want to retrieve in the response.
     * @param {Int} skip Enter the number of tasks to be skipped.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).getUser()
     * .then((user) => {
     *  return user.getTasks()
     * })
     * .then((response) => console.log(response.assignments))
     *
     */


    this.getTasks = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(params) {
        var headers, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = {};

                if (params) {
                  headers.params = _objectSpread({}, cloneDeep(params));
                }

                _context.prev = 2;
                _context.next = 5;
                return http.get("/user/assignments", headers);

              case 5:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", response.data);

              case 10:
                throw error(response);

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](2);
                throw error(_context.t0);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 13]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
  }

  return this;
}
export function UserCollection(http, data) {
  var users = data.collaborators || data.shares || [];
  var obj = cloneDeep(users);
  var userCollection = obj.map(function (userdata) {
    return new User(http, {
      user: userdata
    });
  });
  return userCollection;
}