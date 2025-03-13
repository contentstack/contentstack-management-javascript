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
var deleteVariantsUID = ''
describe('Variants api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Variants create', done => {
    makeVariants()
      .create({ variants })
      .then((variantsResponse) => {
        variantsUID = variantsResponse.uid
        expect(variantsResponse.uid).to.be.not.equal(null)
        expect(variantsResponse.name).to.be.equal(variants.name)
        done()
      })
      .catch(done)
  })

  it('Fetch variants from uid', done => {
    makeVariants(variantsUID)
      .fetch()
      .then((variantsResponse) => {
        expect(variantsResponse.uid).to.be.equal(variantsUID)
        expect(variantsResponse.name).to.be.equal(variants.name)
        done()
      })
      .catch(done)
  })

  it('Query to get all variantss', done => {
    makeVariants()
      .query({ query: { name: variants.name } })
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

  it('Query variants with name', done => {
    makeVariants()
      .query({ query: { name: variants.name } })
      .find()
      .then((response) => {
        response.items.forEach((variantsResponse) => {
          expect(variantsResponse.uid).to.be.equal(variantsUID)
          expect(variantsResponse.name).to.be.equal(variants.name)
        })
        done()
      })
      .catch(done)
  })

  it('Fetch By variants UIDs ', done => {
    makeVariants()
      .fetchByUIDs(['uid1', 'uid2'])
      .then((response) => {
        response.variants.forEach((variantsResponse) => {
          expect(variantsResponse.uid).to.be.equal(variantsUID)
          expect(variantsResponse.name).to.be.equal(variants.name)
        })
        done()
      })
      .catch(done)
  })

  it('Delete variants from uid', done => {
    makeVariants(deleteVariantsUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Variants deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeVariants (uid = null) {
  return client.stack({ api_key: stack.api_key }).variants(uid)
}
