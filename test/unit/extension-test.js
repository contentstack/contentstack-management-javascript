import path from 'path'
import Axios from 'axios'
import { describe, it } from 'mocha'
import { Extension, ExtensionCollection, createExtensionFormData } from '../../lib/stack/extension/index'
import { expect } from 'chai'
import { systemUidMock, stackHeadersMock, checkSystemFields, extensionMock, noticeMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'
describe('Contentstack Extension test', () => {
  it('Extension test without uid', done => {
    const extension = makeExtension()
    expect(extension.urlPath).to.be.equal('/extensions')
    expect(extension.stackHeaders).to.be.equal(undefined)
    expect(extension.update).to.be.equal(undefined)
    expect(extension.delete).to.be.equal(undefined)
    expect(extension.fetch).to.be.equal(undefined)
    expect(extension.create).to.not.equal(undefined)
    expect(extension.upload).to.not.equal(undefined)
    expect(extension.query).to.not.equal(undefined)
    done()
  })

  it('Extension test with uid', done => {
    const extension = makeExtension({ extension: { ...systemUidMock } })
    expect(extension.urlPath).to.be.equal(`/extensions/${systemUidMock.uid}`)
    expect(extension.uid).to.be.equal(systemUidMock.uid)
    expect(extension.stackHeaders).to.be.equal(undefined)
    expect(extension.update).to.not.equal(undefined)
    expect(extension.delete).to.not.equal(undefined)
    expect(extension.fetch).to.not.equal(undefined)
    expect(extension.create).to.be.equal(undefined)
    expect(extension.upload).to.be.equal(undefined)
    expect(extension.query).to.be.equal(undefined)
    done()
  })

  it('Extension test with stack headers', done => {
    const extension = makeExtension({ extension: { ...systemUidMock },
      stackHeaders: stackHeadersMock
    })
    expect(extension.urlPath).to.be.equal(`/extensions/${systemUidMock.uid}`)
    expect(extension.uid).to.be.equal(systemUidMock.uid)
    expect(extension.stackHeaders).to.not.equal(undefined)
    expect(extension.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(extension.update).to.not.equal(undefined)
    expect(extension.delete).to.not.equal(undefined)
    expect(extension.fetch).to.not.equal(undefined)
    expect(extension.create).to.be.equal(undefined)
    expect(extension.upload).to.be.equal(undefined)
    expect(extension.query).to.be.equal(undefined)
    done()
  })

  it('Extension Collection test with blank data', done => {
    const extensions = new ExtensionCollection(Axios, {})
    expect(extensions.length).to.be.equal(0)
    done()
  })

  it('Extension Collection test with data', done => {
    const extensions = new ExtensionCollection(Axios, {
      extensions: [
        extensionMock
      ]
    })
    expect(extensions.length).to.be.equal(1)
    checkExtension(extensions[0])
    done()
  })

  it('Extension create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/extensions').reply(200, {
      extension: {
        ...extensionMock
      }
    })
    makeExtension()
      .create()
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })

  it('Extension Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/extensions').reply(200, {
      extensions: [
        extensionMock
      ]
    })
    makeExtension()
      .query()
      .find()
      .then((extensions) => {
        checkExtension(extensions.items[0])
        done()
      })
      .catch(done)
  })

  it('Extension update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/extensions/UID').reply(200, {
      extension: {
        ...extensionMock
      }
    })
    makeExtension({
      extension: {
        ...extensionMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })

  it('Extension fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/extensions/UID').reply(200, {
      extension: {
        ...extensionMock
      }
    })
    makeExtension({
      extension: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })

  it('Extension delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/extensions/UID').reply(200, {
      ...noticeMock
    })
    makeExtension({
      extension: {
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

  it('Extension upload test only upload file', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/extensions').reply(200, {
      ...noticeMock,
      extension: {
        ...extensionMock
      }
    })

    const extensionUpload = { upload: path.join(__dirname, '../sanity-check/mock/customUpload.html') }
    const form = createExtensionFormData(extensionUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)

    makeExtension(extensionUpload)
      .upload()
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })

  it('Extension upload test string tags', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/extensions').reply(200, {
      ...noticeMock,
      extension: {
        ...extensionMock
      }
    })

    const extensionUpload = { upload: path.join(__dirname, '../sanity-check/mock/customUpload.html'), tags: 'tag1, tag2' }
    const form = createExtensionFormData(extensionUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeExtension()
      .upload(extensionUpload)
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })

  it('Extension upload test all details', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/extensions').reply(200, {
      ...noticeMock,
      extension: {
        ...extensionMock
      }
    })
    const extensionUpload = {
      title: 'Custom dashboard Upload',
      data_type: extensionMock.data_type,
      type: extensionMock.type,
      tags: extensionMock.tags,
      enable: true,
      default_width: extensionMock.default_width,
      upload: path.join(__dirname, '../sanity-check/mock/customUpload.html'),
      scope: {},
      multiple: true
    }
    const form = createExtensionFormData(extensionUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeExtension()
      .upload(extensionUpload)
      .then((extension) => {
        checkExtension(extension)
        done()
      })
      .catch(done)
  })
})

function makeExtension (data) {
  return new Extension(Axios, data)
}

function checkExtension (extension) {
  checkSystemFields(extension)
  expect(extension.tags.length).to.be.equal(2)
  expect(extension.data_type).to.be.equal('text')
  expect(extension.title).to.be.equal('New Custom Field URL')
  expect(extension.src).to.be.equal('https://www.sample.com')
  expect(extension.multiple).to.be.equal(false)
  expect(extension.config).to.be.equal('{}')
  expect(extension.type).to.be.equal('field')
}
