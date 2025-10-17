import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Terms } from '../../lib/stack/taxonomy/terms'
import { systemUidMock, stackHeadersMock, termsMock, noticeMock } from './mock/objects'

describe('Contentstack Term test', () => {
  it('term create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms()
      .create()
      .then((term) => {
        checkTerms(term)
        done()
      })
      .catch(done)
  })
  it('Term fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/taxonomy_uid/terms/UID`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((term) => {
        checkTerms(term)
        done()
      })
      .catch(done)
  })
  it('Terms query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [
        termsMock
      ]
    })
    makeTerms()
      .query()
      .find()
      .then((terms) => {
        checkTerms(terms.items[0])
        done()
      })
      .catch(done)
  })
  it('Term update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut(`/taxonomies/taxonomy_uid/terms/UID`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((term) => {
        checkTerms(term)
        done()
      })
      .catch(done)
  })
  it('term delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete(`/taxonomies/taxonomy_uid/terms/UID`).reply(200, {
      ...noticeMock
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((term) => {
        expect(term.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
  it('term ancestors test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/taxonomy_uid/terms/UID/ancestors`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .ancestors()
      .then((terms) => {
        expect(terms.term.uid).to.be.equal('UID')
        expect(terms.term.parent_uid).to.be.equal('term_2')
        expect(terms.term.ancestors[0].uid).to.be.equal('term_1')
        expect(terms.term.ancestors[1].uid).to.be.equal('term_2')
        expect(terms.term.ancestors[1].parent_uid).to.be.equal('term_1')
        done()
      })
      .catch(done)
  })
  it('term descendants test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/taxonomy_uid/terms/UID/descendants`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .descendants()
      .then((terms) => {
        expect(terms.term.uid).to.be.equal('UID')
        expect(terms.term.descendants[0].uid).to.be.equal('term_4')
        expect(terms.term.descendants[1].uid).to.be.equal('term_5')
        expect(terms.term.descendants[1].parent_uid).to.be.equal('term_4')
        done()
      })
      .catch(done)
  })
  it('Term test without term uid', done => {
    const term = makeTerms()
    expect(term.stackHeaders).to.be.equal(undefined)
    expect(term.update).to.be.equal(undefined)
    expect(term.delete).to.be.equal(undefined)
    expect(term.fetch).to.be.equal(undefined)
    expect(term.create).not.to.be.equal(undefined)
    expect(term.query).not.to.be.equal(undefined)
    done()
  })
  it('Term test with term uid', done => {
    const term = makeTerms({
      term: {
        ...systemUidMock
      }
    })
    expect(term.urlPath).to.be.equal(`/taxonomies/taxonomy_uid/terms/${systemUidMock.uid}`)
    expect(term.stackHeaders).to.be.equal(undefined)
    expect(term.update).not.to.be.equal(undefined)
    expect(term.delete).not.to.be.equal(undefined)
    expect(term.fetch).not.to.be.equal(undefined)
    expect(term.create).to.be.equal(undefined)
    expect(term.query).to.be.equal(undefined)
    done()
  })
  it('term search test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/$all/terms?typeahead=UID`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms()
      .search('UID')
      .then((terms) => {
        expect(terms.term.uid).to.be.equal('UID')
        done()
      })
      .catch(done)
  })
  it('term move test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut(`/taxonomies/taxonomy_uid/terms/UID/move`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .move()
      .then((terms) => {
        checkTerms(terms)
        expect(terms.uid).to.be.equal('UID')
        done()
      })
      .catch(done)
  })

  it('term locales test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet(`/taxonomies/taxonomy_uid/terms/UID/locales`).reply(200, {
      terms: [
        {
          ...termsMock,
          locale: 'en-us'
        },
        {
          ...termsMock,
          locale: 'hi-in'
        }
      ],
      count: 2
    })
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .locales()
      .then((response) => {
        expect(response).to.have.property('terms')
        expect(response.terms).to.be.an('array')
        expect(response.count).to.be.equal(2)
        done()
      })
      .catch(done)
  })

  it('term localize test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/taxonomies/taxonomy_uid/terms/UID`).reply(200, {
      term: {
        ...termsMock,
        locale: 'hi-in'
      }
    })
    const localizedTerm = {
      term: {
        uid: 'UID',
        name: 'Term localized',
        parent_uid: null
      }
    }
    makeTerms({
      term: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .localize(localizedTerm, { locale: 'hi-in' })
      .then((term) => {
        checkTerms(term)
        expect(term.uid).to.be.equal('UID')
        expect(term.locale).to.be.equal('hi-in')
        done()
      })
      .catch(done)
  })

  // Get all Terms of a Taxonomy with query parameters
  it('terms query with locale parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ locale: 'hi-in' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with branch parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?branch=main`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ branch: 'main' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with include_fallback parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?include_fallback=true`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ include_fallback: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with fallback_locale parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?fallback_locale=en-us`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ fallback_locale: 'en-us' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with depth parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?depth=2`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ depth: 2 })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with include_children_count parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?include_children_count=true`).reply(200, {
      terms: [
        {
          ...termsMock,
          children_count: 2
        }
      ],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ include_children_count: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with include_referenced_entries_count parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?include_referenced_entries_count=true`).reply(200, {
      terms: [
        {
          ...termsMock,
          referenced_entries_count: 5
        }
      ],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ include_referenced_entries_count: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with include_count parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?include_count=true`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ include_count: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with include_order parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?include_order=true`).reply(200, {
      terms: [
        {
          ...termsMock,
          order: 1
        }
      ],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ include_order: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with asc parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?asc=name`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ asc: 'name' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with desc parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?desc=name`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ desc: 'name' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with query parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?query=UID`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ query: 'UID' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with typeahead parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?typeahead=term`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ typeahead: 'term' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with deleted parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?deleted=true`).reply(200, {
      terms: [
        {
          ...termsMock,
          uuid: 'dummy-uuid-123',
          taxonomy_uuid: 'dummy-taxonomy-uuid-456'
        }
      ],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ deleted: true })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with skip and limit parameters test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?skip=0&limit=10`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ skip: 0, limit: 10 })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with taxonomy_uuid parameter test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?taxonomy_uuid=dummy-taxonomy-uuid-456`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ taxonomy_uuid: 'dummy-taxonomy-uuid-456' })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

  it('terms query with multiple parameters test', done => {
    var mock = new MockAdapter(Axios)
    // Mock for base terms endpoint
    mock.onGet(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      terms: [termsMock],
      count: 1
    })
    mock.onGet(`/taxonomies/taxonomy_uid/terms?locale=hi-in&include_children_count=true&include_count=true&skip=0&limit=10`).reply(200, {
      terms: [
        {
          ...termsMock,
          locale: 'hi-in',
          children_count: 3
        }
      ],
      count: 1
    })
    makeTerms({
      stackHeaders: stackHeadersMock
    })
      .query()
      .find({ 
        locale: 'hi-in',
        include_children_count: true,
        include_count: true,
        skip: 0,
        limit: 10
      })
      .then((response) => {
        expect(response).to.have.property('items')
        done()
      })
      .catch(done)
  })

})

function makeTerms (data = {}) {
  return new Terms(Axios, { taxonomy_uid: 'taxonomy_uid', ...data })
}

function checkTerms (terms) {
  expect(terms.name).to.be.equal('name')
}
