import Axios from 'axios'
import { expect } from 'chai'
import { App } from '../../lib/marketplace/app'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appInstallMock, appMock, installationConfigLocationMock, installationMock, installedAppsMock, installedStacksMock, installedUsersMock } from './mock/objects'
import { Installation } from '../../lib/marketplace/installation'
import { WebHooks } from '../../lib/marketplace/installation/webhooks'

describe('Contentstack apps installation test', () => {
  it('Installation without installation uid', done => {
    const installation = makeInstallation({})
    expect(installation.urlPath).to.be.equal(undefined)
    expect(installation.fetch).to.be.equal(undefined)
    expect(installation.update).to.be.equal(undefined)
    expect(installation.uninstall).to.be.equal(undefined)
    expect(installation.fetchAll).to.be.equal(undefined)
    expect(installation.installationData).to.be.equal(undefined)
    expect(installation.configuration).to.be.equal(undefined)
    expect(installation.setConfiguration).to.be.equal(undefined)
    expect(installation.getConfigLocation).to.be.equal(undefined)
    expect(installation.serverConfig).to.be.equal(undefined)
    expect(installation.setServerConfig).to.be.equal(undefined)
    expect(installation.webhooks).to.be.equal(undefined)
    done()
  })

  it('Installation with app uid', done => {
    const uid = appMock.uid
    const installation = makeInstallation({ data: { app_uid: uid } })
    expect(installation.urlPath).to.be.equal('/installations')
    expect(installation.fetch).to.be.equal(undefined)
    expect(installation.update).to.be.equal(undefined)
    expect(installation.uninstall).to.be.equal(undefined)
    expect(installation.installationData).to.be.equal(undefined)
    expect(installation.configuration).to.be.equal(undefined)
    expect(installation.setConfiguration).to.be.equal(undefined)
    expect(installation.getConfigLocation).to.be.equal(undefined)
    expect(installation.serverConfig).to.be.equal(undefined)
    expect(installation.setServerConfig).to.be.equal(undefined)
    expect(installation.webhooks).to.be.equal(undefined)
    expect(installation.fetchAll).to.not.equal(undefined)
    expect(installation.getInstalledApps).to.not.equal(undefined)
    expect(installation.getInstalledUsers).to.not.equal(undefined)
    expect(installation.getInstalledStacks).to.not.equal(undefined)
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
    expect(installation.getConfigLocation).to.not.equal(undefined)
    expect(installation.serverConfig).to.not.equal(undefined)
    expect(installation.setServerConfig).to.not.equal(undefined)
    expect(installation.webhooks).to.not.equal(undefined)
    expect(installation.fetchAll).to.be.equal(undefined)
    expect(installation.getInstalledApps).to.be.equal(undefined)
    expect(installation.getInstalledUsers).to.be.equal(undefined)
    expect(installation.getInstalledStacks).to.be.equal(undefined)
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
        expect(installation.installation_uid).to.be.equal(appInstallMock.installation_uid)
        expect(installation.redirect_to).to.be.equal(appInstallMock.redirect_to)
        expect(installation.redirect_uri).to.be.equal(appInstallMock.redirect_uri)
        done()
      })
      .catch(done)
  })

  it('Get app installation test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/installations`).reply(200, {
      data: [installationMock]
    })

    makeInstallation({ data: { app_uid: uid } }).fetchAll()
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

  it('getConfigLocation call should retrieve uilocation configuration details of an installation', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationConfigLocationMock.uid
    mock.onGet(`/installations/${uid}/locations/configuration`).reply(200, {
      data: installationConfigLocationMock
    })

    makeInstallation({ data: { uid } })
      .getConfigLocation()
      .then((response) => {
        expect(response.data).to.be.eql(installationConfigLocationMock)
        done()
      })
      .catch(done)
  })

  it('getInstalledApps call should fetch all the installed apps in your Contentstack organization', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/apps`).reply(200, {
      data: installedAppsMock
    })

    makeInstallation({ data: {} })
      .getInstalledApps()
      .then((response) => {
        expect(response.data).to.be.eql(installedAppsMock)
        done()
      })
      .catch(done)
  })

  it('getInstalledUsers call should fetch all the installed Users in your Contentstack organization', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/users`).reply(200, {
      data: installedUsersMock
    })

    makeInstallation({ data: {} })
      .getInstalledUsers()
      .then((response) => {
        expect(response.data).to.be.eql(installedUsersMock)
        done()
      })
      .catch(done)
  })

  it('getInstalledStacks call should fetch all the installed Stacks in your Contentstack organization', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/stacks`).reply(200, {
      data: installedStacksMock
    })

    makeInstallation({ data: {} })
      .getInstalledStacks()
      .then((response) => {
        expect(response.data).to.be.eql(installedStacksMock)
        done()
      })
      .catch(done)
  })

  it('Get app installation failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/installations`).reply(400, {})

    makeInstallation({ data: { app_uid: uid } }).fetchAll()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Fetch Installation failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}`).reply(400, {})

    makeInstallation({ data: { uid } })
      .fetch()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Get installation installationData failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/installationData`).reply(400, {})

    makeInstallation({ data: { uid } })
      .installationData()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Get installation configuration failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/configuration`).reply(400, {})

    makeInstallation({ data: { uid } })
      .configuration()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Set installation configuration failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}/configuration`).reply(400, {})

    makeInstallation({ data: { uid } })
      .setConfiguration({})
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Get installation server config failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onGet(`/installations/${uid}/server-configuration`).reply(400, {})

    makeInstallation({ data: { uid } })
      .serverConfig()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Get installation installationData failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}/server-configuration`).reply(400, {})

    makeInstallation({ data: { uid } })
      .setServerConfig({})
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Update Installation failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onPut(`/installations/${uid}`).reply(400, {})
    makeInstallation({ data: { uid } })
      .update()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Uninstall Installation failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationMock.uid
    mock.onDelete(`/installations/${uid}`).reply(400, {})
    makeInstallation({ data: { uid } })
      .uninstall()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('getConfigLocation call should retrieve uilocation configuration details of an installation failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = installationConfigLocationMock.uid
    mock.onGet(`/installations/${uid}/locations/configuration`).reply(400, {})

    makeInstallation({ data: { uid } })
      .getConfigLocation()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('getInstalledApps call should fetch all the installed apps in your Contentstack organization failing test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/apps`).reply(400, {})

    makeInstallation({ data: {} })
      .getInstalledApps()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('getInstalledUsers call should fetch all the installed Users in your Contentstack organization failing test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/users`).reply(400, {})

    makeInstallation({ data: {} })
      .getInstalledUsers()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('getInstalledStacks call should fetch all the installed Stacks in your Contentstack organization failing test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/installations/view/stacks`).reply(400, {})

    makeInstallation({ data: {} })
      .getInstalledStacks()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('should get object of WebHook class when webhooks function is called with uid', () => {
    const webHook = makeInstallation({ data: { uid: 'uid' } }).webhooks('webhookUid')

    expect(webHook).to.be.instanceOf(WebHooks)
    expect(webHook.uid).to.be.equal('webhookUid')
    expect(webHook.listExecutionLogs).to.not.equal(undefined)
    expect(webHook.getExecutionLog).to.not.equal(undefined)
    expect(webHook.retryExecution).to.not.equal(undefined)
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
