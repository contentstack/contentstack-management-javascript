import { expect } from "chai";
import { Organization } from "../../types/organization";

let teamUid = 'teamUid'
let stackApiKey = 'stackApiKey'
export function testTeamStackRoleMapping (organization: Organization) {
  describe('Contentstack Teams Stack Role Mapping test', () => {
    it('should fetch all stackRoleMappings', done => {
      organization.teams(teamUid).stackRoleMappings().fetchAll().then((response) => {
        expect(response).to.be.not.equal(undefined)
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
      organization.teams(teamUid).stackRoleMappings().add(stackRoleMappings).then((response) => {
        expect(response.stackRoleMapping).not.to.be.equal(undefined)
        expect(response.stackRoleMapping.roles[0]).to.be.equal(stackRoleMappings.roles[0])
        expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackRoleMappings.stackApiKey)
        done()
      })
      .catch(done)
    })
    it('should update roles', (done) => {
      const stackRoleMappings = {
        roles: [
          'role_uid1',
          'role_uid2'
        ]
      }
        organization.teams(teamUid).stackRoleMappings(stackApiKey).update(stackRoleMappings).then((response) => {
          expect(response).not.to.be.equal(undefined)
          expect(response.stackRoleMapping.roles).to.be.eql(stackRoleMappings.roles)
          expect(response.stackRoleMapping.stackApiKey).to.be.equal(stackApiKey)
          done()
        })
        .catch(done)
    })
    it('should delete roles', done => {
      organization.teams(teamUid).stackRoleMappings(stackApiKey).delete().then((response) => {
        expect(response.status).to.be.equal(204)
        done()
      })
      .catch(done)
    })
  })
}

