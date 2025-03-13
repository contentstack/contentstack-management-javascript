import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}

const organizationUid = process.env.ORGANIZATION
const stackApiKey = process.env.API_KEY
let userId = ''
let teamUid1 = ''
let teamUid2 = ''
let orgAdminRole = ''
let adminRole = ''
let contentManagerRole = ''
let developerRole = ''

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    const orgRoles = jsonReader('orgRoles.json')
    orgAdminRole = orgRoles.find(role => role.name === 'admin').uid
  })

  it('should create new team 1 when required object is passed', async () => {
    const response = await makeTeams().create({
      name: 'test_team1',
      users: [],
      stackRoleMapping: [],
      organizationRole: orgAdminRole })
    teamUid1 = response.uid
    expect(response.uid).not.to.be.equal(null)
    expect(response.name).not.to.be.equal(null)
    expect(response.stackRoleMapping).not.to.be.equal(null)
    expect(response.organizationRole).not.to.be.equal(null)
  })

  it('should create new team 2 when required object is passed', async () => {
    const response = await makeTeams().create({
      name: 'test_team2',
      users: [],
      stackRoleMapping: [],
      organizationRole: orgAdminRole })
    teamUid2 = response.uid
    expect(response.uid).not.to.be.equal(null)
    expect(response.name).not.to.be.equal(null)
    expect(response.stackRoleMapping).not.to.be.equal(null)
    expect(response.organizationRole).not.to.be.equal(null)
  })

  it('should get all the teams when correct organization uid is passed', async () => {
    const response = await makeTeams().fetchAll()
    expect(response.items[0].organizationUid).to.be.equal(organizationUid)
    expect(response.items[0].name).not.to.be.equal(null)
    expect(response.items[0].created_by).not.to.be.equal(null)
    expect(response.items[0].updated_by).not.to.be.equal(null)
  })

  it('should fetch the team when team uid is passed', async () => {
    const response = await makeTeams(teamUid1).fetch()
    expect(response.uid).to.be.equal(teamUid1)
    expect(response.organizationUid).to.be.equal(organizationUid)
    expect(response.name).not.to.be.equal(null)
    expect(response.created_by).not.to.be.equal(null)
    expect(response.updated_by).not.to.be.equal(null)
  })

  it('should update team when updating data is passed', async () => {
    const updateData = {
      name: 'name',
      users: [
        {
          email: process.env.EMAIL
        }
      ],
      organizationRole: '',
      stackRoleMapping: []
    }
    await makeTeams(teamUid1).update(updateData)
      .then((team) => {
        expect(team.name).to.be.equal(updateData.name)
        expect(team.createdByUserName).not.to.be.equal(undefined)
        expect(team.updatedByUserName).not.to.be.equal(undefined)
      })
  })

  it('should delete team 1 when team uid is passed', async () => {
    const response = await makeTeams(teamUid1).delete()
    expect(response.status).to.be.equal(204)
  })
})

describe('Teams Stack Role Mapping API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    const stackRoles = jsonReader('roles.json')
    adminRole = stackRoles.find(role => role.name === 'Admin').uid
    contentManagerRole = stackRoles.find(role => role.name === 'Content Manager').uid
    developerRole = stackRoles.find(role => role.name === 'Developer').uid
  })

  it('should add roles', done => {
    const stackRoleMappings = {
      stackApiKey: stackApiKey,
      roles: [
        adminRole
      ]
    }
    makestackRoleMappings(teamUid2).add(stackRoleMappings).then((response) => {
      expect(response.stackRoleMapping).not.to.be.equal(undefined)
      expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
      expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackRoleMappings.stackApiKey)
      done()
    })
      .catch(done)
  })

  it('should fetch all stackRoleMappings', done => {
    makestackRoleMappings(teamUid2).fetchAll().then((response) => {
      expect(response.stackRoleMappings).to.be.not.equal(undefined)
      done()
    })
      .catch(done)
  })

  it('should update roles', done => {
    const stackRoleMappings = {
      roles: [
        adminRole,
        contentManagerRole,
        developerRole
      ]
    }
    makestackRoleMappings(teamUid2, stackApiKey).update(stackRoleMappings).then((response) => {
      expect(response.stackRoleMapping).not.to.be.equal(undefined)
      expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
      expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackApiKey)
      done()
    })
      .catch(done)
  })

  it('should delete roles', done => {
    makestackRoleMappings(teamUid2, stackApiKey).delete().then((response) => {
      expect(response.status).to.be.equal(204)
      done()
    })
      .catch(done)
  })
})

describe('Teams Users API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should add the user when user\'s mail is passed', done => {
    const usersMail = {
      emails: ['email1@email.com']
    }
    makeUsers(teamUid2).add(usersMail).then((response) => {
      expect(response.status).to.be.equal(201)
      done()
    })
      .catch(done)
  })

  it('should fetch all users', done => {
    makeUsers(teamUid2).fetchAll().then((response) => {
      response.items.forEach((user) => {
        userId = response.items[0].userId
        expect(user.userId).to.be.not.equal(null)
        done()
      })
    })
      .catch(done)
  })

  it('should remove the user when uid is passed', done => {
    makeUsers(teamUid2, userId).remove().then((response) => {
      expect(response.status).to.be.equal(204)
      done()
    })
      .catch(done)
  })

  it('should delete team 2 when team uid is passed', async () => {
    const response = await makeTeams(teamUid2).delete()
    expect(response.status).to.be.equal(204)
  })
})

function makeTeams (teamUid = null) {
  return client.organization(organizationUid).teams(teamUid)
}

function makestackRoleMappings (teamUid, stackApiKey = null) {
  return client.organization(organizationUid).teams(teamUid).stackRoleMappings(stackApiKey)
}

function makeUsers (teamUid, userId = null) {
  return client.organization(organizationUid).teams(teamUid).teamUsers(userId)
}
