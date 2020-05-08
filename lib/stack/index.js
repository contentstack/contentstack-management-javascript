import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { UserCollection } from '../user/index'
import { Role } from './roles/index'
import { create, query, update, deleteEntity, fetch } from '../entity'
import { ContentType } from './contentType/index'
import { GlobalField } from './globalField/index'
import { DeliveryToken } from './deliveryToken/index'
// import { format } from 'util'
/**
 * A stack is a space that stores the content of a project (a web or mobile property). Within a stack, you can create content structures, content entries, users, etc. related to the project. Read more about <a href='https://www.contentstack.com/docs/guide/stack'>Stacks</a>.
 * @namespace Stack
 */
export function Stack (http, data) {
  this.urlPath = '/stacks'
  if (data) {
    if (data.stack) {
      Object.assign(this, cloneDeep(data.stack))
    } else if (data.organization_uid) {
      this.organization_uid = data.organization_uid
    }
  }
  if (data && data.stack) {
    this.stackHeaders = { api_key: this.api_key }
    /**
     * @description The Update stack call lets you update the name and description of an existing stack.
     * @memberof Stack
     * @func update
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').fetch()
     * .then((stack) => {
     *  stack.name = 'My New Stack'
     *  stack.description = 'My new test stack'
     *  return stack.update()
     * })
     * .then((stack) => console.log(stack))
     *
     */
    this.update = update(http, 'stack')

    /**
     * @description The Delete stack call is used to delete an existing stack permanently from your Contentstack account.
     * @memberof Stack
     * @func delete
     *  @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch stack call fetches stack details.
     * @memberof Stack
     * @func fetch
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').fetch()
     * .then((stack) => console.log(stack))
     *
     */
    this.fetch = fetch(http, 'stack')

    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContenType} Instace of ContentType.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').contentType().create()
     * .then((contentType) => console.log(contentType))
     *
     * client.stack('api_key').contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     */
    this.contentType = (contentTypeUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (contentTypeUid) {
        data.content_type = { uid: contentTypeUid }
      }
      return new ContentType(http, data)
    }

    /**
     * @description Global field defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the Global field you want to get details.
     * @returns {ContenType} Instace of Global field.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField().create()
     * .then((globalField) => console.log(globalField))
     *
     * client.stack('api_key').globalField('globalField_uid').fetch()
     * .then((globalField) => console.log(globalField))
     */
    this.globalField = (globalFieldUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (globalFieldUid) {
        data.global_field = { uid: globalFieldUid }
      }
      return new GlobalField(http, data)
    }
    /**
     * @description Global field defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the Global field you want to get details.
     * @returns {ContenType} Instace of Global field.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').deliveryToken().create()
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     * client.stack('api_key').deliveryToken('deliveryToken_uid').fetch()
     * .then((deliveryToken) => console.log(deliveryToken))
     */
    this.deliveryToken = (deliveryTokenUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (deliveryTokenUid) {
        data.global_field = { uid: deliveryTokenUid }
      }
      return new DeliveryToken(http, data)
    }
    /**
     * @description The Get all users of a stack call fetches the list of all users of a particular stack
     * @memberof Stack
     * @func users
     * @returns {Array<User>} Array of User's including owner of Stack
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').users()
     * .then((users) => console.log(users))
     *
     */
    this.users = async () => {
      try {
        const response = await http.get(this.urlPath, {
          params: {
            include_collaborators: true
          },
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        })
        if (response.data) {
          return UserCollection(http, response.data.stack)
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Transfer stack ownership to other users call sends the specified user an email invitation for accepting the ownership of a particular stack.
     * @memberof Stack
     * @func transferOwnership
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

    this.transferOwnership = async (email) => {
      try {
        const response = await http.post(`${this.urlPath}/transfer_ownership`,
          { transfer_to: email },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.notice
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Get stack settings call retrieves the configuration settings of an existing stack.
     * @memberof Stack
     * @func settings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').settings()
     * .then((settings) => console.log(settings))
     *
     */
    this.settings = async () => {
      try {
        const response = await http.get(`${this.urlPath}/settings`,
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Reset stack settings call resets your stack to default settings, and additionally, lets you add parameters to or modify the settings of an existing stack.
     * @memberof Stack
     * @func resetSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').resetSettings()
     * .then((settings) => console.log(settings))
     *
     */
    this.resetSettings = async () => {
      try {
        const response = await http.post(`${this.urlPath}/settings`, { stack_settings: { discrete_variables: {}, stack_variables: {} } },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Add stack settings call lets you add settings for an existing stack.
     * @memberof Stack
     * @func addSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').addSettings({ key: 'value' })
     * .then((settings) => console.log(settings))
     *
     */
    this.addSettings = async (stackVariables = {}) => {
      try {
        const response = await http.post(`${this.urlPath}/settings`, { stack_settings: { stack_variables: stackVariables } },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Share a stack call shares a stack with the specified user to collaborate on the stack.
     * @memberof Stack
     * @func share
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
    this.share = async (emails = [], roles = {}) => {
      try {
        const response = await http.post(`${this.urlPath}/share`, { emails: emails, roles: roles },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.notice
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
     * @memberof Stack
     * @func unShare
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
    this.unShare = async (email) => {
      try {
        const response = await http.post(`${this.urlPath}/unshare`, { email: email },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.notice
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description A role is a collection of permissions that will be applicable to all the users who are assigned this role.
     * @memberof Stack
     * @func role
     * @param {String} uid The UID of the role you want to get details.
     * @returns {Role} Instance of Role.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').role().create({
     * "role":
     *       {
     *        "name":"testRole",
     *        "description":"",
     *        "rules":[...],
     *       }
     * })
     * .then((role) => console.log(role))
     *
     * client.stack('api_key').role('role_uid').fetch())
     * .then((role) => console.log(role))
     *
     */
    this.role = (uid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (uid) {
        data.role = { uid: uid }
      }
      return new Role(http, data)
    }
  } else {
    /**
     * @description The Create stack call creates a new stack in your Contentstack account.
     * @memberof Stack
     * @func create
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('org_uid').stack().create({name: 'My New Stack'})
     * .then((stack) => console.log(stack))
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().create({name: 'My New Stack'}, { organization_uid: 'org_uid' })
     * .then((stack) => console.log(stack))
     */
    this.create = create({ http: http, params: this.organization_uid ? { organization_uid: this.organization_uid } : null })

    /**
     * @description The Query on Stack will allow to fetch details of all or specific Stack.
     * @memberof Stack
     * @func query
     * @param {Boolean} include_collaborators Set this parameter to 'true' to include the details of the stack collaborators.
     * @param {Boolean} include_stack_variablesSet this to 'true' to display the stack variables. Stack variables are extra information about the stack, such as the description, format of date, format of time, and so on. Users can include or exclude stack variables in the response.
     * @param {Boolean} include_discrete_variables Set this to 'true' to view the access token of your stack.
     * @param {Boolean} include_count Set this to 'true' to include in the response the total count of the stacks owned by or shared with a user account.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().query({name: 'My New Stack'})
     * .then((stack) => console.log(stack))
     */
    this.query = query({ http: http, wrapperCollection: StackCollection })
  }
  return this
}

export function StackCollection (http, data) {
  const obj = cloneDeep(data.stacks)
  const stackCollection = obj.map((userdata) => {
    return new Stack(http, { stack: userdata })
  })
  return stackCollection
}
