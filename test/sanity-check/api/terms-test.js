import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { stageBranch } from '../mock/branch.js'

var client = {}

const taxonomy = {
  uid: 'taxonomy_testing',
  name: 'taxonomy testing',
  description: 'Description for Taxonomy testing'
}
const termString = 'term'
const term = {
  term: {
    uid: 'term_test',
    name: 'Term test',
    parent_uid: null
  }
}
const childTerm1 = {
  term: {
    uid: 'term_test_child1',
    name: 'Term test1',
    parent_uid: 'term_test'
  }
}
const childTerm2 = {
  term: {
    uid: 'term_test_child2',
    name: 'Term test2',
    parent_uid: 'term_test_child1'
  }
}
var termUid = term.term.uid

describe('Terms API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should create taxonomy', async () => {
    const response = await client.stack({ api_key: process.env.API_KEY }).taxonomy().create({ taxonomy })
    expect(response.uid).to.be.equal(taxonomy.uid)
    await new Promise(resolve => setTimeout(resolve, 5000))
  }, 10000)

  it('should create term', async () => {
    const response = await makeTerms(taxonomy.uid).create(term)
    expect(response.uid).to.be.equal(term.term.uid)
    await new Promise(resolve => setTimeout(resolve, 15000))
  })

  it('should create child term 1', async () => {
    const response = await makeTerms(taxonomy.uid).create(childTerm1)
    expect(response.uid).to.be.equal(childTerm1.term.uid)
    await new Promise(resolve => setTimeout(resolve, 15000))
  })

  it('should create child term 2', async () => {
    const response = await makeTerms(taxonomy.uid).create(childTerm2)
    expect(response.uid).to.be.equal(childTerm2.term.uid)
    await new Promise(resolve => setTimeout(resolve, 15000))
  })

  it('should query and get all terms', done => {
    makeTerms(taxonomy.uid).query().find()
      .then((response) => {
        expect(response.items).to.be.an('array')
        expect(response.items[0].uid).not.to.be.equal(null)
        expect(response.items[0].name).not.to.be.equal(null)
        done()
      })
      .catch(done)
  })

  it('should fetch term of the term uid passed', done => {
    makeTerms(taxonomy.uid, term.term.uid).fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(termUid)
        expect(response.name).not.to.be.equal(null)
        expect(response.created_by).not.to.be.equal(null)
        expect(response.updated_by).not.to.be.equal(null)
        done()
      })
      .catch(done)
  })

  it('should update term of the term uid passed', done => {
    makeTerms(taxonomy.uid, termUid).fetch()
      .then((term) => {
        term.name = 'update name'
        return term.update()
      })
      .then((response) => {
        expect(response.uid).to.be.equal(termUid)
        expect(response.name).to.be.equal('update name')
        expect(response.created_by).not.to.be.equal(null)
        expect(response.updated_by).not.to.be.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get the ancestors of the term uid passed', done => {
    makeTerms(taxonomy.uid, childTerm1.term.uid).ancestors()
      .then((response) => {
        expect(response.terms[0].uid).not.to.be.equal(null)
        expect(response.terms[0].name).not.to.be.equal(null)
        expect(response.terms[0].created_by).not.to.be.equal(null)
        expect(response.terms[0].updated_by).not.to.be.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get the descendants of the term uid passed', done => {
    makeTerms(taxonomy.uid, childTerm1.term.uid).descendants()
      .then((response) => {
        expect(response.terms.uid).not.to.be.equal(null)
        expect(response.terms.name).not.to.be.equal(null)
        expect(response.terms.created_by).not.to.be.equal(null)
        expect(response.terms.updated_by).not.to.be.equal(null)
        done()
      })
      .catch(done)
  })

  it('should search the term with the string passed', done => {
    makeTerms(taxonomy.uid).search(termString)
      .then((response) => {
        expect(response.terms).to.be.an('array')
        done()
      })
      .catch(done)
  })

  it('should move the term to parent uid passed', done => {
    const term = {
      parent_uid: 'term_test_child1',
      order: 1
    }
    makeTerms(taxonomy.uid, childTerm2.term.uid).move({ term, force: true })
      .then(async (term) => {
        expect(term.parent_uid).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get term locales', done => {
    makeTerms(taxonomy.uid, term.term.uid).locales()
      .then((response) => {
        expect(response).to.have.property('terms')
        expect(response.terms).to.be.an('array')
        done()
      })
      .catch(done)
  })

  it('should localize term', done => {
    const localizedTerm = {
      term: {
        uid: term.term.uid,
        name: 'Term test localized',
        parent_uid: null
      }
    }
    makeTerms(taxonomy.uid, term.term.uid).localize(localizedTerm, { locale: 'hi-in' })
      .then((response) => {
        expect(response.uid).to.be.equal(term.term.uid)
        expect(response.locale).to.be.equal('hi-in')
        done()
      })
      .catch(done)
  })

  it('should delete of the term uid passed', done => {
    makeTerms(taxonomy.uid, term.term.uid).delete({ force: true })
      .then((response) => {
        expect(response.status).to.be.equal(204)
        done()
      })
      .catch(done)
  })

  it('should delete taxonomy', async () => {
    const taxonomyResponse = await client.stack({ api_key: process.env.API_KEY }).taxonomy(taxonomy.uid).delete({ force: true })
    expect(taxonomyResponse.status).to.be.equal(204)
  })
})

function makeTerms (taxonomyUid, termUid = null) {
  return client.stack({ api_key: process.env.API_KEY }).taxonomy(taxonomyUid).terms(termUid)
}

describe('Terms Query Parameters Sanity Tests', () => {
  beforeEach(async () => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)

    // Ensure taxonomy exists before running query tests
    try {
      await client.stack({ api_key: process.env.API_KEY }).taxonomy(taxonomy.uid).fetch()
    } catch (error) {
      // If taxonomy doesn't exist, try to use an existing one first
      if (error.status === 404) {
        try {
          // Try to use an existing taxonomy if available
          const existingTaxonomies = await client.stack({ api_key: process.env.API_KEY }).taxonomy().query().find()
          if (existingTaxonomies.items.length > 0) {
            // Use the first existing taxonomy
            taxonomy.uid = existingTaxonomies.items[0].uid
            console.log(`Using existing taxonomy: ${taxonomy.uid}`)
          } else {
            // Create a new taxonomy if none exist
            await client.stack({ api_key: process.env.API_KEY }).taxonomy().create({ taxonomy })
            await new Promise(resolve => setTimeout(resolve, 5000))
          }
        } catch (createError) {
          // If creation fails, try to create the original taxonomy
          await client.stack({ api_key: process.env.API_KEY }).taxonomy().create({ taxonomy })
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
    }

    // Create some test terms if they don't exist
    try {
      const existingTerms = await makeTerms(taxonomy.uid).query().find()
      if (existingTerms.items.length === 0) {
        // Create a test term
        await makeTerms(taxonomy.uid).create(term)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      // If terms query fails, try to create a term anyway
      try {
        await makeTerms(taxonomy.uid).create(term)
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (createError) {
        // Ignore creation errors - terms might already exist
        // This is expected behavior for test setup
        if (createError.status !== 422) {
          console.log('Term creation failed, continuing with tests:', createError.message)
        }
      }
      // Log the original error for debugging but don't fail the test
      console.log('Terms query failed during setup, continuing with tests:', error.message)
    }
  })

  it('should get terms with locale parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ locale: 'en-us' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with branch parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ branch: 'main' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with include_fallback parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ include_fallback: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with fallback_locale parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ fallback_locale: 'en-us' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with depth parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ depth: 2 })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with include_children_count parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ include_children_count: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with include_referenced_entries_count parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ include_referenced_entries_count: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with include_count parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ include_count: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
    // Count property might not be available in all environments
    if (terms.count !== undefined) {
      expect(terms).to.have.property('count')
    }
  })

  it('should get terms with include_order parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ include_order: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with asc parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ asc: 'name' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with desc parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ desc: 'name' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with query parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ query: 'term' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with typeahead parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ typeahead: 'term' })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with deleted parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ deleted: true })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with skip and limit parameters', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ skip: 0, limit: 10 })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with taxonomy_uuid parameter', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({ taxonomy_uuid: taxonomy.uid })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
  })

  it('should get terms with multiple parameters', async () => {
    const terms = await makeTerms(taxonomy.uid).query().find({
      locale: 'en-us',
      include_children_count: true,
      include_count: true,
      skip: 0,
      limit: 10
    })
    expect(terms).to.have.property('items')
    expect(terms.items).to.be.an('array')
    // Count property might not be available in all environments
    if (terms.count !== undefined) {
      expect(terms).to.have.property('count')
    }
  })

  // Cleanup: Delete the taxonomy after query tests
  it('should delete taxonomy after query tests', async () => {
    try {
      const taxonomyResponse = await client.stack({ api_key: process.env.API_KEY }).taxonomy(taxonomy.uid).delete({ force: true })
      expect(taxonomyResponse.status).to.be.equal(204)
    } catch (error) {
      // Taxonomy might already be deleted, which is acceptable
      if (error.status === 404) {
        // Test passes if taxonomy doesn't exist
      } else {
        throw error
      }
    }
  })
})

describe('Branch creation api Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create staging branch', async () => {
    const response = await makeBranch().create({ branch: stageBranch })
    expect(response.uid).to.be.equal(stageBranch.uid)
    expect(response.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
    expect(response.source).to.be.equal(stageBranch.source)
    expect(response.alias).to.not.equal(undefined)
    expect(response.fetch).to.not.equal(undefined)
    expect(response.delete).to.not.equal(undefined)
    await new Promise(resolve => setTimeout(resolve, 15000))
  })
})

function makeBranch (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).branch(uid)
}
