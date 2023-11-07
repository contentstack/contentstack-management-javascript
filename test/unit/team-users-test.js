import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { TeamUsers } from '../../lib/organization/team/teamUsers'
import { teamUsersMock, noticeMock } from './mock/objects'

describe('Contentstack Team Users test', () => {
  it('should query and find all users', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams/team_uid/users`).reply(200, teamUsersMock)
    makeTeamUsers().query().find()
      .then((users) => {
        users.items.forEach((user) => {
          expect(user.uidId).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })
  it('should add the user when user\'s mail is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/organization_uid/teams/team_uid/users`).reply(200, teamUsersMock.addUser)
    const usersMail = {
      emails: ['email@email.com']
    }
    makeTeamUsers()
      .add(usersMail)
      .then((team) => {
        expect(team.userId).to.be.equal('UID')
        done()
      })
      .catch(done)
  })
  it('should remove the user when uid is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/organizations/organization_uid/teams/team_uid/users/UID`).reply(200, { ...noticeMock })
    makeTeamUsers({ userId: 'UID' }, noticeMock)
      .remove()
      .then((user) => {
        expect(user.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeTeamUsers (data = {}) {
  return new TeamUsers(Axios, { organizationUid: 'organization_uid', teamUid: 'team_uid', ...data })
}
