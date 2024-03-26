import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { ManagementToken, ManagementTokenCollection } from '../../lib/stack/managementToken'
import { systemUidMock, stackHeadersMock, managementTokenMock, noticeMock, checkSystemFields } from './mock/objects'
import { checkEnvironment } from './environment-test'

describe('Contentstack ManagementToken test', () => {
  it('ManagementToken test without uid', done => {
    const managementToken = makeManagementToken()
    expect(managementToken.urlPath).to.be.equal('/stacks/management_tokens')
    expect(managementToken.stackHeaders).to.be.equal(undefined)
    expect(managementToken.update).to.be.equal(undefined)
    expect(managementToken.delete).to.be.equal(undefined)
    expect(managementToken.fetch).to.be.equal(undefined)
    expect(managementToken.create).to.not.equal(undefined)
    expect(managementToken.query).to.not.equal(undefined)
    done()
  })

  it('ManagementToken test with uid', done => {
    const managementToken = makeManagementToken({
      token: {
        ...systemUidMock
      }
    })
    expect(managementToken.urlPath).to.be.equal(`/stacks/management_tokens/${systemUidMock.uid}`)
    expect(managementToken.stackHeaders).to.be.equal(undefined)
    expect(managementToken.update).to.not.equal(undefined)
    expect(managementToken.delete).to.not.equal(undefined)
    expect(managementToken.fetch).to.not.equal(undefined)
    expect(managementToken.create).to.be.equal(undefined)
    expect(managementToken.query).to.be.equal(undefined)
    done()
  })

  it('ManagementToken test with Stack Headers', done => {
    const managementToken = makeManagementToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(managementToken.urlPath).to.be.equal(`/stacks/management_tokens/${systemUidMock.uid}`)
    expect(managementToken.stackHeaders).to.not.equal(undefined)
    expect(managementToken.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(managementToken.update).to.not.equal(undefined)
    expect(managementToken.delete).to.not.equal(undefined)
    expect(managementToken.fetch).to.not.equal(undefined)
    expect(managementToken.create).to.be.equal(undefined)
    expect(managementToken.query).to.be.equal(undefined)
    done()
  })

  it('ManagementToken Collection test with blank data', done => {
    const managementToken = new ManagementTokenCollection(Axios, {})
    expect(managementToken.length).to.be.equal(0)
    done()
  })

  it('ManagementToken Collection test with data', done => {
    const managementToken = new ManagementTokenCollection(Axios, {
      tokens: [
        managementTokenMock
      ]
    })
    expect(managementToken.length).to.be.equal(1)
    checkManagementToken(managementToken[0])
    done()
  })

  it('ManagementToken create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/stacks/management_tokens').reply(200, {
      token: {
        ...managementTokenMock
      }
    })
    makeManagementToken()
      .create()
      .then((managementToken) => {
        checkManagementToken(managementToken)
        done()
      })
      .catch(done)
  })

  it('ManagementToken Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/management_tokens').reply(200, {
      tokens: [
        managementTokenMock
      ]
    })
    makeManagementToken()
      .query()
      .find()
      .then((managementTokens) => {
        checkManagementToken(managementTokens.items[0])
        done()
      })
      .catch(done)
  })

  it('ManagementToken update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/stacks/management_tokens/UID').reply(200, {
      token: {
        ...managementTokenMock
      }
    })
    makeManagementToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((managementToken) => {
        checkManagementToken(managementToken)
        done()
      })
      .catch(done)
  })

  it('ManagementToken fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/management_tokens/UID').reply(200, {
      token: {
        ...managementTokenMock
      }
    })
    makeManagementToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((managementToken) => {
        checkManagementToken(managementToken)
        done()
      })
      .catch(done)
  })

  it('ManagementToken delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/stacks/management_tokens/UID').reply(200, {
      ...noticeMock
    })
    makeManagementToken({
      token: {
        ...systemUidMock
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

function makeManagementToken (data = {}) {
  return new ManagementToken(Axios, data)
}

function checkManagementToken (managementToken) {
  checkSystemFields(managementToken)
  expect(managementToken.name).to.be.equal('Test')
  expect(managementToken.description).to.be.equal('description')
  expect(managementToken.token).to.be.equal('token')
  expect(managementToken.type).to.be.equal('management')
  expect(managementToken.scope.length).to.be.equal(1)
  checkEnvironment(managementToken.scope[0].environments[0])
}
