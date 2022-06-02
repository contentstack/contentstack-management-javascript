import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'

import { Environment, EnvironmentCollection } from '../../lib/stack/environment'
import { systemUidMock, stackHeadersMock, environmentMock, noticeMock, checkSystemFields } from './mock/objects'

describe('Contentstack Environment test', () => {
  it('Environment test without uid', done => {
    const environment = makeEnvironment()
    expect(environment.urlPath).to.be.equal('/environments')
    expect(environment.stackHeaders).to.be.equal(undefined)
    expect(environment.update).to.be.equal(undefined)
    expect(environment.delete).to.be.equal(undefined)
    expect(environment.fetch).to.be.equal(undefined)
    expect(environment.create).to.not.equal(undefined)
    expect(environment.query).to.not.equal(undefined)
    done()
  })

  it('Environment test with uid', done => {
    const environment = makeEnvironment({
      environment: {
        name: systemUidMock.uid
      }
    })
    expect(environment.urlPath).to.be.equal(`/environments/${systemUidMock.uid}`)
    expect(environment.stackHeaders).to.be.equal(undefined)
    expect(environment.update).to.not.equal(undefined)
    expect(environment.delete).to.not.equal(undefined)
    expect(environment.fetch).to.not.equal(undefined)
    expect(environment.create).to.be.equal(undefined)
    expect(environment.query).to.be.equal(undefined)
    done()
  })

  it('Environment test with Stack Headers', done => {
    const environment = makeEnvironment({
      environment: {
        name: systemUidMock.uid
      },
      stackHeaders: stackHeadersMock
    })
    expect(environment.urlPath).to.be.equal(`/environments/${systemUidMock.uid}`)
    expect(environment.stackHeaders).to.not.equal(undefined)
    expect(environment.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(environment.update).to.not.equal(undefined)
    expect(environment.delete).to.not.equal(undefined)
    expect(environment.fetch).to.not.equal(undefined)
    expect(environment.create).to.be.equal(undefined)
    expect(environment.query).to.be.equal(undefined)
    done()
  })

  it('Environment Collection test with blank data', done => {
    const environments = new EnvironmentCollection(Axios, {})
    expect(environments.length).to.be.equal(0)
    done()
  })

  it('Environment Collection test with data', done => {
    const environments = new EnvironmentCollection(Axios, {
      environments: [
        environmentMock
      ]
    })
    expect(environments.length).to.be.equal(1)
    checkEnvironment(environments[0])
    done()
  })

  it('Environment create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/environments').reply(200, {
      environment: {
        ...environmentMock
      }
    })
    makeEnvironment()
      .create()
      .then((environment) => {
        checkEnvironment(environment)
        done()
      })
      .catch(done)
  })

  it('Environment Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/environments').reply(200, {
      environments: [
        environmentMock
      ]
    })
    makeEnvironment()
      .query()
      .find()
      .then((environments) => {
        checkEnvironment(environments.items[0])
        done()
      })
      .catch(done)
  })

  it('Environment update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/environments/UID').reply(200, {
      environment: {
        ...environmentMock
      }
    })
    makeEnvironment({
      environment: {
        name: systemUidMock.uid
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((environment) => {
        checkEnvironment(environment)
        done()
      })
      .catch(done)
  })

  it('Environment fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/environments/UID').reply(200, {
      environment: {
        ...environmentMock
      }
    })
    makeEnvironment({
      environment: {
        name: systemUidMock.uid
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((environment) => {
        checkEnvironment(environment)
        done()
      })
      .catch(done)
  })

  it('Environment delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/environments/UID').reply(200, {
      ...noticeMock
    })
    makeEnvironment({
      environment: {
        name: systemUidMock.uid
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeEnvironment (data) {
  return new Environment(Axios, data)
}

function checkEnvironment (environment) {
  checkSystemFields(environment)
  expect(environment.name).to.be.equal('name')
  expect(environment.deploy_content).to.be.equal(true)
  expect(environment.urls.length).to.be.equal(1)
  expect(environment.servers.length).to.be.equal(2)
  expect(environment.ACL.length).to.be.equal(0)
  expect(environment._version).to.be.equal(1)
}

export { checkEnvironment }
