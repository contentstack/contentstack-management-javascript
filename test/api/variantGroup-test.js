import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createVariantGroup, createVariantGroup1, createVariantGroup2 } from './mock/variantGroup.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
var tokenUID = ''
describe('Variant Group api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Add a Variant Group', done => {
    makeVariantGroup()
      .create(createVariantGroup)
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal(createVariantGroup.name)
        expect(variantGroup.description).to.be.equal(createVariantGroup.description)
        expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup.scope[0].module)
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a Variant Group for production', done => {
    makeVariantGroup()
      .create(createVariantGroup2)
      .then((variantGroup) => {
        tokenUID = variantGroup.uid
        expect(variantGroup.name).to.be.equal(createVariantGroup2.name)
        expect(variantGroup.description).to.be.equal(createVariantGroup2.description)
        expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup2.scope[0].module)
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get a Variant Group from uid', done => {
    makeVariantGroup(tokenUID)
      .fetch()
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal(createVariantGroup1.name)
        expect(variantGroup.description).to.be.equal(createVariantGroup1.description)
        expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup1.scope[0].module)
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Query to get all Variant Group', done => {
    makeVariantGroup()
      .query()
      .find()
      .then((tokens) => {
        tokens.items.forEach((variantGroup) => {
          expect(variantGroup.name).to.be.not.equal(null)
          expect(variantGroup.description).to.be.not.equal(null)
          expect(variantGroup.scope[0].module).to.be.not.equal(null)
          expect(variantGroup.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Query to get a Variant Group from name', done => {
    makeVariantGroup()
      .query({ query: { name: createVariantGroup.name } })
      .find()
      .then((tokens) => {
        tokens.items.forEach((variantGroup) => {
          expect(variantGroup.name).to.be.equal(createVariantGroup.name)
          expect(variantGroup.description).to.be.equal(createVariantGroup.description)
          expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup.scope[0].module)
          expect(variantGroup.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Fetch and update a Variant Group from uid', done => {
    makeVariantGroup(tokenUID)
      .fetch()
      .then((variantGroup) => {
        variantGroup.name = 'Update Production Name'
        variantGroup.description = 'Update Production description'
        variantGroup.scope = createVariantGroup2.scope
        return variantGroup.update()
      })
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal('Update Production Name')
        expect(variantGroup.description).to.be.equal('Update Production description')
        expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup2.scope[0].module)
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update a Variant Group from uid', done => {
    const variantGroup = makeVariantGroup(tokenUID)
    Object.assign(variantGroup, createVariantGroup2.variantGroup)
    variantGroup.update()
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal(createVariantGroup2.name)
        expect(variantGroup.description).to.be.equal(createVariantGroup2.description)
        expect(variantGroup.scope[0].module).to.be.equal(createVariantGroup2.scope[0].module)
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Delete a Variant Group from uid', done => {
    makeVariantGroup(tokenUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Variant Group deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeVariantGroup (uid = null) {
  return client.stack({ api_key: stack.api_key }).variantGroup(uid)
}