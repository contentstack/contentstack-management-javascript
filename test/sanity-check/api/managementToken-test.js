import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'
import { createManagementToken, createManagementToken2 } from '../mock/managementToken.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

let tokenUidProd = ''
let tokenUidDev = ''
describe('Management Token api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should add a Management Token', done => {
    makeManagementToken()
      .create(createManagementToken)
      .then((token) => {
        tokenUidDev = token.uid
        expect(token.name).to.be.equal(createManagementToken.token.name)
        expect(token.description).to.be.equal(createManagementToken.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should add a Management Token for production', done => {
    makeManagementToken()
      .create(createManagementToken2)
      .then((token) => {
        tokenUidProd = token.uid
        expect(token.name).to.be.equal(createManagementToken2.token.name)
        expect(token.description).to.be.equal(createManagementToken2.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get a Management Token from uid', done => {
    makeManagementToken(tokenUidProd)
      .fetch()
      .then((token) => {
        expect(token.name).to.be.equal(createManagementToken2.token.name)
        expect(token.description).to.be.equal(createManagementToken2.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should query to get all Management Token', done => {
    makeManagementToken()
      .query()
      .find()
      .then((tokens) => {
        tokens.items.forEach((token) => {
          expect(token.name).to.be.not.equal(null)
          expect(token.description).to.be.not.equal(null)
          expect(token.scope[0].module).to.be.not.equal(null)
          expect(token.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should query to get a Management Token from name', done => {
    makeManagementToken()
      .query({ query: { name: createManagementToken.token.name } })
      .find()
      .then((tokens) => {
        tokens.items.forEach((token) => {
          expect(token.name).to.be.equal(createManagementToken.token.name)
          expect(token.description).to.be.equal(createManagementToken.token.description)
          expect(token.scope[0].module).to.be.equal(createManagementToken.token.scope[0].module)
          expect(token.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should fetch and update a Management Token from uid', done => {
    makeManagementToken(tokenUidProd)
      .fetch()
      .then((token) => {
        token.name = 'Update Production Name'
        token.description = 'Update Production description'
        token.scope = createManagementToken2.token.scope
        return token.update()
      })
      .then((token) => {
        expect(token.name).to.be.equal('Update Production Name')
        expect(token.description).to.be.equal('Update Production description')
        expect(token.scope[0].module).to.be.equal(createManagementToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should update a Management Token from uid', done => {
    const token = makeManagementToken(tokenUidProd)
    Object.assign(token, createManagementToken2.token)
    token.update()
      .then((token) => {
        expect(token.name).to.be.equal(createManagementToken2.token.name)
        expect(token.description).to.be.equal(createManagementToken2.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should delete a Management Token from uid', done => {
    makeManagementToken(tokenUidProd)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Management Token deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete a Management Token from uid 2', done => {
    makeManagementToken(tokenUidDev)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Management Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeManagementToken (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).managementToken(uid)
}
