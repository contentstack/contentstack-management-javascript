
import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity } from '../entity'
import error from '../core/contentstackError'
/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace Role
 */
export function User (http, data) {
  const user = cloneDeep(data.user)
  const urlPath = '/user'
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
  user.update = function () {
    const data = cloneDeep(this)
    const updateData = {
      user: data
    }
    return update(http, urlPath, updateData, {}, User)
  }

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
  user.delete = function () {
    return deleteEntity(urlPath, {})
  }

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
  user.requestPassword = function () {
    return http.post('/user/forgot_password', { user: { email: user.email } })
      .then((response) => {
        return response.data.notice
      }, error)
  }
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
  user.resetPassword = function ({ resetPasswordToken, password, passwordConfirm }) {
    return http.post('/user/reset_password', { user:
      {
        reset_password_token: resetPasswordToken,
        password: password,
        password_confirmation: passwordConfirm
      }
    })
      .then((response) => {
        return response.data.notice
      }, error)
  }
  return user
}

export function UserCollection (http, data) {
  const obj = cloneDeep(data)
  const userCollection = obj.map((userdata) => {
    return User(http, { user: userdata })
  })
  return userCollection
}
