import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

const taxonomy_uid = 'taxonomy_21'
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
    const response = await makeTerms().create([{ term }])
    console.log(response)
    expect(response.notice).to.be.equal('Term created successfully.')
    expect(response.uid).to.be.equal(term.term.uid)
  })

  it('Query and get all terms', async () => {
    const response = await makeTerms().query().find()
    expect(response.items).to.be.an('array')
    expect(response.items[0].uid).not.to.be.equal(null)
    expect(response.items[0].name).not.to.be.equal(null)
  })

  it('Fetch term from UID', async () => {
    const termsUid = 'fashion'
    const response = await makeTerms(termsUid).fetch()
    expect(response.uid).to.be.equal(termsUid)
    expect(response.name).not.to.be.equal(null)
    expect(response.created_by).not.to.be.equal(null)
    expect(response.updated_by).not.to.be.equal(null)
  })

  it('Update term', async () => {
    const termsUid = 'fashion'
    const response = await makeTerms(termsUid).fetch()
      .then((term) => {
        term.name = 'fashion'
        return term.update()
      })
    expect(response.notice).to.be.equal('Term updated successfully.')
    expect(response.uid).to.be.equal(termsUid)
    expect(response.name).to.be.equal('fashion')
    expect(response.created_by).not.to.be.equal(null)
    expect(response.updated_by).not.to.be.equal(null)
  })

  it('Delete term from UID', async () => {
    const termsUid = 'testing'
    const response = await makeTerms(termsUid).delete()
    expect(response.notice).to.be.equal('')
  })

  it('Ancestors of the term given', async () => {
    const termsUid = 'term_3'
    const response = await makeTerms(termsUid).ancestors()
    expect(response.terms[0].uid).not.to.be.equal(null)
    expect(response.terms[0].name).not.to.be.equal(null)
    expect(response.terms[0].created_by).not.to.be.equal(null)
    expect(response.terms[0].updated_by).not.to.be.equal(null)
  })

  it('Descendants of the term given', async () => {
    const termsUid = 'term_3'
    const response = await makeTerms(termsUid).descendants()
    expect(response.terms.uid).not.to.be.equal(null)
    expect(response.terms.name).not.to.be.equal(null)
    expect(response.terms.created_by).not.to.be.equal(null)
    expect(response.terms.updated_by).not.to.be.equal(null)
  })
})

function makeTerms (uid = '') {
  return client.stack({ api_key: stack.api_key }).taxonomy(taxonomy_uid).terms(uid)
}
