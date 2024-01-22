import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { environmentCreate, environmentProdCreate } from '../mock/environment.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

describe('Delete Environment api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should delete an environment', done => {
    makeEnvironment(environmentCreate.environment.name)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Environment deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete the prod environment', done => {
    makeEnvironment(environmentProdCreate.environment.name)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Environment deleted successfully.')
        done()
      })
      .catch(done)
  })
})

describe('Delete Locale api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should delete language: Hindi - India', done => {
    makeLocale('hi-in')
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Language removed successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete language: English - Austria', done => {
    makeLocale('en-at')
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Language removed successfully.')
        done()
      })
      .catch(done)
  })
})

function makeEnvironment (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).environment(uid)
}

function makeLocale (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).locale(uid)
}
