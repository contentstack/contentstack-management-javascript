import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { expect } from 'chai'

dotenv.config()

const orgID = process.env.ORGANIZATION
let client = {}
let apps = {}

describe('Apps api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    apps = jsonReader('apps.json')
  })

  it('fetch all authorization apps test', done => {
    client.organization(orgID).app(apps.uid).authorization().findAll()
      .then((response) => {
        expect(response).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('revoke all authorization apps test', done => {
    client.organization(orgID).app(apps.uid).authorization().revokeAll()
      .then((response) => {
        expect(response).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('revoke all authorization apps test', done => {
    client.organization(orgID).app(apps.uid).authorization().revoke('uid')
      .then((response) => {
        expect(response).to.not.equal(null)
        done()
      })
      .catch(done)
  })
})
