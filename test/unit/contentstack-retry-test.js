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
const retryDelayOptionsStub = sinon.stub()
const retryConditionStub = sinon.stub()

function setup (options = {}) {
  const defaultOption = Object.assign({
    logHandler: logHandlerStub,
    retryOnError: true,
    retryCondition: (error) => {
      if (error.response && error.response.status === 429) {
        return true
      }
      return false
    }
  }, options)
  const client = axios.create(defaultOption)
  contentstckRetry(client, defaultOption, options.retryLimit)
  return { client }
}
function setupNoRetry () {
  const client = axios.create(Object.assign({
    logHandler: logHandlerStub,
    retryOnError: false
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
    logHandlerStub.resetHistory()
    retryDelayOptionsStub.resetHistory()
    retryConditionStub.resetHistory()
  })

  it('Contentstack retry on Axios timeout', done => {
      const client = axios.create({})
      contentstckRetry(client, {timeout: 250})
      client.get('http://localhost:4444/', {
        timeout: 250
      }).then(function (res) {
        expect(success).to.be.equal(null)
        done();
      }).catch(function (err) {
        expect(err.response.status).to.be.equal(408)
        expect(err.response.statusText).to.be.equal('timeout of 250ms exceeded')
        done();
      }).catch(done);
  })

  it('Contentstack retry on 429 rate limit', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/user').replyOnce(429, 'retry on 429')
    mock.onGet('/user').replyOnce(200, 'test data')
    client.get('/user')
      .then((response) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack retry on network error', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/netError').networkError()
    mock.onGet('/netError').replyOnce(200, 'test data')
    client.get('/netError')
      .then((response) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack retry on network error With Authorization', done => {
    const { client } = setup({ headers: { authorization: 'auth' } })
    mock = new MockAdapter(client)
    mock.onGet('/netError').networkError()
    mock.onGet('/netError').replyOnce(200, 'test data')
    client.get('/netError')
      .then((response) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })
  it('Contentstack no retry on error', done => {
    const { client } = setup()
    mock = new MockAdapter(client)
    mock.onGet('/netErrord').replyOnce(400, 'test errro')
    mock.onGet('/netErrord').replyOnce(200, 'test data')
    client.get('/netErrord')
      .then((response) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(response.data).to.be.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack retry on network error with limit', done => {
    const { client } = setup({ retryLimit: 2 })
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
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(2)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
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
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(5)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack no retry on network error', done => {
    const { client } = setupNoRetry()
    mock = new MockAdapter(client)
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    client.get('/testnoretry')
      .then((response) => {
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack no retry on custome backoff with no retry on 402', done => {
    retryConditionStub.returns(true)
    retryDelayOptionsStub.onCall(0).returns(200)
    retryDelayOptionsStub.onCall(1).returns(300)
    retryDelayOptionsStub.onCall(2).returns(-1)

    const { client } = setup({
      retryCondition: retryConditionStub,
      retryDelayOptions: {
        customBackoff: retryDelayOptionsStub
      }
    })
    mock = new MockAdapter(client)
    mock.onGet('/testnoretry').replyOnce(400, 'test error result')
    mock.onGet('/testnoretry').replyOnce(422, 'test error result')
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    client.get('/testnoretry')
      .then((response) => {
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(2)
        expect(retryDelayOptionsStub.callCount).to.be.equal(3)
        expect(retryConditionStub.callCount).to.be.equal(3)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack no retry delay with base request', done => {
    retryConditionStub.returns(true)
    retryDelayOptionsStub.returns(200)
    const { client } = setup({
      retryCondition: retryConditionStub,
      retryDelayOptions: {
        base: retryDelayOptionsStub()
      }
    })
    mock = new MockAdapter(client)
    mock.onGet('/testnoretry').replyOnce(400, 'test error result')
    mock.onGet('/testnoretry').replyOnce(422, 'test error result')
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    client.get('/testnoretry')
      .then((response) => {
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(3)
        expect(retryConditionStub.callCount).to.be.equal(3)
        expect(retryDelayOptionsStub.callCount).to.be.equal(1)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Contentstack no retry Condition request', done => {
    retryConditionStub.onCall(0).returns(true)
    retryConditionStub.onCall(1).returns(false)

    const { client } = setup({
      retryCondition: retryConditionStub
    })
    mock = new MockAdapter(client)
    mock.onGet('/testnoretry').replyOnce(400, 'test error result')
    mock.onGet('/testnoretry').replyOnce(422, 'test error result')
    mock.onGet('/testnoretry').replyOnce(402, 'test error result')
    mock.onGet('/testnoretry').replyOnce(200, 'test data')
    client.get('/testnoretry')
      .then((response) => {
        expect(response.data).to.not.equal('test data')
        done()
      })
      .catch((error) => {
        expect(logHandlerStub.callCount).to.be.equal(1)
        expect(retryConditionStub.callCount).to.be.equal(2)
        expect(error).to.not.equal(null)
        done()
      })
      .catch(done)
  })
})
