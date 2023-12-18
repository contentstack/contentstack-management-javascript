import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { multiPageCT, singlepageCT } from '../mock/content-type'
import { contentstackClient } from '../utility/ContentstackClient'

var client = {}

describe('Content Type delete api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('Content Type delete', done => {
    makeContentType(multiPageCT.content_type.uid)
      .delete().then((data) => {
        expect(data.notice).to.be.equal('Content Type deleted successfully.')
        done()
      })
    makeContentType(singlepageCT.content_type.uid).delete()
      .catch(done)
  })
})

function makeContentType (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).contentType(uid)
}
