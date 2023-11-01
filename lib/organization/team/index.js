import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  update,
  deleteEntity,
  fetchAll
} from '../../entity'
import { TeamUsers } from './teamUsers'

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
     * client.organization(s'organizationUid').teams('teamUid')
     * .then((response) => console.log(response))
     *
     */
    this.update = update(http, 'team')

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
