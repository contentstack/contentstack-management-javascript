import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../../sanity-check/utility/fileOperations/readwrite'
import { contentstackClient } from '../../sanity-check/utility/ContentstackClient'
import { singlepageCT, multiPageCT } from '../mock/content-type.js'
import { createManagementToken } from '../mock/managementToken.js'
import dotenv from 'dotenv'
dotenv.config()

let client = {}
let clientWithManagementToken = {}
let entryUid1 = ''
let assetUid1 = ''
let entryUid2 = ''
let assetUid2 = ''
let jobId1 = ''
let jobId2 = ''
let jobId3 = ''
let tokenUidDev = ''
let tokenUid = ''

describe('BulkOperation api test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    const entryRead1 = jsonReader('publishEntry1.json')
    const assetRead1 = jsonReader('publishAsset1.json')
    entryUid1 = entryRead1.uid
    assetUid1 = assetRead1.uid
    const entryRead2 = jsonReader('publishEntry2.json')
    const assetRead2 = jsonReader('publishAsset2.json')
    entryUid2 = entryRead2.uid
    assetUid2 = assetRead2.uid
    client = contentstackClient(user.authtoken)
    clientWithManagementToken = contentstackClient()
  })

  it('should create a Management Token for get job status', done => {
    makeManagementToken()
      .create(createManagementToken)
      .then((token) => {
        tokenUidDev = token.token
        tokenUid = token.uid
        expect(token.name).to.be.equal(createManagementToken.token.name)
        expect(token.description).to.be.equal(createManagementToken.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should publish one entry when publishDetails of an entry is passed', done => {
    const publishDetails = {
      entries: [
        {
          uid: entryUid1,
          content_type: multiPageCT.content_type.title,
          locale: 'en-us'
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    doBulkOperation()
      .publish({ details: publishDetails, api_version: '3.2' })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        jobId1 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should publish one asset when publishDetails of an asset is passed', done => {
    const publishDetails = {
      assets: [
        {
          uid: assetUid1
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    doBulkOperation()
      .publish({ details: publishDetails, api_version: '3.2' })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        jobId2 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should publish multiple entries assets when publishDetails of entries and assets are passed', done => {
    const publishDetails = {
      entries: [
        {
          uid: entryUid1,
          content_type: multiPageCT.content_type.uid,
          locale: 'en-us'
        },
        {
          uid: entryUid2,
          content_type: singlepageCT.content_type.uid,
          locale: 'en-us'
        }
      ],
      assets: [
        {
          uid: assetUid1
        },
        {
          uid: assetUid2
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    doBulkOperation()
      .publish({ details: publishDetails, api_version: '3.2' })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        jobId3 = response.job_id
        done()
      })
      .catch(done)
  })

    it('should get job status for the first publish job', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId1, api_version: '3.2' })
      .then((response) => {
        console.dir(response)
        expect(response).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.status).to.not.equal(undefined)
        expect(response.action).to.not.equal(undefined)
        expect(response.summary).to.not.equal(undefined)
        expect(response.body).to.not.equal(undefined)
        done()
      })
      .catch((error) => {
        console.error('Job status error:', error)
        done(error)
      })
  })

  it('should validate detailed job status response structure', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId1, api_version: '3.2' })
      .then((response) => {
        console.dir(response)
        expect(response).to.not.equal(undefined)
        // Validate main job properties
        expect(response.uid).to.not.equal(undefined)
        expect(response.created_by).to.not.equal(undefined)
        expect(response.updated_by).to.not.equal(undefined)
        expect(response.created_at).to.not.equal(undefined)
        expect(response.updated_at).to.not.equal(undefined)
        expect(response.action).to.not.equal(undefined)
        expect(response.api_key).to.not.equal(undefined)
        expect(response.status).to.not.equal(undefined)
        
        // Validate body structure
        expect(response.body).to.not.equal(undefined)
        expect(response.body.branch).to.not.equal(undefined)
        expect(response.body.locales).to.be.an('array')
        expect(response.body.environments).to.be.an('array')
        expect(response.body.published_at).to.not.equal(undefined)
        
        // Validate summary structure
        expect(response.summary).to.not.equal(undefined)
        expect(response.summary.approvals).to.be.a('number')
        expect(response.summary.skip).to.be.a('number')
        expect(response.summary.state).to.not.equal(undefined)
        expect(response.summary.success).to.be.a('number')
        expect(response.summary.total_processed).to.be.a('number')
        expect(response.summary.unsuccess).to.be.a('number')
        
        done()
      })
      .catch((error) => {
        console.error('Detailed job status error:', error)
        done(error)
      })
  })

  it('should get job status for the second publish job', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId2, api_version: '3.2' })
      .then((response) => {
        expect(response).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.status).to.not.equal(undefined)
        expect(response.action).to.not.equal(undefined)
        expect(response.summary).to.not.equal(undefined)
        expect(response.body).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('should get job status for the third publish job', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId3, api_version: '3.2' })
      .then((response) => {
        expect(response).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.status).to.not.equal(undefined)
        expect(response.action).to.not.equal(undefined)
        expect(response.summary).to.not.equal(undefined)
        expect(response.body).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('should get job status with bulk_version parameter', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId1, bulk_version: 'v3', api_version: '3.2' })
      .then((response) => {
        expect(response).to.not.equal(undefined)
        expect(response.uid).to.not.equal(undefined)
        expect(response.status).to.not.equal(undefined)
        expect(response.action).to.not.equal(undefined)
        expect(response.summary).to.not.equal(undefined)
        expect(response.body).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('should test job status endpoint accessibility', done => {
    doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: 'test-job-id', api_version: '3.2' })
      .then((response) => {
        done()
      })
      .catch((error) => {
        console.log('Job status endpoint error (expected for invalid job ID):', error.message)
        // This is expected to fail with invalid job ID, but should not be an auth error
        if (error.message && error.message.includes('authentication') || error.message.includes('401')) {
          done(error)
        } else {
          done() // Expected error for invalid job ID
        }
      })
  })

  it('should delete a Management Token', done => {
    makeManagementToken(tokenUid)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Management Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function doBulkOperation (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).bulkOperation()
}

function doBulkOperationWithManagementToken (tokenUidDev) {
  return clientWithManagementToken.stack({ api_key: process.env.API_KEY, management_token: tokenUidDev }).bulkOperation()
}

function makeManagementToken (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).managementToken(uid)
}
