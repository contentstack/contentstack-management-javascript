import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { StackRoleMappings } from '../../lib/organization/teams/stackRoleMappings'
import { stackRoleMappingMock } from './mock/objects'
import { TEST_API_KEY as STACK_API_KEY } from '../helpers/testSecrets'

describe('Contentstack Team Stack Role Mapping test', () => {
  it('should fetch all the roles', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams/team_uid/stack_role_mappings`).reply(200, stackRoleMappingMock)
    makeStackRoleMapping().fetchAll()
      .then((response) => {
        expect(response.stackRoleMappings).to.be.not.equal(undefined)
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
        stackApiKey: STACK_API_KEY,
        roles: [
          'role_uid1',
          'role_uid2'
        ]
      }
    }
    var mock = new MockAdapter(Axios)
    mock.onPut(`/organizations/organization_uid/teams/team_uid/stack_role_mappings/${STACK_API_KEY}`).reply(200, updateStackRoleMappingMock)
    const stackRoleMappings = {
      roles: [
        'role_uid1',
        'role_uid2'
      ]
    }
    makeStackRoleMapping({ stackApiKey: STACK_API_KEY }).update(stackRoleMappings)
      .then((response) => {
        expect(response.stackRoleMapping).not.to.be.equal(undefined)
        expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
        expect(response.stackRoleMapping.stackApiKey).to.be.equal(STACK_API_KEY)
        done()
      })
      .catch(done)
  })
  it('should delete stack role mapping when stack api key is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/organizations/organization_uid/teams/team_uid/stack_role_mappings/${STACK_API_KEY}`).reply(200, { status: 204 })
    makeStackRoleMapping({ stackApiKey: STACK_API_KEY }).delete()
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
