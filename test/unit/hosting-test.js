import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock } from './mock/objects'
import { Hosting } from '../../lib/marketplace/app/hosting'
import { latestLiveResponse, signedUrlResponse } from './mock/hosting-mock'

describe('Contentstack hosting test', () => {
  it('Hosting without contents', done => {
    const hosting = makeHosting()
    expect(hosting).to.not.equal(undefined)
    expect(hosting.createUploadUrl).to.be.equal(undefined)
    expect(hosting.deployment).to.be.equal(undefined)
    expect(hosting.disable).to.be.equal(undefined)
    expect(hosting.enable).to.be.equal(undefined)
    expect(hosting.isEnable).to.be.equal(undefined)
    expect(hosting.latestLiveDeployment).to.be.equal(undefined)
    expect(hosting.params).to.not.equal(undefined)
    expect(hosting.urlPath).to.be.equal(undefined)
    done()
  })
  it('Hosting without app uid', done => {
    const hosting = makeHosting({})
    expect(hosting).to.not.equal(undefined)
    expect(hosting.createUploadUrl).to.be.equal(undefined)
    expect(hosting.deployment).to.be.equal(undefined)
    expect(hosting.disable).to.be.equal(undefined)
    expect(hosting.enable).to.be.equal(undefined)
    expect(hosting.isEnable).to.be.equal(undefined)
    expect(hosting.latestLiveDeployment).to.be.equal(undefined)
    expect(hosting.params).to.not.equal(undefined)
    expect(hosting.urlPath).to.be.equal(undefined)
    done()
  })

  it('Hosting with app uid', done => {
    const appUid = 'APP_UID'
    const hosting = makeHosting({ app_uid: appUid })
    expect(hosting).to.not.equal(undefined)
    expect(hosting.createUploadUrl).to.not.equal(undefined)
    expect(hosting.deployment).to.not.equal(undefined)
    expect(hosting.disable).to.not.equal(undefined)
    expect(hosting.enable).to.not.equal(undefined)
    expect(hosting.isEnable).to.not.equal(undefined)
    expect(hosting.latestLiveDeployment).to.not.equal(undefined)
    expect(hosting.params).to.not.equal(undefined)
    expect(hosting.urlPath).to.be.equal(`/manifests/${appUid}/hosting`)
    expect(hosting.deployment()).to.not.equal(undefined)
    expect(hosting.deployment('uid')).to.not.equal(undefined)
    done()
  })

  it('Hosting with app uid and org uid', done => {
    const appUid = 'APP_UID'
    const organizationUid = 'ORG_UID'
    const hosting = makeHosting({ app_uid: appUid, organization_uid: organizationUid })
    expect(hosting).to.not.equal(undefined)
    expect(hosting.createUploadUrl).to.not.equal(undefined)
    expect(hosting.deployment).to.not.equal(undefined)
    expect(hosting.disable).to.not.equal(undefined)
    expect(hosting.enable).to.not.equal(undefined)
    expect(hosting.isEnable).to.not.equal(undefined)
    expect(hosting.latestLiveDeployment).to.not.equal(undefined)
    expect(hosting.params.organization_uid).to.be.equal(organizationUid)
    expect(hosting.urlPath).to.be.equal(`/manifests/${appUid}/hosting`)
    done()
  })

  it('test hosting is enable request', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`manifests/${uid}/hosting`).reply(200, {
      data: { enabled: false }
    })

    makeHosting({ app_uid: uid })
      .isEnable()
      .then((response) => {
        expect(response.data.enabled).to.be.equal(false)
        done()
      })
      .catch(done)
  })

  it('fail test hosting isEnable request', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`manifests/${uid}/hosting`).reply(400, {})
    makeHosting({ app_uid: uid })
      .isEnable()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test set hosting enable', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPatch(`manifests/${uid}/hosting/enable`).reply(200, {
      data: { enabled: true }
    })

    makeHosting({ app_uid: uid })
      .enable()
      .then((response) => {
        expect(response.data.enabled).to.be.equal(true)
        done()
      })
      .catch(done)
  })

  it('fail test set hosting enable', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPatch(`manifests/${uid}/hosting/enable`).reply(400, {})

    makeHosting({ app_uid: uid })
      .enable()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test set hosting disble', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPatch(`manifests/${uid}/hosting/disable`).reply(200, {
      data: { enabled: false }
    })

    makeHosting({ app_uid: uid })
      .disable()
      .then((response) => {
        expect(response.data.enabled).to.be.equal(false)
        done()
      })
      .catch(done)
  })

  it('fail test set hosting disble', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPatch(`manifests/${uid}/hosting/disable`).reply(400, {})

    makeHosting({ app_uid: uid })
      .disable()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test create signed url for hosting', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPost(`manifests/${uid}/hosting/signedUploadUrl`).reply(200, {
      ...signedUrlResponse
    })

    makeHosting({ app_uid: uid })
      .createUploadUrl()
      .then((response) => {
        expect(response.data.upload_uid).to.be.equal(signedUrlResponse.data.upload_uid)
        expect(response.data.upload_url).to.be.equal(signedUrlResponse.data.upload_url)
        expect(response.data.expires_in).to.be.equal(signedUrlResponse.data.expires_in)
        done()
      })
      .catch(done)
  })

  it('fail test create signed url for hosting', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onPost(`manifests/${uid}/hosting/signedUploadUrl`).reply(400, {})

    makeHosting({ app_uid: uid })
      .createUploadUrl()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test latest deployment for hosting', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`manifests/${uid}/hosting/latestLiveDeployment`).reply(200, {
      ...latestLiveResponse
    })

    makeHosting({ app_uid: uid })
      .latestLiveDeployment()
      .then((deployment) => {
        expect(deployment.created_at).to.be.equal(latestLiveResponse.data.created_at)
        expect(deployment.deployment_number).to.be.equal(latestLiveResponse.data.deployment_number)
        expect(deployment.deployment_url).to.be.equal(latestLiveResponse.data.deployment_url)
        expect(deployment.environment).to.be.equal(latestLiveResponse.data.environment)
        expect(deployment.latest).to.be.equal(latestLiveResponse.data.latest)
        expect(deployment.preview_url).to.be.equal(latestLiveResponse.data.preview_url)
        expect(deployment.status).to.be.equal(latestLiveResponse.data.status)
        expect(deployment.uid).to.be.equal(latestLiveResponse.data.uid)
        expect(deployment.updated_at).to.be.equal(latestLiveResponse.data.updated_at)
        done()
      })
      .catch(done)
  })

  it('fail test latest deployment for hosting', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    mock.onGet(`manifests/${uid}/hosting/latestLiveDeployment`).reply(400, {})

    makeHosting({ app_uid: uid })
      .latestLiveDeployment()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

function makeHosting (data, param = {}) {
  return new Hosting(Axios, data, param)
}
