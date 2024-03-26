import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'
import { singlepageCT } from '../mock/content-type.js'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}

const label = {
  name: 'First label',
  content_types: [singlepageCT.content_type.uid]
}

let labelUID = ''
let deleteLabelUID = ''
describe('Label api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create a Label', done => {
    makeLabel()
      .create({ label })
      .then((labelResponse) => {
        labelUID = labelResponse.uid
        expect(labelResponse.uid).to.be.not.equal(null)
        expect(labelResponse.name).to.be.equal(label.name)
        expect(labelResponse.content_types[0]).to.be.equal(label.content_types[0])
        done()
      })
      .catch(done)
  })

  it('should create Label with parent uid', done => {
    const label = {
      name: 'With Parent label',
      parent: [labelUID],
      content_types: [singlepageCT.content_type.uid]
    }
    makeLabel()
      .create({ label })
      .then((labelResponse) => {
        deleteLabelUID = labelResponse.uid
        expect(labelResponse.uid).to.be.not.equal(null)
        expect(labelResponse.name).to.be.equal(label.name)
        expect(labelResponse.parent[0]).to.be.equal(label.parent[0])
        expect(labelResponse.content_types[0]).to.be.equal(label.content_types[0])
        done()
      })
      .catch(done)
  })

  it('should fetch label from uid', done => {
    makeLabel(labelUID)
      .fetch()
      .then((labelResponse) => {
        expect(labelResponse.uid).to.be.equal(labelUID)
        expect(labelResponse.name).to.be.equal(label.name)
        expect(labelResponse.content_types[0]).to.be.equal(label.content_types[0])
        done()
      })
      .catch(done)
  })

  it('should query to get all labels', done => {
    makeLabel()
      .query({ query: { name: label.name } })
      .find()
      .then((response) => {
        response.items.forEach((labelResponse) => {
          expect(labelResponse.uid).to.be.not.equal(null)
          expect(labelResponse.name).to.be.not.equal(null)
          expect(labelResponse.content_types).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should query label with name', done => {
    makeLabel()
      .query({ query: { name: label.name } })
      .find()
      .then((response) => {
        response.items.forEach((labelResponse) => {
          expect(labelResponse.uid).to.be.equal(labelUID)
          expect(labelResponse.name).to.be.equal(label.name)
          expect(labelResponse.content_types[0]).to.be.equal(label.content_types[0])
        })
        done()
      })
      .catch(done)
  })

  it('should fetch and update label from uid', done => {
    makeLabel(labelUID)
      .fetch()
      .then((labelResponse) => {
        labelResponse.name = 'Update Name'
        return labelResponse.update()
      })
      .then((labelResponse) => {
        expect(labelResponse.uid).to.be.equal(labelUID)
        expect(labelResponse.name).to.be.equal('Update Name')
        expect(labelResponse.content_types[0]).to.be.equal(label.content_types[0])
        done()
      })
      .catch(done)
  })

  it('should delete parent label from uid', done => {
    makeLabel(deleteLabelUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Label deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete label from uid', done => {
    makeLabel(labelUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Label deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeLabel (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).label(uid)
}
