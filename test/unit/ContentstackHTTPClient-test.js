
import contentstackHTTPClient from '../../lib/core/contentstackHTTPClient.js'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
const logHandlerStub = sinon.stub()

describe('Contentstack HTTP Client', () => {
  beforeEach(() => {
    logHandlerStub.resetHistory()
  })
  it('Contentstack Http Client Object successful', done => {
    var axiosInstance = contentstackHTTPClient({
      apiKey: 'apiKey',
      accessToken: 'accessToken',
      defaultHostName: 'defaulthost'
    })
    expect(logHandlerStub.callCount).to.be.equal(0)
    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://defaulthost:443/v3', 'Api not Equal to \'https://defaulthost:443/v3\'')
    done()
  })

  it('Contentstack Http Client Host', done => {
    var axiosInstance = contentstackHTTPClient(
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        defaultHostName: 'defaulthost',
        host: 'contentstack.com:443'
      })
    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/v3', 'Api not Equal to \'https://defaulthost:443/v3\'')
    done()
  })

  it('Contentstack Http Client Host without port', done => {
    var axiosInstance = contentstackHTTPClient(
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        defaultHostName: 'defaulthost',
        host: 'contentstack.com'
      })

    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/v3', 'Api not Equal to \'https://contentstack.com:443/v3\'')
    done()
  })

  it('Contentstack Http Client Host with basePath', done => {
    var axiosInstance = contentstackHTTPClient(
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        defaultHostName: 'defaulthost',
        host: 'contentstack.com',
        basePath: 'stack'
      })

    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/stack/v3', 'Api not Equal to \'https://contentstack.com:443/stack/v3\'')
    done()
  })
  it('Contentstack Http Client blank API key', done => {
    try {
      var axiosInstance = contentstackHTTPClient(
        {
          accessToken: 'accessToken',
          defaultHostName: 'defaulthost'
        })
      expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    } catch (err) {
      expect(err.message).to.be.equal('Expected parameter apiKey')
    }
    done()
  })

  it('Contentstack Http Client blank Access Token', done => {
    try {
      var axiosInstance = contentstackHTTPClient(
        {
          apiKey: 'apiKey',
          defaultHostName: 'defaulthost'
        })
      axiosInstance.defaults.logHandler('warning', `Server warning occurred.`)
      axiosInstance.defaults.logHandler('error', `Server error occurred.`)
      expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    } catch (err) {
      expect(err.message).to.be.equal('Expected parameter accessToken')
    }
    done()
  })
  it('Contentstack Http Client Param Serializer', done => {
    try {
      var axiosInstance = contentstackHTTPClient(
        {
          apiKey: 'apiKey',
          defaultHostName: 'defaulthost'
        })
      expect(axiosInstance.defaults.paramsSerializer({ skip: 1, limit: 1 })).to.be.equal('skip=1&limit=1')
      expect(axiosInstance.defaults.paramsSerializer({ query: { title: 'title' }, limit: 1 })).to.be.equal('limit=1&query=%7B%22title%22:%22title%22%7D')
    } catch (err) {
      expect(err.message).to.be.equal('Expected parameter accessToken')
    }
    done()
  })
})
