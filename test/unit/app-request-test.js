import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock } from './mock/objects'
import { Request } from '../../lib/app/request'
import { requestMock } from './mock/request-mock'

describe('Contentstack apps request test', () => {
  it('test request without contents', () => {
    const request = makeAppRequest()
    expect(request.create).to.be.equal(undefined)
    expect(request.fetch).to.be.equal(undefined)
    expect(request.delete).to.be.equal(undefined)
    expect(request.findAll).to.be.equal(undefined)
  })
  it('test request without app uid', () => {
    const request = makeAppRequest({})
    expect(request.create).to.be.equal(undefined)
    expect(request.fetch).to.be.equal(undefined)
    expect(request.delete).to.not.equal(undefined)
    expect(request.findAll).to.not.equal(undefined)
  })

  it('test request with app uid', () => {
    const appUid = 'APP_UID'
    const request = makeAppRequest({ app_uid: appUid })
    expect(request.create).to.not.equal(undefined)
    expect(request.fetch).to.not.equal(undefined)
    expect(request.delete).to.not.equal(undefined)
    expect(request.findAll).to.be.equal(undefined)
    expect(request.params.organization_uid).to.be.equal(undefined)
  })

  it('test request with app uid and org uid', () => {
    const appUid = 'APP_UID'
    const organizationUid = 'ORG_UID'
    const request = makeAppRequest({ app_uid: appUid, organization_uid: organizationUid })
    expect(request.create).to.not.equal(undefined)
    expect(request.fetch).to.not.equal(undefined)
    expect(request.delete).to.not.equal(undefined)
    expect(request.findAll).to.be.equal(undefined)
    expect(request.params.organization_uid).to.be.equal(organizationUid)
  })

  it('test find all request for organization', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/requests`).reply(200, {
      data: [requestMock]
    })

    makeAppRequest({})
      .findAll()
      .then((response) => {
        expect(response.data).to.not.equal(undefined)
        const requests = response.data
        requests.forEach(request => {
          checkRequest(request)
        })
        done()
      })
      .catch(done)
  })
  it('test create request for app uid', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onPost(`/requests`).reply(200, {
      data: { ...requestMock }
    })

    makeAppRequest({ app_uid: appMock.uid })
      .create(requestMock.target_uid)
      .then((response) => {
        checkRequest(response.data)
        done()
      })
      .catch(done)
  })
  it('test fetch request for app uid', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${appMock.uid}/requests`).reply(200, {
      data: { ...requestMock }
    })

    makeAppRequest({ app_uid: appMock.uid })
      .fetch()
      .then((response) => {
        checkRequest(response.data)
        done()
      })
      .catch(done)
  })
  it('test delete request for organization', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/requests/${requestMock.uid}`).reply(200, {

    })

    makeAppRequest({ app_uid: appMock.uid })
      .delete(requestMock.uid)
      .then((request) => {
        expect(request).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })
  it('test find all request for organization fail request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/requests`).reply(400, {

    })

    makeAppRequest({})
      .findAll()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
  it('test create request for app uid fail request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onPost(`/requests`).reply(400, {

    })

    makeAppRequest({ app_uid: appMock.uid })
      .create(requestMock.target_uid)
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
  it('test fetch request for app uid fail request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${appMock.uid}/requests`).reply(400, {

    })

    makeAppRequest({ app_uid: appMock.uid })
      .fetch()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
  it('test delete request for organization fail request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/requests/${requestMock.uid}`).reply(400, {

    })

    makeAppRequest({ app_uid: appMock.uid })
      .delete(requestMock.uid)
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
})

function makeAppRequest (data, param) {
  return new Request(Axios, data, param)
}

function checkRequest (request) {
  expect(request.organization_uid).to.be.equal(requestMock.organization_uid)
  expect(request.target_uid).to.be.equal(requestMock.target_uid)
  expect(request.uid).to.be.equal(requestMock.uid)
}
