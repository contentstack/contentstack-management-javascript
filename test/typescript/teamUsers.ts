import { expect } from "chai";
import { Organization } from "../../types/organization";

let teamUid = 'teamUid'
export function testTeamUsers (organization: Organization) {
  describe('Contentstack Team Users test', () => {
    test('should add the user when user\'s mail is passed', done => {
      const usersMail = {
        emails: ['email@email.com']
      }
        organization.teams(teamUid).teamUsers().add(usersMail).then((response) => {
        expect(response.status).to.be.eql(201)
        done()
      })
        .catch(done)
    })
    test('should remove the user when uid is passed', done => {
      const user_id = 'user_id'
      organization.teams(teamUid).teamUsers(user_id).remove().then((response) => {
        expect(response.status).to.be.equal(204)
        done()
      })
        .catch(done)
    })
    test('should fetch all users', done => {
      organization.teams(teamUid).teamUsers()
      .fetchAll()
        .then((users) => {
        users.items.forEach((user) => {
          expect(user.userId).to.be.not.equal(null)
        })
        done()
      })
        .catch(done)
    })
  })
}

