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
    await client.stack({ api_key: process.env.API_KEY }).taxonomy().create({ taxonomy })
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
    makeTerms(taxonomy.uid, childTerm2.term.uid).fetch()
      .then(async (term) => {
        term.parent_uid = null
        const moveTerm = await term.move({ force: true })
        expect(moveTerm.parent_uid).to.be.equal(null)
        done()
        return moveTerm
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
