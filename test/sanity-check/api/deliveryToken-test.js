import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createDeliveryToken, createDeliveryToken2 } from '../mock/deliveryToken.js'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}

let tokenUID = ''
describe('Delivery Token api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should add a Delivery Token for development', done => {
    makeDeliveryToken()
      .create(createDeliveryToken)
      .then((token) => {
        expect(token.name).to.be.equal(createDeliveryToken.token.name)
        expect(token.description).to.be.equal(createDeliveryToken.token.description)
        expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken.token.scope[0].environments[0])
        expect(token.scope[0].module).to.be.equal(createDeliveryToken.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        expect(token.preview_token).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should add a Delivery Token for production', done => {
    makeDeliveryToken()
      .create(createDeliveryToken2)
      .then((token) => {
        tokenUID = token.uid
        expect(token.name).to.be.equal(createDeliveryToken2.token.name)
        expect(token.description).to.be.equal(createDeliveryToken2.token.description)
        expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken2.token.scope[0].environments[0])
        expect(token.scope[0].module).to.be.equal(createDeliveryToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        expect(token.preview_token).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get a Delivery Token from uid', done => {
    makeDeliveryToken(tokenUID)
      .fetch()
      .then((token) => {
        expect(token.name).to.be.equal(createDeliveryToken2.token.name)
        expect(token.description).to.be.equal(createDeliveryToken2.token.description)
        expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken2.token.scope[0].environments[0])
        expect(token.scope[0].module).to.be.equal(createDeliveryToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should query to get all Delivery Token', done => {
    makeDeliveryToken()
      .query()
      .find()
      .then((tokens) => {
        tokens.items.forEach((token) => {
          expect(token.name).to.be.not.equal(null)
          expect(token.description).to.be.not.equal(null)
          expect(token.scope[0].environments[0].name).to.be.not.equal(null)
          expect(token.scope[0].module).to.be.not.equal(null)
          expect(token.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should query to get a Delivery Token from name', done => {
    makeDeliveryToken()
      .query({ query: { name: createDeliveryToken.token.name } })
      .find()
      .then((tokens) => {
        tokens.items.forEach((token) => {
          expect(token.name).to.be.equal(createDeliveryToken.token.name)
          expect(token.description).to.be.equal(createDeliveryToken.token.description)
          expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken.token.scope[0].environments[0])
          expect(token.scope[0].module).to.be.equal(createDeliveryToken.token.scope[0].module)
          expect(token.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should fetch and update a Delivery Token from uid', done => {
    makeDeliveryToken(tokenUID)
      .fetch()
      .then((token) => {
        token.name = 'Update Production Name'
        token.description = 'Update Production description'
        token.scope = createDeliveryToken2.token.scope
        return token.update()
      })
      .then((token) => {
        expect(token.name).to.be.equal('Update Production Name')
        expect(token.description).to.be.equal('Update Production description')
        expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken2.token.scope[0].environments[0])
        expect(token.scope[0].module).to.be.equal(createDeliveryToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should update a Delivery Token from uid', done => {
    const token = makeDeliveryToken(tokenUID)
    Object.assign(token, createDeliveryToken2.token)
    token.update()
      .then((token) => {
        expect(token.name).to.be.equal(createDeliveryToken2.token.name)
        expect(token.description).to.be.equal(createDeliveryToken2.token.description)
        expect(token.scope[0].environments[0].name).to.be.equal(createDeliveryToken2.token.scope[0].environments[0])
        expect(token.scope[0].module).to.be.equal(createDeliveryToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should delete a Delivery Token from uid', done => {
    makeDeliveryToken(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Delivery Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeDeliveryToken (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).deliveryToken(uid)
}
