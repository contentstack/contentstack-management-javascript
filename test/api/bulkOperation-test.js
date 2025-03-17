import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

describe('BulkOperation api test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('should publish one entry when publishDetails of an entry is passed', done => {
    const publishDetails = {
      entries: [
        {
          uid: 'blte6542a9aac484405',
          content_type: 'bye',
          version: 1,
          locale: 'en-us'
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'dev'
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
          uid: 'blt9f8e5aa45ac36455'
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'dev'
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
          uid: 'blt077157784a170bab',
          content_type: 'bye',
          version: 1,
          locale: 'en-us'
        }, {
          uid: 'blta519039712ca2b8a',
          content_type: 'bye',
          version: 1,
          locale: 'en-us'
        }
      ],
      assets: [
        {
          uid: 'blt9f8e5aa45ac36455'
        }, {
          uid: 'blt3b097cc58475b0a3'
        }
      ],
      locales: [
        'en-us'
      ],
      environments: [
        'dev'
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
  return client.stack({ api_key: stack.api_key }).bulkOperation()
}
