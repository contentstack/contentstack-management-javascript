import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { multiPageCT } from '../unit/mock/content-type'

var client = {}

var stack = {}
describe('Content Type delete api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Content Type delete', done => {
    makeContentType(multiPageCT.content_type.uid)
      .delete().then((notice) => {
        expect(notice).to.be.equal('Content Type deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeContentType (uid = null) {
  return client.stack(stack.api_key).contentType(uid)
}
