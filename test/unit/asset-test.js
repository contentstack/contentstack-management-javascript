import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Asset, AssetCollection } from '../../lib/stack/asset'
import { systemUidMock, stackHeadersMock, assetMock, checkSystemFields, noticeMock } from './mock/objects'

describe('Contentstack Asset test', () => {
  it('Asset test without uid', done => {
    const asset = makeAsset()
    expect(asset.urlPath).to.be.equal('/assets')
    expect(asset.stackHeaders).to.be.equal(undefined)
    expect(asset.update).to.be.equal(undefined)
    expect(asset.delete).to.be.equal(undefined)
    expect(asset.fetch).to.be.equal(undefined)
    expect(asset.replace).to.be.equal(undefined)
    expect(asset.publish).to.be.equal(undefined)
    expect(asset.unpublish).to.be.equal(undefined)
    expect(asset.create).to.not.equal(undefined)
    expect(asset.folder).to.not.equal(undefined)
    expect(asset.query).to.not.equal(undefined)
    done()
  })

  it('Asset test with uid', done => {
    const asset = makeAsset({
      asset: {
        ...systemUidMock
      }
    })
    expect(asset.urlPath).to.be.equal(`/assets/${systemUidMock.uid}`)
    expect(asset.stackHeaders).to.be.equal(undefined)
    expect(asset.update).to.not.equal(undefined)
    expect(asset.delete).to.not.equal(undefined)
    expect(asset.fetch).to.not.equal(undefined)
    expect(asset.replace).to.not.equal(undefined)
    expect(asset.publish).to.not.equal(undefined)
    expect(asset.unpublish).to.not.equal(undefined)
    expect(asset.create).to.be.equal(undefined)
    expect(asset.folder).to.be.equal(undefined)
    expect(asset.query).to.be.equal(undefined)
    done()
  })

  it('Asset test with Stack Headers', done => {
    const asset = makeAsset({
      asset: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(asset.urlPath).to.be.equal(`/assets/${systemUidMock.uid}`)
    expect(asset.stackHeaders).to.not.equal(undefined)
    expect(asset.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(asset.update).to.not.equal(undefined)
    expect(asset.delete).to.not.equal(undefined)
    expect(asset.fetch).to.not.equal(undefined)
    expect(asset.replace).to.not.equal(undefined)
    expect(asset.publish).to.not.equal(undefined)
    expect(asset.unpublish).to.not.equal(undefined)
    expect(asset.create).to.be.equal(undefined)
    expect(asset.folder).to.be.equal(undefined)
    expect(asset.query).to.be.equal(undefined)
    done()
  })

  it('Asset Collection test with blank data', done => {
    const assets = new AssetCollection(Axios, {})
    expect(assets.length).to.be.equal(0)
    done()
  })

  it('Asset Collection test with data', done => {
    const assets = new AssetCollection(Axios, {
      assets: [
        assetMock
      ]
    })
    expect(assets.length).to.be.equal(1)
    checkAsset(assets[0])
    done()
  })

  it('Asset folder initialization without uid test', done => {
    const folder = makeAsset().folder()
    expect(folder.uid).to.be.equal(undefined)
    expect(folder.stackHeaders).to.be.equal(undefined)
    done()
  })

  it('Asset folder initialization with uid test', done => {
    const folder = makeAsset().folder('UID')
    expect(folder.uid).to.be.equal('UID')
    expect(folder.stackHeaders).to.be.equal(undefined)
    done()
  })

  it('Asset folder initialization with stack headers test', done => {
    const folder = makeAsset({ stackHeaders: { ...stackHeadersMock } }).folder()
    expect(folder.uid).to.be.equal(undefined)
    expect(folder.stackHeaders).to.not.equal(undefined)
    expect(folder.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    done()
  })

  it('Asset create only upload file test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/assets').reply(200, {
      asset: {
        ...assetMock
      }
    })
    makeAsset()
      .create({ upload: path.join(__dirname, '../api/mock/customUpload.html') })
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset create only upload file with tags string test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/assets').reply(200, {
      asset: {
        ...assetMock
      }
    })
    makeAsset()
      .create({ upload: path.join(__dirname, '../api/mock/customUpload.html'), tags: 'tags' })
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/assets').reply(200, {
      asset: {
        ...assetMock
      }
    })
    const assetUpload = {
      upload: path.join(__dirname, '../api/mock/customUpload.html'),
      title: 'customasset',
      description: 'Custom Asset Desc',
      tags: ['Custom'],
      parent_uid: 'UID'
    }
    makeAsset()
      .create(assetUpload)
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset replace test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/assets/UID').reply(200, {
      asset: {
        ...assetMock
      }
    })
    const assetUpload = {
      upload: path.join(__dirname, '../api/mock/customUpload.html'),
      title: 'customasset',
      description: 'Custom Asset Desc',
      tags: ['Custom'],
      parent_uid: 'UID'
    }
    makeAsset({ asset: { ...systemUidMock } })
      .replace(assetUpload)
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/assets').reply(200, {
      assets: [
        assetMock
      ]
    })
    makeAsset()
      .query()
      .find()
      .then((asset) => {
        checkAsset(asset.items[0])
        done()
      })
      .catch(done)
  })

  it('Asset update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/assets/UID').reply(200, {
      asset: {
        ...assetMock
      }
    })
    makeAsset({
      asset: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/assets/UID').reply(200, {
      asset: {
        ...assetMock
      }
    })
    makeAsset({
      asset: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((asset) => {
        checkAsset(asset)
        done()
      })
      .catch(done)
  })

  it('Asset delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/assets/UID').reply(200, {
      ...noticeMock
    })
    makeAsset({
      asset: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((asset) => {
        expect(asset.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Asset publish test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/assets/UID/publish').reply(200, {
      ...noticeMock
    })
    const publishDetails = {
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    makeAsset({ asset: { ...systemUidMock } })
      .publish({ publishDetails })
      .then((asset) => {
        expect(asset.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Asset unpublish test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/assets/UID/unpublish').reply(200, {
      ...noticeMock
    })
    const publishDetails = {
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    makeAsset({ asset: { ...systemUidMock } })
      .unpublish({ publishDetails })
      .then((asset) => {
        expect(asset.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeAsset (data) {
  return new Asset(Axios, data)
}

function checkAsset (asset) {
  checkSystemFields(asset)
  expect(asset.content_type).to.be.equal('image/png')
  expect(asset.file_size).to.be.equal('42670')
  expect(asset.tags.length).to.be.equal(0)
  expect(asset.filename).to.be.equal('file.png')
  expect(asset.url).to.be.equal('url')
  expect(asset.is_dir).to.be.equal(false)
  expect(asset.parent_uid).to.be.equal('parent_uid')
  expect(asset._version).to.be.equal(1)
  expect(asset.title).to.be.equal('file.png')
}
