import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { ContentType, ContentTypeCollection, createFormData } from '../../lib/stack/contentType'
import { systemUidMock, checkSystemFields, contentTypeMock, stackHeadersMock, noticeMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'

describe('Contentstack ContentType test', () => {
  it('ContentType test without uid', done => {
    const contentType = makeContentType()
    expect(contentType.urlPath).to.be.equal('/content_types')
    expect(contentType.stackHeaders).to.be.equal(undefined)
    expect(contentType.update).to.be.equal(undefined)
    expect(contentType.delete).to.be.equal(undefined)
    expect(contentType.fetch).to.be.equal(undefined)
    expect(contentType.create).to.not.equal(undefined)
    expect(contentType.query).to.not.equal(undefined)
    done()
  })

  it('ContentType test with uid', done => {
    const contentType = makeContentType({
      content_type: {
        ...systemUidMock
      }
    })
    expect(contentType.urlPath).to.be.equal(`/content_types/${systemUidMock.uid}`)
    expect(contentType.stackHeaders).to.be.equal(undefined)
    expect(contentType.update).to.not.equal(undefined)
    expect(contentType.delete).to.not.equal(undefined)
    expect(contentType.fetch).to.not.equal(undefined)
    expect(contentType.create).to.be.equal(undefined)
    expect(contentType.query).to.be.equal(undefined)
    done()
  })

  it('ContentType test with Stack Headers', done => {
    const contentType = makeContentType({
      content_type: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(contentType.urlPath).to.be.equal(`/content_types/${systemUidMock.uid}`)
    expect(contentType.stackHeaders).to.not.equal(undefined)
    expect(contentType.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(contentType.update).to.not.equal(undefined)
    expect(contentType.delete).to.not.equal(undefined)
    expect(contentType.fetch).to.not.equal(undefined)
    expect(contentType.create).to.be.equal(undefined)
    expect(contentType.query).to.be.equal(undefined)
    done()
  })

  it('ContentType Collection test with blank data', done => {
    const contentTypes = new ContentTypeCollection(Axios, {})
    expect(contentTypes.length).to.be.equal(0)
    done()
  })

  it('ContentType Collection test with data', done => {
    const contentTypes = new ContentTypeCollection(Axios, {
      content_types: [
        contentTypeMock
      ]
    })
    expect(contentTypes.length).to.be.equal(1)
    checkContentType(contentTypes[0])
    done()
  })

  it('ContentType create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types').reply(200, {
      content_type: {
        ...contentTypeMock
      }
    })
    makeContentType()
      .create()
      .then((contentType) => {
        checkContentType(contentType)
        done()
      })
      .catch(done)
  })

  it('ContentType generate UID from content type name test', done => {
    const contentType = makeContentType()
    expect(contentType.generateUid.bind(contentType, null)).to.throw('Expected parameter name')
    expect(contentType.generateUid('Test Name')).to.be.equal('test_name')
    expect(contentType.generateUid('Test @Name')).to.be.equal('test_name')
    expect(contentType.generateUid('12 Test Name')).to.be.equal('12_test_name')
    expect(contentType.generateUid('@@@@ Test Name')).to.be.equal('_test_name')
    expect(contentType.generateUid('Test !@#$%&%&^##@$ ^ ()} | {} Name')).to.be.equal('test_name')
    done()
  })

  it('ContentType Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types').reply(200, {
      content_types: [
        contentTypeMock
      ]
    })
    makeContentType()
      .query()
      .find()
      .then((contentType) => {
        checkContentType(contentType.items[0])
        done()
      })
      .catch(done)
  })

  it('ContentType update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/content_types/UID').reply(200, {
      content_type: {
        ...contentTypeMock
      }
    })
    makeContentType({
      content_type: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((contentType) => {
        checkContentType(contentType)
        done()
      })
      .catch(done)
  })

  it('ContentType fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/UID').reply(200, {
      content_type: {
        ...contentTypeMock
      }
    })
    makeContentType({
      content_type: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((contentType) => {
        checkContentType(contentType)
        done()
      })
      .catch(done)
  })

  it('ContentType delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/content_types/UID').reply(200, {
      ...noticeMock
    })
    makeContentType({
      content_type: {
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

  it('ContentType entry initialization without uid test', done => {
    const entry = makeContentType({
      content_type: {
        ...systemUidMock
      }
    })
      .entry()
    expect(entry.uid).to.be.equal(undefined)
    expect(entry.stackHeaders).to.be.equal(undefined)
    done()
  })

  it('ContentType entry initialization with uid test', done => {
    const entry = makeContentType({
      content_type: {
        ...systemUidMock
      }
    })
      .entry('UID')
    expect(entry.uid).to.be.equal('UID')
    expect(entry.stackHeaders).to.be.equal(undefined)
    done()
  })

  it('ContentType entry initialization with uid, stack headers test', done => {
    const entry = makeContentType({
      content_type: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .entry('UID')
    expect(entry.uid).to.be.equal('UID')
    expect(entry.stackHeaders).to.not.equal(undefined)
    expect(entry.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    done()
  })

  it('ContentType import test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/import').reply(200, {
      content_type: {
        ...contentTypeMock
      }
    })
    const contentTypeUpload = { content_type: path.join(__dirname, '../api/mock/contentType.json') }
    const form = createFormData(contentTypeUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeContentType()
      .import(contentTypeUpload)
      .then((contentType) => {
        checkContentType(contentType)
        done()
      })
      .catch(done)
  })
})

function makeContentType (data) {
  return new ContentType(Axios, data)
}

function checkContentType (contentType) {
  checkSystemFields(contentType)
  expect(contentType.title).to.be.equal('title')
  expect(contentType.schema.length).to.be.equal(2)
}
