
import { describe, it } from 'mocha'
import { Folder, FolderCollection } from '../../lib/stack/asset/folders'
import Axios from 'axios'
import { expect } from 'chai'
import { systemUidMock, folderMock, checkSystemFields, noticeMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'

describe('Contentstack Asset Folder test', () => {
  it('Folder without details', done => {
    const folder = makeFolder()
    expect(folder.create).to.not.equal(undefined)
    expect(folder.stackHeaders).to.be.equal(undefined)
    expect(folder.fetch).to.be.equal(undefined)
    expect(folder.update).to.be.equal(undefined)
    expect(folder.delete).to.be.equal(undefined)
    expect(folder.urlPath).to.be.equal(`/assets/folders`)
    expect(folder.uid).to.be.equal(undefined)
    done()
  })

  it('Folder with stack headers', done => {
    const folder = makeFolder({ stackHeaders: { api_key: 'stack_api_key' } })
    expect(folder.create).to.not.equal(undefined)
    expect(folder.stackHeaders).to.not.equal(undefined)
    expect(folder.fetch).to.be.equal(undefined)
    expect(folder.update).to.be.equal(undefined)
    expect(folder.delete).to.be.equal(undefined)
    expect(folder.stackHeaders.api_key).to.be.equal('stack_api_key')
    expect(folder.urlPath).to.be.equal(`/assets/folders`)
    expect(folder.uid).to.be.equal(undefined)
    done()
  })

  it('Folder with stack header and details', done => {
    const folder = makeFolder({ stackHeaders: { api_key: 'stack_api_key' },
      asset: {
        ...systemUidMock
      }
    })
    expect(folder.create).to.be.equal(undefined)
    expect(folder.stackHeaders).to.not.equal(undefined)
    expect(folder.fetch).to.not.equal(undefined)
    expect(folder.update).to.not.equal(undefined)
    expect(folder.delete).to.not.equal(undefined)
    expect(folder.stackHeaders.api_key).to.be.equal('stack_api_key')
    expect(folder.urlPath).to.be.equal(`/assets/folders/UID`)
    expect(folder.uid).to.be.equal(systemUidMock.uid)
    done()
  })

  it('Folder Collction without data test', done => {
    const collection = new FolderCollection(Axios, {})
    expect(collection.length).to.be.equal(0)
    done()
  })

  it('Folder Collction with data test', done => {
    const collection = new FolderCollection(Axios, { assets: [folderMock] })
    expect(collection.length).to.be.equal(1)
    checkFolder(collection[0])
    done()
  })

  it('Folder create test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/assets/folders').reply(200, {
      asset: {
        ...folderMock
      }
    })
    makeFolder()
      .create()
      .then((folder) => {
        checkFolder(folder)
        done()
      })
      .catch(done)
  })

  it('Folder fetch test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/assets/folders/${systemUidMock.uid}`).reply(200, {
      asset: {
        ...folderMock
      }
    })
    makeFolder({ asset: { ...systemUidMock } })
      .fetch()
      .then((folder) => {
        checkFolder(folder)
        done()
      })
      .catch(done)
  })

  it('Folder update test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPut(`/assets/folders/${systemUidMock.uid}`).reply(200, {
      asset: {
        ...folderMock
      }
    })
    makeFolder({ asset: { ...systemUidMock } })
      .update()
      .then((folder) => {
        checkFolder(folder)
        done()
      })
      .catch(done)
  })

  it('Folder delete test', done => {
    const mock = new MockAdapter(Axios)
    mock.onDelete(`/assets/folders/${systemUidMock.uid}`).reply(200, {
      ...noticeMock
    })
    makeFolder({ asset: { ...systemUidMock } })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeFolder (data) {
  return new Folder(Axios, data)
}

function checkFolder (folder) {
  checkSystemFields(folder)
  expect(folder.content_type).to.be.equal('application/vnd.contenstack.folder')
  expect(folder.tags.length).to.be.equal(0)
  expect(folder.name).to.be.equal('Demo Folder')
  expect(folder.is_dir).to.be.equal(true)
  expect(folder.parent_uid).to.be.equal('parent_uid')
  expect(folder._version).to.be.equal(1)
}
