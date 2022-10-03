import Axios from 'axios'
import sinon from 'sinon'
import { expect } from 'chai'
import http from 'http'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { ConcurrencyQueue } from '../../lib/core/concurrency-queue'
import FormData from 'form-data'
import { createReadStream } from 'fs'
import path from 'path'
import multiparty from 'multiparty'
import { client } from '../../lib/contentstack'
const axios = Axios.create()

let server
var host = 'http://localhost'
var port = 4444

const api = Axios.create({
  baseURL: `${host}:${port}`
})
let concurrencyQueue = new ConcurrencyQueue({ axios: api })

const logHandlerStub = sinon.stub()
const retryConditionStub = sinon.stub()
const retryDelayOptionsStub = sinon.stub()

const wrapPromise = (p, count) => {
  return p.then(
    result => ({ result, success: true }),
    result => ({ result, success: false })
  )
}
const wrapPromiseInArray = (p, count) => {
  const array = []
  for (let i = 0; i < count; i++) {
    array.push(p.then(
      result => ({ result, success: true }),
      result => ({ result, success: false })
    ))
  }
  return array
}
const sequence = (count) => {
  const array = []
  for (let i = 0; i < count; i++) {
    array.push(i)
  }
  return array
}

const reconfigureQueue = (options = {}) => {
  const config = Object.assign({
    retryOnError: true,
    logHandler: logHandlerStub,
    retryCondition: () => {
      return true
    }
  }, options)
  concurrencyQueue.detach()
  concurrencyQueue = new ConcurrencyQueue({ axios: api, config })
}
var returnContent = false
var unauthorized = false
var token = 'Bearer <token_value_new>'
describe('Concurrency queue test', () => {
  before(() => {
    server = http.createServer((req, res) => {
      if (req.url === '/user-session') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ token }))
      } else if (req.url === '/unauthorized') {
        if (req.headers.authorization === token) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ randomInteger: 123 }))
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ errorCode: 401 }))
        }
        unauthorized = !unauthorized
      } else if (req.url === '/timeout') {
        setTimeout(function () {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end()
        }, 1000)
      } else if (req.url === '/fail') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ errorCode: 400 }))
      } else if (req.url === '/ratelimit') {
        res.writeHead(429, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ errorCode: 429 }))
      } else if (req.url === '/assetUpload') {
        var form = new multiparty.Form()
        form.parse(req, function (err, fields, files) {
          if (err) {
            return
          }
          if (returnContent) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ randomInteger: 123 }))
          } else {
            res.writeHead(429, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ errorCode: 429 }))
          }
          returnContent = !returnContent
        })
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ randomInteger: 123 }))
      }
    }).listen(port, function () {

    })
  })

  beforeEach(() => {
    logHandlerStub.resetHistory()
    retryDelayOptionsStub.resetHistory()
    retryConditionStub.resetHistory()
  })

  after(() => {
    if (server) {
      server.close()
      server = null
    }
  })

  it('Refresh Token on 401 with 1000 concurrent request', done => {
    const axios2 = client({
      baseURL: `${host}:${port}`
    })
    const axios = client({
      baseURL: `${host}:${port}`,
      authorization: 'Bearer <token_value>',
      logHandler: logHandlerStub,
      refreshToken: () => {
        return new Promise((resolve, reject) => {
          return axios2.login().then((res) => {
            resolve({ authorization: res.token })
          }).catch((error) => {
            reject(error)
          })
        })
      }
    })
    Promise.all(sequence(1003).map(() => axios.axiosInstance.get('/unauthorized')))
      .then((responses) => {
        return responses.map(r => r.config.headers.authorization)
      })
      .then(objects => {
        objects.forEach((authorization) => {
          expect(authorization).to.be.equal(token)
        })
        expect(logHandlerStub.callCount).to.be.equal(5)
        expect(objects.length).to.be.equal(1003)
        done()
      })
      .catch(done)
  })

  it('Initialize with bad axios instance', done => {
    try {
      new ConcurrencyQueue({ axios: undefined })
      expect.fail('Undefined axios should fail')
    } catch (error) {
      expect(error.message).to.be.equal('Axios instance is not present')
      done()
    }
  })

  it('Initialization with default config test', done => {
    const queue = makeConcurrencyQueue()
    expect(queue.config.maxRequests).to.be.equal(5)
    expect(queue.config.retryLimit).to.be.equal(5)
    expect(queue.config.retryDelay).to.be.equal(300)
    expect(queue.queue.length).to.be.equal(0)
    expect(queue.running.length).to.be.equal(0)
    expect(queue.interceptors.request).to.be.equal(0)
    expect(queue.interceptors.response).to.be.equal(0)
    done()
  })

  it('Initialization with custom config test', done => {
    const queue = makeConcurrencyQueue({ maxRequests: 20, retryLimit: 2, retryDelay: 1000 })
    expect(queue.config.maxRequests).to.be.equal(20)
    expect(queue.config.retryLimit).to.be.equal(2)
    expect(queue.config.retryDelay).to.be.equal(1000)
    expect(queue.queue.length).to.be.equal(0)
    expect(queue.running.length).to.be.equal(0)
    done()
  })

  it('Detach interceptors test', done => {
    const queue = makeConcurrencyQueue({ maxRequests: 20 })
    queue.detach()
    expect(queue.config.maxRequests).to.be.equal(20)
    expect(queue.config.retryLimit).to.be.equal(5)
    expect(queue.config.retryDelay).to.be.equal(300)
    expect(queue.interceptors.request).to.be.equal(null)
    expect(queue.interceptors.response).to.be.equal(null)
    done()
  })

  it('Initialization with custom config negative value test', done => {
    try {
      makeConcurrencyQueue({ maxRequests: -10 })
      expect.fail('Negative concurrency queue should fail')
    } catch (error) {
      expect(error.message).to.be.equal('Concurrency Manager Error: minimum concurrent requests is 1')
      done()
    }
  })

  it('Initialization with custom config retry limit negative value test', done => {
    try {
      makeConcurrencyQueue({ retryLimit: -10 })
      expect.fail('Negative retry limit should fail')
    } catch (error) {
      expect(error.message).to.be.equal('Retry Policy Error: minimum retry limit is 1')
      done()
    }
  })

  it('Initialization with custom config retry delay value test', done => {
    try {
      makeConcurrencyQueue({ retryDelay: 10 })
      expect.fail('Retry delay should be min 300ms')
    } catch (error) {
      expect(error.message).to.be.equal('Retry Policy Error: minimum retry delay for requests is 300')
      done()
    }
  })

  it('Concurrency with 100 passing requests Queue tests', done => {
    Promise.all(sequence(100).map(() => api.get('/testReq')))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(objects.length).to.be.equal(100)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 100 failing requests retry on error false tests', done => {
    Promise.all(sequence(100).map(() => wrapPromise(api.get('/fail'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(objects.length).to.be.equal(100)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 10 timeout requests', done => {
    const client = Axios.create({
      baseURL: `${host}:${port}`
    })
    const concurrency = new ConcurrencyQueue({ axios: client, config: { retryOnError: true, timeout: 250 } })
    client.get('http://localhost:4444/timeout', {
      timeout: 250
    }).then(function (res) {
      expect(res).to.be.equal(null)
      done()
    }).catch(function (err) {
      concurrency.detach()
      expect(err.response.status).to.be.equal(408)
      expect(err.response.statusText).to.be.equal('timeout of 250ms exceeded')
      done()
    }).catch(done)
  })
  it('Concurrency with 10 timeout requests retry', done => {
    retryDelayOptionsStub.returns(5000)
    const client = Axios.create({
      baseURL: `${host}:${port}`
    })
    const concurrency = new ConcurrencyQueue({ axios: client, config: { retryCondition: (error) => {
      if (error.response.status === 408) {
        return true
      }
      return false
    },
    logHandler: logHandlerStub,
    retryDelayOptions: {
      base: retryDelayOptionsStub()
    },
    retryLimit: 2,
    retryOnError: true, timeout: 250 } })
    client.get('http://localhost:4444/timeout', {
      timeout: 250
    }).then(function (res) {
      expect(res).to.be.equal(null)
      done()
    }).catch(function (err) {
      concurrency.detach()
      expect(err.response.status).to.be.equal(408)
      expect(err.response.statusText).to.be.equal('timeout of 250ms exceeded')
      done()
    }).catch(done)
  })

  it('Concurrency with 100 failing requests retry on error with no retry condition tests', done => {
    reconfigureQueue({ retryCondition: (error) => false })
    Promise.all(sequence(100).map(() => wrapPromise(api.get('/fail'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(0)
        expect(objects.length).to.be.equal(100)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 10 failing requests with retry tests', done => {
    reconfigureQueue()
    Promise.all(sequence(10).map(() => wrapPromise(api.get('/fail'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(50)
        expect(objects.length).to.be.equal(10)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 10 rate limit requests Queue tests', done => {
    reconfigureQueue()
    Promise.all(sequence(10).map(() => wrapPromise(api.get('/ratelimit'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(50)
        expect(objects.length).to.be.equal(10)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 10 asset upload with rate limit error', done => {
    reconfigureQueue()
    const fuc = (pathcontent) => {
      return () => {
        const formData = new FormData()
        const uploadStream = createReadStream(path.join(__dirname, '../api/mock/upload.html'))
        formData.append('asset[upload]', uploadStream)
        return formData
      }
    }

    Promise.all(sequence(10).map(() => wrapPromise(api.post('/assetUpload', fuc()))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(10)
        expect(objects.length).to.be.equal(10)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 20 request and 1 rate limit request tests', done => {
    reconfigureQueue()
    Promise.all(
      [
        ...wrapPromiseInArray(api.get('/testReq'), 5),
        ...wrapPromiseInArray(api.get('/ratelimit'), 1),
        ...wrapPromiseInArray(api.get('/testReq'), 15)
      ]
    )
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(5)
        expect(objects.length).to.be.equal(21)
        done()
      })
      .catch(done)
  })

  it('Concurrency with 20 request and 1 rate limit request tests', done => {
    reconfigureQueue({ retryOnError: false })
    Promise.all(sequence(20).map(() => wrapPromise(api.get('/timeout'))))
      .then((responses) => {
        expect.fail('Should not get response')
      })
      .catch(done)
    setTimeout(() => {
      concurrencyQueue.clear()
      expect(concurrencyQueue.queue.length).to.equal(0)
      done()
    }, 1000)
  })

  it('Concurrency retry on custome backoff test', done => {
    reconfigureQueue({
      retryCondition: retryConditionStub,
      retryDelayOptions: {
        customBackoff: retryDelayOptionsStub
      }
    })

    retryConditionStub.returns(true)
    retryDelayOptionsStub.onCall(0).returns(200)
    retryDelayOptionsStub.onCall(1).returns(300)
    retryDelayOptionsStub.onCall(2).returns(-1)
    retryDelayOptionsStub.returns(200)
    Promise.all(sequence(10).map(() => wrapPromise(api.get('/fail'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(45)
        expect(objects.length).to.be.equal(10)
        done()
      })
      .catch(done)
  })

  it('Concurrency retry delay with base request test', done => {
    retryConditionStub.returns(true)
    retryDelayOptionsStub.returns(200)

    reconfigureQueue({
      retryCondition: retryConditionStub,
      retryDelayOptions: {
        base: retryDelayOptionsStub()
      }
    })

    Promise.all(sequence(10).map(() => wrapPromise(api.get('/fail'))))
      .then((responses) => {
        return responses.map(r => r.data)
      })
      .then(objects => {
        expect(logHandlerStub.callCount).to.be.equal(50)
        expect(objects.length).to.be.equal(10)
        done()
      })
      .catch(done)
  })

  it('Concurrency update authorization to not pass authtoken', done => {
    api.get('/fail', { headers: { authorization: 'authorization' } })
      .then((response) => {
        expect(response).to.equal(undefined)
        done()
      })
      .catch((error) => {
        expect(error.config.headers.authtoken).to.equal(undefined)
        expect(error.config.headers.authorization).to.equal('authorization')
        done()
      })
      .catch(done)
  })

  it('Request to fail with no response', done => {
    reconfigureQueue()
    const mock = new MockAdapter(api)
    mock.onGet('/netError').networkError()
    api.get('/netError')
      .then((response) => {
        expect(response).to.equal(undefined)
        done()
      })
      .catch((error) => {
        expect(error.esponse).to.equal(undefined)
        done()
      })
      .catch(done)
  })
})

function makeConcurrencyQueue (config) {
  return new ConcurrencyQueue({ axios, config })
}
