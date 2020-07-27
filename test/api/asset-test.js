import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'

var client = {}
var stack = {}

var folderUID = ''
var assetUID = ''
var publishAssetUID = 'bltec65a7f777312cdb'
describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Asset Upload ', done => {
    const asset = {
      upload: path.join(__dirname, '../unit/mock/customUpload.html'),
      title: 'customeasset',
      description: 'Custom Asset Desc'
    }
    makeAsset().create(asset)
      .then((asset) => {
        assetUID = asset.uid
        console.log(asset)
        expect(asset.uid).to.be.not.equal(null)
        expect(asset.url).to.be.not.equal(null)
        expect(asset.filename).to.be.equal('customUpload.html')
        expect(asset.title).to.be.equal('customeasset')
        expect(asset.description).to.be.equal('Custom Asset Desc')
        expect(asset.content_type).to.be.equal('text/html')
        done()
      })
      .catch(done)
  })

  it('Create folder ', done => {
    makeAsset().folder().create({ asset: { name: 'Sample Folder' } })
      .then((asset) => {
        folderUID = asset.uid
        expect(asset.uid).to.be.not.equal(null)
        expect(asset.name).to.be.equal('Sample Folder')
        expect(asset.is_dir).to.be.equal(true)
        done()
      })
      .catch(done)
  })

  it('Asset Upload in folder', done => {
    const asset = {
      upload: path.join(__dirname, '../unit/mock/customUpload.html'),
      title: 'customeasset in Folder',
      description: 'Custom Asset Desc in Folder',
      parent_uid: folderUID
    }
    makeAsset().create(asset)
      .then((asset) => {
        publishAssetUID = asset.uid
        expect(asset.uid).to.be.not.equal(null)
        expect(asset.url).to.be.not.equal(null)
        expect(asset.filename).to.be.equal('customUpload.html')
        expect(asset.title).to.be.equal('customeasset in Folder')
        expect(asset.description).to.be.equal('Custom Asset Desc in Folder')
        expect(asset.content_type).to.be.equal('text/html')
        expect(asset.parent_uid).to.be.equal(folderUID)
        done()
      })
      .catch(done)
  })
  it('Replace asset ', done => {
    const asset = {
      upload: path.join(__dirname, '../unit/mock/upload.html')
    }
    makeAsset(assetUID)
      .replace(asset)
      .then((asset) => {
        expect(asset.uid).to.be.equal(assetUID)
        expect(asset.filename).to.be.equal('upload.html')
        expect(asset.content_type).to.be.equal('text/html')
        done()
      })
      .catch(done)
  })

  it('Fetch and Update asset details', done => {
    makeAsset(assetUID)
      .fetch()
      .then((asset) => {
        asset.title = 'Update title'
        asset.description = 'Update description'
        return asset.update()
      })
      .then((asset) => {
        expect(asset.uid).to.be.equal(assetUID)
        expect(asset.title).to.be.equal('Update title')
        expect(asset.description).to.be.equal('Update description')
        done()
      })
      .catch(done)
  })

  it('Publish Asset', done => {
    makeAsset(publishAssetUID)
      .publish({ publishDetails: {
        locales: ['hi-in', 'en-us'],
        environments: ['development']
      } })
      .then((notice) => {
        expect(notice).to.be.equal('Asset sent for publishing.')
      })
      .catch(done)
  })

  it('Unpublish Asset', done => {
    makeAsset(publishAssetUID)
      .unpublish({ publishDetails: {
        locales: ['hi-in', 'en-us'],
        environments: ['development']
      } })
      .then((notice) => {
        expect(notice).to.be.equal('Asset sent for publishing.')
      })
      .catch(done)
  })

  it('Delete asset', done => {
    makeAsset(assetUID)
      .delete()
      .then((notice) => {
        expect(notice).to.be.equal('Asset deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeAsset (uid = null) {
  return client.stack(stack.api_key).asset(uid)
}
