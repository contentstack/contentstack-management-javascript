import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { variant, variant1, variant2 } from './mock/variants.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
var tokenUID = ''
describe('Variants api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Add a Variants', done => {
    makeVariants()
      .create(variant)
      .then((variants) => {
        expect(variants.name).to.be.equal(variant.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a Variants for production', done => {
    makeVariants()
      .create(variant2)
      .then((variants) => {
        tokenUID = variants.uid
        expect(variants.name).to.be.equal(variant2.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get a Variants from uid', done => {
    makeVariants(tokenUID)
      .fetch()
      .then((variants) => {
        expect(variants.name).to.be.equal(variant2.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Query to get all Variants', done => {
    makeVariants()
      .query()
      .find()
      .then((tokens) => {
        tokens.items.forEach((variants) => {
          expect(variants.name).to.be.not.equal(null)
          expect(variants.uid).to.be.not.equal(null)
        })
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

  it('Fetch and update a Variants from uid', done => {
    makeVariants(tokenUID)
      .fetch()
      .then((variants) => {
        variants.name = 'Update Production Name'
        variants.description = 'Update Production description'
        variants.scope = variant2.scope
        return variants.update()
      })
      .then((variants) => {
        expect(variants.name).to.be.equal('Update Production Name')
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update a Variants from uid', done => {
    const variants = makeVariants(tokenUID)
    Object.assign(variants, variant2.variants)
    variants.update()
      .then((variants) => {
        expect(variants.name).to.be.equal(variant2.name)
        expect(variants.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })
})

function makeVariants (uid = null) {
  return client.stack({ api_key: stack.api_key }).variantGroup('uid').variants(uid)
}
