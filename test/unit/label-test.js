import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Label, LabelCollection } from '../../lib/stack/label'
import { systemUidMock, stackHeadersMock, labelMock, checkSystemFields, noticeMock } from './mock/objects'

describe('Contentstack Label test', () => {
  it('Label test without uid', done => {
    const label = makeLabel()
    expect(label.urlPath).to.be.equal('/labels')
    expect(label.stackHeaders).to.be.equal(undefined)
    expect(label.update).to.be.equal(undefined)
    expect(label.delete).to.be.equal(undefined)
    expect(label.fetch).to.be.equal(undefined)
    expect(label.create).to.not.equal(undefined)
    expect(label.query).to.not.equal(undefined)
    done()
  })

  it('Label test with uid', done => {
    const label = makeLabel({
      label: {
        ...systemUidMock
      }
    })
    expect(label.urlPath).to.be.equal(`/labels/${systemUidMock.uid}`)
    expect(label.stackHeaders).to.be.equal(undefined)
    expect(label.update).to.not.equal(undefined)
    expect(label.delete).to.not.equal(undefined)
    expect(label.fetch).to.not.equal(undefined)
    expect(label.create).to.be.equal(undefined)
    expect(label.query).to.be.equal(undefined)
    done()
  })

  it('Label test with Stack Headers', done => {
    const label = makeLabel({
      label: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(label.urlPath).to.be.equal(`/labels/${systemUidMock.uid}`)
    expect(label.stackHeaders).to.not.equal(undefined)
    expect(label.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(label.update).to.not.equal(undefined)
    expect(label.delete).to.not.equal(undefined)
    expect(label.fetch).to.not.equal(undefined)
    expect(label.create).to.be.equal(undefined)
    expect(label.fetchAll).to.be.equal(undefined)
    expect(label.query).to.be.equal(undefined)
    done()
  })

  it('Label Collection test with blank data', done => {
    const labels = new LabelCollection(Axios, {})
    expect(labels.length).to.be.equal(0)
    done()
  })

  it('Label Collection test with data', done => {
    const labels = new LabelCollection(Axios, {
      labels: [
        labelMock
      ]
    })
    expect(labels.length).to.be.equal(1)
    checkLabel(labels[0])
    done()
  })

  it('Label create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/labels').reply(200, {
      label: {
        ...labelMock
      }
    })
    makeLabel()
      .create()
      .then((label) => {
        checkLabel(label)
        done()
      })
      .catch(done)
  })

  it('Label Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/labels').reply(200, {
      labels: [
        labelMock
      ]
    })
    makeLabel()
      .query()
      .find()
      .then((labels) => {
        checkLabel(labels.items[0])
        done()
      })
      .catch(done)
  })

  it('Label update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/labels/UID').reply(200, {
      label: {
        ...labelMock
      }
    })
    makeLabel({
      label: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((label) => {
        checkLabel(label)
        done()
      })
      .catch(done)
  })

  it('Label fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/labels/UID').reply(200, {
      label: {
        ...labelMock
      }
    })
    makeLabel({
      label: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((label) => {
        checkLabel(label)
        done()
      })
      .catch(done)
  })

  it('Label delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/labels/UID').reply(200, {
      ...noticeMock
    })
    makeLabel({
      label: {
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
})

function makeLabel (data = {}) {
  return new Label(Axios, data)
}

function checkLabel (label) {
  checkSystemFields(label)
  expect(label.name).to.be.equal('name')
  expect(label.parent.length).to.be.equal(0)
  expect(label.ACL.length).to.be.equal(0)
  expect(label._version).to.be.equal(1)
  expect(label.content_types.length).to.be.equal(4)
}
