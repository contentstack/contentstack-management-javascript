import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { singlepageCT } from '../unit/mock/content-type.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}

const label = {
  name: 'First label',
  content_types: [singlepageCT.content_type.uid]
}

var labelUID = ''
var deleteLabelUID = ''
describe('Label api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Label create', done => {
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

  it('Label create with parent uid', done => {
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

  it('Fetch label from uid', done => {
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

  it('Query to get all labels', done => {
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

  it('Query label with name', done => {
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

  it('Fetch and update label from uid', done => {
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

  it('Delete label from uid', done => {
    makeLabel(deleteLabelUID)
      .delete()
      .then((notice) => {
        expect(notice).to.be.equal('Label deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeLabel (uid = null) {
  return client.stack(stack.api_key).label(uid)
}
