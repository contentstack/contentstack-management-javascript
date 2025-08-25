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
let jobId4 = ''
let jobId5 = ''
let jobId6 = ''
let jobId7 = ''
let jobId8 = ''
let jobId9 = ''
let jobId10 = ''
let tokenUidDev = ''
let tokenUid = ''

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForJobReady (jobId, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await doBulkOperationWithManagementToken(tokenUidDev)
        .jobStatus({ job_id: jobId, api_version: '3.2' })

      if (response && response.status) {
        return response
      }
    } catch (error) {
      console.log(`Attempt ${attempt}: Job not ready yet, retrying...`)
    }
    await delay(2000)
  }
  throw new Error(`Job ${jobId} did not become ready after ${maxAttempts} attempts`)
}

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

  it('should publish entries with publishAllLocalized parameter set to true', done => {
    const publishDetails = {
      entries: [
        {
          uid: entryUid1,
          content_type: multiPageCT.content_type.uid,
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
      .publish({
        details: publishDetails,
        api_version: '3.2',
        publishAllLocalized: true
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId4 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should publish entries with publishAllLocalized parameter set to false', done => {
    const publishDetails = {
      entries: [
        {
          uid: entryUid2,
          content_type: singlepageCT.content_type.uid,
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
      .publish({
        details: publishDetails,
        api_version: '3.2',
        publishAllLocalized: false
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId5 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should publish assets with publishAllLocalized parameter', done => {
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
      .publish({
        details: publishDetails,
        api_version: '3.2',
        publishAllLocalized: true
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId6 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should unpublish entries with unpublishAllLocalized parameter set to true', done => {
    const unpublishDetails = {
      entries: [
        {
          uid: entryUid1,
          content_type: multiPageCT.content_type.uid,
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
      .unpublish({
        details: unpublishDetails,
        api_version: '3.2',
        unpublishAllLocalized: true
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId7 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should unpublish entries with unpublishAllLocalized parameter set to false', done => {
    const unpublishDetails = {
      entries: [
        {
          uid: entryUid2,
          content_type: singlepageCT.content_type.uid,
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
      .unpublish({
        details: unpublishDetails,
        api_version: '3.2',
        unpublishAllLocalized: false
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId8 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should unpublish assets with unpublishAllLocalized parameter', done => {
    const unpublishDetails = {
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
      .unpublish({
        details: unpublishDetails,
        api_version: '3.2',
        unpublishAllLocalized: true
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId9 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should publish entries with multiple parameters including publishAllLocalized', done => {
    const publishDetails = {
      entries: [
        {
          uid: entryUid1,
          content_type: multiPageCT.content_type.uid,
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
      .publish({
        details: publishDetails,
        api_version: '3.2',
        publishAllLocalized: true,
        skip_workflow_stage: true,
        approvals: true
      })
      .then((response) => {
        expect(response.notice).to.not.equal(undefined)
        expect(response.job_id).to.not.equal(undefined)
        // Store job ID for later status check
        jobId10 = response.job_id
        done()
      })
      .catch(done)
  })

  it('should wait for all jobs to be processed before checking status', async () => {
    await delay(5000) // Wait 5 seconds for jobs to be processed
  })

  it('should wait for jobs to be ready and get job status for the first publish job', async () => {
    const response = await waitForJobReady(jobId1)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should validate detailed job status response structure', async () => {
    const response = await waitForJobReady(jobId1)

    expect(response).to.not.equal(undefined)
    // Validate main job properties
    expect(response.uid).to.not.equal(undefined)
    expect(response.api_key).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)

    // Validate body structure
    expect(response.body).to.not.equal(undefined)
    expect(response.body.locales).to.be.an('array')
    expect(response.body.environments).to.be.an('array')
    // Validate summary structure
    expect(response.summary).to.not.equal(undefined)
  })

  it('should get job status for the second publish job', async () => {
    const response = await waitForJobReady(jobId2)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for the third publish job', async () => {
    const response = await waitForJobReady(jobId3)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for publishAllLocalized=true job', async () => {
    const response = await waitForJobReady(jobId4)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for publishAllLocalized=false job', async () => {
    const response = await waitForJobReady(jobId5)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for asset publishAllLocalized job', async () => {
    const response = await waitForJobReady(jobId6)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for unpublishAllLocalized=true job', async () => {
    const response = await waitForJobReady(jobId7)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for unpublishAllLocalized=false job', async () => {
    const response = await waitForJobReady(jobId8)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for asset unpublishAllLocalized job', async () => {
    const response = await waitForJobReady(jobId9)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status for multiple parameters job', async () => {
    const response = await waitForJobReady(jobId10)

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
  })

  it('should get job status with bulk_version parameter', async () => {
    await waitForJobReady(jobId1)

    const response = await doBulkOperationWithManagementToken(tokenUidDev)
      .jobStatus({ job_id: jobId1, bulk_version: 'v3', api_version: '3.2' })

    expect(response).to.not.equal(undefined)
    expect(response.uid).to.not.equal(undefined)
    expect(response.status).to.not.equal(undefined)
    expect(response.action).to.not.equal(undefined)
    expect(response.summary).to.not.equal(undefined)
    expect(response.body).to.not.equal(undefined)
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
  // @ts-ignore-next-line secret-detection
  return client.stack({ api_key: process.env.API_KEY }).bulkOperation()
}

function doBulkOperationWithManagementToken (tokenUidDev) {
  // @ts-ignore-next-line secret-detection
  return clientWithManagementToken.stack({ api_key: process.env.API_KEY, management_token: tokenUidDev }).bulkOperation()
}

function makeManagementToken (uid = null) {
  // @ts-ignore-next-line secret-detection
  return client.stack({ api_key: process.env.API_KEY }).managementToken(uid)
}
