import { expect } from 'chai'
import error from '../../lib/core/contentstackError'
import { errorMock } from './mock/objects'
import { describe, it } from 'mocha'
import cloneDeep from 'lodash/cloneDeep'

describe('Contentstack error test', () => {
  it('Throw error with details', done => {
    try {
      error(errorMock)
    } catch (err) {
      const jsonMessage = err
      expect(jsonMessage.status).to.be.equal(404)
      expect(jsonMessage.statusText).to.be.equal('Not Found')
      expect(jsonMessage.request.url).to.be.equal('requesturl')
      done()
    }
  })
  it('Throw error', done => {
    try {
      error({})
    } catch (err) {
      expect(err).to.not.equal(null)
      done()
    }
  })

  it('Throw error with additional details', done => {
    var errorObj = cloneDeep(errorMock)
    errorObj.response.data = {
      error_message: 'error message in detail',
      error_code: 110,
      errors: {
        stack: 'is not define'
      }
    }

    try {
      error(errorObj)
    } catch (err) {
      const jsonMessage = err
      expect(jsonMessage.status).to.be.equal(404)
      expect(jsonMessage.statusText).to.be.equal('Not Found')
      expect(jsonMessage.request.url).to.be.equal('requesturl')
      expect(jsonMessage.errorMessage).to.be.equal('error message in detail')
      expect(jsonMessage.errorCode).to.be.equal(110)
      expect(jsonMessage.errors.stack).to.be.equal('is not define')
      done()
    }
  })

  it('Throw error with Config details', done => {
    var errorObj = cloneDeep(errorMock)
    errorObj.config.headers = {
      authtoken: 'abjcomdllsdn'
    }

    errorObj.response.data = {}

    try {
      error(errorObj)
    } catch (err) {
      const jsonMessage = err
      expect(jsonMessage.status).to.be.equal(404)
      expect(jsonMessage.statusText).to.be.equal('Not Found')
      expect(jsonMessage.request.url).to.be.equal('requesturl')
      expect(jsonMessage.request.headers.authtoken).to.be.equal('...llsdn')
      expect(jsonMessage.errorMessage).to.be.equal('')
      expect(jsonMessage.errorCode).to.be.equal(0)
      done()
    }
  })

  it('Throw error with Config details', done => {
    var errorObj = cloneDeep(errorMock)
    errorObj.config.headers = {
      authorization: 'abjcomdllsdn'
    }

    errorObj.response.data = {}

    try {
      error(errorObj)
    } catch (err) {
      const jsonMessage = err
      expect(jsonMessage.status).to.be.equal(404)
      expect(jsonMessage.statusText).to.be.equal('Not Found')
      expect(jsonMessage.request.url).to.be.equal('requesturl')
      expect(jsonMessage.request.headers.authorization).to.be.equal('...llsdn')
      expect(jsonMessage.errorMessage).to.be.equal('')
      expect(jsonMessage.errorCode).to.be.equal(0)
      done()
    }
  })
})
