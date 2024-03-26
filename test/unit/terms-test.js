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
})

function makeTerms (data = {}) {
  return new Terms(Axios, { taxonomy_uid: 'taxonomy_uid', ...data })
}

function checkTerms (terms) {
  expect(terms.name).to.be.equal('name')
}
