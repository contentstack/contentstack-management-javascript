import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'
import { singlepageCT, multiPageCT, schema } from '../mock/content-type.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}
let multiPageCTUid = ''

describe('Content Type api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create Single page ContentType Schema', done => {
    makeContentType()
      .create(singlepageCT)
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(singlepageCT.content_type.uid)
        expect(contentType.title).to.be.equal(singlepageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('should create Multi page ContentType Schema', done => {
    makeContentType()
      .create(multiPageCT)
      .then((contentType) => {
        multiPageCTUid = contentType.uid
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('should get all ContentType', done => {
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

  it('should query ContentType title', done => {
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

  it('should fetch ContentType from uid', done => {
    makeContentType(multiPageCT.content_type.uid)
      .fetch()
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('should fetch and Update ContentType schema', done => {
    makeContentType(multiPageCTUid)
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
  // it('should update Multi page ContentType Schema without fetch', done => {
  //   makeContentType()
  //     .updateCT(multiPageCT)
  //     .then((contentType) => {
  //       multiPageCTUid = contentType.uid
  //       expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
  //       expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
  //       done()
  //     })
  //     .catch(done)
  // })

  it('should import content type', done => {
    makeContentType().import({
      content_type: path.join(__dirname, '../mock/contentType.json')
    })
      .then((response) => {
        expect(response.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })
})

function makeContentType (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).contentType(uid)
}
