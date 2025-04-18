import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { multiPageCT, singlepageCT } from './mock/content-type.js'
import { entryFirst, entrySecond, entryThird } from './mock/entry.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
var entryUTD = ''
describe('Entry api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Create Entry in Single ', done => {
    var entry = {
      title: 'Sample Entry',
      url: 'sampleEntry'
    }
    makeEntry(singlepageCT.content_type.uid)
      .create({ entry })
      .then((entryResponse) => {
        entryUTD = entryResponse.uid
        expect(entryResponse.title).to.be.equal(entry.title)
        expect(entryResponse.url).to.be.equal(entry.url)
        expect(entryResponse.uid).to.be.not.equal(null)
        expect(entryResponse.locale).to.be.equal(stack.master_locale)
        done()
      })
      .catch(done)
  })
  it('Entry fetch with Content Type', done => {
    makeEntry(singlepageCT.content_type.uid, entryUTD)
      .fetch({ include_content_type: true })
      .then((entryResponse) => {
        expect(entryResponse.uid).to.be.not.equal(null)
        expect(entryResponse.content_type).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Localize entry with title update', done => {
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
        expect(entry.url).to.be.equal(`/${entryFirst.title.toLowerCase().replace(/ /g, '-')}`)
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
        expect(entry.url).to.be.equal(`/${entrySecond.title.toLowerCase().replace(/ /g, '-')}`)
        expect(entry.single_line).to.be.equal(entrySecond.single_line)
        expect(entry.multi_line).to.be.equal(entrySecond.multi_line)
        expect(entry.markdown).to.be.equal(entrySecond.markdown)
        expect(entry.tags[0]).to.be.equal(entrySecond.tags[0])
        done()
      })
      .catch(done)
  })

  it('Create Entries 3 for Multiple page', done => {
    makeEntry(multiPageCT.content_type.uid)
      .create({ entry: entryThird })
      .then((entry) => {
        expect(entry.uid).to.be.not.equal(null)
        expect(entry.title).to.be.equal(entryThird.title)
        expect(entry.url).to.be.equal(`/${entryThird.title.toLowerCase().replace(/ /g, '-')}`)
        expect(entry.single_line).to.be.equal(entryThird.single_line)
        expect(entry.multi_line).to.be.equal(entryThird.multi_line)
        expect(entry.markdown).to.be.equal(entryThird.markdown)
        expect(entry.tags[0]).to.be.equal(entryThird.tags[0])
        done()
      })
      .catch(done)
  })

  it('Get all Entry', done => {
    makeEntry(multiPageCT.content_type.uid)
      .query({ include_count: true, include_content_type: true }).find()
      .then((collection) => {
        jsonWrite(collection.items, 'entry.json')
        expect(collection.count).to.be.equal(3)
        collection.items.forEach((entry) => {
          expect(entry.uid).to.be.not.equal(null)
          expect(entry.content_type_uid).to.be.equal(multiPageCT.content_type.uid)
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
      .then((data) => {
        expect(data.notice).to.be.equal('The requested action has been performed.')
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
      .then((data) => {
        expect(data.notice).to.be.equal('The requested action has been performed.')
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
      .then((data) => {
        expect(data.notice).to.be.equal('The requested action has been performed.')
        done()
      })
      .catch(done)
  })

  it('Import Entry', done => {
    makeEntry(multiPageCT.content_type.uid)
      .import({
        entry: path.join(__dirname, './mock/entry.json')
      })
      .then((response) => {
        expect(response.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Create and update an entry with asset', done => {
    // get asset
    let asset
    makeAsset()
      .query()
      .find()
      .then((collection) => {
        asset = collection.items[0]
        // create entry
        const entry = {
          ...entryFirst,
          title: 'uniqueTitle45',
          modular_blocks: [
            {
              block1: {
                file: asset.uid
              }
            }
          ]
        }
        makeEntry(multiPageCT.content_type.uid)
          .create({ entry: entry })
          .then(entry => {
            const newTitle = 'updated title'
            entry.title = newTitle
            entry.update().then(updatedEntry => {
              expect(updatedEntry.title).to.be.equal(newTitle)
              done()
            })
          })
      })
  })
})

function makeEntry (contentType, uid = null) {
  return client.stack({ api_key: stack.api_key }).contentType(contentType).entry(uid)
}

function makeAsset (uid = null) {
  return client.stack({ api_key: stack.api_key }).asset(uid)
}
