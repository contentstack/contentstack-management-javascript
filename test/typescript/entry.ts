import { expect } from "chai";
import { Stack } from "../../types/stack";
import { entryFirst, entrySecond, entryThird } from "./mock/entry"
import { multiPageCT, singlepageCT } from "./mock/contentType";
import path from "path";
var entryUTD = ''

export function createEntry(stack: Stack) {
    describe('Entry create', () => {
        test('Create Single page entry', done => {
            var entry = {title: 'Entry title', url: 'sampleEntry'}

            stack.contentType(singlepageCT.content_type.uid).entry().create({entry})
            .then(response => {
                entryUTD = response.uid
                expect(response.uid).not.equal(undefined)
                expect(response.title).equal(entry.title)
                expect(response.url).equal(entry.url)
                expect(response.locale).to.be.equal('en-us')
                done()
            })
            .catch(done)
        })

        test('Create Entries for Multiple Page', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .create({entry: entryFirst})
            .then((entry) => {
                expect(entry.uid) .to.be.not.equal(null)
                expect(entry.title).to.be.equal(entryFirst.title)
                expect(entry.single_line).to.be.equal(entryFirst.single_line)
                expect(entry.url).to.be.equal(`/${entryFirst.title.toLowerCase().replace(/ /g, '-')}`)
                expect(entry.multi_line).to.be.equal(entryFirst.multi_line)
                expect(entry.markdown).to.be.equal(entryFirst.markdown)
                done()
              })
            .catch(done)
        })

        test('Create Entries 2 for Multiple page', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .create({entry: entrySecond})
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

        test('Create Entries 3 for Multiple page', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .create({entry: entryThird})
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
    })
}

export function getEntries(stack: Stack) {
    describe('Entry get', () => {
        test('Get all entries', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .query({ include_count: true, include_content_type: true })
            .find()
            .then((collection) => {
                expect(collection.count).to.be.equal(3)
                collection.items.forEach((entry) => {
                  expect(entry.uid).to.be.not.equal(null)
                  expect(entry.content_type_uid).to.be.equal(multiPageCT.content_type.uid)
                })
                done()
            })
            .catch(done)
        })

        test('Get all entries from tag', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .query({ include_count: true, query: { tags: entrySecond.tags[0] } })
            .find()
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
        
        test('Fetch Entry', done => {
            stack.contentType('product').entry('blt0000000000000000')
            .fetch({include_content_type: true})
            .then((response) => {
                expect(response.uid).to.be.not.equal(null)
                expect(response.content_type).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Localize entry with title update', done => {
            stack.contentType(singlepageCT.content_type.uid).entry(entryUTD)
            .fetch()
            .then((response) => {
                response.title = 'Sample Entry in en-at'
                return response.update({ locale: 'en-at' })
            })
            .then((entryResponse) => {
                expect(entryResponse.title).to.be.equal('Sample Entry in en-at')
                expect(entryResponse.uid).to.be.not.equal(null)
                expect(entryResponse.locale).to.be.equal('en-at')
                done()
            })
            .catch(done)
        })
    })
}

export function getEntryLocales(stack: Stack) {
    describe('Entry get', () => { 
        test('to get locales of an entry', done => {
            stack.contentType(singlepageCT.content_type.uid).entry(entryUTD).locales()
            .then((locale) => {
                expect(locale.locales[0].code).to.be.equal('en-us')
                locale.locales.forEach((locales) => {
                  expect(locales.code).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}

export function publishUnpublishEntry(stack: Stack) {
    describe('Unpublish/Publish Entry', () => {
        test('Publish Entry', done => {
            stack.contentType(singlepageCT.content_type.uid).entry(entryUTD)
            .publish({ publishDetails: {
                locales: ['hi-in', 'en-at'],
                environments: ['development']
              }})
              .then((data) => {
                expect(data.notice).to.be.equal('The requested action has been performed.')
                done()
              })
              .catch(done)
        })

        test('Publish localized Entry to locales', done => {
            stack.contentType(singlepageCT.content_type.uid).entry(entryUTD)
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

        test('Unpublish localized Entry to locales', done => {
            stack.contentType(singlepageCT.content_type.uid).entry(entryUTD)
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
    })
}

export function importEntry(stack: Stack){
    describe('Import Entry', () => {
        test('Entry import from path', done => {
            stack.contentType(multiPageCT.content_type.uid).entry()
            .import({ entry: path.join(__dirname, '../sanity-check/mock/entry.json')})
            .then((response) => {
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(e => {
                console.log(e);
                done()
            })
        })
    })
}