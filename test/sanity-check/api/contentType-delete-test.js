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

  it('should content Type delete', done => {
    makeContentType(multiPageCT.content_type.uid)
      .delete().then((data) => {
        expect(data.notice).to.be.equal('Content Type deleted successfully.')
        done()
      })
    makeContentType(singlepageCT.content_type.uid).delete()
      .catch(done)
  })

  it('should delete ContentTypes', done => {
    makeContentType('multi_page_from_json')
      .delete()
      .then((contentType) => {
        expect(contentType.notice).to.be.equal('Content Type deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete Variant ContentTypes', done => {
    makeContentType('iphone_prod_desc')
      .delete()
      .then((contentType) => {
        expect(contentType.notice).to.be.equal('Content Type deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeContentType (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).contentType(uid)
}
