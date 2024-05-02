import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Entry, EntryCollection, createFormData } from '../../lib/stack/contentType/entry'
import { cleanAssets } from '../../lib/entity'
import { systemUidMock, stackHeadersMock, entryMock, noticeMock, checkSystemFields, variantsEntriesMock, variantsEntryMock, variantsUpdateEntryMock } from './mock/objects'
import { Variants, VariantsCollection } from '../../lib/stack/contentType/entry/variants'
import { entries } from 'lodash'

describe('Contentstack Variants Entry test', () => {
    it('Variants Entry test without uid', done => {
        const variants_entry = makeVariantEntry()
        expect(variants_entry.urlPath).to.be.equal('/content_types/content_type_uid/entries/entry_uid/variants')
        expect(variants_entry.stackHeaders).to.be.equal(undefined)
        expect(variants_entry.update).to.be.equal(undefined)
        expect(variants_entry.delete).to.be.equal(undefined)
        expect(variants_entry.fetch).to.be.equal(undefined)
        expect(variants_entry.query).to.not.equal(undefined)
        done()
    })
    it('Variants Entry test with uid', done => {
        const variants_entry = makeVariantEntry({
            variants_uid: 'UID'
        })
        expect(variants_entry.urlPath).to.be.equal('/content_types/content_type_uid/entries/entry_uid/variants/UID')
        expect(variants_entry.stackHeaders).to.be.equal(undefined)
        expect(variants_entry.update).to.not.equal(undefined)
        expect(variants_entry.delete).to.not.equal(undefined)
        expect(variants_entry.fetch).to.not.equal(undefined)
        expect(variants_entry.query).to.be.equal(undefined)
        done()
    })
    it('Variants Entry test with Stack Headers', done => {
        const variants_entry = makeVariantEntry({
            variants_uid: 'UID',
            stackHeaders: stackHeadersMock
        })
        expect(variants_entry.urlPath).to.be.equal('/content_types/content_type_uid/entries/entry_uid/variants/UID')
        expect(variants_entry.stackHeaders).to.not.equal(undefined)
        expect(variants_entry.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
        expect(variants_entry.update).to.not.equal(undefined)
        expect(variants_entry.delete).to.not.equal(undefined)
        expect(variants_entry.fetch).to.not.equal(undefined)
        expect(variants_entry.query).to.be.equal(undefined)
        done()
    })
    it('Variants Entry Collection test with blank data', done => {
        const variants_entries = new VariantsCollection(Axios, {})
        expect(variants_entries.length).to.be.equal(0)
        done()
    })
    it('Variants Entry Collection test with data', done => {
        const variants_entries = new VariantsCollection(Axios, {
            entries: [
                variantsEntriesMock
          ]})
        expect(variants_entries.length).to.be.equal(1)
        done()
    })
    // it('Variants Entry Query test', done => {
    //     var mock = new MockAdapter(Axios)
    //     mock.onGet('/content_types/content_type_uid/entries/variants').reply(200, {
    //       entries: [
    //         variantsEntriesMock
    //       ]
    //     })
    //     makeVariantEntry()
    //       .query()
    //       .find()
    //       .then((entry) => {
    //         checkEntry(entry.items[0])
    //         done()
    //       })
    //       .catch(done)
    //   })

    it('Entry update test', done => {
        var mock = new MockAdapter(Axios)
        mock.onPut('/content_types/content_type_uid/entries/entry_uid/variants/UID').reply(200, {
                ...variantsUpdateEntryMock
        })
        makeVariantEntry({
            'variants_uid': 'UID',
            'stackHeaders': {...stackHeadersMock}
        }).update().then((entry) => {
            checkEntry(entry)
            done()
        }).catch(done)
    })
    
    // it('Variants Entry fetch test', done => {
    //     var mock = new MockAdapter(Axios)
    //     mock.onGet('/content_types/content_type_uid/entries/entry_uid/variants/UID').reply(200, {
    //             ...variantsEntryMock
    //         })
    //     makeVariantEntry({
    //         variants_uid: 'UID',
    //         stackHeaders: stackHeadersMock
    //       }).fetch().then((entry) => {
    //         checkEntry(entry)
    //         done()
    //     }).catch(done)
    // })
    it('Entry delete test', done => {
        var mock = new MockAdapter(Axios)
        mock.onDelete('/content_types/content_type_uid/entries/entry_uid/variants/UID').reply(200, {
            ...noticeMock
        })
        makeVariantEntry({
            variants_uid: 'UID'
        }).delete().then((entry) => {
            expect(entry.notice).to.be.equal(noticeMock.notice)
            done()
        }).catch(done)
    })
})

function makeVariantEntry(data) {
    return new Variants(Axios, {
        content_type_uid: 'content_type_uid',
        entry_uid: 'entry_uid',
        ...data
    })
}

function checkEntry(entry) {
    checkSystemFields(entry)
    expect(entry.title).to.be.equal('title')
    expect(entry.url).to.be.equal('/url')
    expect(entry.locale).to.be.equal('en-us')
    expect(entry._version).to.be.equal(1)
    expect(entry._in_progress).to.be.equal(false)
}

function checkEntries(entries) {
    checkSystemFields(entries)
    expect(entries.title).to.be.equal('title')
    expect(entries.url).to.be.equal('/url')
    expect(entries.locale).to.be.equal('en-us')
    expect(entries._version).to.be.equal(1)
    expect(entries._in_progress).to.be.equal(false)
}