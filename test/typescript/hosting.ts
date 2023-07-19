import { expect } from 'chai'
import * as dotenv from 'dotenv'
import { Hosting } from '../../types/marketplace/hosting'
dotenv.config()
let uploadUid = ''
let deploymentUid = ''
export function hosting(hosting: Hosting) {
    describe('Hosting api', () => {
        test('create upload url', done => {
            hosting.createUploadUrl()
            .then((response)=> {
                uploadUid = response.upload_uid
                expect(response.upload_uid).to.not.equal(undefined)
                expect(response.form_fields).to.not.equal(undefined)
                expect(response.upload_url).to.not.equal(undefined)
                expect(response.expires_in).to.not.equal(undefined)
                done()
              })
              .catch(done)
        })

        test('isEnable hosting', done => {
            hosting.isEnable()
            .then((response) => {
              expect(response.enabled).to.not.equal(false)
              done()
            })
            .catch(done)
        })
        test('test latest live deployment for apps hosting', done => {
            hosting.latestLiveDeployment()
              .then((response) => {
                expect(response).to.not.equal(undefined)
                done()
              })
              .catch(done)
          })
        
        test('test enable apps hosting details', done => {
            hosting.enable()
              .then((response) => {
                expect(response.enabled).to.not.equal(true)
                done()
              })
              .catch(done)
          })
        
        test('test disable apps hosting details', done => {
            hosting.disable()
              .then((response) => {
                expect(response.enabled).to.not.equal(false)
                done()
              })
              .catch(done)
          })
    })
}

export function deployment(hosting: Hosting) {
    describe('deployment api', () => {
        test('create deployment', done => {
            hosting.deployment().create({ uploadUid, fileType: 'SOURCE' })
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
        test('find all deployment', done => {
            hosting.deployment().findAll()
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
        test('test get deployment from uid for app hosting', done => {
            hosting.deployment(deploymentUid).fetch()
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
        
        test('test get deployment logs for app hosting', done => {
            hosting.deployment(deploymentUid).logs()
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
        
        test('test get deployment signed download url for app hosting', done => {
            hosting.deployment(deploymentUid).signedDownloadUrl()
              .then((response) => {
                expect(response.download_url).to.not.equal(undefined)
                expect(response.expires_in).to.not.equal(undefined)
                done()
              })
              .catch(done)
        })
    })
}