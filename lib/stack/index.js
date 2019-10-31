import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { UserCollection } from '../user/index'
import { Role, RoleCollection } from './roles/index'
import { entity, update, deleteEntity, fetch } from '../entity'

export function Stack (http, data) {
  const stack = cloneDeep(data.stack)
  const urlPath = '/stacks'
  const stackHeaders = { headers: { api_key: stack.api_key } }
  /**
   * @description The Update stack call lets you update the name and description of an existing stack.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').fetch()
   * .then((stack) => {
   *  stack.name = 'My New Stack'
   *  stack.description = 'My new test stack'
   *  return stack.update
   * })
   * .then((stack) => console.log(stack))
   *
   */
  stack.update = function () {
    const data = cloneDeep(this)
    const updateData = {
      stack: data
    }
    return update(http, urlPath, updateData, stackHeaders, Stack)
  }

  /**
   * @description The Delete stack call is used to delete an existing stack permanently from your Contentstack account.
   * @returns {String} Success message.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').delete()
   * .then((notice) => console.log(notice))
   */
  stack.delete = function () {
    return deleteEntity(http, urlPath, stackHeaders)
  }

  /**
   * @description The fetch stack call fetches stack details.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').fetch()
   * .then((stack) => console.log(stack))
   *
   */
  stack.fetch = function () {
    return fetch(http, urlPath, stackHeaders, Stack)
  }

  /**
   * @description The Get all users of a stack call fetches the list of all users of a particular stack
   * @returns {Array<User>} Array of User's including owner of Stack
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').users()
   * .then((users) => console.log(users))
   *
   */
  stack.users = function () {
    return http.get(urlPath, {
      params: {
        include_collaborators: true
      },
      headers: stackHeaders.headers
    })
      .then((response) => {
        return UserCollection(http, response.data.stack.collaborators)
      }, error)
  }

  /**
   * @description The Transfer stack ownership to other users call sends the specified user an email invitation for accepting the ownership of a particular stack.
   * @param {String} email The email address of the user to whom you wish to transfer the ownership of the stack.
   * @returns {String} Success message of transfer ownership.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').transferOwnership('emailId')
   * .then((notice) => console.log(notice))
   *
   */

  stack.transferOwnership = function (email) {
    return http.post(`${urlPath}/transfer_ownership`, { transfer_to: email }, stackHeaders)
      .then((response) => {
        return response.data.notice
      }, error)
  }

  /**
   * @description The Get stack settings call retrieves the configuration settings of an existing stack.
   * @returns {Object} Configuration settings of stack.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').settings()
   * .then((settings) => console.log(settings))
   *
   */
  stack.settings = function () {
    return http.get(`${urlPath}/settings`, stackHeaders)
      .then((response) => {
        return response.data.stack_settings
      }, error)
  }

  /**
   * @description The Reset stack settings call resets your stack to default settings, and additionally, lets you add parameters to or modify the settings of an existing stack.
   * @returns {Object} Configuration settings of stack.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').resetSettings()
   * .then((settings) => console.log(settings))
   *
   */
  stack.resetSettings = function () {
    return http.post(`${urlPath}/settings`, { stack_settings: { discrete_variables: {}, stack_variables: {} } }, stackHeaders)
      .then((response) => {
        return response.data.stack_settings
      }, error)
  }

  /**
   * @description The Add stack settings call lets you add settings for an existing stack.
   * @returns {Object} Configuration settings of stack.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').addSettings({ key: 'value' })
   * .then((settings) => console.log(settings))
   *
   */
  stack.addSettings = function (stackVariables = {}) {
    return http.post(`${urlPath}/settings`, { stack_settings: { stack_variables: stackVariables } }, stackHeaders)
      .then((response) => {
        return response.data.stack_settings
      }, error)
  }

  /**
   * @description The Share a stack call shares a stack with the specified user to collaborate on the stack.
   * @param {Array<String>} emails - Email ID of the user with whom you wish to share the stack
   * @param {Array<String>} roles - The role uid that you wish to assign the user.
   * @returns {String} Success message of invitition send.
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').share([ "manager@example.com" ], { "manager@example.com": [ "abcdefhgi1234567890" ] })
   * .then((notice) => console.log(notice))
   *
   */
  stack.share = function (emails = [], roles = {}) {
    return http.post(`${urlPath}/share`, { emails: emails, roles: roles }, stackHeaders)
      .then((response) => {
        return response.data.notice
      }, error)
  }

  /**
   * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
   * @param {String} email The email ID of the user from whom you wish to unshare the stack.
   * @returns {String} Success message of unshare stack with user.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').unShare('email@id.com')
   * .then((notice) => console.log(notice))
   *
   */
  stack.unShare = function (email) {
    return http.post(`${urlPath}/unshare`, { email: email }, stackHeaders)
      .then((response) => {
        return response.data.notice
      }, error)
  }

  stack.role = function (uid = null) {
    if (!uid) {
      return entity({ http: http, urlPath: '/roles', stackHeaders: stackHeaders.h, wrapper: Role, wrapperCollection: RoleCollection })
    }
    return Role(http, { role: {
      uid: uid
    },
    stackHeaders: stackHeaders })
  }
  return stack
}

export function StackCollection (http, data) {
  const obj = cloneDeep(data.stacks)
  const stackCollection = obj.map((userdata) => {
    return Stack(http, { stack: userdata })
  })
  return stackCollection
}
