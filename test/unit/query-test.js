import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import Query from '../../lib/query'
import { stackHeadersMock, entryMock, checkSystemFields } from './mock/objects'
import { EntryCollection } from '../../lib/stack/contentType/entry'
import MockAdapter from 'axios-mock-adapter'

describe('Contentstack Query test', () => {
  it('Query initialization test', done => {
    const query = makeQuery()
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    done()
  })

  it('Query initialization test', done => {
    const query = Query(Axios)
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    done()
  })

  it('Query initialization param and Stack Headers test', done => {
    const query = makeQuery({}, stackHeadersMock)
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    expect(query.count).to.not.equal(undefined)
    done()
  })

  it('Query find test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('query').reply(200, {
      entries: [entryMock]
    })
    makeQuery({}, stackHeadersMock)
      .find()
      .then((entries) => {
        checkEntry(entries.items[0])
        done()
      })
      .catch(done)
  })

  it('Query findOne test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('query').reply(200, {
      entries: [entryMock]
    })
    makeQuery({}, stackHeadersMock)
      .findOne()
      .then((entries) => {
        checkEntry(entries.items[0])
        done()
      })
      .catch(done)
  })

  it('Query count test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('query').reply(200, {
      entries: 1
    })
    makeQuery({}, stackHeadersMock)
      .count()
      .then((response) => {
        expect(response.entries).to.be.equal(1)
        done()
      })
      .catch(done)
  })
})

function makeQuery (param = null, stackHeaders = null) {
  return Query(Axios, 'query', param, stackHeaders, EntryCollection)
}

function checkEntry (entry) {
  checkSystemFields(entry)
  expect(entry.title).to.be.equal('title')
  expect(entry.url).to.be.equal('/url')
  expect(entry.locale).to.be.equal('en-us')
  expect(entry._version).to.be.equal(1)
  expect(entry._in_progress).to.be.equal(false)
}
