import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { multiPageCT, singlepageCT } from '../unit/mock/content-type.js'
import { entryFirst, entrySecond } from '../unit/mock/entry.js'

var client = {}

var stack = {}
var entryUTD = 'bltc144f14cb4310b7d'
describe('Entry api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Create Entry in Single ', done => {
    var entry = {
      title: 'Sample Entry',
      url: 'sampleEntry'
    }
    makeEntry(singlepageCT.content_type.uid)
      .create({ entry })
      .then((entryResponse) => {
        expect(entryResponse.title).to.be.equal(entry.title)
        expect(entryResponse.url).to.be.equal(entry.url)
        expect(entryResponse.uid).to.be.not.equal(null)
        expect(entryResponse.locale).to.be.equal(stack.master_locale)
        done()
      })
      .catch(done)
  })
  it('Localize entry with title update ', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .fetch({ include_content_type: true })
      .then((entryResponse) => {
        console.log(entryResponse)
        expect(entryResponse.uid).to.be.not.equal(null)
        expect(entryResponse.content_type).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Localize entry with title update ', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .fetch()
      .then((entry) => {
        entry.title = 'Sample Entry in en-at'
        return entry.update({ locale: 'en-at' })
      })
      .then((entryResponse) => {
        entryUTD = entryResponse.uid
        expect(entryResponse.title).to.be.equal('Sample Entry in en-at')
        expect(entryResponse.uid).to.be.not.equal(null)
        expect(entryResponse.locale).to.be.equal('en-at')
        done()
      })
      .catch(done)
  })

  it('Create Entries for Multiple page', done => {
    makeEntry(multiPageCT.content_type.uid)
      .create({ entry: entryFirst })
      .then((entry) => {
        expect(entry.uid).to.be.not.equal(null)
        expect(entry.title).to.be.equal(entryFirst.title)
        expect(entry.single_line).to.be.equal(entryFirst.single_line)
        expect(entry.url).to.be.equal(`/${entryFirst.title.toLowerCase().replace(' ', '-')}`)
        expect(entry.multi_line).to.be.equal(entryFirst.multi_line)
        expect(entry.markdown).to.be.equal(entryFirst.markdown)
        done()
      })
      .catch(done)
  })

  it('Create Entries 2 for Multiple page', done => {
    makeEntry(multiPageCT.content_type.uid)
      .create({ entry: entrySecond })
      .then((entry) => {
        expect(entry.uid).to.be.not.equal(null)
        expect(entry.title).to.be.equal(entrySecond.title)
        expect(entry.url).to.be.equal(`/${entrySecond.title.toLowerCase().replace(' ', '-')}`)
        expect(entry.single_line).to.be.equal(entrySecond.single_line)
        expect(entry.multi_line).to.be.equal(entrySecond.multi_line)
        expect(entry.markdown).to.be.equal(entrySecond.markdown)
        expect(entry.tags[0]).to.be.equal(entrySecond.tags[0])
        done()
      })
      .catch(done)
  })

  it('Get all Entry', done => {
    makeEntry(multiPageCT.content_type.uid)
      .query({ include_count: true, include_content_type: true }).find()
      .then((collection) => {
        expect(collection.count).to.be.equal(2)
        collection.items.forEach((entry) => {
          expect(entry.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Get all Entry from tag', done => {
    makeEntry(multiPageCT.content_type.uid)
      .query({ include_count: true, query: { tags: entrySecond.tags[0] } }).find()
      .then((collection) => {
        expect(collection.count).to.be.equal(1)
        collection.items.forEach((entry) => {
          expect(entry.uid).to.be.not.equal(null)
          expect(entry.tags).to.have.all.keys(0)
        })
        done()
      })
      .catch(done)
  })

  it('Publish Entry', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .publish({ publishDetails: {
        locales: ['en-us'],
        environments: ['development']
      } })
      .then((notice) => {
        expect(notice).to.be.equal('The requested action has been performed.')
        done()
      })
      .catch(done)
  })

  it('Publish localized Entry to locales', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .publish({ publishDetails: {
        locales: ['hi-in', 'en-at'],
        environments: ['development']
      },
      locale: 'en-at' })
      .then((notice) => {
        expect(notice).to.be.equal('The requested action has been performed.')
        done()
      })
      .catch(done)
  })

  it('Unpublish localized entry', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .unpublish({ publishDetails: {
        locales: ['hi-in', 'en-at'],
        environments: ['development']
      },
      locale: 'en-at' })
      .then((notice) => {
        expect(notice).to.be.equal('The requested action has been performed.')
        done()
      })
      .catch(done)
  })
})

function makeEntry (contentType, uid = null) {
  return client.stack(stack.api_key).contentType(contentType).entry(uid)
}
