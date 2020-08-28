import cloneDeep from 'lodash/cloneDeep';
import { update, deleteEntity } from '../entity';
import error from '../core/contentstackError';
import { OrganizationCollection } from '../organization';
/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace Role
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
     * .then((notice) => console.log(notice))
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
     * .then((notice) => console.log(notice))
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
     *  return user.resetPassword()
     * })
     * .then((notice) => console.log(notice))
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
  }

  return this;
}
export function UserCollection(http, data) {
  var obj = cloneDeep(data.collaborators || data.shares || {});
  var userCollection = obj.map(function (userdata) {
    return new User(http, {
      user: userdata
    });
  });
  return userCollection;
}