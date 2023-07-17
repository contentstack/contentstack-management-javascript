import Axios from 'axios'
import { expect } from 'chai'
import { Oauth } from '../../lib/marketplace/app/oauth'
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

    const oauthObj = makeOauth({ app_uid: uid, organization_uid: 'organization_uid' })
    expect(oauthObj.params.organization_uid).to.be.equal('organization_uid')
    oauthObj
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

  it('Get oAuth configuration failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/${uid}/oauth`).reply(400, {})

    const oauthObj = makeOauth({ app_uid: uid, organization_uid: 'organization_uid' })
    expect(oauthObj.params.organization_uid).to.be.equal('organization_uid')
    oauthObj
      .fetch()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
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
    makeOauth({ app_uid: uid })
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

  it('Update oAuth configuration failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPut(`/manifests/${uid}/oauth`).reply(400, {})

    const config = { ...oAuthMock }
    makeOauth({ app_uid: uid })
      .update({ config })
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('List Scopes', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/oauth/scopes`).reply(200, {
      data: {
        ...oAuthScopesMock
      }
    })
    makeOauth({ app_uid: uid })
      .getScopes()
      .then((scopes) => {
        expect(scopes).to.deep.equal(oAuthScopesMock)
        done()
      })
      .catch(done)
  })

  it('List Scopes failing test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`/manifests/oauth/scopes`).reply(400, {})
    makeOauth({ app_uid: uid })
      .getScopes()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

function makeOauth (data) {
  return new Oauth(Axios, data, {})
}
