import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

const taxonomyUid = ''
const termUid = ''
const term = {
  term: {
    uid: 'term_test',
    name: 'Term test'
  },
  parent_uid: null
}

describe('Terms API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Create term', async () => {
    try {
      const response = await makeTerms(taxonomyUid).create(term)
      expect(response.notice).to.be.equal('Term created successfully.')
      expect(response.uid).to.be.equal(term.term.uid)
    } catch (err) {
      console.log(err)
    }
  })

  it('Query and get all terms', async () => {
    try {
      const response = await makeTerms(taxonomyUid).query().find()
      expect(response.items).to.be.an('array')
      expect(response.items[0].uid).not.to.be.equal(null)
      expect(response.items[0].name).not.to.be.equal(null)
    } catch (err) {
      console.log(err)
    }
  })

  it('Fetch term from UID', async () => {
    try {
      const response = await makeTerms(taxonomyUid, termUid).fetch()
      expect(response.uid).to.be.equal(termUid)
      expect(response.name).not.to.be.equal(null)
      expect(response.created_by).not.to.be.equal(null)
      expect(response.updated_by).not.to.be.equal(null)
    } catch (err) {
      console.log(err)
    }
  })

  it('Update term', async () => {
    try {
      const response = await makeTerms(taxonomyUid, termUid).fetch()
        .then((term) => {
          term.name = 'fashion'
          return term.update()
        })
      expect(response.notice).to.be.equal('Term updated successfully.')
      expect(response.uid).to.be.equal(termUid)
      expect(response.name).to.be.equal('fashion')
      expect(response.created_by).not.to.be.equal(null)
      expect(response.updated_by).not.to.be.equal(null)
    } catch (err) {
      console.log(err)
    }
  })

  it('Delete term from UID', async () => {
    try {
      const response = await makeTerms(termUid).delete()
      expect(response.notice).to.be.equal('')
    } catch (err) {
      console.log(err)
    }
  })

  it('Ancestors of the term given', async () => {
    try {
      const response = await makeTerms(taxonomyUid, termUid).ancestors()
      expect(response.terms[0].uid).not.to.be.equal(null)
      expect(response.terms[0].name).not.to.be.equal(null)
      expect(response.terms[0].created_by).not.to.be.equal(null)
      expect(response.terms[0].updated_by).not.to.be.equal(null)
    } catch (err) {
      console.log(err)
    }
  })

  it('Descendants of the term given', async () => {
    try {
      const response = await makeTerms(taxonomyUid, termUid).descendants()
      expect(response.terms.uid).not.to.be.equal(null)
      expect(response.terms.name).not.to.be.equal(null)
      expect(response.terms.created_by).not.to.be.equal(null)
      expect(response.terms.updated_by).not.to.be.equal(null)
    } catch (err) {
      console.log(err)
    }
  })
  it('search term', async () => {
    const termString = ''
    try {
      const response = await makeTerms(taxonomyUid).search(termString)
      expect(response.terms).to.be.an('array')
    } catch (err) {
      console.log(err)
    }
  })
  it('move term', async () => {
    try {
      const term = {
        parent_uid: 'parent_uid',
        order: 2
      }
      await makeTerms(taxonomyUid, termUid).move({ term })
        .then((term) => {
          term.parent_uid = 'parent_uid'
          console.log(term.move())
          return term.move()
        })
    } catch (err) {
      console.log(err)
    }
  })
})

function makeTerms (taxonomyUid, termUid = null) {
  return client.stack({ api_key: stack.api_key }).taxonomy(taxonomyUid).terms(termUid)
}
