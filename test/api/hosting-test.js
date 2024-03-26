import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { expect } from 'chai'

dotenv.config()

let apps = {}
const orgID = process.env.ORGANIZATION
let client = {}
let uploadUid = ''
let deploymentUid = ''
describe('Apps hosting api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    apps = jsonReader('apps.json')
  })

  it('test get apps hosting details', done => {
    makeHosting(apps.uid).isEnable()
      .then((response) => {
        expect(response.enabled).to.not.equal(false)
        done()
      })
      .catch(done)
  })

  it('test create upload url for apps hosting details', done => {
    makeHosting(apps.uid).createUploadUrl()
      .then((response) => {
        uploadUid = response.upload_uid
        expect(response.upload_uid).to.not.equal(undefined)
        expect(response.form_fields).to.not.equal(undefined)
        expect(response.upload_url).to.not.equal(undefined)
        expect(response.expires_in).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test deployment for signed upload app hosting', done => {
    makeHosting(apps.uid).deployment().create({ uploadUid, fileType: 'SOURCE' })
      .then((response) => {
        deploymentUid = response.uid
        expect(response.deployment_number).to.not.equal(undefined)
        expect(response.deployment_url).to.not.equal(undefined)
        expect(response.environment).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.urlPath).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test deployment for signed upload app hosting', done => {
    makeHosting(apps.uid).deployment().findAll()
      .then((response) => {
        response.items.forEach(deployment => {
          expect(deployment.deployment_number).to.not.equal(undefined)
          expect(deployment.deployment_url).to.not.equal(undefined)
          expect(deployment.environment).to.not.equal(undefined)
          expect(deployment.uid).to.not.equal(undefined)
          expect(deployment.urlPath).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('test get deployment from uid for app hosting', done => {
    makeHosting(apps.uid).deployment(deploymentUid).fetch()
      .then((response) => {
        expect(response.deployment_number).to.not.equal(undefined)
        expect(response.deployment_url).to.not.equal(undefined)
        expect(response.environment).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.urlPath).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test get deployment logs for app hosting', done => {
    makeHosting(apps.uid).deployment(deploymentUid).logs()
      .then((response) => {
        for (const i in response) {
          const deploymentLogs = response[i]
          expect(deploymentLogs.message).to.not.equal(undefined)
          expect(deploymentLogs.stage).to.not.equal(undefined)
          expect(deploymentLogs.timestamp).to.not.equal(undefined)
        }
        done()
      })
      .catch(done)
  })

  it('test get deployment signed download url for app hosting', done => {
    makeHosting(apps.uid).deployment(deploymentUid).signedDownloadUrl()
      .then((response) => {
        expect(response.download_url).to.not.equal(undefined)
        expect(response.expires_in).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test latest live deployment for apps hosting', done => {
    makeHosting(apps.uid).latestLiveDeployment()
      .then((response) => {
        expect(response).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test enable apps hosting details', done => {
    makeHosting(apps.uid).enable()
      .then((response) => {
        expect(response.enabled).to.not.equal(true)
        done()
      })
      .catch(done)
  })

  it('test disable apps hosting details', done => {
    makeHosting(apps.uid).disable()
      .then((response) => {
        expect(response.enabled).to.not.equal(false)
        done()
      })
      .catch(done)
  })
})

function makeHosting (appUid) {
  return client.organization(orgID).app(appUid).hosting()
}
