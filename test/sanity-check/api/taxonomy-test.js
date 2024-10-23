import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

const taxonomy = {
  uid: 'taxonomy_testing',
  name: 'taxonomy testing',
  description: 'Description for Taxonomy testing'
}

var taxonomyUID = ''

describe('taxonomy api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create taxonomy', done => {
    makeTaxonomy()
      .create({ taxonomy })
      .then((taxonomyResponse) => {
        taxonomyUID = taxonomyResponse.uid
        expect(taxonomyResponse.name).to.be.equal(taxonomy.name)
        setTimeout(() => {
          done()
        }, 10000)
      })
      .catch(done)
  })

  it('should fetch taxonomy of the uid passed', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should update taxonomy of the uid passed', done => {
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

  it('should get all taxonomies', async () => {
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

  it('should delete taxonomy from uid', done => {
    makeTaxonomy(taxonomyUID)
      .delete()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.status).to.be.equal(204)
        done()
      })
      .catch(done)
  })
})

function makeTaxonomy (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).taxonomy(uid)
}
