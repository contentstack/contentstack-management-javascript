import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'

var client = {}
var stack = {}

var folderUID = 'bltccb61db5f26e5817'
describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')

    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  // it('Asset Upload ', done => {
  //   const asset = {
  //     upload: path.join(__dirname, '../unit/mock/customUpload.html'),
  //     title: 'customeasset',
  //     description: 'Custom Asset Desc'
  //   }
  //   makeAsset().create(asset)
  //     .then((asset) => {
  //       console.log(asset)
  //       expect(asset.uid).to.be.not.equal(null)
  //       expect(asset.url).to.be.not.equal(null)
  //       expect(asset.filename).to.be.equal('customUpload.html')
  //       expect(asset.title).to.be.equal('customeasset')
  //       expect(asset.description).to.be.equal('Custom Asset Desc')
  //       expect(asset.content_type).to.be.equal('text/html')
  //       done()
  //     })
  //     .catch(done)
  // })

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
})

function makeAsset (uid = null) {
  return client.stack(stack.api_key, 'managementToken').asset(uid)
}
