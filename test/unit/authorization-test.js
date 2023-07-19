import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Authorization } from '../../lib/marketplace/authorization'

const uid = 'APP_UID'
const orgUid = 'org_uid'
const authUid = 'AUTH_UID'

describe('Contentstack apps authorization test', () => {
  it('Authorization without content', () => {
    const authorization = makeAuthorization()
    expect(authorization.findAll).to.be.equal(undefined)
    expect(authorization.revokeAll).to.be.equal(undefined)
    expect(authorization.revoke).to.be.equal(undefined)
    expect(authorization.params).to.not.equal(undefined)
  })

  it('Authorization without app uid', () => {
    const authorization = makeAuthorization({})
    expect(authorization.findAll).to.be.equal(undefined)
    expect(authorization.revokeAll).to.be.equal(undefined)
    expect(authorization.revoke).to.be.equal(undefined)
    expect(authorization.params).to.not.equal(undefined)
  })
  it('Authorization with app uid', () => {
    const authorization = makeAuthorization({ app_uid: uid })
    expect(authorization.urlPath).to.be.equal(`/manifests/${uid}/authorizations`)
    expect(authorization.findAll).to.not.equal(undefined)
    expect(authorization.revokeAll).to.not.equal(undefined)
    expect(authorization.revoke).to.not.equal(undefined)
    expect(authorization.params).to.not.equal(undefined)
  })
  it('Authorization with app uid org uid as Param', () => {
    const authorization = makeAuthorization({ app_uid: uid }, { organization_uid: orgUid })
    expect(authorization.urlPath).to.be.equal(`/manifests/${uid}/authorizations`)
    expect(authorization.findAll).to.not.equal(undefined)
    expect(authorization.revokeAll).to.not.equal(undefined)
    expect(authorization.revoke).to.not.equal(undefined)
    expect(authorization.params.organization_uid).to.be.equal(orgUid)
  })
  it('Authorization with app uid, org uid as content', () => {
    const authorization = makeAuthorization({ app_uid: uid, organization_uid: orgUid })
    expect(authorization.urlPath).to.be.equal(`/manifests/${uid}/authorizations`)
    expect(authorization.findAll).to.not.equal(undefined)
    expect(authorization.revokeAll).to.not.equal(undefined)
    expect(authorization.revoke).to.not.equal(undefined)
    expect(authorization.params.organization_uid).to.be.equal(orgUid)
  })

  it('test find all authorization for apps', done => {
    const content = {
      app_uid: 'app_uid',
      organization_uid: 'org_uid',
      scopes: [
        'user.profile:read'
      ],
      created_at: '2021-09-09T05:03:10.473Z',
      updated_at: '2021-09-09T05:03:10.473Z',
      user: {
        uid: 'uid'
      }
    }
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${uid}/authorizations`).reply(200, {
      data: [content]
    })

    makeAuthorization({ app_uid: uid })
      .findAll()
      .then((response) => {
        const result = response.data[0]
        expect(result.app_uid).to.be.equal(content.app_uid)
        expect(result.organization_uid).to.be.equal(content.organization_uid)
        expect(result.scopes[0]).to.be.equal(content.scopes[0])
        expect(result.user.uid).to.be.equal(content.user.uid)
        done()
      })
      .catch(done)
  })

  it('test revoke all authorization for apps', done => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/manifests/${uid}/authorizations`).reply(200, {

    })

    makeAuthorization({ app_uid: uid })
      .revokeAll()
      .then((response) => {
        expect(response).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('test revoke authorization for apps', done => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/manifests/${uid}/authorizations/${authUid}`).reply(200, {

    })

    makeAuthorization({ app_uid: uid })
      .revoke(authUid)
      .then((response) => {
        expect(response).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('test find all authorization for apps fail request', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests/${uid}/authorizations`).reply(400, {
    })

    makeAuthorization({ app_uid: uid })
      .findAll({})
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test revoke all authorization for apps fail request', done => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/manifests/${uid}/authorizations`).reply(400, {

    })

    makeAuthorization({ app_uid: uid })
      .revokeAll({})
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test revoke authorization for apps fail request', done => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/manifests/${uid}/authorizations/${authUid}`).reply(400, {

    })

    makeAuthorization({ app_uid: uid })
      .revoke(authUid)
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

function makeAuthorization (data, param) {
  return new Authorization(Axios, data, param)
}
