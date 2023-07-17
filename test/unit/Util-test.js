import getUserAgent, { __RewireAPI__ as getUserAgentRewireApi, isHost } from '../../lib/core/Util.js'
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
    const macUserAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(macUserAgent.match(headerRegEx).length).to.be.equal(5)
    expect(macUserAgent.indexOf('platform browser')).to.not.equal(-1)
    expect(macUserAgent.indexOf('os macOS;')).to.not.equal(-1)

    global.window.navigator.platform = 'Windows'
    const windowsUserAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(windowsUserAgent.match(headerRegEx).length).to.be.equal(5)
    expect(windowsUserAgent.indexOf('platform browser')).to.not.equal(-1)
    expect(windowsUserAgent.indexOf('os Windows;')).to.not.equal(-1)

    global.window.navigator = { userAgent: 'Android' }
    const androidUserAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(androidUserAgent.match(headerRegEx).length).to.be.equal(5)
    expect(androidUserAgent.indexOf('platform browser')).to.not.equal(-1)
    expect(androidUserAgent.indexOf('os Android;')).to.not.equal(-1)

    global.window.navigator = { platform: 'Linux' }
    const linuxUserAgent = getUserAgent('contentstack-sdk/1.0.0', 'SampleApplication/0.1', 'SampleIntegration/0,1')
    expect(linuxUserAgent.match(headerRegEx).length).to.be.equal(5)
    expect(linuxUserAgent.indexOf('platform browser')).to.not.equal(-1)
    expect(linuxUserAgent.indexOf('os Linux;')).to.not.equal(-1)
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

  it('Contentstack host test', done => {
    expect(isHost('contentstack.io')).to.be.equal(true, 'contentstack.io should be host')
    expect(isHost('contentstack.io:334')).to.be.equal(true, 'contentstack.io:334  should be host')
    expect(isHost('http://contentstack.io')).to.be.equal(false, 'http://contentstack.io should not host')
    expect(isHost('contentstack.io:2Sdrd')).to.be.equal(true, 'contentstack.io:2Sdrd  should be host')
    expect(isHost('contentstack.io:wedsfa2')).to.be.equal(true, 'contentstack.io:wedsfa2 should be host')
    expect(isHost('eu-api.contentstack.com')).to.be.equal(true, 'eu-api.contentstack.com should be host')
    expect(isHost('contentstack.io/path')).to.be.equal(false, 'contentstack.io/path should not host')
    done()
  })
})
