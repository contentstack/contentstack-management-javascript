
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
var client = {}

var stack = {}
describe('Delete api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Delete role in stack', done => {
    const role = jsonReader('role.json')
    client.stack(stack.api_key).role(role.uid)
      .delete()
      .then((notice) => {
        expect(notice).to.be.equal('The role deleted successfully.', 'Role delete notice does not match')
        done()
      })
      .catch(done)
  })

  it('Delete Stack', done => {
    client.stack(stack.api_key)
      .delete().then((notice) => {
        expect(notice).to.be.equal('Stack deleted successfully!')
        done()
      })
      .catch(done)
  })

  it('User logout test', done => {
    client.logout()
      .then((response) => {
        expect(axios.defaults.headers.authtoken).to.be.equal(undefined)
        expect(response.notice).to.be.equal('You\'ve logged out successfully.')
        done()
      })
      .catch(done)
  })
})
