import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

const variants = {
  uid: 'iphone_color_white', // optional
  name: 'White',
  personalize_metadata: {
    experience_uid: 'exp1',
    experience_short_uid: 'expShortUid1',
    project_uid: 'project_uid1',
    variant_short_uid: 'variantShort_uid1'
  }
}
var variantsUID = ''
describe('Ungrouped Variants api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })
  it('Should create ungrouped variants create', done => {
    makeVariants()
      .create(variants)
      .then((variantsResponse) => {
        variantsUID = variantsResponse.uid
        expect(variantsResponse.uid).to.be.not.equal(null)
        expect(variantsResponse.name).to.be.equal(variants.name)
        done()
      })
      .catch(done)
  })

  it('Should Query to get all ungrouped variants by name', done => {
    makeVariants()
      .query({ query: { name: variants.name } })
      .find()
      .then((response) => {
        response.items.forEach((variantsResponse) => {
          variantsUID = variantsResponse.uid
          expect(variantsResponse.uid).to.be.not.equal(null)
          expect(variantsResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Should fetch ungrouped variants from uid', done => {
    makeVariants(variantsUID)
      .fetch()
      .then((variantsResponse) => {
        expect(variantsResponse.name).to.be.equal(variants.name)
        done()
      })
      .catch(done)
  })
  it('Should fetch variants from array of uids', done => {
    makeVariants()
      .fetchByUIDs([variantsUID])
      .then((variantsResponse) => {
        expect(variantsResponse.variants.length).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('Should Query to get all ungrouped variants', done => {
    makeVariants()
      .query()
      .find()
      .then((response) => {
        response.items.forEach((variantsResponse) => {
          expect(variantsResponse.uid).to.be.not.equal(null)
          expect(variantsResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Should delete ungrouped variants from uid', done => {
    makeVariants(variantsUID)
      .delete()
      .then((data) => {
        expect(data.message).to.be.equal('Variant deleted successfully')
        done()
      })
      .catch(done)
  })
})

function makeVariants (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).variants(uid)
}
