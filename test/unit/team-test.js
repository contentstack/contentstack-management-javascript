import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Teams } from '../../lib/organization/team'
import { systemUidMock, teamsMock, noticeMock } from './mock/objects'

describe('Contentstack Team test', () => {
  it('team create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/organization_uid/teams`).reply(200, {
      team: {
        ...teamsMock
      }
    })
    makeTeams()
      .create()
      .then((team) => {
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('Team fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams/UID`).reply(200, {
      team: {
        ...teamsMock
      }
    })
    makeTeams({
      team: {
        ...systemUidMock
      }
    })
      .fetch()
      .then((team) => {
        console.log('fetch', team)
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('Teams query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/organization_uid/teams`).reply(200, {
      teams: [
        teamsMock
      ]
    })
    makeTeams()
      .query()
      .then((teams) => {
        console.log(teams)
        checkTeams(teams.items[0])
        done()
      })
      .catch(done)
  })
  it('Team update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut(`/organizations/organization_uid/teams/UID`).reply(200, {
      team: {
        ...teamsMock
      }
    })
    makeTeams({
      team: {
        ...systemUidMock
      }
    })
      .update()
      .then((team) => {
        checkTeams(team)
        done()
      })
      .catch(done)
  })
  it('team delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/organizations/organization_uid/teams/UID`).reply(200, {
      ...noticeMock
    })
    makeTeams({
      team: {
        ...systemUidMock
      }
    })
      .delete()
      .then((team) => {
        expect(team.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeTeams (data = {}) {
  return new Teams(Axios, { organization_uid: 'organization_uid', ...data })
}

function checkTeams (teams) {
  expect(teams.name).to.be.equal('name')
}
