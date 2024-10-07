import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createVariantGroup, createVariantGroup1, createVariantGroup2 } from '../mock/variantGroup.js'
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
        expect(variantGroup.uid).to.be.equal(createVariantGroup.uid)
        done()
      })
      .catch(done)
  })

  it('Query to get all Variant Group', done => {
    makeVariantGroup()
      .query()
      .find()
      .then((variants) => {
        variants.items.forEach((variantGroup) => {
          expect(variantGroup.name).to.be.not.equal(null)
          expect(variantGroup.description).to.be.not.equal(null)
          expect(variantGroup.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Query to get a Variant Group from name', done => {
    makeVariantGroup()
      .query({ name: createVariantGroup.name })
      .find()
      .then((tokens) => {
        tokens.items.forEach((variantGroup) => {
          expect(variantGroup.name).to.be.equal(createVariantGroup.name)
          expect(variantGroup.description).to.be.equal(createVariantGroup.description)
          expect(variantGroup.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Should update a Variant Group from uid', done => {
    const updateData = { name: 'Update Production Name', description: 'Update Production description' }
    makeVariantGroup('iphone_color_white')
      .update(updateData)
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal('Update Production Name')
        expect(variantGroup.description).to.be.equal('Update Production description')
        expect(variantGroup.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Delete a Variant Group from uid', done => {
    makeVariantGroup('iphone_color_white')
      .delete()
      .then((data) => {
        expect(data.message).to.be.equal('Variant Group and Variants deleted successfully')
        done()
      })
      .catch(done)
  })
})

function makeVariantGroup(uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).variantGroup(uid)
}