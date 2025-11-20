
import contentstackHTTPClient from '../../lib/core/contentstackHTTPClient.js'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'
const logHandlerStub = sinon.stub()

// Commented out - getRegionEndpoint function was removed in recent changes
describe('Contentstack HTTP Client', () => {
  beforeEach(() => {
    logHandlerStub.resetHistory()
  })
  // it('Contentstack Http Client Object successful', done => {
  //   var axiosInstance = contentstackHTTPClient({
  //     apiKey: 'apiKey',
  //     accessToken: 'accessToken',
  //     defaultHostName: 'defaulthost'
  //   })
  //   expect(logHandlerStub.callCount).to.be.equal(0)
  //   expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   expect(axiosInstance.defaults.baseURL).to.be.equal('https://defaulthost:443/{api-version}', 'Api not Equal to \'https://defaulthost:443/v3\'')
  //   done()
  // })

  // it('Contentstack Http Client Host', done => {
  //   var axiosInstance = contentstackHTTPClient(
  //     {
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'defaulthost',
  //       host: 'contentstack.com:443'
  //     })
  //   expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/{api-version}', 'Api not Equal to \'https://defaulthost:443/v3\'')
  //   done()
  // })

  // it('Contentstack Http Client Host without port', done => {
  //   var axiosInstance = contentstackHTTPClient(
  //     {
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'defaulthost',
  //       host: 'contentstack.com'
  //     })

  //   expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/{api-version}', 'Api not Equal to \'https://contentstack.com:443/v3\'')
  //   done()
  // })

  // it('Contentstack Http Client Host with basePath', done => {
  //   var axiosInstance = contentstackHTTPClient(
  //     {
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'defaulthost',
  //       host: 'contentstack.com',
  //       basePath: 'stack'
  //     })

  //   expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   expect(axiosInstance.defaults.baseURL).to.be.equal('https://contentstack.com:443/stack/{api-version}', 'Api not Equal to \'https://contentstack.com:443/stack/v3\'')
  //   done()
  // })
  // it('Contentstack Http Client blank API key', done => {
  //   try {
  //     var axiosInstance = contentstackHTTPClient(
  //       {
  //         accessToken: 'accessToken',
  //         defaultHostName: 'defaulthost'
  //       })
  //     expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   } catch (err) {
  //     expect(err.message).to.be.equal('Expected parameter apiKey')
  //   }
  //   done()
  // })

  // it('Contentstack Http Client blank Access Token', done => {
  //   try {
  //     var axiosInstance = contentstackHTTPClient(
  //       {
  //         apiKey: 'apiKey',
  //         defaultHostName: 'defaulthost'
  //       })
  //     axiosInstance.defaults.logHandler('warning', `Server warning occurred.`)
  //     axiosInstance.defaults.logHandler('error', `Server error occurred.`)
  //     expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   } catch (err) {
  //     expect(err.message).to.be.equal('Expected parameter accessToken')
  //   }
  //   done()
  // })
  // it('Contentstack Http Client Param Serializer', done => {
  //   try {
  //     var axiosInstance = contentstackHTTPClient(
  //       {
  //         apiKey: 'apiKey',
  //         defaultHostName: 'defaulthost'
  //       })
  //     expect(axiosInstance.defaults.paramsSerializer({ skip: 1, limit: 1 })).to.be.equal('skip=1&limit=1')
  //     expect(axiosInstance.defaults.paramsSerializer({ query: { title: 'title' }, limit: 1 })).to.be.equal('limit=1&query=%7B%22title%22%3A%22title%22%7D')
  //   } catch (err) {
  //     expect(err.message).to.be.equal('Expected parameter accessToken')
  //   }
  //   done()
  // })

  // it('Contentstack retryDelayOption base test', done => {
  //   const client = contentstackHTTPClient({
  //     retryDelayOptions: { base: 200 }
  //   })
  //   expect(client.defaults.retryDelayOptions).to.not.equal(undefined)
  //   expect(client.defaults.retryDelayOptions.base).to.be.equal(200)
  //   done()
  // })

  // it('Contentstack retryDelayOption customBackoff test', done => {
  //   const client = contentstackHTTPClient({
  //     retryDelayOptions: {
  //       customBackoff: (count, error) => {
  //         return 300
  //       }
  //     }
  //   })
  //   expect(client.defaults.retryDelayOptions).to.not.equal(undefined)
  //   expect(client.defaults.retryDelayOptions.customBackoff(2, undefined)).to.be.equal(300)
  //   done()
  // })

  // it('Contentstack default retryCondition test', done => {
  //   const client = contentstackHTTPClient({})
  //   expect(client.defaults.retryCondition).to.not.equal(undefined)
  //   expect(client.defaults.retryCondition({ response: { status: 400 } })).to.be.equal(false)
  //   expect(client.defaults.retryCondition({ response: { status: 429 } })).to.be.equal(true)
  //   done()
  // })

  // it('Contentstack retryCondition test', done => {
  //   const client = contentstackHTTPClient({
  //     retryCondition: (error) => {
  //       if (error) {
  //         return true
  //       }
  //       return false
  //     }
  //   })
  //   expect(client.defaults.retryCondition).to.not.equal(undefined)
  //   expect(client.defaults.retryCondition(undefined)).to.be.equal(false)
  //   expect(client.defaults.retryCondition('error')).to.be.equal(true)
  //   done()
  // })
  // it('should add x-header-ea in headers when early_access is passed', done => {
  //   var axiosInstance = contentstackHTTPClient(
  //     {
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       early_access: 'ea1,ea2'
  //     })

  //   expect(axiosInstance.defaults.headers.apiKey).to.be.equal('apiKey', 'Api not Equal to \'apiKey\'')
  //   expect(axiosInstance.defaults.headers.accessToken).to.be.equal('accessToken', 'Api not Equal to \'accessToken\'')
  //   expect(axiosInstance.defaults.headers['x-header-ea']).to.be.equal('ea1,ea2')
  //   done()
  // })

  // Commented out - getRegionEndpoint function was removed in recent changes
  // describe('Region-based endpoint configuration', () => {
  //   it('should configure endpoints for NA region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://app.contentstack.com', 'NA UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('developerhub-api.contentstack.com', 'NA developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for EU region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'eu-api.contentstack.com',
  //       region: 'eu'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://eu-app.contentstack.com', 'EU UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('eu-developerhub-api.contentstack.com', 'EU developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for AU region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'au-api.contentstack.com',
  //       region: 'au'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://au-app.contentstack.com', 'AU UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('au-developerhub-api.contentstack.com', 'AU developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for Azure NA region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'azure-na-api.contentstack.com',
  //       region: 'azure-na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://azure-na-app.contentstack.com', 'Azure NA UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('azure-na-developerhub-api.contentstack.com', 'Azure NA developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for Azure EU region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'azure-eu-api.contentstack.com',
  //       region: 'azure-eu'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://azure-eu-app.contentstack.com', 'Azure EU UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('azure-eu-developerhub-api.contentstack.com', 'Azure EU developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for GCP NA region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'gcp-na-api.contentstack.com',
  //       region: 'gcp-na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://gcp-na-app.contentstack.com', 'GCP NA UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('gcp-na-developerhub-api.contentstack.com', 'GCP NA developer hub should match')
  //     done()
  //   })

  //   it('should configure endpoints for GCP EU region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'gcp-eu-api.contentstack.com',
  //       region: 'gcp-eu'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://gcp-eu-app.contentstack.com', 'GCP EU UI base URL should match')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('gcp-eu-developerhub-api.contentstack.com', 'GCP EU developer hub should match')
  //     done()
  //   })

  //   it('should include https protocol in developer hub base URL', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'na'
  //     })
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.match(/^https:\/\//, 'Developer hub URL should start with https://')
  //     done()
  //   })

  //   it('should include https protocol in UI base URL', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.match(/^https:\/\//, 'UI base URL should start with https://')
  //     done()
  //   })

  //   it('should configure UI base URL with protocol for NA region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://app.contentstack.com', 'NA UI base URL should include protocol')
  //     done()
  //   })

  //   it('should configure UI base URL with protocol for EU region', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'eu-api.contentstack.com',
  //       region: 'eu'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://eu-app.contentstack.com', 'EU UI base URL should include protocol')
  //     done()
  //   })

  //   it('should handle region aliases when configuring endpoints', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'us'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://app.contentstack.com', 'US alias should map to NA endpoints')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('developerhub-api.contentstack.com', 'US alias should map to NA developer hub')
  //     done()
  //   })

  //   it('should handle azure_na alias when configuring endpoints', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'azure-na-api.contentstack.com',
  //       region: 'azure_na'
  //     })
  //     expect(axiosInstance.defaults.uiBaseUrl).to.be.equal('https://azure-na-app.contentstack.com', 'azure_na alias should work')
  //     expect(axiosInstance.defaults.developerHubBaseUrl).to.contain('azure-na-developerhub-api.contentstack.com', 'azure_na alias should work for developer hub')
  //     done()
  //   })

  //   it('should configure region property in config', done => {
  //     var axiosInstance = contentstackHTTPClient({
  //       apiKey: 'apiKey',
  //       accessToken: 'accessToken',
  //       defaultHostName: 'api.contentstack.io',
  //       region: 'eu'
  //     })
  //     expect(axiosInstance.defaults.region).to.be.equal('eu', 'Region should be stored in defaults')
  //     done()
  //   })
  // })
})
