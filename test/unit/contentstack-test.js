import { client, __RewireAPI__ as createClientRewireApi } from '../../lib/contentstack.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import packages from '../../package.json'
import sinon from 'sinon'
const SDK = `contentstack-management-javascript/${packages.version}`

describe('Contentstack HTTP Client', () => {
  it('Contentstack Http Client Object successful', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    var clients = client()
    expect(clients).to.not.equal(null, 'Contentstack Client should not null')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client X-User-Agent Header', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client()
    expect(createHttpClientStub.args[0][0].defaultHostName).to.be.equal('api.contentstack.io', 'Default host name not match')
    expect(createHttpClientStub.args[0][0].headers['X-User-Agent']).to.be.equal(SDK, 'Default host name not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client Authtoken', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client({ authtoken: 'token' })
    expect(createHttpClientStub.args[0][0].authtoken).to.be.equal('token', 'Authtoken not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client Default Host', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client()
    expect(createHttpClientStub.args[0][0].defaultHostName).to.be.equal('api.contentstack.io', 'Default host name not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client Default Host Custom', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client({ defaultHostName: 'contentstack.com' })
    expect(createHttpClientStub.args[0][0].defaultHostName).to.be.equal('contentstack.com', 'Default host name not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client User-Agent Header', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client()
    const headerParts = createHttpClientStub.args[0][0].headers['User-Agent'].split('; ')
    expect(headerParts[0]).to.be.match(/^sdk contentstack-management-javascript\/.+/, 'User agent sdk does not match')
    expect(headerParts[1]).to.be.match(/^platform (.+\/.+|browser)/, 'User agent platform does not match')
    expect(headerParts[2]).to.be.match(/^os .+/, 'User agent os does not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })

  it('Contentstack Http Client User-Agent Header Custom', done => {
    createClientRewireApi.__Rewire__('client', { create: sinon.stub() })
    const createHttpClientStub = sinon.stub()
    createClientRewireApi.__Rewire__('httpClient', createHttpClientStub)
    createClientRewireApi.__Rewire__('contentstackClient', sinon.stub().returns({}))
    client({ application: 'myApplication/1.0.0', integration: 'myIntegration/1.2.0', feature: 'feature' })
    const headerParts = createHttpClientStub.args[0][0].headers['User-Agent'].split('; ')
    expect(headerParts[0]).to.be.equal('app myApplication/1.0.0', 'User agent app does not match')
    expect(headerParts[1]).to.be.equal('integration myIntegration/1.2.0', 'User agent integration does not match')
    expect(headerParts[2]).to.be.equal('feature feature', 'User agent feature does not match')
    expect(headerParts[3]).to.be.match(/^sdk contentstack-management-javascript\/.+/, 'User agent sdk does not match')
    createClientRewireApi.__ResetDependency__('httpClient')
    createClientRewireApi.__ResetDependency__('contentstackClient')
    done()
  })
})
