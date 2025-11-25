import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query, fetchAll } from '../../entity'
/**
 * A role is a collection of permissions that will be applicable to all the users who are assigned this role. Read more about <a href='https://www.contentstack.com/docs/guide/users-and-roles#roles'>Roles</a>.
 * @namespace Role
 */
export function Role (http, data) {
  this.urlPath = `/roles`
  this.stackHeaders = data.stackHeaders
  if (data.role) {
    Object.assign(this, cloneDeep(data.role))
    this.urlPath = `/roles/${this.uid}`
    if (this.stackHeaders) {
      /**
      * @description The Update role call lets you modify an existing role of your stack.
      * @memberof Role
      * @func update
      * @returns {Promise<Role>} Promise for Role instance
      * @example
      * import * as contentstack from '@contentstack/management'
      * const client = contentstack.client()
      *
      * client.stack({ api_key: 'api_key'}).role('role_uid').fetch({ include_rules: true, include_permissions: true})
      * .then((role) => {
      *  role.name = 'My New Role'
      *  role.description = 'Role description'
      *  role.rules = [
      * {
      *   module: 'asset',
      *   assets: ['$all'],
      *   acl: {
      *     read: true,
      *     create: true,
      *     update: true,
      *     publish: true,
      *     delete: true
      *   }
      * },
      * {
      *   module: 'environment',
      *   environments: [],
      *   acl: { read: true }
      * },
      * {
      *   module: 'locale',
      *   locales: [Array],
      *   acl: { read: true }
      * }]
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
       * @returns {Promise<Object>} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).role('role_uid').delete()
       * .then((response) => console.log(response.notice))
       */
      this.delete = deleteEntity(http)

      /**
       * @description The Get a single role request returns comprehensive information on a specific role.
       * @memberof Role
       * @func fetch
       * @returns {Promise<Role>} Promise for Role instance
       * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
       * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).role('role_uid').fetch()
       * .then((role) => console.log(role))
       *
       */
      this.fetch = fetch(http, 'role')
    }
  } else {
    /**
     * @description The Create a role call creates a new role in a stack.
     * @memberof Role
     * @func create
     * @returns {Promise<Role.Role>} Promise for Role instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const role =  {
     *   name: 'Role Name',
     *   description: 'From CMA Js',
     *   rules:
     *     [
     *       {
     *         module: 'environment',
     *         environments: [],
     *         acl: { read: true }
     *       },
     *       {
     *         module: 'locale',
     *         locales: [],
     *         acl: { read: true }
     *       }
     *     ],
     *   uid: 'uid'
     * }
     * client.stack().role().create({ role })
     * .then((role) => console.log(role))
     */
    this.create = create({ http: http })

    /**
     * @description The 'Get all roles' request returns comprehensive information about all roles created in a stack.
     * @memberof Role
     * @func findAll
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to 'true' to include the details of the rules assigned to a role.
     * @returns {Promise<ContentstackCollection>} Promise for ContentstackCollection instance.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().role().findAll()
     * .then((collection) => console.log(collection))
     */
    this.fetchAll = fetchAll(http, RoleCollection)

    /**
     * @description The Query on Role will allow you to fetch details of all or specific Roles.
     * @memberof Role
     * @func query
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to 'true' to include the details of the rules assigned to a role.
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).role().query({ query: { name: 'Role Name' } }).find()
     * .then((role) => console.log(role))
     */
    this.query = query({ http: http, wrapperCollection: RoleCollection })
  }
  return this
}

export function RoleCollection (http, data) {
  const obj = cloneDeep(data.roles || [])
  const roleCollection = obj.map((userdata) => {
    return new Role(http, { role: userdata, stackHeaders: data.stackHeaders })
  })
  return roleCollection
}
