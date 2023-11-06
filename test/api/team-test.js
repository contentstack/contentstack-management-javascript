import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

const organizationUid = 'organizationUid'
const teamUid = 'teamUid'
const deleteUid = 'deleteUid'

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should get all the teams when correct organization uid is passed', async () => {
    const response = await makeTeams(organizationUid).fetchAll()
    expect(response.items[0].organizationUid).to.be.equal(organizationUid)
    expect(response.items[0].name).not.to.be.equal(null)
    expect(response.items[0].created_by).not.to.be.equal(null)
    expect(response.items[0].updated_by).not.to.be.equal(null)
  })
  it('should fetch the team when correct organization uid and team uid is passed', async () => {
    const response = await makeTeams(organizationUid, teamUid).fetch()
    expect(response.uid).to.be.equal(teamUid)
    expect(response.organizationUid).to.be.equal(organizationUid)
    expect(response.name).not.to.be.equal(null)
    expect(response.created_by).not.to.be.equal(null)
    expect(response.updated_by).not.to.be.equal(null)
  })
  it('should create new team when required object is passed', async () => {
    const response = await makeTeams(organizationUid).create({
      name: 'test_team11111',
      users: [],
      stackRoleMapping: [],
      organizationRole: 'blt09e5dfced326aaea' })
    expect(response.uid).not.to.be.equal(null)
    expect(response.name).not.to.be.equal(null)
    expect(response.stackRoleMapping).not.to.be.equal(null)
    expect(response.organizationRole).not.to.be.equal(null)
  })
  it('should delete team when correct organization uid and team uid is passed', async () => {
    const response = await makeTeams(organizationUid, deleteUid).delete()
    expect(response.status).to.be.equal(204)
  })
  it('should update team when updating data is passed', async () => {
    const updateData = {
      name: 'name',
      users: [
        {
          email: 'abc@abc.com'
        }
      ],
      organizationRole: '',
      stackRoleMapping: []
    }
    await makeTeams(organizationUid, teamUid).update(updateData)
      .then((team) => {
        expect(team.name).to.be.equal(updateData.name)
        expect(team.createdByUserName).not.to.be.equal(undefined)
        expect(team.updatedByUserName).not.to.be.equal(undefined)
      })
  })
})

function makeTeams (organizationUid, teamUid = null) {
  return client.organization(organizationUid).teams(teamUid)
}
