import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity, fetch } from '../../entity'
export function Role (http, data) {
  const role = cloneDeep(data.role)
  const urlPath = `/roles/${role.uid}`
  const stackHeaders = { headers: data.stackHeaders }

  /**
   * @description The Update stack call lets you update the name and description of an existing stack.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').role('role_uid').fetch()
   * .then((role) => {
   *  role.name = 'My New Role'
   *  role.description = 'Role description'
   *  return role.update
   * })
   * .then((role) => console.log(role))
   *
   */
  role.update = function () {
    const data = cloneDeep(this)
    const updateData = {
      role: data
    }
    return update(http, urlPath, updateData, stackHeaders, Role)
  }

  /**
   * @description The Delete stack call is used to delete an existing stack permanently from your Contentstack account.
   * @returns {String} Success message.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').role('role_uid').delete()
   * .then((notice) => console.log(notice))
   */
  role.delete = function () {
    return deleteEntity(urlPath, stackHeaders)
  }

  /**
   * @description The fetch stack call fetches stack details.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').role('role_uid').fetch()
   * .then((role) => console.log(role))
   *
   */
  role.fetch = function () {
    return fetch(http, urlPath, stackHeaders, Role)
  }

  return role
}

export function RoleCollection (http, data) {
  const obj = cloneDeep(data.roles)
  const roleCollection = obj.map((userdata) => {
    return Role(http, { role: userdata, stackHeaders: data.stackHeaders })
  })
  return roleCollection
}
