"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.User = User;
exports.UserCollection = UserCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../entity");

var _contentstackError = require("../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _organization = require("../organization");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace User
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
    this.update = (0, _entity.update)(http, 'user');
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

    this["delete"] = (0, _entity.deleteEntity)(http);
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
      }, _contentstackError2["default"]);
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
      }, _contentstackError2["default"]);
    };

    if (this.organizations) {
      this.organizations = new _organization.OrganizationCollection(http, {
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
      var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(params) {
        var headers, response;
        return _regenerator2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                headers = {};

                if (params) {
                  headers.params = _objectSpread({}, (0, _cloneDeep2["default"])(params));
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
                throw (0, _contentstackError2["default"])(response);

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](2);
                throw (0, _contentstackError2["default"])(_context.t0);

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

function UserCollection(http, data) {
  var users = data.collaborators || data.shares || [];
  var obj = (0, _cloneDeep2["default"])(users);
  var userCollection = obj.map(function (userdata) {
    return new User(http, {
      user: userdata
    });
  });
  return userCollection;
}