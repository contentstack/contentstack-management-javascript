/**
 * @namespace StackRoleMappings
 */
import cloneDeep from 'lodash/cloneDeep'
import {
  deleteEntity
} from '../../../entity'
import error from '../../../core/contentstackError'

export function StackRoleMappings (http, data) {
  const _urlPath = `/organizations/${data.organizationUid}/teams/${data.teamUid}/stack_role_mappings`
  if (data && data.stackApiKey) {
    Object.assign(this, cloneDeep(data))

    if (this.organizationUid) this.urlPath = `${_urlPath}/${this.stackApiKey}`
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
    this.update = async (updateData, params = {}) => {
      try {
        const response = await http.put(this.urlPath, updateData, { params })
        if (response.data) {
          return response.data
        }
      } catch (err) {
        throw error(err)
      }
    }

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
    this.add = async (updateData, params = {}) => {
      try {
        const response = await http.post(this.urlPath, updateData, { params })
        if (response.data) {
          return response.data
        }
      } catch (err) {
        throw error(err)
      }
    }

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
    this.fetchAll = async () => {
      try {
        const response = await http.get(this.urlPath)
        if (response.data) {
          return response.data
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
}
