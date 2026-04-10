import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Stack } from '../../lib/stack/index'
import Query from '../../lib/query'
import { EntryCollection } from '../../lib/stack/contentType/entry'
import { AuditLog } from '../../lib/stack/auditlog'
import { Webhook } from '../../lib/stack/webhook'
import { bindModuleHeaders, bindHeaderTarget } from '../../lib/core/moduleHeaderSupport.js'
import { stackHeadersMock, entryMock } from './mock/objects'

describe('Module header injection (addHeader / addHeaderDict / removeHeader)', () => {
  it('Stack addHeader mutates shared stackHeaders visible on child modules', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY' } })
    stack.addHeader('api_version', '3.2')
    expect(stack.stackHeaders.api_version).to.equal('3.2')
    const ct = stack.contentType()
    expect(ct.stackHeaders).to.equal(stack.stackHeaders)
    expect(ct.stackHeaders.api_version).to.equal('3.2')
    done()
  })

  it('Stack addHeaderDict merges into stackHeaders and preserves api_key and branch', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY', branch_uid: 'dev_branch' } })
    stack.addHeaderDict({ api_version: '3.2', custom: 'x' })
    expect(stack.stackHeaders.api_key).to.equal('MY_KEY')
    expect(stack.stackHeaders.branch).to.equal('dev_branch')
    expect(stack.stackHeaders.api_version).to.equal('3.2')
    expect(stack.stackHeaders.custom).to.equal('x')
    done()
  })

  it('Resource addHeader isolates headers from sibling instances (copy-on-write)', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY' } })
    const a = stack.asset()
    const b = stack.asset()
    expect(a.stackHeaders).to.equal(b.stackHeaders)
    a.addHeader('x_module', 'only_a')
    expect(a.stackHeaders.x_module).to.equal('only_a')
    expect(b.stackHeaders.x_module).to.be.undefined
    done()
  })

  it('Resource addHeaderDict does not mutate stack or sibling module headers', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY' } })
    const w = stack.webhook()
    w.addHeaderDict({ branch: 'dev', api_version: '3.1' })
    expect(stack.stackHeaders.branch).to.be.undefined
    expect(stack.stackHeaders.api_version).to.be.undefined
    const other = stack.webhook()
    expect(other.stackHeaders.branch).to.be.undefined
    expect(other.stackHeaders.api_version).to.be.undefined
    expect(w.stackHeaders.branch).to.equal('dev')
    expect(w.stackHeaders.api_version).to.equal('3.1')
    done()
  })

  it('Stack addHeader ignores null and undefined keys', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    const before = { ...stack.stackHeaders }
    stack.addHeader(null, 'v')
    stack.addHeader(undefined, 'v')
    expect(stack.stackHeaders).to.deep.equal(before)
    done()
  })

  it('Resource addHeader ignores null key', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    const asset = stack.asset()
    asset.addHeader(null, 'v')
    expect(asset.stackHeaders).to.deep.equal(stack.stackHeaders)
    done()
  })

  it('Stack without api_key can use addHeader to initialize stackHeaders', (done) => {
    const stack = new Stack(Axios, { organization_uid: 'org' })
    expect(stack.stackHeaders).to.be.undefined
    stack.addHeader('custom_header', '1')
    expect(stack.stackHeaders).to.deep.equal({ custom_header: '1' })
    done()
  })

  it('addHeader and addHeaderDict return instance for chaining', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    expect(stack.addHeader('a', 1)).to.equal(stack)
    const asset = stack.asset()
    expect(asset.addHeaderDict({ b: 2 })).to.equal(asset)
    done()
  })

  it('Query find sends headers from addHeader and addHeaderDict', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/query-entries').reply(200, { entries: [entryMock] })
    const q = Query(
      Axios,
      '/query-entries',
      {},
      { ...stackHeadersMock },
      EntryCollection
    )
    q.addHeader('branch', 'release').addHeaderDict({ api_version: '3.2' })
    q.find()
      .then(() => {
        expect(mock.history.get.length).to.be.at.least(1)
        const req = mock.history.get[0]
        expect(req.headers.branch).to.equal('release')
        expect(req.headers.api_version).to.equal('3.2')
        expect(req.headers.api_key).to.equal(stackHeadersMock.api_key)
        done()
      })
      .catch(done)
  })

  it('Query with no initial stackHeaders supports addHeader on empty header map', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/things').reply(200, { entries: [] })
    const q = Query(Axios, '/things', null, null, EntryCollection)
    q.addHeader('api_key', 'key_from_query_only')
    q.find()
      .then(() => {
        const req = mock.history.get[0]
        expect(req.headers.api_key).to.equal('key_from_query_only')
        done()
      })
      .catch(done)
  })

  it('AuditLog fetch includes injected headers in the request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/audit-logs/UID').reply(200, { logs: { uid: 'UID' } })
    const log = new AuditLog(Axios, {
      logs: { uid: 'UID' },
      stackHeaders: { ...stackHeadersMock }
    })
    log.addHeader('branch', 'staging')
    log.fetch()
      .then(() => {
        const req = mock.history.get[0]
        expect(req.headers.branch).to.equal('staging')
        expect(req.headers.api_key).to.equal(stackHeadersMock.api_key)
        done()
      })
      .catch(done)
  })

  it('Webhook fetchAll includes injected headers in the request', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/webhooks').reply(200, { webhooks: [] })
    const w = new Webhook(Axios, { stackHeaders: { ...stackHeadersMock } })
    w.addHeader('api_version', '3.2')
    w.fetchAll()
      .then(() => {
        const req = mock.history.get[0]
        expect(req.headers.api_version).to.equal('3.2')
        expect(req.headers.api_key).to.equal(stackHeadersMock.api_key)
        done()
      })
      .catch(done)
  })

  it('bindHeaderTarget mutates the header map from getHeaderMap', (done) => {
    const headers = { a: 1 }
    const target = {}
    bindHeaderTarget(target, () => headers)
    target.addHeader('b', 2).addHeaderDict({ c: 3 })
    expect(headers).to.deep.equal({ a: 1, b: 2, c: 3 })
    expect(target.addHeader(null, 'x')).to.equal(target)
    expect(headers).to.deep.equal({ a: 1, b: 2, c: 3 })
    done()
  })

  it('bindModuleHeaders without ownsHeadersInline clones before first mutation', (done) => {
    const shared = { api_key: 'k' }
    const mod = { stackHeaders: shared }
    bindModuleHeaders(mod)
    mod.addHeader('z', 1)
    expect(mod.stackHeaders.z).to.equal(1)
    expect(shared.z).to.be.undefined
    done()
  })

  it('Stack removeHeader deletes from shared stackHeaders for all child modules', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY' } })
    stack.addHeader('api_version', '3.2')
    stack.removeHeader('api_version')
    expect(stack.stackHeaders.api_version).to.be.undefined
    const ct = stack.contentType()
    expect(ct.stackHeaders).to.equal(stack.stackHeaders)
    expect(ct.stackHeaders.api_version).to.be.undefined
    done()
  })

  it('Resource removeHeader only affects that instance when removing inherited key', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'MY_KEY', branch_uid: 'main' } })
    const a = stack.asset()
    const b = stack.asset()
    a.removeHeader('branch')
    expect(a.stackHeaders.branch).to.be.undefined
    expect(b.stackHeaders.branch).to.equal('main')
    expect(stack.stackHeaders.branch).to.equal('main')
    done()
  })

  it('Resource removeHeader after addHeader drops only that header', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    const w = stack.webhook()
    w.addHeaderDict({ x: '1', y: '2' })
    w.removeHeader('x')
    expect(w.stackHeaders.x).to.be.undefined
    expect(w.stackHeaders.y).to.equal('2')
    expect(w.stackHeaders.api_key).to.equal('K')
    done()
  })

  it('Resource removeHeader for missing key does not force copy-on-write', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    const a = stack.asset()
    const b = stack.asset()
    a.removeHeader('nonexistent_key')
    expect(a.stackHeaders).to.equal(b.stackHeaders)
    done()
  })

  it('Stack and resource removeHeader ignore null key', (done) => {
    const stack = new Stack(Axios, { stack: { api_key: 'K' } })
    const before = { ...stack.stackHeaders }
    stack.removeHeader(null)
    expect(stack.stackHeaders).to.deep.equal(before)
    const asset = stack.asset()
    asset.removeHeader(undefined)
    expect(asset.stackHeaders).to.deep.equal(stack.stackHeaders)
    done()
  })

  it('Query find omits header after removeHeader', (done) => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/q').reply(200, { entries: [] })
    const q = Query(Axios, '/q', {}, { ...stackHeadersMock, branch: 'dev' }, EntryCollection)
    q.removeHeader('branch')
    q.find()
      .then(() => {
        const req = mock.history.get[0]
        expect(req.headers.branch).to.be.undefined
        expect(req.headers.api_key).to.equal(stackHeadersMock.api_key)
        done()
      })
      .catch(done)
  })

  it('bindHeaderTarget removeHeader deletes key', (done) => {
    const headers = { a: 1, b: 2 }
    const target = {}
    bindHeaderTarget(target, () => headers)
    target.removeHeader('a')
    expect(headers).to.deep.equal({ b: 2 })
    expect(target.removeHeader(null)).to.equal(target)
    done()
  })
})
