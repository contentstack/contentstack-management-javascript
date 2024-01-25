import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { environmentCreate, environmentProdCreate } from '../mock/environment.js'
import { stageBranch } from '../mock/branch.js'
import { createDeliveryToken } from '../mock/deliveryToken.js'
import dotenv from 'dotenv'

dotenv.config()

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

describe('Delivery Token delete api Test', () => {
  let tokenUID = ''
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should get token uid by name for deleting that token', done => {
    makeDeliveryToken()
      .query({ query: { name: createDeliveryToken.token.name } })
      .find()
      .then((tokens) => {
        tokens.items.forEach((token) => {
          tokenUID = token.uid
        })
        done()
      })
      .catch(done)
  })
  it('should delete Delivery token from uid', done => {
    makeDeliveryToken(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Delivery Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

describe('Branch Alias delete api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('Should delete Branch Alias', done => {
    try {
      makeBranchAlias(`${stageBranch.uid}_alias`)
        .delete()
        .then((response) => {
          expect(response.notice).to.be.equal('Branch alias deleted successfully.')
          done()
        })
        .catch(done)
    } catch (e) {
      done()
    }
  })
  it('Should delete stage branch from uid', done => {
    client.stack({ api_key: process.env.API_KEY }).branch(stageBranch.uid)
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Your request to delete branch is in progress. Please check organization bulk task queue for more details.')
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

function makeDeliveryToken (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).deliveryToken(uid)
}

function makeBranchAlias (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).branchAlias(uid)
}

