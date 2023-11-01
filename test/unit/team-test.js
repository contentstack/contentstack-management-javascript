import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Teams } from '../../lib/organization/team'
import { systemUidMock, teamsMock, noticeMock } from './mock/objects'

describe('Contentstack Team test', () => {
  it('should get all the teams when correct organization uid is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams`).reply(200, [teamsMock])
    makeTeams().fetchAll()
      .then((teams) => {
        expect(teams.items[0].uid).to.be.equal('UID')
        checkTeams(teams.items[0])
        done()
      })
      .catch(done)
  })
  it('should fetch the team when correct organization uid and team uid is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams/UID`).reply(200, { ...teamsMock })
    makeTeams({ ...systemUidMock })
      .fetch()
      .then((team) => {
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('should create new team when required object is passedt', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/organization_uid/teams`).reply(200, { ...teamsMock })
    makeTeams()
      .create({
        name: 'name',
        organizationUid: 'organization_uid',
        users: [],
        stackRoleMapping: [],
        organizationRole: 'organizationRole'
      })
      .then((team) => {
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('should update team when updating data is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut(`/organizations/organization_uid/teams/UID`).reply(200, { ...teamsMock
    })
    makeTeams({ ...systemUidMock })
      .update()
      .then((team) => {
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('should delete team when correct organization uid and team uid is passed', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/organizations/organization_uid/teams/UID`).reply(200, {
      ...noticeMock
    })
    makeTeams({ ...systemUidMock })
      .delete()
      .then((team) => {
        expect(team.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeTeams (data = {}) {
  return new Teams(Axios, { organizationUid: 'organization_uid', ...data })
}

function checkTeams (teams) {
  expect(teams.name).to.be.equal('name')
}
