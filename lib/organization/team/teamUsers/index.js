import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  deleteEntity,
  query
} from '../../../entity'

export function TeamUsers (http, data) {
  if (data && data.userId) {
    Object.assign(this, cloneDeep(data))

    const _urlPath = `/organizations/${this.organizationUid}/teams/${this.teamUid}/users/${data.userId}`
    if (this.organizationUid) this.urlPath = _urlPath

    /**
     * @description The Remove teamUser call is used to remove an existing user of that team.
     * @memberof TeamUsers
     * @func remove
     * @returns {Promise<TeamUsers.TeamUsers>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organizationUid').teams('teamUid').users('userId').remove()
     * .then((response) => console.log(response))
     *
     */
    this.remove = deleteEntity(http)
  } else {
    this.urlPath = `/organizations/${data.organizationUid}/teams/${data.teamUid}/users`

    /**
     * @description The Add teamUser call is used to add an user the team.
     * @memberof TeamUsers
     * @func add
     * @returns {Promise<TeamUsers.TeamUsers>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const usersMail = {
     *    emails: ['emailId1','emailId2' ]
     * }
     * client.organization('organizationUid').teams('teamUid').users('userId').add(usersMail)
     * .then((response) => console.log(response))
     *
     */
    this.add = create({ http })

    /**
     * @description The Query on teamUser will allow to fetch details of all teamUsers.
     * @memberof TeamUsers
     * @func query
     * @returns {Promise<TeamUsers.TeamUsers>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const usersMail = {
     * emails: ['emailId1','emailId2' ]}
     * client.organization('organizationUid').teams('teamUid').users('userId').query().find()
     * .then((response) => console.log(response))
     *
     */
    this.query = query({ http: http, wrapperCollection: UsersCollection })
  }
}
export function UsersCollection (http, data) {
  const obj = cloneDeep(data.users) || []
  const usersCollection = obj.map((user) => {
    return new TeamUsers(http, { userId: user })
  })
  return usersCollection
}
