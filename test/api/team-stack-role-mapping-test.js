import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

const stackApiKey = 'stackApiKey'
const organizationUid = 'organizationUid'
const teamUid = 'teamUid'

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should fetch all stackRoleMappings', done => {
    makestackRoleMappings(organizationUid, teamUid).fetchAll().then((response) => {
      expect(response.stackRoleMappings).to.be.not.equal(undefined)
      done()
    })
      .catch(done)
  })
  it('should add roles', done => {
    const stackRoleMappings = {
      stackApiKey: 'stackApiKey',
      roles: [
        'role_uid'
      ]
    }
    makestackRoleMappings(organizationUid, teamUid).add(stackRoleMappings).then((response) => {
      expect(response.stackRoleMapping).not.to.be.equal(undefined)
      expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
      expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackRoleMappings.stackApiKey)
      done()
    })
      .catch(done)
  })
  it('should update roles', done => {
    const stackRoleMappings = {
      roles: [
        'role_uid1',
        'role_uid2'
      ]
    }
    makestackRoleMappings(organizationUid, teamUid, stackApiKey).update(stackRoleMappings).then((response) => {
      expect(response.stackRoleMapping).not.to.be.equal(undefined)
      expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
      expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackApiKey)
      done()
    })
      .catch(done)
  })
  it('should delete roles', done => {
    makestackRoleMappings(organizationUid, teamUid, stackApiKey).delete().then((response) => {
      expect(response.status).to.be.equal(204)
      done()
    })
      .catch(done)
  })
})

function makestackRoleMappings (organizationUid, teamUid, stackApiKey = null) {
  return client.organization(organizationUid).teams(teamUid).stackRoleMappings(stackApiKey)
}
