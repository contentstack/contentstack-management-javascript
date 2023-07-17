import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appMock } from './mock/objects'
import { latestLiveResponse, signedUrlResponse } from './mock/hosting-mock'
import { Deployment } from '../../lib/marketplace/app/hosting/deployment'

describe('Contentstack hosting test', () => {
  it('test deployment without contents', done => {
    const deployment = makeDeployment()
    expect(deployment.create).to.be.equal(undefined)
    expect(deployment.fetch).to.be.equal(undefined)
    expect(deployment.findAll).to.be.equal(undefined)
    expect(deployment.logs).to.be.equal(undefined)
    expect(deployment.params).to.be.equal(undefined)
    expect(deployment.signedDownloadUrl).to.be.equal(undefined)
    expect(deployment.urlPath).to.be.equal(undefined)
    done()
  })
  it('test deployment without app uid', done => {
    const deployment = makeDeployment({})
    expect(deployment.create).to.be.equal(undefined)
    expect(deployment.fetch).to.be.equal(undefined)
    expect(deployment.findAll).to.be.equal(undefined)
    expect(deployment.logs).to.be.equal(undefined)
    expect(deployment.params).to.be.equal(undefined)
    expect(deployment.signedDownloadUrl).to.be.equal(undefined)
    expect(deployment.urlPath).to.be.equal(undefined)
    done()
  })

  it('test deployment with app uid', done => {
    const uid = appMock.uid
    const deployment = makeDeployment({ app_uid: uid })
    expect(deployment.create).to.not.equal(undefined)
    expect(deployment.fetch).to.be.equal(undefined)
    expect(deployment.findAll).to.not.equal(undefined)
    expect(deployment.logs).to.be.equal(undefined)
    expect(deployment.params.organization_uid).to.be.equal(undefined)
    expect(deployment.signedDownloadUrl).to.be.equal(undefined)
    expect(deployment.urlPath).to.be.equal(`/manifests/${uid}/hosting/deployments`)
    done()
  })

  it('test deployment with app uid and org uid', done => {
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    const deployment = makeDeployment({ app_uid: uid, organization_uid: organizationUid })
    expect(deployment.create).to.not.equal(undefined)
    expect(deployment.fetch).to.be.equal(undefined)
    expect(deployment.findAll).to.not.equal(undefined)
    expect(deployment.logs).to.be.equal(undefined)
    expect(deployment.params.organization_uid).to.not.equal(undefined)
    expect(deployment.signedDownloadUrl).to.be.equal(undefined)
    expect(deployment.urlPath).to.be.equal(`/manifests/${uid}/hosting/deployments`)
    done()
  })

  it('test deployment with deployment uid', done => {
    const appUid = appMock.uid
    const organizationUid = appMock.organization_uid
    const uid = 'Deployment_uid'
    const deployment = makeDeployment({ app_uid: appUid, organization_uid: organizationUid, data: { uid } })
    expect(deployment.create).to.be.equal(undefined)
    expect(deployment.fetch).to.not.equal(undefined)
    expect(deployment.findAll).to.be.equal(undefined)
    expect(deployment.logs).to.not.equal(undefined)
    expect(deployment.params.organization_uid).to.not.equal(undefined)
    expect(deployment.signedDownloadUrl).to.not.equal(undefined)
    expect(deployment.urlPath).to.be.equal(`/manifests/${appUid}/hosting/deployments/${uid}`)
    done()
  })

  it('test get all deployment for hosting', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    mock.onGet(`manifests/${uid}/hosting/deployments`).reply(200, {
      data: [latestLiveResponse.data]
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid })
      .findAll({ skip: 10 })
      .then((deployments) => {
        deployments.items.forEach(deployment => {
          checkDeployment(deployment)
        })
      })
      .catch(done)

    // Failing test
    mock.onGet(`manifests/${uid}/hosting/deployments`).reply(400, {})
    makeDeployment({ app_uid: uid, organization_uid: organizationUid })
      .findAll({ skip: 10 })
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test create deployment from signed url', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const uploadUid = signedUrlResponse.data.upload_uid
    const fileType = 'fileType'
    const organizationUid = appMock.organization_uid
    mock.onPost(`manifests/${uid}/hosting/deployments`).reply(200, {
      data: { ...latestLiveResponse.data }
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid })
      .create({ uploadUid, fileType })
      .then((deployment) => {
        checkDeployment(deployment)
      })
      .catch(done)

    // Failing test
    mock.onPost(`manifests/${uid}/hosting/deployments`).reply(400, {})
    makeDeployment({ app_uid: uid, organization_uid: organizationUid })
      .create({ uploadUid, fileType })
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test create deployment from signed url with advance options', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const uploadUid = signedUrlResponse.data.upload_uid
    const fileType = 'fileType'
    const organizationUid = appMock.organization_uid
    mock.onPost(`manifests/${uid}/hosting/deployments`).reply(200, {
      data: { ...latestLiveResponse.data }
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid })
      .create({ uploadUid, fileType, withAdvancedOptions: true })
      .then((deployment) => {
        checkDeployment(deployment)
        done()
      })
      .catch(done)
  })

  it('test get deployment from uid', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    const deploymentUid = latestLiveResponse.data.uid
    mock.onGet(`manifests/${uid}/hosting/deployments/${deploymentUid}`).reply(200, {
      data: { ...latestLiveResponse.data }
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid, organization_uid: organizationUid } })
      .fetch()
      .then((deployment) => {
        expect(deployment).to.be.instanceOf(Deployment)
        checkDeployment(deployment)
        done()
      })
      .catch(done)
  })

  it('test get deployment from uid fail test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    const deploymentUid = latestLiveResponse.data.uid
    mock.onGet(`manifests/${uid}/hosting/deployments/${deploymentUid}`).reply(400, {})

    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid, organization_uid: organizationUid } })
      .fetch()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('test get deployment logs from uid', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    const deploymentUid = latestLiveResponse.data.uid
    const content = {
      message: 'No build command set',
      stage: 'CREATING_BUILD',
      timestamp: '2023-01-17T10:15:07.397Z'
    }
    mock.onGet(`manifests/${uid}/hosting/deployments/${deploymentUid}/logs`).reply(200, {
      data: [content]
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid } })
      .logs()
      .then((logs) => {
        logs.forEach(log => {
          expect(log.message).to.be.equal(content.message)
          expect(log.stage).to.be.equal(content.stage)
          expect(log.timestamp).to.be.equal(content.timestamp)
        })
      })
      .catch(done)

    // Failing test
    mock.onGet(`manifests/${uid}/hosting/deployments/${deploymentUid}/logs`).reply(400, {})
    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid } })
      .logs()
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('signedDownloadUrl test', done => {
    const mock = new MockAdapter(Axios)
    const uid = appMock.uid
    const organizationUid = appMock.organization_uid
    const deploymentUid = latestLiveResponse.data.uid
    const content = {
      download_url: 'download_url',
      expires_in: 900
    }
    mock.onPost(`manifests/${uid}/hosting/deployments/${deploymentUid}/signedDownloadUrl`).reply(200, {
      data: { ...content }
    })

    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid } })
      .signedDownloadUrl()
      .then((download) => {
        expect(download.download_url).to.be.equal(content.download_url)
        expect(download.expires_in).to.be.equal(content.expires_in)
      })
      .catch(done)

    // Failing test
    mock.onPost(`manifests/${uid}/hosting/deployments/${deploymentUid}/signedDownloadUrl`).reply(400, {})
    makeDeployment({ app_uid: uid, organization_uid: organizationUid, data: { uid: deploymentUid } })
      .signedDownloadUrl()
      .then()
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

function makeDeployment (data, param = {}) {
  return new Deployment(Axios, data, param)
}

function checkDeployment (deployment) {
  expect(deployment.created_at).to.be.equal(latestLiveResponse.data.created_at)
  expect(deployment.deployment_number).to.be.equal(latestLiveResponse.data.deployment_number)
  expect(deployment.deployment_url).to.be.equal(latestLiveResponse.data.deployment_url)
  expect(deployment.environment).to.be.equal(latestLiveResponse.data.environment)
  expect(deployment.latest).to.be.equal(latestLiveResponse.data.latest)
  expect(deployment.preview_url).to.be.equal(latestLiveResponse.data.preview_url)
  expect(deployment.status).to.be.equal(latestLiveResponse.data.status)
  expect(deployment.uid).to.be.equal(latestLiveResponse.data.uid)
  expect(deployment.updated_at).to.be.equal(latestLiveResponse.data.updated_at)
}
