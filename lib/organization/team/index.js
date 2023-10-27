import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  update,
  query,
  deleteEntity,
  parseData,
  fetchAll
} from '../../entity'

export function Teams (http, data) {
  this.organization_uid = data.organization_uid

  this.urlPath = `/organizations/${this.organization_uid}/teams`

  if (data && data.team) {
    Object.assign(this, cloneDeep(data.team))
    console.log('org uid 2', this.organization_uid)

    this.urlPath = `/organizations/${this.organization_uid}/teams/${this.uid}`

    this.update = update(http, 'team')

    this.delete = deleteEntity(http)

    this.fetch = fetch(http, 'team')
  } else {
    this.create = create({ http })
    this.query = fetchAll(http, TeamsCollection)
    // this.query = query({ http: http, wrapperCollection: TeamsCollection })
  }
}
export function TeamsCollection (http, teamsData) {
  const obj = cloneDeep(teamsData.teams) || []
  const teamsCollection = obj.map((team) => {
    return new Teams(http, { team: team })
  })
  return teamsCollection
}
