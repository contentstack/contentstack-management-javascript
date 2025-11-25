import getUserAgent, { __RewireAPI__ as getUserAgentRewireApi, isHost, getRegionEndpoint } from '../../lib/core/Util.js'
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
    expect(isHost('au-api.contentstack.com')).to.be.equal(true, 'au-api.contentstack.com should be host')
    expect(isHost('contentstack.io/path')).to.be.equal(false, 'contentstack.io/path should not host')
    done()
  })

  describe('Custom domain validation', () => {
    it('should validate custom domain hosts', done => {
      expect(isHost('dev11-api.csnonprod.com')).to.be.equal(true, 'dev11-api.csnonprod.com should be valid')
      expect(isHost('custom-domain.com')).to.be.equal(true, 'custom-domain.com should be valid')
      expect(isHost('api.custom-domain.com')).to.be.equal(true, 'api.custom-domain.com should be valid')
      expect(isHost('dev11-api.custom-domain.com')).to.be.equal(true, 'dev11-api.custom-domain.com should be valid')
      done()
    })

    it('should reject invalid custom domain hosts', done => {
      expect(isHost('http://dev11-api.csnonprod.com')).to.be.equal(false, 'should reject URLs with protocol')
      expect(isHost('dev11-api.csnonprod.com/v3')).to.be.equal(false, 'should reject URLs with path')
      expect(isHost('dev11-api.csnonprod.com?test=1')).to.be.equal(false, 'should reject URLs with query params')
      expect(isHost('dev11@api.csnonprod.com')).to.be.equal(false, 'should reject URLs with special chars')
      expect(isHost('127.0.0.1')).to.be.equal(false, 'should reject IP addresses')
      expect(isHost('internal.domain.com')).to.be.equal(false, 'should reject internal domains')
      done()
    })

    it('should handle edge cases correctly', done => {
      expect(isHost('')).to.be.equal(false, 'should reject empty string')
      expect(isHost('.')).to.be.equal(false, 'should reject single dot')
      expect(isHost('.com')).to.be.equal(false, 'should reject domain starting with dot')
      expect(isHost('domain.')).to.be.equal(false, 'should reject domain ending with dot')
      expect(isHost('domain..com')).to.be.equal(false, 'should reject consecutive dots')
      done()
    })

    it('should validate port numbers correctly', done => {
      expect(isHost('dev11-api.csnonprod.com:443')).to.be.equal(true, 'should accept valid port')
      expect(isHost('dev11-api.csnonprod.com:8080')).to.be.equal(true, 'should accept custom port')
      expect(isHost('dev11-api.csnonprod.com:65535')).to.be.equal(true, 'should accept max port')
      expect(isHost('dev11-api.csnonprod.com:0')).to.be.equal(true, 'should accept port 0')
      expect(isHost('dev11-api.csnonprod.com:65536')).to.be.equal(true, 'should handle port overflow')
      expect(isHost('dev11-api.csnonprod.com:abc')).to.be.equal(true, 'should handle non-numeric port')
      done()
    })
  })

  describe('Region Endpoint Retrieval', () => {
    describe('Valid regions with ID', () => {
      it('should return correct endpoint for NA region', done => {
        const endpoint = getRegionEndpoint('na', 'contentManagement')
        expect(endpoint).to.be.equal('api.contentstack.io', 'NA region endpoint should match')
        done()
      })

      it('should return correct endpoint for EU region', done => {
        const endpoint = getRegionEndpoint('eu', 'contentManagement')
        expect(endpoint).to.be.equal('eu-api.contentstack.com', 'EU region endpoint should match')
        done()
      })

      it('should return correct endpoint for AU region', done => {
        const endpoint = getRegionEndpoint('au', 'contentManagement')
        expect(endpoint).to.be.equal('au-api.contentstack.com', 'AU region endpoint should match')
        done()
      })

      it('should return correct endpoint for Azure NA region', done => {
        const endpoint = getRegionEndpoint('azure-na', 'contentManagement')
        expect(endpoint).to.be.equal('azure-na-api.contentstack.com', 'Azure NA region endpoint should match')
        done()
      })

      it('should return correct endpoint for Azure EU region', done => {
        const endpoint = getRegionEndpoint('azure-eu', 'contentManagement')
        expect(endpoint).to.be.equal('azure-eu-api.contentstack.com', 'Azure EU region endpoint should match')
        done()
      })

      it('should return correct endpoint for GCP NA region', done => {
        const endpoint = getRegionEndpoint('gcp-na', 'contentManagement')
        expect(endpoint).to.be.equal('gcp-na-api.contentstack.com', 'GCP NA region endpoint should match')
        done()
      })

      it('should return correct endpoint for GCP EU region', done => {
        const endpoint = getRegionEndpoint('gcp-eu', 'contentManagement')
        expect(endpoint).to.be.equal('gcp-eu-api.contentstack.com', 'GCP EU region endpoint should match')
        done()
      })
    })

    describe('Valid regions with aliases', () => {
      it('should return correct endpoint for US alias', done => {
        const endpoint = getRegionEndpoint('us', 'contentManagement')
        expect(endpoint).to.be.equal('api.contentstack.io', 'US alias should map to NA region')
        done()
      })

      it('should return correct endpoint for aws-na alias', done => {
        const endpoint = getRegionEndpoint('aws-na', 'contentManagement')
        expect(endpoint).to.be.equal('api.contentstack.io', 'aws-na alias should map to NA region')
        done()
      })

      it('should return correct endpoint for aws_na alias', done => {
        const endpoint = getRegionEndpoint('aws_na', 'contentManagement')
        expect(endpoint).to.be.equal('api.contentstack.io', 'aws_na alias should map to NA region')
        done()
      })

      it('should return correct endpoint for aws-eu alias', done => {
        const endpoint = getRegionEndpoint('aws-eu', 'contentManagement')
        expect(endpoint).to.be.equal('eu-api.contentstack.com', 'aws-eu alias should map to EU region')
        done()
      })

      it('should return correct endpoint for azure_na alias', done => {
        const endpoint = getRegionEndpoint('azure_na', 'contentManagement')
        expect(endpoint).to.be.equal('azure-na-api.contentstack.com', 'azure_na alias should map to Azure NA region')
        done()
      })

      it('should return correct endpoint for gcp_na alias', done => {
        const endpoint = getRegionEndpoint('gcp_na', 'contentManagement')
        expect(endpoint).to.be.equal('gcp-na-api.contentstack.com', 'gcp_na alias should map to GCP NA region')
        done()
      })
    })

    describe('Different service endpoints', () => {
      it('should return correct application endpoint for NA region', done => {
        const endpoint = getRegionEndpoint('na', 'application')
        expect(endpoint).to.be.equal('app.contentstack.com', 'NA application endpoint should match')
        done()
      })

      it('should return correct developerHub endpoint for NA region', done => {
        const endpoint = getRegionEndpoint('na', 'developerHub')
        expect(endpoint).to.be.equal('developerhub-api.contentstack.com', 'NA developerHub endpoint should match')
        done()
      })

      it('should return correct contentDelivery endpoint for EU region', done => {
        const endpoint = getRegionEndpoint('eu', 'contentDelivery')
        expect(endpoint).to.be.equal('eu-cdn.contentstack.com', 'EU contentDelivery endpoint should match')
        done()
      })

      it('should return correct auth endpoint for Azure NA region', done => {
        const endpoint = getRegionEndpoint('azure-na', 'auth')
        expect(endpoint).to.be.equal('azure-na-auth-api.contentstack.com', 'Azure NA auth endpoint should match')
        done()
      })

      it('should return correct graphqlDelivery endpoint for GCP EU region', done => {
        const endpoint = getRegionEndpoint('gcp-eu', 'graphqlDelivery')
        expect(endpoint).to.be.equal('gcp-eu-graphql.contentstack.com', 'GCP EU graphqlDelivery endpoint should match')
        done()
      })

      it('should return correct preview endpoint for AU region', done => {
        const endpoint = getRegionEndpoint('au', 'preview')
        expect(endpoint).to.be.equal('au-rest-preview.contentstack.com', 'AU preview endpoint should match')
        done()
      })

      it('should return correct images endpoint for NA region', done => {
        const endpoint = getRegionEndpoint('na', 'images')
        expect(endpoint).to.be.equal('images.contentstack.io', 'NA images endpoint should match')
        done()
      })

      it('should return correct automate endpoint for Azure EU region', done => {
        const endpoint = getRegionEndpoint('azure-eu', 'automate')
        expect(endpoint).to.be.equal('azure-eu-automations-api.contentstack.com', 'Azure EU automate endpoint should match')
        done()
      })

      it('should return correct personalize endpoint for GCP NA region', done => {
        const endpoint = getRegionEndpoint('gcp-na', 'personalizeManagement')
        expect(endpoint).to.be.equal('gcp-na-personalize-api.contentstack.com', 'GCP NA personalize endpoint should match')
        done()
      })
    })

    describe('Default service parameter', () => {
      it('should default to contentManagement service when service parameter is not provided', done => {
        const endpoint = getRegionEndpoint('na')
        expect(endpoint).to.be.equal('api.contentstack.io', 'Should default to contentManagement service')
        done()
      })

      it('should default to contentManagement for EU region', done => {
        const endpoint = getRegionEndpoint('eu')
        expect(endpoint).to.be.equal('eu-api.contentstack.com', 'Should default to contentManagement service for EU')
        done()
      })
    })

    describe('URL protocol stripping', () => {
      it('should strip https:// protocol from endpoint', done => {
        const endpoint = getRegionEndpoint('na', 'contentManagement')
        expect(endpoint).to.not.contain('https://', 'Endpoint should not contain https://')
        expect(endpoint).to.not.contain('http://', 'Endpoint should not contain http://')
        done()
      })

      it('should strip protocol from application endpoint', done => {
        const endpoint = getRegionEndpoint('eu', 'application')
        expect(endpoint).to.not.contain('https://', 'Application endpoint should not contain https://')
        expect(endpoint).to.not.contain('http://', 'Application endpoint should not contain http://')
        done()
      })
    })

    describe('Invalid regions', () => {
      it('should throw error for invalid region', done => {
        try {
          getRegionEndpoint('invalid-region', 'contentManagement')
          done(new Error('Should have thrown an error'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Error message should indicate invalid region')
          expect(error.message).to.contain('invalid-region', 'Error message should contain the invalid region name')
          done()
        }
      })

      it('should throw error for empty region', done => {
        try {
          getRegionEndpoint('', 'contentManagement')
          done(new Error('Should have thrown an error'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Error message should indicate invalid region')
          done()
        }
      })

      it('should throw error for null region', done => {
        try {
          getRegionEndpoint(null, 'contentManagement')
          done(new Error('Should have thrown an error'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Error message should indicate invalid region')
          done()
        }
      })

      it('should throw error for undefined region', done => {
        try {
          getRegionEndpoint(undefined, 'contentManagement')
          done(new Error('Should have thrown an error'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Error message should indicate invalid region')
          done()
        }
      })

      it('should include available regions in error message', done => {
        try {
          getRegionEndpoint('invalid', 'contentManagement')
          done(new Error('Should have thrown an error'))
        } catch (error) {
          expect(error.message).to.contain('Allowed regions are:', 'Error should list allowed regions')
          expect(error.message).to.contain('na', 'Error should include NA region')
          expect(error.message).to.contain('eu', 'Error should include EU region')
          expect(error.message).to.contain('au', 'Error should include AU region')
          done()
        }
      })
    })

    describe('Case sensitivity', () => {
      it('should handle lowercase region names', done => {
        const endpoint = getRegionEndpoint('na', 'contentManagement')
        expect(endpoint).to.be.equal('api.contentstack.io', 'Lowercase region should work')
        done()
      })

      it('should be case-sensitive for region names', done => {
        try {
          getRegionEndpoint('NA', 'contentManagement')
          done(new Error('Should have thrown an error for uppercase region'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Should throw error for uppercase region')
          done()
        }
      })

      it('should be case-sensitive for aliases', done => {
        try {
          getRegionEndpoint('US', 'contentManagement')
          done(new Error('Should have thrown an error for uppercase alias'))
        } catch (error) {
          expect(error.message).to.contain('Invalid region', 'Should throw error for uppercase alias')
          done()
        }
      })

      it('should accept lowercase Azure region', done => {
        const endpoint = getRegionEndpoint('azure-na', 'contentManagement')
        expect(endpoint).to.be.equal('azure-na-api.contentstack.com', 'Lowercase Azure region should work')
        done()
      })
    })
  })
})
