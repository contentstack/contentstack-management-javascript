import { expect } from 'chai'
import sinon from 'sinon'
import {
  getStoredCodeVerifier,
  storeCodeVerifier,
  clearStoredCodeVerifier
} from '../../lib/core/pkceStorage'
import { describe, it, beforeEach, afterEach } from 'mocha'

describe('pkceStorage', () => {
  let sessionStorageStub

  beforeEach(() => {
    sessionStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    }
    global.window = { sessionStorage: sessionStorageStub }
  })

  afterEach(() => {
    delete global.window
  })

  describe('getStoredCodeVerifier', () => {
    it('returns null when not in browser', () => {
      delete global.window
      expect(getStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.equal(null)
    })

    it('returns null when nothing stored', () => {
      sessionStorageStub.getItem.returns(null)
      expect(getStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.equal(null)
    })

    it('returns code_verifier when valid and not expired', () => {
      const stored = JSON.stringify({
        codeVerifier: 'stored_verifier_xyz',
        expiresAt: Date.now() + 600000
      })
      sessionStorageStub.getItem.returns(stored)
      expect(getStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.equal('stored_verifier_xyz')
    })

    it('returns null when stored entry is expired', () => {
      const stored = JSON.stringify({
        codeVerifier: 'expired_verifier',
        expiresAt: Date.now() - 1000
      })
      sessionStorageStub.getItem.returns(stored)
      expect(getStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.equal(null)
    })

    it('returns null when storage throws', () => {
      sessionStorageStub.getItem.throws(new Error('QuotaExceeded'))
      expect(getStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.equal(null)
    })

    it('uses key containing appId, clientId, redirectUri', () => {
      sessionStorageStub.getItem.returns(null)
      getStoredCodeVerifier('myApp', 'myClient', 'https://app.example/cb')
      expect(sessionStorageStub.getItem.calledOnce).to.equal(true)
      const key = sessionStorageStub.getItem.firstCall.args[0]
      expect(key).to.include('contentstack_oauth_pkce')
      expect(key).to.include('myApp')
      expect(key).to.include('myClient')
      expect(key).to.include('https://app.example/cb')
    })
  })

  describe('storeCodeVerifier', () => {
    it('does nothing when not in browser', () => {
      delete global.window
      storeCodeVerifier('appId', 'clientId', 'http://localhost:8184', 'verifier123')
      expect(sessionStorageStub.setItem.called).to.equal(false)
    })

    it('stores codeVerifier and expiresAt in sessionStorage', () => {
      const before = Date.now()
      storeCodeVerifier('appId', 'clientId', 'http://localhost:8184', 'verifier123')
      const after = Date.now()
      expect(sessionStorageStub.setItem.calledOnce).to.equal(true)
      const [key, valueStr] = sessionStorageStub.setItem.firstCall.args
      expect(key).to.include('contentstack_oauth_pkce')
      const value = JSON.parse(valueStr)
      expect(value.codeVerifier).to.equal('verifier123')
      expect(value.expiresAt).to.be.at.least(before + 9 * 60 * 1000)
      expect(value.expiresAt).to.be.at.most(after + 10 * 60 * 1000 + 100)
    })

    it('does not throw when sessionStorage.setItem throws', () => {
      sessionStorageStub.setItem.throws(new Error('QuotaExceeded'))
      expect(() => storeCodeVerifier('appId', 'clientId', 'http://localhost:8184', 'v')).to.not.throw()
    })
  })

  describe('clearStoredCodeVerifier', () => {
    it('does nothing when not in browser', () => {
      delete global.window
      clearStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')
      expect(sessionStorageStub.removeItem.called).to.equal(false)
    })

    it('calls sessionStorage.removeItem with correct key', () => {
      clearStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')
      expect(sessionStorageStub.removeItem.calledOnce).to.equal(true)
      const key = sessionStorageStub.removeItem.firstCall.args[0]
      expect(key).to.include('contentstack_oauth_pkce')
      expect(key).to.include('appId')
      expect(key).to.include('clientId')
    })

    it('does not throw when sessionStorage.removeItem throws', () => {
      sessionStorageStub.removeItem.throws(new Error('SecurityError'))
      expect(() => clearStoredCodeVerifier('appId', 'clientId', 'http://localhost:8184')).to.not.throw()
    })
  })
})
