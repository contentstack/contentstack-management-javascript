import Axios from 'axios'
import { expect } from 'chai'
import { App } from '../../lib/app'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appInstallMock, appMock, installationMock } from './mock/objects'
import { Installation } from '../../lib/app/installation'

describe('Contentstack apps installation test', () => {
  it('Installation without installation uid', done => {
    const installation = makeInstallation({})
    expect(installation.urlPath).to.be.equal(undefined)
    expect(installation.fetch).to.be.equal(undefined)
    expect(installation.update).to.be.equal(undefined)
    expect(installation.uninstall).to.be.equal(undefined)
    expect(installation.findAll).to.be.equal(undefined)
    expect(installation.installationData).to.be.equal(undefined)
    expect(installation.configuration).to.be.equal(undefined)
    expect(installation.setConfiguration).to.be.equal(undefined)
    expect(installation.serverConfig).to.be.equal(undefined)
    expect(installation.setServerConfig).to.be.equal(undefined)
    done()
  })

  it('Installation with app uid', done => {
    const uid = appMock.uid
    const installation = makeInstallation({ app_uid: uid })
    expect(installation.urlPath).to.be.equal(`manifests/${uid}/installations`)
    expect(installation.fetch).to.be.equal(undefined)
    expect(installation.update).to.be.equal(undefined)
    expect(installation.uninstall).to.be.equal(undefined)
    expect(installation.installationData).to.be.equal(undefined)
    expect(installation.configuration).to.be.equal(undefined)
    expect(installation.setConfiguration).to.be.equal(undefined)
    expect(installation.serverConfig).to.be.equal(undefined)
    expect(installation.setServerConfig).to.be.equal(undefined)
    done()
  })

  it('Installation with installation uid', done => {
    const uid = installationMock.uid
    const installation = makeInstallation({ data: { uid } })
    expect(installation.urlPath).to.be.equal(`/installations/${uid}`)
    expect(installation.fetch).to.not.equal(undefined)
    expect(installation.update).to.not.equal(undefined)
    expect(installation.uninstall).to.not.equal(undefined)
    expect(installation.installationData).to.not.equal(undefined)
    expect(installation.configuration).to.not.equal(undefined)
    expect(installation.setConfiguration).to.not.equal(undefined)
    expect(installation.serverConfig).to.not.equal(undefined)
    expect(installation.setServerConfig).to.not.equal(undefined)
    expect(installation.findAll).to.be.equal(undefined)
    done()
  })

  it('Params for installation', done => {
    const installation = makeInstallation({})
    expect(installation.params).to.deep.equal({})
    done()
  })

  it('Organization uid params for installation', done => {
    const organizationUid = 'org_uid'
    const installation = makeInstallation({}, { organization_uid: organizationUid })
    expect(installation.params.organization_uid).to.be.equal(organizationUid)
    done()
  })

  it('Params in data for installation', done => {
    const organizationUid = 'org_uid'
    const installation = makeInstallation({ data: { organization_uid: organizationUid } })
    expect(installation.params.organization_uid).to.be.equal(organizationUid)
    done()
  })

  it('Install app test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPost(`/manifests/${uid}/install`).reply(200, {
      data: {
        ...appInstallMock
      }
    })
    const app = new App(Axios, { data: { uid } })
    app
      .install({ targetType: 'stack', targetUid: 'STACK_UID' })
      .then((installation) => {
        expect(installation.status).to.be.equal(appInstallMock.status)
        expect(installation.uid).to.be.equal(appInstallMock.installation_uid)
        expect(installation.redirect_to).to.be.equal(appInstallMock.redirect_to)
        expect(installation.redirect_uri).to.be.equal(appInstallMock.redirect_uri)
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

    makeInstallation({ app_uid: uid })
      .findAll()
      .then((installations) => {
        installations.items.forEach(installation => {
          checkInstallation(installation)
        })
        done()
      })
      .catch(done)
  })

  it('Fetch Installation test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}`).reply(200, {
      data: installationMock
    })

    makeInstallation({ data: { uid } })
      .fetch()
      .then((installation) => {
        checkInstallation(installation)
        done()
      })
      .catch(done)
  })

  it('Get installation installationData test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/installationData`).reply(200, {
      data: {}
    })

    makeInstallation({ data: { uid } })
      .installationData()
      .then((data) => {
        expect(data).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get installation configuration test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/configuration`).reply(200, {
      data: {}
    })

    makeInstallation({ data: { uid } })
      .configuration()
      .then((data) => {
        expect(data).to.not.equal(null)
        done()
      })
      .catch(done)
  })
  it('Set installation configuration test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}/configuration`).reply(200, {
      data: {}
    })

    makeInstallation({ data: { uid } })
      .setConfiguration({})
      .then((data) => {
        expect(data).to.not.equal(null)
        done()
      })
      .catch(done)
  })
  it('Get installation server config test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/server-configuration`).reply(200, {
      data: {}
    })

    makeInstallation({ data: { uid } })
      .serverConfig()
      .then((data) => {
        expect(data).to.not.equal(null)
        done()
      })
      .catch(done)
  })
  it('Get installation installationData test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}/server-configuration`).reply(200, {
      data: {}
    })

    makeInstallation({ data: { uid } })
      .setServerConfig({})
      .then((data) => {
        expect(data).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update Installation test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}`).reply(200, {
      data: installationMock
    })
    makeInstallation({ data: { uid } })
      .update()
      .then((installation) => {
        checkInstallation(installation)
        done()
      })
      .catch(done)
  })

  it('Uninstall Installation test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onDelete(`/installations/${uid}`).reply(200, {

    })
    makeInstallation({ data: { uid } })
      .uninstall()
      .then(() => {
        done()
      })
      .catch(done)
  })
})

export function checkInstallation (installation) {
  expect(installation.status).to.be.equal(installationMock.status)
  expect(installation.uid).to.be.equal(installationMock.uid)
  expect(installation.organization_uid).to.be.equal(installationMock.organization_uid)
  expect(installation.target.type).to.be.equal(installationMock.target.type)
  expect(installation.target.uid).to.be.equal(installationMock.target.uid)
}

function makeInstallation (data, param = {}) {
  return new Installation(Axios, data, param)
}
