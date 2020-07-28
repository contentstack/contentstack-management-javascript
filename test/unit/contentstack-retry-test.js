import contentstckRetry from '../../lib/core/contentstack-retry'
import axios from 'axios'
import sinon from 'sinon'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import httpAdapter from 'axios/lib/adapters/http'

const host = 'http://localhost/'
axios.defaults.host = host
axios.defaults.adapter = httpAdapter

const logHandlerStub = sinon.stub()
const mock = new MockAdapter(axios)

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
  it('Contentstack retry on 429 rate limit', done => {
    mock.onGet('/user').replyOnce(429, 'retry on 429')
    mock.onGet('/user').replyOnce(200, 'test data')
    const { client } = setup()
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
    mock.onGet('/netError').networkError()
    mock.onGet('/netError').replyOnce(200, 'test data')
    const { client } = setup()
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
    mock.onGet('/netErrord').replyOnce(400, 'test errro')
    mock.onGet('/netErrord').replyOnce(200, 'test data')
    const { client } = setup()
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
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').networkError()
    mock.onGet('/network-error').replyOnce(200, 'test data')
    const { client } = setup()
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
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    const { client } = setupNoRetry()
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
