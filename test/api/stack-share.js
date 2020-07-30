import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
var stack = {}
var client = {}

describe('Stack Share/Unshare', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })
  it('Share stack test', done => {
    const role = jsonReader('role.json')
    client.stack(stack.api_key)
      .share(['test@test.com'], { 'test@test.com': [role.uid] })
      .then((response) => {
        expect(response).to.be.equal('The invitation has been sent successfully.')
        done()
      })
      .catch(done)
  })

  it('unshare stack test', done => {
    client.stack(stack.api_key)
      .unShare('test@test.com')
      .then((response) => {
        expect(response).to.be.equal('The stack has been successfully unshared.')
        done()
      })
      .catch(done)
  })
})
