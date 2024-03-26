import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { expect } from 'chai'

dotenv.config()

let apps = {}
let installation = {}
const orgID = process.env.ORGANIZATION
let client = {}

describe('Apps api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
    apps = jsonReader('apps.json')
    installation = jsonReader('installation.json')
  })

  it('Uninstall installation test', done => {
    client.organization(orgID).app(apps.uid).installation(installation.uid).uninstall()
      .then((installation) => {
        expect(installation).to.deep.equal({})
        done()
      }).catch(done)
  })

  it('Delete app test', done => {
    client.organization(orgID).app(apps.uid).delete()
      .then((appResponse) => {
        expect(appResponse).to.deep.equal({})
        done()
      })
      .catch(done)
  })
})
