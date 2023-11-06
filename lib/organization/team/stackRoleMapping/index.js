/**
 * @namespace StackRoleMappings
 */
import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetchAll
} from '../../../entity'

export function StackRoleMappings (http, data) {
  console.log("🚀 ~ file: index.js:13 ~ StackRoleMappings ~ data:", data)
  const _urlPath = `/organizations/${data.organizationUid}/teams/${data.teamUid}/stack_role_mappings`
  if (data && data.stackApiKey) {
    Object.assign(this, cloneDeep(data))

    this.urlPath = `${_urlPath}/${this.stackApiKey}`
    /**
     * @description The update stackRoleMappings call is used to update the roles.
     * @memberof StackRoleMappings
     * @func update
     * @returns {Promise<StackRoleMappings.StackRoleMappings>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const updateRoles = {
     *  roles: [
     *    'roles_uid1',
     *    'roles_uid2'
     *    ]
     *  }
     * client.organization('organizationUid').teams('teamUid').stackRoleMappings('stackApiKey').update(updateRoles)
     * .then((response) => console.log(response))
     */
    this.update = update(http, 'stackRoleMapping')

    /**
     * @description The delete stackRoleMappings call is used to delete the roles.
     * @memberof StackRoleMappings
     * @func delete
     * @returns {Promise<StackRoleMappings.StackRoleMappings>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organizationUid').teams('teamUid').stackRoleMappings('stackApiKey').delete()
     * .then((response) => console.log(response))
     */
    this.delete = deleteEntity(http)
  } else {
    // const _urlPath = `/organizations/${data.organizationUid}/teams/${data.teamUid}/stack_role_mappings`
    this.urlPath = _urlPath
    /**
     * @description The add stackRoleMappings call is used to add the roles.
     * @memberof StackRoleMappings
     * @func add
     * @returns {Promise<StackRoleMappings.StackRoleMappings>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const addRole = {
     *  'stackApiKey: 'stackApiKey',
     *  'roles': [
     *    'role_uid'
     *    ]
     * }
     * client.organization('organizationUid').teams('teamUid').stackRoleMappings().add(addRole)
     * .then((response) => console.log(response))
     */
    this.add = create({ http })

    /**
     * @description The fetchAll stackRoleMappings call is used to fetchAll the roles.
     * @memberof StackRoleMappings
     * @func fetchAll
     * @returns {Promise<StackRoleMappings.StackRoleMappings>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organizationUid').teams('teamUid').stackRoleMappings().fetchAll
     * .then((response) => console.log(response))
     */
    this.fetchAll = fetchAll(http, stackRoleMappingsCollection)
  }
}
export function stackRoleMappingsCollection (http, data) {
  const obj = cloneDeep(data.stackRoleMappings) || []
  const stackRoleMappingCollection = obj.map((stackRoleMappings) => {
    return new StackRoleMappings(http, { stackRoleMappings: stackRoleMappings })
  })
  return stackRoleMappingCollection
}
