import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

const taxonomy = {
  uid: 'taxonomy_testing1',
  name: 'taxonomy testing',
  description: 'Description for Taxonomy testing'
}

var taxonomyUID = ''
// var taxonomyDelUID = 'taxonomy_testing'

describe('taxonomy api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Create taxonomy', done => {
    makeTaxonomy()
      .create([{ taxonomy }])
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.name).to.be.equal(taxonomy.name)
        done()
      })
      .catch(done)
  })

  it('Fetch taxonomy from uid', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update taxonomy from uid', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.name = 'Updated Name'
        return taxonomyResponse.update()
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal('Updated Name')
        done()
      })
      .catch(done)
  })

  // it('Delete taxonomy from uid', done => {
  //   makeTaxonomy(taxonomyDelUID)
  //     .delete()
  //     .then((taxonomyResponse) => {
  //       expect(taxonomyResponse.notice).to.be.equal('Taxonomy deleted successfully.')
  //       done()
  //     })
  //     .catch(done)
  // })

  it('Query to get all taxonomies', async () => {
    makeTaxonomy()
      .query()
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
      })
  })
})

function makeTaxonomy (uid = null) {
  return client.stack({ api_key: stack.api_key }).taxonomy(uid)
}
