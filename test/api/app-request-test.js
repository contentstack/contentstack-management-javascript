import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { expect } from 'chai'

dotenv.config()

let apps = {}
const orgID = process.env.ORGANIZATION
let client = {}
let stack = {}
let requestUID = ''
describe('Apps request api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    apps = jsonReader('apps.json')
    stack = jsonReader('stack.json')
  })

  it('test create app request', done => {
    client.organization(orgID).request()
      .create({ appUid: apps.uid, targetUid: stack.api_key })
      .then((response) => {
        requestUID = response.data.data.uid
        expect(response.data).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test get all request for oranization', done => {
    client.organization(orgID).request()
      .findAll()
      .then((response) => {
        expect(response.data).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('test delete app request', done => {
    client.organization(orgID).request()
      .delete(requestUID)
      .then((response) => {
        expect(response.data).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })
})
