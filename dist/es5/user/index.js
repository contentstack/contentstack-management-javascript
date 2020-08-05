"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = User;
exports.UserCollection = UserCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../entity");

var _contentstackError = require("../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _organization = require("../organization");

/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace Role
 */
function User(http, data) {
  Object.assign(this, (0, _cloneDeep2["default"])(data.user));
  this.urlPath = '/user';

  if (this.authtoken) {
    /**
     * @description The Update User API Request updates the details of an existing user account.
     * @memberof User
     * @func update
     * @returns {Promise<User.User>} Promise for User instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').getUser()
     * .then((user) => {
     *  user.first_name = 'FirstName'
     *  user.last_name = 'LastName'
     *  user.company = 'Role description'
     *  return user.update()
     * })
     * .then((user) => console.log(user))
     */
    this.update = (0, _entity.update)(http, 'user');
    /**
     * @description The Delete user call deletes the current authenticated user permanently from your Contentstack account.
     * @memberof User
     * @func delete
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').getUser()
     * .then((user) => {
     *  return user.delete()
     * })
     * .then((notice) => console.log(notice))
     */

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
     * @description The Request for a password call sends a request for a temporary password to log in to an account in case a user has forgotten the login password.
     * @memberof User
     * @func requestPassword
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').getUser()
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
        return response.data.notice;
      }, _contentstackError2["default"]);
    };
    /**
     * @description The Reset password call sends a request for resetting the password of your Contentstack account.
     * @memberof User
     * @func resetPassword
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').getUser()
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
        return response.data.notice;
      }, _contentstackError2["default"]);
    };

    if (this.organizations) {
      this.organizations = new _organization.OrganizationCollection(http, {
        organizations: this.organizations
      });
    }
  }

  return this;
}

function UserCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.collaborators || data.shares || {});
  var userCollection = obj.map(function (userdata) {
    return new User(http, {
      user: userdata
    });
  });
  return userCollection;
}