import cloneDeep from 'lodash/cloneDeep'
import { update, deleteEntity, fetch } from '../../entity'

/**
 * A role is a collection of permissions that will be applicable to all the users who are assigned this role. Read more about <a href= 'https://www.contentstack.com/docs/guide/users-and-roles#roles'>Roles</a>.
 * @namespace Role
 */
export function Role (http, data) {
  const role = cloneDeep(data.role)
  const urlPath = `/roles/${role.uid}`
  const stackHeaders = { headers: data.stackHeaders }

  /**
   * @description The Update role call lets you modify an existing role of your stack.
   * @memberof Role
   * @func update
   * @returns {Promise<Role.Role>} Promise for Role instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').role('role_uid').fetch()
   * .then((role) => {
   *  role.name = 'My New Role'
   *  role.description = 'Role description'
   *  return role.update()
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
   * @description The Delete role call deletes an existing role from your stack.
   * @memberof Role
   * @func delete
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
   * @description The Get a single role request returns comprehensive information on a specific role.
   * @memberof Role
   * @func fetch
   * @returns {Promise<Role.Role>} Promise for Role instance
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
