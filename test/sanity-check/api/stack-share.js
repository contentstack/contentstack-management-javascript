import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
var client = {}

describe('Stack Share/Unshare', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should share stack test', done => {
    const role = jsonReader('roles.json')
    client.stack({ api_key: process.env.API_KEY })
      .share(['test@test.com'], { 'test@test.com': [role[0].uid] })
      .then((response) => {
        expect(response.notice).to.be.equal('The invitation has been sent successfully.')
        done()
      })
      .catch(done)
  })

  it('should unshare stack test', done => {
    client.stack({ api_key: process.env.API_KEY })
      .unShare('test@test.com')
      .then((response) => {
        expect(response.notice).to.be.equal('The stack has been successfully unshared.')
        done()
      })
      .catch(done)
  })
})
