import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { StackRoleMappings } from '../../lib/organization/teams/stackRoleMappings'
import { stackRoleMappingMock } from './mock/objects'

describe('Contentstack Team Stack Role Mapping test', () => {
  it('should fetch all the roles', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams/team_uid/stack_role_mappings`).reply(200, stackRoleMappingMock)
    makeStackRoleMapping().fetchAll()
      .then((roles) => {
        console.log('🚀 ~ file: team-stack-role-mapping-test.js:14 ~ .then ~ roles:', roles)
        done()
      })
      .catch(done)
  })
  it('should add roles when correct data is passed', done => {
    const addStackRoleMappingMock = {
      stackRoleMapping: {
        stackApiKey: 'stackApiKey',
        roles: [
          'role_uid'
        ]
      }
    }
    var mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/organization_uid/teams/team_uid/stack_role_mappings`).reply(200, addStackRoleMappingMock)
    const addRole = {
      stackApiKey: 'stackApiKey',
      roles: [
        'role_uid'

      ]
    }
    makeStackRoleMapping()
      .add(addRole)
      .then((response) => {
        expect(response.stackRoleMapping).not.to.be.equal(undefined)
        expect(response.stackRoleMapping.roles[0]).to.be.equal(addRole.roles[0])
        expect(response.stackRoleMapping.stackApiKey).to.be.equal(addRole.stackApiKey)
        done()
      })
      .catch(done)
  })
  it('should update stack role mapping when stack api key and updateData are passed', done => {
    const updateStackRoleMappingMock = {
      stackRoleMapping: {
        stackApiKey: 'STACKAPIKEY',
        roles: [
          'role_uid1',
          'role_uid2'
        ]
      }
    }
    var mock = new MockAdapter(Axios)
    mock.onPut(`/organizations/organization_uid/teams/team_uid/stack_role_mappings/STACKAPIKEY`).reply(200, updateStackRoleMappingMock)
    const stackRoleMappings = {
      roles: [
        'role_uid1',
        'role_uid2'
      ]
    }
    makeStackRoleMapping({ stackApiKey: 'STACKAPIKEY' }).update(stackRoleMappings)
      .then((response) => {
        expect(response.stackRoleMapping).not.to.be.equal(undefined)
        expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
        expect(response.stackRoleMapping.stackApiKey).to.be.equal('STACKAPIKEY')
        done()
      })
      .catch(done)
  })
  it('should delete stack role mapping when stack api key is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/organizations/organization_uid/teams/team_uid/stack_role_mappings/STACKAPIKEY`).reply(200, { status: 204 })
    makeStackRoleMapping({ stackApiKey: 'STACKAPIKEY' }).delete()
      .then((response) => {
        expect(response.status).to.be.equal(204)
        done()
      })
      .catch(done)
  })
})

function makeStackRoleMapping (data = {}) {
  return new StackRoleMappings(Axios, { organizationUid: 'organization_uid', teamUid: 'team_uid', ...data })
}
