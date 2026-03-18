import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  deleteEntity,
  fetchAll
} from '../../entity'
import { TeamUsers } from './teamUsers'
import { StackRoleMappings } from './stackRoleMappings'
import error from '../../core/contentstackError'

export function Teams (http, data) {
  this.organizationUid = data.organizationUid
  this.urlPath = `/organizations/${this.organizationUid}/teams`
  if (data && data.uid) {
    Object.assign(this, cloneDeep(data))

    this.urlPath = `/organizations/${this.organizationUid}/teams/${this.uid}`

    /**
     * @description The update call allows you to update details of a team.
     * @memberof Teams
     * @func update
     * @async
     * @param {Object} updateData - Team update data.
     * @prop {string} updateData.name - Team name.
     * @prop {Array<Object>} updateData.users - Array of user objects with email property.
     * @prop {string} updateData.organizationRole - Organization role UID.
     * @prop {Array} updateData.stackRoleMapping - Stack role mappings.
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const updateData = {
     *    name: 'updatedname',
     *    users: [
     *      {
     *          email: 'abc@abc.com'
     *      }
     *    ],
     *    organizationRole: 'blt0000000000000000',
     *    stackRoleMapping: []
     *   }
     * client.organization('organizationUid').teams('teamUid').update(updateData)
     * .then((response) => console.log(response))
     *
     */
    this.update = async (updateData) => {
      try {
        const response = await http.put(this.urlPath, updateData)
        if (response.data) {
          return response.data
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The delete call deletes an existing team.
     * @memberof Teams
     * @func delete
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').delete()
     * .then((response) => console.log(response))
     *
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch call fetches the existing team details.
     * @memberof Teams
     * @func fetch
     * @returns {Promise<Teams>} Promise for Teams instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').fetch()
     * .then((response) => console.log(response))
     *
     */
    this.fetch = fetch(http, 'team')

    /**
     * @description The teamUsers call returns a TeamUsers instance for managing team users.
     * @memberof Teams
     * @func teamUsers
     * @returns {TeamUsers} Instance of TeamUsers.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').teamUsers().fetchAll()
     *  .then((response) => console.log(response))
     *
     */
    this.teamUsers = (userId = null) => {
      data.organizationUid = this.organizationUid
      data.teamUid = this.uid
      if (userId) {
        data.userId = userId
      }
      return new TeamUsers(http, data)
    }

    /**
     * @description The stackRoleMappings call returns a StackRoleMappings instance for managing stack role mappings.
     * @memberof Teams
     * @func stackRoleMappings
     * @returns {StackRoleMappings} Instance of StackRoleMappings.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').stackRoleMappings().fetchAll()
     *  .then((response) => console.log(response))
     *
     */
    this.stackRoleMappings = (stackApiKey = null) => {
      data.organizationUid = this.organizationUid
      data.teamUid = this.uid
      if (stackApiKey) {
        data.stackApiKey = stackApiKey
      }
      return new StackRoleMappings(http, data)
    }
  } else {
    /**
     * @description The create call creates a new team.
     * @memberof Teams
     * @func create
     * @returns {Promise<Teams>} Promise for Teams instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const team = {
     *    name: 'name',
     *    organizationUid: 'organization_uid',
     *    users: [],
     *    stackRoleMapping: [],
     *    organizationRole: 'organizationRole'
     * }
     * client.organization('organizationUid').teams().create(team)
     * .then((response) => console.log(response))
     *
     */
    this.create = create({ http })

    /**
     * @description The fetchAll call allows you to fetch details of all teams.
     * @memberof Teams
     * @func fetchAll
     * @returns {Promise<ContentstackCollection>} Promise for ContentstackCollection instance.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organizationUid').teams().fetchAll()
     * .then((response) => console.log(response))
     */
    this.fetchAll = fetchAll(http, TeamsCollection, { api_version: 1.1 })
  }
}
export function TeamsCollection (http, teamsData) {
  const obj = cloneDeep(teamsData.teams) || []
  const teamsCollection = obj.map((team) => {
    return new Teams(http, team)
  })
  return teamsCollection
}
