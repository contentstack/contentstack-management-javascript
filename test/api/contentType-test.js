import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { singlepageCT, multiPageCT, schema } from '../unit/mock/content-type'

var client = {}

var stack = {}
describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Create Single page ContentType Schema', done => {
    makeContentTyoe()
      .create(singlepageCT)
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(singlepageCT.content_type.uid)
        expect(contentType.title).to.be.equal(singlepageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Create Multi page ContentType Schema', done => {
    makeContentTyoe()
      .create(multiPageCT)
      .then((contentType) => {
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Get all ContentType', done => {
    makeContentTyoe()
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
    makeContentTyoe()
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
    makeContentTyoe(multiPageCT.content_type.uid)
      .fetch()
      .then((contentType) => {
        console.log(contentType)
        expect(contentType.uid).to.be.equal(multiPageCT.content_type.uid)
        expect(contentType.title).to.be.equal(multiPageCT.content_type.title)
        done()
      })
      .catch(done)
  })

  it('Fetch and Update ContentType schema', done => {
    makeContentTyoe(multiPageCT.content_type.uid)
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
})

function makeContentTyoe (uid = null) {
  return client.stack(stack.api_key).contentType(uid)
}
