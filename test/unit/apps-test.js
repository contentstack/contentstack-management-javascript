import Axios from 'axios'
import { expect } from 'chai'
import { App } from '../../lib/marketplace/app'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock, installationMock, noticeMock } from './mock/objects'
import { requestMock } from './mock/request-mock'
import { checkInstallation } from './installation-test'

describe('Contentstack apps test', () => {
  it('App without app uid', done => {
    const app = makeApp({})
    expect(app.urlPath).to.be.equal('/manifests')
    expect(app.create).to.not.equal(undefined)
    expect(app.findAll).to.be.equal(undefined)
    expect(app.findAllAuthorized).to.be.equal(undefined)
    expect(app.fetch).to.be.equal(undefined)
    expect(app.update).to.be.equal(undefined)
    expect(app.delete).to.be.equal(undefined)
    expect(app.hosting).to.be.equal(undefined)
    expect(app.install).to.be.equal(undefined)
    expect(app.installation).to.be.equal(undefined)
    expect(app.getRequests).to.be.equal(undefined)
    expect(app.authorize).to.be.equal(undefined)
    done()
  })

  it('App with app uid', done => {
    const uid = 'APP_UID'
    const app = makeApp({ data: { uid } })
    expect(app.urlPath).to.be.equal(`/manifests/${uid}`)
    expect(app.create).to.be.equal(undefined)
    expect(app.findAll).to.be.equal(undefined)
    expect(app.findAllAuthorized).to.be.equal(undefined)
    expect(app.fetch).to.not.equal(undefined)
    expect(app.update).to.not.equal(undefined)
    expect(app.delete).to.not.equal(undefined)
    expect(app.hosting).to.not.equal(undefined)
    expect(app.install).to.not.equal(undefined)
    expect(app.listInstallations).to.not.equal(undefined)
    expect(app.getRequests).to.not.equal(undefined)
    expect(app.authorize).to.not.equal(undefined)
    expect(app.hosting()).to.not.equal(undefined)
    expect(app.authorization()).to.not.equal(undefined)
    expect(app.oauth()).to.not.equal(undefined)
    done()
  })

  it('App with app uid and org uid', done => {
    const uid = 'APP_UID'
    const organizationUid = 'ORG_UID'
    const app = makeApp({ data: { uid, organization_uid: organizationUid }, organization_uid: organizationUid })
    expect(app.urlPath).to.be.equal(`/manifests/${uid}`)
    expect(app.create).to.be.equal(undefined)
    expect(app.findAll).to.be.equal(undefined)
    expect(app.findAllAuthorized).to.be.equal(undefined)
    expect(app.fetch).to.not.equal(undefined)
    expect(app.update).to.not.equal(undefined)
    expect(app.delete).to.not.equal(undefined)
    expect(app.hosting).to.not.equal(undefined)
    expect(app.install).to.not.equal(undefined)
    expect(app.getRequests).to.not.equal(undefined)
    expect(app.authorize).to.not.equal(undefined)
    done()
  })

  it('Create app test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/manifests').reply(200, {
      data: {
        ...appMock
      }
    })

    makeApp({})
      .create({})
      .then((app) => {
        checkApp(app)
        done()
      })
      .catch(done)
  })

  it('Update app test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPut(`/manifests/${uid}`).reply(200, {
      data: {
        ...appMock
      }
    })

    makeApp({ data: { uid } })
      .update()
      .then((app) => {
        checkApp(app)
        done()
      })
      .catch(done)
  })

  it('Get app from UID test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/${uid}`).reply(200, {
      data: {
        ...appMock
      }
    })

    makeApp({ data: { uid } })
      .fetch()
      .then((app) => {
        checkApp(app)
        done()
      })
      .catch(done)
  })

  it('Delete app from UID test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onDelete(`/manifests/${uid}`).reply(200, {
      ...noticeMock
    })

    makeApp({ data: { uid } })
      .delete()
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Get app installation test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`manifests/${uid}/installations`).reply(200, {
      data: [installationMock]
    })

    makeApp({ data: { uid } })
      .listInstallations()
      .then((installations) => {
        installations.items.forEach(installation => {
          checkInstallation(installation)
        })
      })
      .catch(done)

    // Failing test
    mock.onGet(`manifests/${uid}/installations`).reply(400, {})
    makeApp({ data: { uid } })
      .listInstallations()
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('app install test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPost(`/manifests/${uid}/install`).reply(200, {
      data: {
        ...installationMock
      }
    })
    const targetUid = 'target_uid'
    const targetType = 'target_type'
    makeApp({ data: { uid } })
      .install({ targetUid, targetType })
      .then((installation) => {
        expect(installation.status).to.be.equal(installationMock.status)
        expect(installation.manifest.name).to.be.equal(installationMock.manifest.name)
        expect(installation.target.uid).to.be.equal(installationMock.target.uid)
        expect(installation.organization_uid).to.be.equal(installationMock.organization_uid)
        expect(installation.uid).to.be.equal(installationMock.uid)
      })
      .catch(done)

    // Failing test
    mock.onPost(`/manifests/${uid}/install`).reply(400, {})
    makeApp({ data: { uid } })
      .install({ targetUid, targetType })
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('app upgrade test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPut(`/manifests/${uid}/reinstall`).reply(200, {
      data: {
        ...installationMock
      }
    })
    const targetUid = 'target_uid'
    const targetType = 'target_type'
    makeApp({ data: { uid } })
      .upgrade({ targetUid, targetType })
      .then((installation) => {
        expect(installation.status).to.be.equal(installationMock.status)
        expect(installation.manifest.name).to.be.equal(installationMock.manifest.name)
        expect(installation.target.uid).to.be.equal(installationMock.target.uid)
        expect(installation.organization_uid).to.be.equal(installationMock.organization_uid)
        expect(installation.uid).to.be.equal(installationMock.uid)
      })
      .catch(done)

    // Failing test
    mock.onPut(`/manifests/${uid}/reinstall`).reply(400, {})
    makeApp({ data: { uid } })
      .upgrade({ targetUid, targetType })
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test fetch request for app uid', (done) => {
    const uid = appMock.uid
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${appMock.uid}/requests`).reply(200, {
      data: { ...requestMock }
    })

    makeApp({ data: { uid } })
      .getRequests()
      .then((response) => {
        const request = response.data
        expect(request.organization_uid).to.be.equal(requestMock.organization_uid)
        expect(request.target_uid).to.be.equal(requestMock.target_uid)
        expect(request.uid).to.be.equal(requestMock.uid)
        done()
      })
      .catch(done)
  })
  it('test authorize app', (done) => {
    const uid = appMock.uid
    const mock = new MockAdapter(Axios)
    mock.onPost(`/manifests/${appMock.uid}/authorize`).reply(200, {
      data: { redirect_uri: 'uri' }
    })

    makeApp({ data: { uid } })
      .authorize({ responseType: 'type', clientId: 'id', redirectUri: 'uri', scope: 'scope' })
      .then((response) => {
        expect(response.data.redirect_uri).to.be.equal('uri')
        done()
      })
      .catch(done)
  })
  it('test authorize app fail request', (done) => {
    const uid = appMock.uid
    const mock = new MockAdapter(Axios)
    mock.onPost(`/manifests/${appMock.uid}/authorize`).reply(400, {

    })

    makeApp({ data: { uid } })
      .authorize({ state: 'state', responseType: 'type', clientId: 'id', redirectUri: 'uri', scope: 'scope' })
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
  it('test fetch request for app uid fail request', (done) => {
    const uid = appMock.uid
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${appMock.uid}/requests`).reply(400, {

    })

    makeApp({ data: { uid } })
      .getRequests()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
  it('test authorize app fail request', (done) => {
    const uid = appMock.uid
    const mock = new MockAdapter(Axios)
    mock.onPost(`/manifests/${appMock.uid}/requests`).reply(400, {

    })

    makeApp({ data: { uid } })
      .getRequests()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
})

function checkApp (app) {
  expect(app.urlPath).to.be.equal('/manifests/UID')
  expect(app.created_at).to.be.equal('created_at_date')
  expect(app.updated_at).to.be.equal('updated_at_date')
  expect(app.uid).to.be.equal('UID')
  expect(app.name).to.be.equal('App Name')
  expect(app.description).to.be.equal('Description of the app')
  expect(app.organization_uid).to.be.equal('org_uid')
}

function makeApp (data) {
  return new App(Axios, data)
}
