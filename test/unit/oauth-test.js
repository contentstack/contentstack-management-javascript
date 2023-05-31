import Axios from 'axios'
import { expect } from 'chai'
import { App } from '../../lib/app'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock, oAuthMock, oAuthScopesMock } from './mock/objects'

describe('Contentstack app oauth', () => {
  it('Get oAuth configuration test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/${uid}/oauth`).reply(200, {
      data: {
        ...oAuthMock
      }
    })

    makeApp({ data: { uid } })
      .oauth()
      .fetch()
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
      .oauth()
      .update({ config })
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

  it('List Scopes', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/oauth/scopes`).reply(200, {
      data: {
        ...oAuthScopesMock
      }
    })
    makeApp({ data: { uid } })
      .oauth()
      .getScopes()
      .then((scopes) => {
        expect(scopes).to.deep.equal(oAuthScopesMock)
        done()
      })
      .catch(done)
  })
})

function makeApp (data) {
  return new App(Axios, data)
}
