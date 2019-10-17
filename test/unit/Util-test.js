import getUserAgent, { __RewireAPI__ as getUserAgentRewireApi } from '../../lib/core/Util.js'
import { expect } from 'chai'
import { describe, it } from 'mocha'
const headerRegEx = /(app|sdk|platform|integration|os) \S+(\/\d+.\d+.\d+(-[\w\d-]+)?)?;/igm

describe('Get User Agent', () => {
  it('Node user agent', done => {
    const userAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(userAgent.match(headerRegEx).length).to.be.equal(5)
    expect(userAgent.indexOf('platform node.js/')).to.not.equal(-1)
    done()
  })

  it('Browser user agent', done => {
    getUserAgentRewireApi.__Rewire__('isNode', () => {
      return false
    })
    getUserAgentRewireApi.__Rewire__('isReactNative', () => false)
    global.window = {
      navigator: {
        platform: 'MacIntel'
      }
    }
    const userAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(userAgent.match(headerRegEx).length).to.be.equal(5)
    expect(userAgent.indexOf('platform browser')).to.not.equal(-1)
    expect(userAgent.indexOf('os macOS;')).to.not.equal(-1)
    done()

    getUserAgentRewireApi.__ResetDependency__('isNode')
    getUserAgentRewireApi.__ResetDependency__('isReactNative')
    getUserAgentRewireApi.__ResetDependency__('window')
  })

  it('Fail User agent', done => {
    getUserAgentRewireApi.__Rewire__('isNode', () => {
      return false
    })
    getUserAgentRewireApi.__Rewire__('isReactNative', () => false)
    global.window = {}

    const userAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')

    expect(userAgent.match(headerRegEx).length).to.be.equal(3)
    expect(userAgent.indexOf('platform browser')).to.equal(-1)
    expect(userAgent.indexOf('os macOS;')).to.equal(-1)
    done()

    getUserAgentRewireApi.__ResetDependency__('isNode')
    getUserAgentRewireApi.__ResetDependency__('isReactNative')
    getUserAgentRewireApi.__ResetDependency__('window')
  })

  it('ReactNative user agent', done => {
    getUserAgentRewireApi.__Rewire__('isNode', () => {
      return false
    })
    getUserAgentRewireApi.__Rewire__('isReactNative', () => true)
    global.window = {
      navigator: {
        product: 'ReactNative'
      }
    }

    const userAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')

    expect(userAgent.match(headerRegEx).length).to.be.equal(4)
    expect(userAgent.indexOf('platform ReactNative')).to.not.equal(-1)
    expect(userAgent.indexOf('os macOS;')).to.equal(-1)
    done()

    getUserAgentRewireApi.__ResetDependency__('isNode')
    getUserAgentRewireApi.__ResetDependency__('isReactNative')
    getUserAgentRewireApi.__ResetDependency__('window')
  })

  it('ReactNative ios user agent', done => {
    getUserAgentRewireApi.__Rewire__('isNode', () => {
      return false
    })
    getUserAgentRewireApi.__Rewire__('isReactNative', () => true)
    global.window = {
      navigator: {
        product: 'ReactNative',
        platform: 'iPhone'
      }
    }

    const userAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1', 'SampleFeature/0.1')

    expect(userAgent.match(headerRegEx).length).to.be.equal(5)
    expect(userAgent.indexOf('platform ReactNative')).to.not.equal(-1)
    expect(userAgent.indexOf('os macOS;')).to.equal(-1)
    done()
    global.window = {}
    getUserAgentRewireApi.__ResetDependency__('isNode')
    getUserAgentRewireApi.__ResetDependency__('isReactNative')
    getUserAgentRewireApi.__ResetDependency__('window')
  })
})
