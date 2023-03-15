import Axios from 'axios'
import { expect } from 'chai'
import { App } from '../../lib/app'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock, installationMock, noticeMock, oAuthMock } from './mock/objects'

describe('Contentstack apps test', () => {
  it('App without app uid', done => {
    const app = makeApp({})
    expect(app.urlPath).to.be.equal('/manifests')
    expect(app.create).to.not.equal(undefined)
    expect(app.findAll).to.not.equal(undefined)
    expect(app.fetch).to.be.equal(undefined)
    expect(app.update).to.be.equal(undefined)
    expect(app.delete).to.be.equal(undefined)
    expect(app.fetchOAuth).to.be.equal(undefined)
    expect(app.updateOAuth).to.be.equal(undefined)
    expect(app.hosting).to.be.equal(undefined)
    expect(app.install).to.be.equal(undefined)
    expect(app.installation).to.be.equal(undefined)
    done()
  })

  it('App with app uid', done => {
    const uid = 'APP_UID'
    const app = makeApp({ data: { uid } })
    expect(app.urlPath).to.be.equal(`/manifests/${uid}`)
    expect(app.create).to.be.equal(undefined)
    expect(app.findAll).to.be.equal(undefined)
    expect(app.fetch).to.not.equal(undefined)
    expect(app.update).to.not.equal(undefined)
    expect(app.delete).to.not.equal(undefined)
    expect(app.fetchOAuth).to.not.equal(undefined)
    expect(app.updateOAuth).to.not.equal(undefined)
    expect(app.hosting).to.not.equal(undefined)
    expect(app.install).to.not.equal(undefined)
    expect(app.installation).to.not.equal(undefined)
    expect(app.hosting()).to.not.equal(undefined)
    expect(app.installation()).to.not.equal(undefined)
    expect(app.installation(uid)).to.not.equal(undefined)
    done()
  })

  it('App with app uid', done => {
    const uid = 'APP_UID'
    const organizationUid = 'ORG_UID'
    const app = makeApp({ data: { uid, organization_uid: organizationUid }, organization_uid: organizationUid })
    expect(app.urlPath).to.be.equal(`/manifests/${uid}`)
    expect(app.create).to.be.equal(undefined)
    expect(app.findAll).to.be.equal(undefined)
    expect(app.fetch).to.not.equal(undefined)
    expect(app.update).to.not.equal(undefined)
    expect(app.delete).to.not.equal(undefined)
    expect(app.fetchOAuth).to.not.equal(undefined)
    expect(app.updateOAuth).to.not.equal(undefined)
    expect(app.hosting).to.not.equal(undefined)
    expect(app.install).to.not.equal(undefined)
    expect(app.installation).to.not.equal(undefined)
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

  it('Get all apps in organization test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests`).reply(200, {
      data: [appMock]
    })

    makeApp({})
      .findAll()
      .then((apps) => {
        checkApp(apps.items[0])
        done()
      })
      .catch(done)
  })

  it('Get oAuth configuration test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/${uid}/oauth`).reply(200, {
      data: {
        ...oAuthMock
      }
    })

    makeApp({ data: { uid } })
      .fetchOAuth()
      .then((oAuthConfig) => {
        expect(oAuthConfig.client_id).to.be.equal(oAuthMock.client_id)
        expect(oAuthConfig.client_secret).to.be.equal(oAuthMock.client_secret)
        expect(oAuthConfig.redirect_uri).to.be.equal(oAuthMock.redirect_uri)
        expect(oAuthConfig.app_token_config.enabled).to.be.equal(oAuthMock.app_token_config.enabled)
        expect(oAuthConfig.user_token_config.enabled).to.be.equal(oAuthMock.user_token_config.enabled)
        done()
      })
      .catch(done)
  })

  it('Update oAuth configuration test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPut(`/manifests/${uid}/oauth`).reply(200, {
      data: {
        ...oAuthMock
      }
    })
    const config = { ...oAuthMock }
    makeApp({ data: { uid } })
      .updateOAuth({ config })
      .then((oAuthConfig) => {
        expect(oAuthConfig.client_id).to.be.equal(oAuthMock.client_id)
        expect(oAuthConfig.client_secret).to.be.equal(oAuthMock.client_secret)
        expect(oAuthConfig.redirect_uri).to.be.equal(oAuthMock.redirect_uri)
        expect(oAuthConfig.app_token_config.enabled).to.be.equal(oAuthMock.app_token_config.enabled)
        expect(oAuthConfig.user_token_config.enabled).to.be.equal(oAuthMock.user_token_config.enabled)
        done()
      })
      .catch(done)
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
        done()
      })
      .catch(done)
  })
})

function checkApp (app) {
  expect(app.urlPath).to.be.equal('/manifests/UID')
  expect(app.created_at).to.be.equal('created_at_date')
  expect(app.updated_at).to.be.equal('updated_at_date')
  expect(app.uid).to.be.equal('UID')
  expect(app.name).to.be.equal('Name of the app')
  expect(app.description).to.be.equal('Description of the app')
  expect(app.organization_uid).to.be.equal('org_uid')
}

function makeApp (data) {
  return new App(Axios, data)
}
