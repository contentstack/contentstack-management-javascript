import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createManagementToken, createManagementToken2 } from './mock/managementToken.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
var tokenUID = ''
describe('Management Token api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Add a Management Token', done => {
    makeManagementToken()
      .create(createManagementToken)
      .then((token) => {
        expect(token.name).to.be.equal(createManagementToken.token.name)
        expect(token.description).to.be.equal(createManagementToken.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a Management Token for production', done => {
    makeManagementToken()
      .create(createManagementToken2)
      .then((token) => {
        tokenUID = token.uid
        expect(token.name).to.be.equal(createManagementToken2.token.name)
        expect(token.description).to.be.equal(createManagementToken2.token.description)
        expect(token.scope[0].module).to.be.equal(createManagementToken2.token.scope[0].module)
        expect(token.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get a Management Token from uid', done => {
    makeManagementToken(tokenUID)
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

  it('Query to get all Management Token', done => {
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

  it('Query to get a Management Token from name', done => {
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

  it('Fetch and update a Management Token from uid', done => {
    makeManagementToken(tokenUID)
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

  it('Update a Management Token from uid', done => {
    const token = makeManagementToken(tokenUID)
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

  it('Delete a Management Token from uid', done => {
    makeManagementToken(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Management Token deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeManagementToken (uid = null) {
  return client.stack({ api_key: stack.api_key }).managementToken(uid)
}
