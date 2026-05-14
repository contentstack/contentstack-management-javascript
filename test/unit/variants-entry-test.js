import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import {
  Variants,
  VariantsCollection
} from '../../lib/stack/contentType/entry/variants/'
import { Entry } from '../../lib/stack/contentType/entry/'
import {
  checkSystemFields,
  varinatsEntryMock,
  variantEntryVersion
  , systemUidMock, noticeMock } from './mock/objects'

describe('Contentstack Variants entry test', () => {
  it('Variants entry test without uid', (done) => {
    const entry = makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'UID'
    })
    expect(entry.urlPath).to.be.equal(
      '/content_types/content_type_uid/entries/UID/variants'
    )
    expect(entry.stackHeaders).to.be.equal(undefined)
    expect(entry.update).to.be.equal(undefined)
    expect(entry.delete).to.be.equal(undefined)
    expect(entry.fetch).to.be.equal(undefined)
    expect(entry.query).to.not.equal(undefined)
    done()
  })

  it('Variants entry test with uid', (done) => {
    const entry = makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'UID'
    })
    expect(entry.urlPath).to.be.equal(
      `/content_types/content_type_uid/entries/UID/variants`
    )
    done()
  })

  it('Variants entry Collection test with blank data', (done) => {
    const entries = new VariantsCollection(Axios, {})
    expect(entries.length).to.be.equal(0)
    done()
  })

  it('Variants entry Collection test with data', (done) => {
    const entries = new VariantsCollection(Axios, {
      entries: [varinatsEntryMock]
    })
    expect(entries.length).to.be.equal(1)
    checkEntry(entries[0].variants)
    done()
  })

  it('Variants entry Query test', (done) => {
    var mock = new MockAdapter(Axios)
    mock
      .onGet('/content_types/content_type_uid/entries/UID/variants')
      .reply(200, {
        entries: [varinatsEntryMock]
      })
    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'UID'
    })
      .query()
      .find()
      .then((entry) => {
        checkEntry(entry.items[0].variants)
        done()
      })
      .catch(done)
  })

  it('Variants entry fetch test', (done) => {
    var mock = new MockAdapter(Axios)
    mock
      .onGet(
        '/content_types/content_type_uid/entries/UID/variants/variants_uid'
      )
      .reply(200, {
        entry: {
          ...varinatsEntryMock
        }
      })
    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'UID',
      variants_uid: 'variants_uid'
    })
      .fetch()
      .then((entry) => {
        checkEntry(entry.entry)
        done()
      })
      .catch(done)
  })
  it('Variants entry version test', (done) => {
    var mock = new MockAdapter(Axios)
    mock
      .onGet(
        '/content_types/content_type_uid/entries/UID/variants/variants_uid/versions'
      )
      .reply(200, {
        ...variantEntryVersion
      })
    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'UID',
      variants_uid: 'variants_uid'
    })
      .versions()
      .then((entry) => {
        expect(entry.versions.length).to.be.equal(3)
        done()
      })
      .catch(done)
  })

  it('Entry publish test', (done) => {
    var mock = new MockAdapter(Axios)
    const publishVariantEntryFirst = {
      entry: {
        environments: ['development'],
        locales: ['en-us'],
        variants: [
          {
            uid: 'variants_uid',
            version: 1
          }
        ],
        variant_rules: {
          publish_latest_base: false,
          publish_latest_base_conditionally: true
        }
      },
      locale: 'en-us',
      version: 1
    }
    mock
      .onPost('/content_types/content_type_uid/entries/UID/publish')
      .reply(200, {
        ...noticeMock,
        job_id: 'job_id'
      })

    makeEntry({ entry: { ...systemUidMock }, options: { api_version: '3.2' } })
      .publish({
        publishDetails: publishVariantEntryFirst.entry,
        locale: publishVariantEntryFirst.locale
      })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice)
        expect(entry.job_id).to.be.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Entry unpublish test', (done) => {
    var unpublishVariantEntryFirst = {
      entry: {
        environments: ['development'],
        locales: ['en-at'],
        variants: [
          {
            uid: '',
            version: 1
          }
        ],
        variant_rules: {
          publish_latest_base: false,
          publish_latest_base_conditionally: true
        }
      },
      locale: 'en-us',
      version: 1
    }
    var mock = new MockAdapter(Axios)
    mock
      .onPost('/content_types/content_type_uid/entries/UID/unpublish')
      .reply(200, {
        ...noticeMock,
        job_id: 'job_id'
      })
    makeEntry({ entry: { ...systemUidMock }, options: { api_version: '3.2' } })
      .unpublish({
        publishDetails: unpublishVariantEntryFirst.entry,
        locale: unpublishVariantEntryFirst.locale
      })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Variants update test', (done) => {
    var mock = new MockAdapter(Axios)
    const updatedData = {
      entry: {
        title: 'Updated Variant Title',
        url: '/updated-variant-url'
      }
    }
    const variantEntryMock = {
      uid: 'variant_uid',
      title: 'Variant Title',
      content_type: 'content_type_uid',
      locale: 'en-us',
      _version: 1,
      _in_progress: false
    }

    mock
      .onPut(`/content_types/content_type_uid/entries/entry_uid/variants/variant_uid`)
      .reply(200, {
        entry: {
          ...variantEntryMock,
          ...updatedData.entry
        }
      })

    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'entry_uid',
      variants_uid: 'variant_uid'
    })
      .update(updatedData)
      .then((response) => {
        expect(response.entry.title).to.be.equal('Updated Variant Title')
        expect(response.entry.url).to.be.equal('/updated-variant-url')
        done()
      })
      .catch(done)
  })

  it('Variants entry publish posts to entry publish URL with optional headers and params', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/entry_uid/publish').reply((config) => {
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      expect(body.entry).to.be.an('object')
      expect(body.entry.variants).to.be.an('array')
      expect(body.entry.variants[0].uid).to.equal('variant_uid')
      expect(body.locale).to.equal('en-us')
      expect(config.headers['x-custom']).to.equal('1')
      expect(config.params.t).to.equal('1')
      return [200, { notice: 'Entry sent for publishing.', job_id: 'jid' }]
    })
    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'entry_uid',
      variants_uid: 'variant_uid',
      stackHeaders: { api_key: 'k' }
    })
      .publish({
        publishDetails: {
          environments: ['development'],
          locales: ['en-us'],
          variants: [{ uid: 'variant_uid', version: 1 }],
          variant_rules: { publish_latest_base_conditionally: true }
        },
        locale: 'en-us',
        headers: { 'x-custom': '1' },
        params: { t: '1' }
      })
      .then((res) => {
        expect(res.notice).to.include('publish')
        done()
      })
      .catch(done)
  })

  it('Variants entry unpublish posts to entry unpublish URL with optional headers and params', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/entry_uid/unpublish').reply((config) => {
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      expect(body.entry).to.be.an('object')
      expect(body.entry.variants).to.be.an('array')
      expect(body.locale).to.equal('en-us')
      expect(config.headers['x-unpub']).to.equal('y')
      expect(config.params.q).to.equal('2')
      return [200, { notice: 'Entry sent for unpublishing.' }]
    })
    makeEntryVariants({
      content_type_uid: 'content_type_uid',
      entry_uid: 'entry_uid',
      variants_uid: 'variant_uid',
      stackHeaders: { api_key: 'k' }
    })
      .unpublish({
        publishDetails: {
          environments: ['development'],
          locales: ['en-us'],
          variants: [{ uid: 'variant_uid', version: 1 }]
        },
        locale: 'en-us',
        headers: { 'x-unpub': 'y' },
        params: { q: '2' }
      })
      .then((res) => {
        expect(res.notice).to.include('unpublish')
        done()
      })
      .catch(done)
  })

  it('Entry variants fetch sends optional branch header', (done) => {
    const mock = new MockAdapter(Axios)
    mock
      .onGet('/content_types/content_type_uid/entries/UID/variants/v1')
      .reply((config) => {
        expect(config.headers.branch).to.equal('feature_branch')
        return [200, {
          entry: {
            ...varinatsEntryMock
          }
        }]
      })
    makeEntry({
      entry: { ...systemUidMock },
      stackHeaders: { api_key: 'test_key' }
    })
      .variants('v1', 'feature_branch')
      .fetch()
      .then((entry) => {
        checkEntry(entry.entry)
        done()
      })
      .catch(done)
  })

  it('Entry variants multiple UIDs and branch on update', (done) => {
    const mock = new MockAdapter(Axios)
    mock
      .onPut('/content_types/content_type_uid/entries/entry_uid/variants/u1,u2')
      .reply((config) => {
        expect(config.headers.branch).to.equal('devel')
        return [200, {
          entry: {
            title: 'ok',
            uid: 'variant_uid',
            content_type: 'content_type_uid',
            locale: 'en-us',
            _version: 1,
            _in_progress: false
          }
        }]
      })
    makeEntry({
      entry: { ...systemUidMock, uid: 'entry_uid' },
      stackHeaders: { api_key: 'k' }
    })
      .variants(['u1', 'u2'], 'devel')
      .update({ entry: { title: 'x' } })
      .then((response) => {
        expect(response.entry.title).to.be.equal('ok')
        done()
      })
      .catch(done)
  })

  it('Entry variants query mode with branch only', (done) => {
    const mock = new MockAdapter(Axios)
    mock
      .onGet('/content_types/content_type_uid/entries/UID/variants')
      .reply((config) => {
        expect(config.headers.branch).to.equal('staging')
        return [200, {
          entries: [varinatsEntryMock]
        }]
      })
    makeEntry({
      entry: { ...systemUidMock },
      stackHeaders: { api_key: 'k' }
    })
      .variants(null, 'staging')
      .query()
      .find()
      .then((collection) => {
        checkEntry(collection.items[0].variants)
        done()
      })
      .catch(done)
  })
})

function makeEntryVariants (data) {
  return new Variants(Axios, { ...data })
}

function makeEntry (data) {
  return new Entry(Axios, { content_type_uid: 'content_type_uid', ...data })
}

function checkEntry (entry) {
  checkSystemFields(entry)
}
