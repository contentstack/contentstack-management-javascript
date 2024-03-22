import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../../sanity-check/utility/fileOperations/readwrite'
import { contentstackClient } from '../../sanity-check/utility/ContentstackClient'
import { singlepageCT, multiPageCT } from '../mock/content-type.js'
import dotenv from 'dotenv'
dotenv.config()

let client = {}
let entryUid1 = ''
let assetUid1 = ''
let entryUid2 = ''
let assetUid2 = ''

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
        done()
      })
      .catch(done)
  })
})

function doBulkOperation (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).bulkOperation()
}
