import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createVariantGroup } from '../mock/variantGroup.js'
import { variant, variant1, variant2 } from '../mock/variants.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
var variantUid = ''
var variantName = ''
var variantGroupUid = ''
describe('Variants api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create a Variant Group', done => {
    makeVariantGroup()
      .create(createVariantGroup)
      .then((variantGroup) => {
        expect(variantGroup.name).to.be.equal(createVariantGroup.name)
        expect(variantGroup.uid).to.be.equal(createVariantGroup.uid)
        done()
      })
      .catch(done)
  })

  it('Query to get a Variant from name', done => {
    makeVariantGroup()
      .query({ name: createVariantGroup.name })
      .find()
      .then((tokens) => {
        tokens.items.forEach((variantGroup) => {
          variantGroupUid = variantGroup.uid
          expect(variantGroup.name).to.be.equal(createVariantGroup.name)
          expect(variantGroup.description).to.be.equal(createVariantGroup.description)
          expect(variantGroup.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should create a Variants', done => {
    makeVariants()
      .create(variant)
      .then((variants) => {
        expect(variants.name).to.be.equal(variant.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Query to get all Variants', done => {
    makeVariants()
      .query()
      .find()
      .then((variants) => {
        variants.items.forEach((variants) => {
          variantUid = variants.uid
          variantName = variants.name
          expect(variants.name).to.be.not.equal(null)
          expect(variants.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Get a Variants from uid', done => {
    makeVariants(variantUid)
      .fetch()
      .then((variants) => {
        expect(variants.name).to.be.equal(variant.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Query to get a Variants from name', done => {
    makeVariants()
      .query({ query: { name: variant.name } })
      .find()
      .then((tokens) => {
        tokens.items.forEach((variants) => {
          expect(variants.name).to.be.equal(variant.name)
          expect(variants.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should update a Variants from uid', done => {
    const updateData = { name: 'Update Production Name', description: 'Update Production description' }
    makeVariants(variantUid).update(updateData)
      .then((variants) => {
        expect(variants.name).to.be.equal('Update Production Name')
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Delete a Variant from uid', done => {
    makeVariantGroup(variantGroupUid).variants(variantUid)
      .delete()
      .then((data) => {
        expect(data.message).to.be.equal('Variant deleted successfully')
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

function makeVariants (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).variantGroup(variantGroupUid).variants(uid)
}

function makeVariantGroup (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).variantGroup(uid)
}
