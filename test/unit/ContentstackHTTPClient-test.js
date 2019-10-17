import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import ContentstackHTTPClient from '../../lib/core/ContentstackHTTPClient.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'

const host = 'http://localhost'

axios.defaults.host = host
axios.defaults.adapter = httpAdapter

describe('Contentstack HTTP Client', () => {
  it('Contentstack Http Client Object successful', done => {
    var axiosInstance = ContentstackHTTPClient(axios,
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        defaultHostName: 'defaulthost'
      })

    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://defaulthost:443/v3', 'Api not Equal to \'https://defaulthost:443/v3\'')
    done()
  })

  it('Contentstack Http Client Host', done => {
    var axiosInstance = ContentstackHTTPClient(axios,
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
    var axiosInstance = ContentstackHTTPClient(axios,
      {
        apiKey: 'apiKey',
        accessToken: 'accessToken',
        defaultHostName: 'defaulthost',
        host: 'contentstack.com'
      })

    expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
    expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/v3', 'Api not Equal to \'https://defaulthost:443/v3\'')
    done()
  })

  it('Contentstack Http Client blank API key', done => {
    try {
      var axiosInstance = ContentstackHTTPClient(axios,
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
      var axiosInstance = ContentstackHTTPClient(axios,
        {
          apiKey: 'apiKey',
          defaultHostName: 'defaulthost'
        })
      expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
    } catch (err) {
      expect(err.message).to.be.equal('Expected parameter accessToken')
    }
    done()
  })
})

// describe('suite', () => {
//   it('test', done => {
//     nock(host)
//       .get('/test')
//       .reply(200, 'test data')
//     axios.get('/test').then(response => {
//       expect(response.data).to.be.equal('test data')
//       done()
//     })
//   })
// })
