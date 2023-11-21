import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Taxonomy } from '../../lib/stack/taxonomy'
import { systemUidMock, stackHeadersMock, taxonomyMock, noticeMock, termsMock } from './mock/objects'

describe('Contentstack Taxonomy test', () => {
  it('taxonomy create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/taxonomies').reply(200, {
      taxonomy: {
        ...taxonomyMock
      }
    })
    makeTaxonomy()
      .create()
      .then((taxonomy) => {
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })
  it('Taxonomy fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/taxonomies/UID').reply(200, {
      taxonomy: {
        ...taxonomyMock
      }
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((taxonomy) => {
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })
  it('Taxonomies query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/taxonomies').reply(200, {
      taxonomies: [
        taxonomyMock
      ]
    })
    makeTaxonomy()
      .query()
      .find()
      .then((taxonomies) => {
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })
  it('Taxonomy update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/taxonomies/UID').reply(200, {
      taxonomy: {
        ...taxonomyMock
      }
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((taxonomy) => {
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })
  it('taxonomy delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/taxonomies/UID').reply(200, {
      ...noticeMock
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
  it('Taxonomy test without uid', done => {
    const taxonomy = makeTaxonomy()
    expect(taxonomy.urlPath).to.be.equal('/taxonomies')
    expect(taxonomy.stackHeaders).to.be.equal(undefined)
    expect(taxonomy.update).to.be.equal(undefined)
    expect(taxonomy.delete).to.be.equal(undefined)
    expect(taxonomy.fetch).to.be.equal(undefined)
    expect(taxonomy.create).to.not.equal(undefined)
    expect(taxonomy.query).to.not.equal(undefined)
    done()
  })
  it('Taxonomy test with uid', done => {
    const taxonomy = makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      }
    })
    expect(taxonomy.urlPath).to.be.equal(`/taxonomies/${systemUidMock.uid}`)
    expect(taxonomy.stackHeaders).to.be.equal(undefined)
    expect(taxonomy.update).to.not.equal(undefined)
    expect(taxonomy.delete).to.not.equal(undefined)
    expect(taxonomy.fetch).to.not.equal(undefined)
    expect(taxonomy.create).to.be.equal(undefined)
    expect(taxonomy.query).to.be.equal(undefined)
    done()
  })

  it('term create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost(`/taxonomies/taxonomy_uid/terms`).reply(200, {
      term: {
        ...termsMock
      }
    })
    makeTaxonomy({
      taxonomy: {
        uid: 'taxonomy_uid'
      },
      stackHeaders: stackHeadersMock
    }).terms()
      .create()
      .then((term) => {
        expect(term.taxonomy_uid).to.be.not.equal(undefined)
        expect(term.uid).to.be.equal('UID')
        expect(term.name).to.be.equal('name')
        done()
      })
      .catch(done)
  })
})

function makeTaxonomy (data = {}) {
  return new Taxonomy(Axios, data)
}

function checkTaxonomy (taxonomy) {
  expect(taxonomy.name).to.be.equal('name')
}
