
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
var client = {}

var stack = {}
describe('Delete api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Delete role in stack', done => {
    const role = jsonReader('role.json')
    client.stack(stack.api_key).role(role.uid)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('The role deleted successfully.', 'Role delete notice does not match')
        done()
      })
      .catch(done)
  })

  it('Delete Stack', done => {
    client.stack(stack.api_key)
      .delete().then((data) => {
        expect(data.notice).to.be.equal('Stack deleted successfully!')
        done()
      })
      .catch(done)
  })

  it('User logout test', done => {
    client.logout()
      .then((response) => {
        expect(response.notice).to.be.equal('You\'ve logged out successfully.')
        done()
      })
      .catch(done)
  })
})
