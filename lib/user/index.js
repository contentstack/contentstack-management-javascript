
import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity } from '../entity'
import error from '../core/contentstackError'
import { OrganizationCollection } from '../organization'
/**
 * All accounts registered with Contentstack are known as Users. A stack can have many users with varying permissions and roles. Read Users to learn more.
 * @namespace User
 */
export function User (http, data) {
  Object.assign(this, cloneDeep(data.user))

  this.urlPath = '/user'
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
    this.update = update(http, 'user')

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
    this.delete = deleteEntity(http)

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
      return http.post('/user/forgot_password', { user: { email: this.email } })
        .then((response) => {
          return response.data
        }, error)
    }

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
    this.resetPassword = function ({ resetPasswordToken, password, passwordConfirm }) {
      return http.post('/user/reset_password', { user:
      {
        reset_password_token: resetPasswordToken,
        password: password,
        password_confirmation: passwordConfirm
      }
      })
        .then((response) => {
          return response.data
        }, error)
    }

    if (this.organizations) {
      this.organizations = new OrganizationCollection(http, { organizations: this.organizations })
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

    this.getTasks = async (params) => {
      const headers = {}
      if (params) {
        headers.params = {
            ...cloneDeep(params)
        }
      }
      try {
        const response = await http.get(`/user/assignments`, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
  return this
}

export function UserCollection (http, data) {
  const users = data.collaborators || data.shares || []
  const obj = cloneDeep(users)
  const userCollection = obj.map((userdata) => {
    return new User(http, { user: userdata })
  })
  return userCollection
}
