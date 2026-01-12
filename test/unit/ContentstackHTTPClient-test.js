
import contentstackHTTPClient from '../../lib/core/contentstackHTTPClient.js'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
import MockAdapter from 'axios-mock-adapter'
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
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://defaulthost:443/{api-version}', 'Api not Equal to \'https://defaulthost:443/v3\'')
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
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/{api-version}', 'Api not Equal to \'https://defaulthost:443/v3\'')
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
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/{api-version}', 'Api not Equal to \'https://contentstack.com:443/v3\'')
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
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/stack/{api-version}', 'Api not Equal to \'https://contentstack.com:443/stack/v3\'')
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
      expect(axiosInstance.defaults.paramsSerializer({ query: { title: 'title' }, limit: 1 })).to.be.equal('limit=1&query=%7B%22title%22%3A%22title%22%7D')
    } catch (err) {
      expect(err.message).to.be.equal('Expected parameter accessToken')
    }
    done()
  })

  it('Contentstack retryDelayOption base test', done => {
    const client = contentstackHTTPClient({
      retryDelayOptions: { base: 200 }
    })
    expect(client.defaults.retryDelayOptions).to.not.equal(undefined)
    expect(client.defaults.retryDelayOptions.base).to.be.equal(200)
    done()
  })

  it('Contentstack retryDelayOption customBackoff test', done => {
    const client = contentstackHTTPClient({
      retryDelayOptions: {
        customBackoff: (count, error) => {
          return 300
        }
      }
    })
    expect(client.defaults.retryDelayOptions).to.not.equal(undefined)
    expect(client.defaults.retryDelayOptions.customBackoff(2, undefined)).to.be.equal(300)
    done()
  })

  it('Contentstack default retryCondition test', done => {
    const client = contentstackHTTPClient({})
    expect(client.defaults.retryCondition).to.not.equal(undefined)
    expect(client.defaults.retryCondition({ response: { status: 400 } })).to.be.equal(false)
    expect(client.defaults.retryCondition({ response: { status: 429 } })).to.be.equal(true)
    done()
  })

  it('Contentstack retryCondition test', done => {
    const client = contentstackHTTPClient({
      retryCondition: (error) => {
        if (error) {
          return true
        }
        return false
      }
    })
    expect(client.defaults.retryCondition).to.not.equal(undefined)
    expect(client.defaults.retryCondition(undefined)).to.be.equal(false)
    expect(client.defaults.retryCondition('error')).to.be.equal(true)
    done()
  })
  it('should add x-header-ea in headers when early_access is passed', done => {
    var axiosInstance = contentstackHTTPClient(
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        early_access: 'ea1,ea2'
      })

    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.headers['x-header-ea']).to.be.equal('ea1,ea2')
    done()
  })

  describe('Plugin Support', () => {
    it('should call onRequest hook before request is sent', (done) => {
      const onRequestSpy = sinon.spy()
      const plugin = {
        onRequest: onRequestSpy,
        onResponse: () => {}
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply(200, { data: 'test' })

      axiosInstance.get('/test').then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(onRequestSpy.calledOnce).to.be.true
        // eslint-disable-next-line no-unused-expressions
        expect(onRequestSpy.calledWith(sinon.match.object)).to.be.true
        done()
      }).catch(done)
    })

    it('should use returned request from onRequest hook', (done) => {
      const customHeader = 'custom-value'
      const plugin = {
        onRequest: (request) => {
          // Return modified request
          return {
            ...request,
            headers: {
              ...request.headers,
              'X-Custom-Header': customHeader
            }
          }
        },
        onResponse: () => {}
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply((config) => {
        expect(config.headers['X-Custom-Header']).to.be.equal(customHeader)
        return [200, { data: 'test' }]
      })

      axiosInstance.get('/test').then(() => {
        done()
      }).catch(done)
    })

    it('should call onResponse hook after successful response', (done) => {
      const onResponseSpy = sinon.spy()
      const plugin = {
        onRequest: () => {},
        onResponse: onResponseSpy
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply(200, { data: 'test' })

      axiosInstance.get('/test').then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(onResponseSpy.calledOnce).to.be.true
        // eslint-disable-next-line no-unused-expressions
        expect(onResponseSpy.calledWith(sinon.match.object)).to.be.true
        done()
      }).catch(done)
    })

    it('should call onResponse hook after error response', (done) => {
      const onResponseSpy = sinon.spy()
      const plugin = {
        onRequest: () => {},
        onResponse: (error) => {
          onResponseSpy(error)
          return error
        }
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin],
        retryOnError: false,
        retryLimit: 0,
        retryOnHttpServerError: false, // Disable HTTP server error retries
        maxNetworkRetries: 0 // Disable network retries
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply(500, { error: 'Server Error' })

      axiosInstance.get('/test').catch(() => {
        // Plugin should be called for the error
        // eslint-disable-next-line no-unused-expressions
        expect(onResponseSpy.called).to.be.true
        if (onResponseSpy.called) {
          // eslint-disable-next-line no-unused-expressions
          expect(onResponseSpy.calledWith(sinon.match.object)).to.be.true
        }
        done()
      }).catch((err) => {
        // Ensure done is called even if there's an unexpected error
        done(err)
      })
    })

    it('should use returned response from onResponse hook', (done) => {
      const customData = { modified: true }
      const plugin = {
        onRequest: () => {},
        onResponse: (response) => {
          // Return modified response
          return {
            ...response,
            data: {
              ...response.data,
              customField: customData
            }
          }
        }
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply(200, { data: 'test' })

      axiosInstance.get('/test').then((response) => {
        expect(response.data.customField).to.deep.equal(customData)
        done()
      }).catch(done)
    })

    it('should run multiple plugins in sequence with return values', (done) => {
      const callOrder = []
      let requestHeader1 = null
      let requestHeader2 = null
      const plugin1 = {
        onRequest: (request) => {
          callOrder.push('plugin1-request')
          requestHeader1 = 'plugin1-value'
          return {
            ...request,
            headers: {
              ...request.headers,
              'X-Plugin1': requestHeader1
            }
          }
        },
        onResponse: (response) => {
          callOrder.push('plugin1-response')
          return response
        }
      }
      const plugin2 = {
        onRequest: (request) => {
          callOrder.push('plugin2-request')
          requestHeader2 = 'plugin2-value'
          // Should receive request from plugin1
          expect(request.headers['X-Plugin1']).to.be.equal(requestHeader1)
          return {
            ...request,
            headers: {
              ...request.headers,
              'X-Plugin2': requestHeader2
            }
          }
        },
        onResponse: (response) => {
          callOrder.push('plugin2-response')
          return response
        }
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [plugin1, plugin2]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply((config) => {
        expect(config.headers['X-Plugin1']).to.be.equal(requestHeader1)
        expect(config.headers['X-Plugin2']).to.be.equal(requestHeader2)
        return [200, { data: 'test' }]
      })

      axiosInstance.get('/test').then(() => {
        expect(callOrder).to.deep.equal(['plugin1-request', 'plugin2-request', 'plugin1-response', 'plugin2-response'])
        done()
      }).catch(done)
    })

    it('should skip plugin errors and continue with other plugins', (done) => {
      const logHandlerSpy = sinon.spy()
      const workingPluginSpy = sinon.spy()
      const customHeader = 'working-plugin-header'
      const errorPlugin = {
        onRequest: () => { throw new Error('Plugin error') },
        onResponse: () => { throw new Error('Plugin error') }
      }
      const workingPlugin = {
        onRequest: (request) => {
          workingPluginSpy()
          return {
            ...request,
            headers: {
              ...request.headers,
              'X-Working': customHeader
            }
          }
        },
        onResponse: (response) => {
          workingPluginSpy()
          return response
        }
      }

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [errorPlugin, workingPlugin],
        logHandler: logHandlerSpy
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply((config) => {
        // eslint-disable-next-line no-unused-expressions
        expect(config.headers['X-Working']).to.be.equal(customHeader)
        return [200, { data: 'test' }]
      })

      axiosInstance.get('/test').then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(workingPluginSpy.callCount).to.be.equal(2) // Called for both request and response
        // eslint-disable-next-line no-unused-expressions
        expect(logHandlerSpy.called).to.be.true
        done()
      }).catch(done)
    })

    it('should filter out invalid plugins', (done) => {
      const validPluginSpy = sinon.spy()
      const validPlugin = {
        onRequest: validPluginSpy,
        onResponse: () => {}
      }
      const invalidPlugins = [
        null,
        undefined,
        {},
        { onRequest: () => {} }, // missing onResponse
        { onResponse: () => {} }, // missing onRequest
        { onRequest: 'not-a-function', onResponse: () => {} },
        'not-an-object'
      ]

      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: [validPlugin, ...invalidPlugins]
      })

      const mock = new MockAdapter(axiosInstance)
      mock.onGet('/test').reply(200, { data: 'test' })

      axiosInstance.get('/test').then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(validPluginSpy.calledOnce).to.be.true
        done()
      }).catch(done)
    })

    it('should handle empty plugins array', (done) => {
      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: []
      })

      // Should not throw errors
      // eslint-disable-next-line no-unused-expressions
      expect(axiosInstance).to.not.be.undefined
      done()
    })

    it('should handle undefined plugins', (done) => {
      const axiosInstance = contentstackHTTPClient({
        defaultHostName: 'defaulthost',
        plugins: undefined
      })

      // Should not throw errors
      // eslint-disable-next-line no-unused-expressions
      expect(axiosInstance).to.not.be.undefined
      done()
    })
  })
})
