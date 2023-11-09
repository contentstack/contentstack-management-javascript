import { expect } from "chai";
import { Organization } from "../../types/organization";

let teamUid = ''
export function testTeams (organization: Organization) {
  describe('Contentstack Teams test', () => {
    test('should fetch all the teams', done => {
      organization.teams().fetchAll()
        .then((teams) => {
          expect(teams[0].organizationUid).not.to.be.equal(undefined)
          expect(teams[0].name).not.to.be.equal(null)
          expect(teams[0].created_by).not.to.be.equal(null)
          expect(teams[0].updated_by).not.to.be.equal(null)
          done()
        })
        .catch(done)
    })
    test('should fetch the team when correct organization uid and team uid is passed', done => {
      organization.teams(teamUid).fetch()
        .then((teams) => {
          expect(teams.uid).to.be.equal(teamUid)
          expect(teams.organizationUid).not.to.be.equal(undefined)
          expect(teams.name).not.to.be.equal(null)
          expect(teams.created_by).not.to.be.equal(null)
          expect(teams.updated_by).not.to.be.equal(null)
          done()
        })
        .catch(done)
    })
    test('should create new team when required object is passed', done => {
      const createData = {
        name: 'test_team',
        users: [],
        stackRoleMapping: [],
        organizationRole: '' 
      }
      organization.teams().create(createData)
        .then((teams) => {
          expect(teams.uid).not.to.be.equal(null)
          expect(teams.name).not.to.be.equal(null)
          expect(teams.stackRoleMapping).not.to.be.equal(null)
          expect(teams.organizationRole).not.to.be.equal(null)
          done()
        })
        .catch(done)
    })
    test('should delete team when correct organization uid and team uid is passed', done => {
      organization.teams(teamUid).delete()
        .then((teams) => {
          expect(teams.status).to.be.equal(204)
          done()
        })
        .catch(done)
    })
    test('should update team when update data is passed', done => {
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
      organization.teams(teamUid).update(updateData)
        .then((team) => {
          expect(team.name).to.be.equal(updateData.name)
          expect(team.organizationRole).to.be.equal(updateData.organizationRole)
          expect(team.createdByUserName).not.to.be.equal(undefined)
          expect(team.updatedByUserName).not.to.be.equal(undefined)
          done()
        })
        .catch(done)
    })
  })
}

