import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  deleteEntity,
  fetchAll
} from '../../entity'
import { TeamUsers } from './teamUsers'
import { StackRoleMappings } from './stackRoleMapping'
import error from '../../core/contentstackError'

export function Teams (http, data) {
  this.organizationUid = data.organizationUid
  this.urlPath = `/organizations/${this.organizationUid}/teams`
  if (data && data.uid) {
    Object.assign(this, cloneDeep(data))

    this.urlPath = `/organizations/${this.organizationUid}/teams/${this.uid}`

    /**
     * @description The update call on team will allow to update details of team.
     * @memberof Teams
     * @func update
     * @returns {Promise<Teams.Teams>} Response Object.
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
     *    organizationRole: 'blt09e5dfced326aaea',
     *    stackRoleMapping: []
     *   }
     * client.organization(s'organizationUid').teams('teamUid').update(updateData)
     * .then((response) => console.log(response))
     *
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
     * @description The delete call on team will delete the existing team.
     * @memberof Teams
     * @func delete
     * @returns {Promise<Teams.Teams>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').delete()
     * .then((response) => console.log(response))
     *
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch call on team will delete the existing team.
     * @memberof Teams
     * @func fetch
     * @returns {Promise<Teams.Teams>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').fetch()
     * .then((response) => console.log(response))
     *
     */
    this.fetch = fetch(http, 'team')

    /**
     * @description The users call on team will get users details.
     * @memberof Teams
     * @func users
     * @returns {Promise<Teams.Teams>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * client.organization('organizationUid').teams('teamUid').users().fetchAll()
     * .then((response) => console.log(response))
     *
     */
    this.users = (userId = null) => {
      data.organizationUid = this.organizationUid
      data.teamUid = this.uid
      if (userId) {
        data.userId = userId
      }
      return new TeamUsers(http, data)
    }

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
     * @description The fetch call on team will delete the existing team.
     * @memberof Teams
     * @func create
     * @returns {Promise<Teams.Teams>} Response Object.
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
     * @description The fetchAll on team will allow to fetch details of all teams.
     * @memberof Teams
     * @func fetchAll
     * @returns {Promise<Teams.Teams>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organizationUid').teams().fetchAll()
     * .then((response) => console.log(response))
     */
    this.fetchAll = fetchAll(http, TeamsCollection)
  }
}
export function TeamsCollection (http, teamsData) {
  const obj = cloneDeep(teamsData) || []
  const teamsCollection = obj.map((team) => {
    return new Teams(http, team)
  })
  return teamsCollection
}
