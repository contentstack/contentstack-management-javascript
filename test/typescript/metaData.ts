import { expect } from "chai";
import { Stack } from "../../types/stack";
import { metaDataFirst, metaDataSecond, metaDataThird } from "./mock/metaData"
import { multiPageCT, singlepageCT } from "./mock/contentType";
import { entryFirst, entrySecond, entryThird} from './mock/entry'

var entryUTD = ''

export function createMetaData(stack: Stack) {
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

