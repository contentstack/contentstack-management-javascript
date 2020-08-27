import contentstckRetry from '../../lib/core/contentstack-retry'
import axios from 'axios'
import sinon from 'sinon'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import httpAdapter from 'axios/lib/adapters/http'

var host = 'http://localhost/'
const logHandlerStub = sinon.stub()
var mock = new MockAdapter(axios)

function setup (options = {}) {
  const client = axios.create(Object.assign({
    logHandler: logHandlerStub,
    retryOnError: true
  }, options))
  contentstckRetry(client, {
    logHandler: logHandlerStub,
    retryOnError: true
  }, options.retryLimit)
  return { client }
}
function setupNoRetry () {
  const client = axios.create(Object.assign({
    logHandler: logHandlerStub,
    retryOnError: true
  }))
  contentstckRetry(client, {
    logHandler: logHandlerStub,
    retryOnError: false
  })
  return { client }
}
describe('Contentstack retry network call', () => {
  beforeEach(() => {
    host = 'http://localhost/'
    axios.defaults.host = host
    axios.defaults.adapter = httpAdapter
  })

  it('Contentstack retry on 429 rate limit', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/user').replyOnce(429, 'retry on 429')
    mock.onGet('/user').replyOnce(200, 'test data')
    client.get('/user')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('Contentstack retry on network error', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/netError').networkError()
    mock.onGet('/netError').replyOnce(200, 'test data')
    client.get('/netError')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('Contentstack retry on network error With Authorization', done => {
    const { client } = setup({ headers: { authorization: 'auth' } })
    mock = new MockAdapter(client)
    mock.onGet('/netError').networkError()
    mock.onGet('/netError').replyOnce(200, 'test data')
    client.get('/netError')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
  it('Contentstack retry on error', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/netErrord').replyOnce(400, 'test errro')
    mock.onGet('/netErrord').replyOnce(200, 'test data')
    client.get('/netErrord')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('Contentstack retry on network error max time', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(429, 'retry on 429')
    mock.onGet('/network-error').replyOnce(200, 'test data')
    client.get('/network-error')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('Contentstack retry on network error', done => {
    const { client } = setupNoRetry()
    mock = new MockAdapter(client)
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    client.get('/testnoretry')
      .then((response) => {
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})
