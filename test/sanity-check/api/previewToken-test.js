import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createDeliveryToken3 } from '../mock/deliveryToken.js'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}

let tokenUID = ''
describe('Preview Token api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should add a Delivery Token for development', (done) => {
    makeDeliveryToken()
      .create(createDeliveryToken3)
      .then((token) => {
        tokenUID = token.uid
        expect(token.name).to.be.equal(createDeliveryToken3.token.name)
        expect(token.description).to.be.equal(
          createDeliveryToken3.token.description
        )
        expect(token.scope[0].environments[0].name).to.be.equal(
          createDeliveryToken3.token.scope[0].environments[0]
        )
        expect(token.scope[0].module).to.be.equal(
          createDeliveryToken3.token.scope[0].module
        )
        expect(token.uid).to.be.not.equal(null)
        expect(token.preview_token).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should add a Preview Token', (done) => {
    makePreviewToken(tokenUID)
      .create()
      .then((token) => {
        expect(token.name).to.be.equal(createDeliveryToken3.token.name)
        expect(token.description).to.be.equal(
          createDeliveryToken3.token.description
        )
        expect(token.scope[0].environments[0].name).to.be.equal(
          createDeliveryToken3.token.scope[0].environments[0]
        )
        expect(token.scope[0].module).to.be.equal(
          createDeliveryToken3.token.scope[0].module
        )
        expect(token.uid).to.be.not.equal(null)
        expect(token.preview_token).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should delete a Preview Token from uid', (done) => {
    makePreviewToken(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Preview token deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete a Delivery Token from uid', (done) => {
    makeDeliveryToken(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Delivery Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makePreviewToken (uid = null) {
  return client
    .stack({ api_key: process.env.API_KEY })
    .deliveryToken(uid)
    .previewToken()
}

function makeDeliveryToken (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).deliveryToken(uid)
}
