import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch } from '../../entity'
import ContentstackCollection from '../../contentstackCollection'
import error from '../../core/contentstackError'
/**
 * A role is a collection of permissions that will be applicable to all the users who are assigned this role. Read more about <a href= 'https://www.contentstack.com/docs/guide/users-and-roles#roles'>Roles</a>.
 * @namespace Role
 */
export function Role (http, data) {
  this.urlPath = `/roles`
  this.stackHeaders = data.stackHeaders
  if (data & data.role) {
    Object.assign(this, cloneDeep(data.role))
    this.urlPath = `/roles/${this.uid}`

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
    this.update = update(http, 'role')

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
    this.delete = deleteEntity(http)

    /**
     * @description The Get a single role request returns comprehensive information on a specific role.
     * @memberof Role
     * @func fetch
     * @returns {Promise<Role.Role>} Promise for Role instance
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').role('role_uid').fetch()
     * .then((role) => console.log(role))
     *
     */
    this.fetch = fetch(http, 'role')
  } else {
    /**
     * @description The Create a role call creates a new role in a stack.
     * @memberof Role
     * @func create
     * @returns {Promise<Role.Role>} Promise for Role instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().role().create({name: 'My New Stack'})
     * .then((role) => console.log(role))
     */
    this.create = create({ http: http })

    /**
     * @description The ‘Get all roles’ request returns comprehensive information about all roles created in a stack.
     * @memberof Role
     * @func findAll
     * @returns {ContentstackCollection} Object of ContentstackCollection/
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().role().findAll()
     * .then((stack) => console.log(stack))
     */
    this.fetchAll = () => {
      return async function (params = {}) {
        const headers = {
          params: { ...cloneDeep(params) },
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        } || {}
        try {
          const response = await http.get(this.urlPath, headers)
          if (response.data) {
            return new ContentstackCollection(response, http, this.stackHeaders, RoleCollection)
          } else {
            throw error(response)
          }
        } catch (err) {
          throw error(err)
        }
      }
    }
  }
  return this
}

export function RoleCollection (http, data) {
  const obj = cloneDeep(data.roles)
  const roleCollection = obj.map((userdata) => {
    return new Role(http, { role: userdata, stackHeaders: data.stackHeaders })
  })
  return roleCollection
}
