import Axios from 'axios'
import path from 'path'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Taxonomy, createFormData } from '../../lib/stack/taxonomy'
import { systemUidMock, stackHeadersMock, taxonomyMock, noticeMock, termsMock, taxonomyImportMock } from './mock/objects'

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

  it('taxonomy localize test', done => {
    const mock = new MockAdapter(Axios)
    const localizeData = {
      taxonomy: {
        uid: 'UID',
        name: 'Taxonomy Name',
        description: 'Localized taxonomy description'
      }
    }
    const localizeParams = {
      locale: 'hi-in'
    }
    const localizeResponse = {
      taxonomy: {
        ...taxonomyMock,
        locale: 'hi-in',
        name: 'Taxonomy Name',
        description: 'Localized taxonomy description'
      }
    }

    mock.onPost('/taxonomies/UID').reply(200, localizeResponse)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .localize(localizeData, localizeParams)
      .then((taxonomy) => {
        expect(taxonomy.uid).to.be.equal('UID')
        expect(taxonomy.name).to.be.equal('Taxonomy Name')
        expect(taxonomy.description).to.be.equal('Localized taxonomy description')
        expect(taxonomy.locale).to.be.equal('hi-in')
        done()
      })
      .catch(done)
  })

  it('taxonomy create backward compatibility test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/taxonomies').reply(200, {
      taxonomy: {
        ...taxonomyMock
      }
    })
    makeTaxonomy()
      .create({ taxonomy: taxonomyMock })
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

  it('Taxonomy fetch with locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = { locale: 'hi-in' }
    mock.onGet('/taxonomies/UID', queryParams).reply(200, {
      taxonomy: {
        ...taxonomyMock,
        locale: 'hi-in'
      }
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch(queryParams)
      .then((taxonomy) => {
        expect(taxonomy.locale).to.be.equal('hi-in')
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomy fetch with include counts parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      include_terms_count: true,
      include_referenced_terms_count: true,
      include_referenced_content_type_count: true,
      include_referenced_entries_count: true
    }
    const responseData = {
      taxonomy: {
        ...taxonomyMock,
        terms_count: 4,
        referenced_terms_count: 3,
        referenced_entries_count: 6,
        referenced_content_type_count: 2
      }
    }
    mock.onGet('/taxonomies/UID', queryParams).reply(200, responseData)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch(queryParams)
      .then((taxonomy) => {
        expect(taxonomy.terms_count).to.be.equal(4)
        expect(taxonomy.referenced_terms_count).to.be.equal(3)
        expect(taxonomy.referenced_entries_count).to.be.equal(6)
        expect(taxonomy.referenced_content_type_count).to.be.equal(2)
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomy fetch with fallback parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      locale: 'hi-in',
      branch: 'main',
      include_fallback: true,
      fallback_locale: 'en-us'
    }
    mock.onGet('/taxonomies/UID', queryParams).reply(200, {
      taxonomy: {
        ...taxonomyMock,
        locale: 'hi-in'
      }
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch(queryParams)
      .then((taxonomy) => {
        expect(taxonomy.locale).to.be.equal('hi-in')
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomy fetch with deleted parameter test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      deleted: true,
      taxonomy_uuid: '65c091865ae75f256a76adc2'
    }
    const responseData = {
      taxonomy: {
        ...taxonomyMock,
        uuid: '65c091865ae75f256a76adc2'
      }
    }
    mock.onGet('/taxonomies/UID', queryParams).reply(200, responseData)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch(queryParams)
      .then((taxonomy) => {
        expect(taxonomy.uuid).to.be.equal('65c091865ae75f256a76adc2')
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

  it('Taxonomies query with locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = { locale: 'hi-in' }
    mock.onGet('/taxonomies', queryParams).reply(200, {
      taxonomies: [
        {
          ...taxonomyMock,
          locale: 'hi-in'
        }
      ],
      count: 1
    })
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        expect(taxonomies.items[0].locale).to.be.equal('hi-in')
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with include counts parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      include_terms_count: true,
      include_referenced_terms_count: true,
      include_referenced_content_type_count: true,
      include_referenced_entries_count: true,
      include_count: true
    }
    const responseData = {
      taxonomies: [
        {
          ...taxonomyMock,
          terms_count: 4,
          referenced_terms_count: 3,
          referenced_entries_count: 6,
          referenced_content_type_count: 2
        }
      ],
      count: 1
    }
    mock.onGet('/taxonomies', queryParams).reply(200, responseData)
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        const taxonomy = taxonomies.items[0]
        expect(taxonomy.terms_count).to.be.equal(4)
        expect(taxonomy.referenced_terms_count).to.be.equal(3)
        expect(taxonomy.referenced_entries_count).to.be.equal(6)
        expect(taxonomy.referenced_content_type_count).to.be.equal(2)
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with fallback parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      locale: 'hi-in',
      branch: 'main',
      include_fallback: true,
      fallback_locale: 'en-us'
    }
    mock.onGet('/taxonomies', queryParams).reply(200, {
      taxonomies: [
        {
          ...taxonomyMock,
          locale: 'hi-in'
        }
      ],
      count: 1
    })
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        expect(taxonomies.items[0].locale).to.be.equal('hi-in')
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with sorting parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      asc: 'name',
      desc: 'created_at'
    }
    mock.onGet('/taxonomies', queryParams).reply(200, {
      taxonomies: [
        taxonomyMock
      ],
      count: 1
    })
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with search parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      query: 'uid:taxonomy_1',
      typeahead: 'taxonomy',
      deleted: false
    }
    mock.onGet('/taxonomies', queryParams).reply(200, {
      taxonomies: [
        taxonomyMock
      ],
      count: 1
    })
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with pagination parameters test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      skip: 10,
      limit: 5
    }
    mock.onGet('/taxonomies', queryParams).reply(200, {
      taxonomies: [
        taxonomyMock
      ],
      count: 1
    })
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        checkTaxonomy(taxonomies.items[0])
        done()
      })
      .catch(done)
  })

  it('Taxonomies query with deleted parameter test', done => {
    const mock = new MockAdapter(Axios)
    const queryParams = {
      deleted: true
    }
    const responseData = {
      taxonomies: [
        {
          ...taxonomyMock,
          uuid: '65c091865ae75f256a76adc2'
        }
      ],
      count: 1
    }
    mock.onGet('/taxonomies', queryParams).reply(200, responseData)
    makeTaxonomy()
      .query(queryParams)
      .find()
      .then((taxonomies) => {
        expect(taxonomies.items[0].uuid).to.be.equal('65c091865ae75f256a76adc2')
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

  it('Taxonomy update with locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const responseData = {
      taxonomy: {
        ...taxonomyMock,
        locale: 'hi-in'
      }
    }
    mock.onPut('/taxonomies/UID').reply(200, responseData)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update({ locale: 'hi-in' })
      .then((taxonomy) => {
        expect(taxonomy.locale).to.be.equal('hi-in')
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomy update without locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const responseData = {
      taxonomy: {
        ...taxonomyMock,
        locale: 'en-us'
      }
    }
    mock.onPut('/taxonomies/UID').reply(200, responseData)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((taxonomy) => {
        expect(taxonomy.locale).to.be.equal('en-us')
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
  })

  it('Taxonomy update with partial data test', done => {
    const mock = new MockAdapter(Axios)
    const responseData = {
      taxonomy: {
        ...taxonomyMock,
        locale: 'en-us'
      }
    }
    mock.onPut('/taxonomies/UID').reply(200, responseData)
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

  it('taxonomy delete with locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const deleteResponse = {
      notice: 'Taxonomy unlocalized successfully',
      status: 200
    }
    mock.onDelete('/taxonomies/UID', { locale: 'hi-in' }).reply(200, deleteResponse)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete({ locale: 'hi-in' })
      .then((response) => {
        expect(response.notice).to.be.equal('Taxonomy unlocalized successfully')
        expect(response.status).to.be.equal(200)
        done()
      })
      .catch(done)
  })

  it('taxonomy delete without locale parameter test', done => {
    const mock = new MockAdapter(Axios)
    const deleteResponse = {
      notice: 'Taxonomy deleted successfully',
      status: 200
    }
    mock.onDelete('/taxonomies/UID').reply(200, deleteResponse)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Taxonomy deleted successfully')
        expect(response.status).to.be.equal(200)
        done()
      })
      .catch(done)
  })

  it('taxonomy delete with different locale test', done => {
    const mock = new MockAdapter(Axios)
    const deleteResponse = {
      notice: 'Taxonomy unlocalized successfully',
      status: 200
    }
    mock.onDelete('/taxonomies/UID', { locale: 'mr-in' }).reply(200, deleteResponse)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete({ locale: 'mr-in' })
      .then((response) => {
        expect(response.notice).to.be.equal('Taxonomy unlocalized successfully')
        expect(response.status).to.be.equal(200)
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

  it('Taxonomy export test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/taxonomies/UID/export').reply(200, {
      taxonomy: {
        ...taxonomyImportMock
      }
    })
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .export()
      .then((taxonomy) => {
        expect(taxonomy['taxonomy']['uid']).to.be.equal('UID')
        expect(taxonomy['taxonomy']['name']).to.be.equal('name')
        done()
      })
      .catch(done)
  })

  it('Taxonomy locales test', done => {
    const mock = new MockAdapter(Axios)
    const localesResponse = {
      taxonomies: [
        {
          uid: 'taxonomy_1',
          name: 'Taxonomy 1',
          locale: 'en-us',
          localized: true
        },
        {
          uid: 'taxonomy_1',
          name: 'Taxonomy 1',
          locale: 'hi-in',
          localized: true
        },
        {
          uid: 'taxonomy_1',
          name: 'Taxonomy 1 Marathi',
          locale: 'mr-in',
          localized: false
        }
      ],
      count: 3
    }

    mock.onGet('/taxonomies/UID/locales').reply(200, localesResponse)
    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .locales()
      .then((response) => {
        expect(response.taxonomies).to.be.an('array')
        expect(response.taxonomies).to.have.lengthOf(3)
        expect(response.count).to.be.equal(3)
        expect(response.taxonomies[0].locale).to.be.equal('en-us')
        expect(response.taxonomies[1].locale).to.be.equal('hi-in')
        expect(response.taxonomies[2].locale).to.be.equal('mr-in')
        done()
      })
      .catch(done)
  })

  it('Taxonomy localize error test', done => {
    const mock = new MockAdapter(Axios)
    const localizeData = {
      taxonomy: {
        uid: 'UID',
        name: 'Invalid Taxonomy',
        description: 'Invalid description'
      }
    }
    const localizeParams = {
      locale: 'invalid-locale'
    }

    mock.onPost('/taxonomies/UID').reply(400, {
      error_message: 'Invalid locale provided',
      error_code: 400
    })

    makeTaxonomy({
      taxonomy: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .localize(localizeData, localizeParams)
      .then(() => {
        done(new Error('Expected error but got success'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        done()
      })
  })

  it('Taxonomy import test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/taxonomies/import').reply(200, {
      taxonomy: {
        ...taxonomyMock
      }
    })
    const taxonomyUpload = { taxonomy: path.join(__dirname, '../sanity-check/mock/taxonomy.json') }
    const form = createFormData(taxonomyUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeTaxonomy()
      .import(taxonomyUpload)
      .then((taxonomy) => {
        checkTaxonomy(taxonomy)
        done()
      })
      .catch(done)
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
