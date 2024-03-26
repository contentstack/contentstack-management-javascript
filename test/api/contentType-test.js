import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { singlepageCT, multiPageCT, schema } from './mock/content-type'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
describe('Content Type api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Create Single page ContentType Schema', done => {
    makeContentType()
      .create(singlepageCT)
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(singlepageCT.content_type.uid)
        expect(contentType.title).to.be.equal(singlepageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Create Multi page ContentType Schema', done => {
    makeContentType()
      .create(multiPageCT)
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Get all ContentType', done => {
    makeContentType()
      .query()
      .find()
      .then((response) => {
        response.items.forEach(contentType => {
          expect(contentType.uid).to.be.not.equal(null)
          expect(contentType.title).to.be.not.equal(null)
          expect(contentType.schema).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Query ContentType title', done => {
    makeContentType()
      .query({ query: { title: singlepageCT.content_type.title } })
      .find()
      .then((response) => {
        response.items.forEach(contentType => {
          expect(contentType.uid).to.be.not.equal(null)
          expect(contentType.title).to.be.not.equal(null)
          expect(contentType.schema).to.be.not.equal(null)
          expect(contentType.uid).to.be.equal(singlepageCT.content_type.uid, 'UID not mathcing')
          expect(contentType.title).to.be.equal(singlepageCT.content_type.title, 'Title not mathcing')
        })
        done()
      })
      .catch(done)
  })

  it('Fetch ContentType from uid', done => {
    makeContentType(multiPageCT.content_type.uid)
      .fetch()
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Fetch and Update ContentType schema', done => {
    makeContentType(multiPageCT.content_type.uid)
      .fetch()
      .then((contentType) => {
        contentType.schema = schema
        return contentType.update()
      })
      .then((contentType) => {
        expect(contentType.schema.length).to.be.equal(6)
        done()
      })
      .catch(done)
  })

  it('Import content type', done => {
    makeContentType().import({
      content_type: path.join(__dirname, './mock/contentType.json')
    })
      .then((response) => {
        expect(response.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })
})

function makeContentType (uid = null) {
  return client.stack({ api_key: stack.api_key }).contentType(uid)
}
