import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import OAuthHandler from '../../lib/core/oauthHandler'
import { describe, it, beforeEach, afterEach } from 'mocha'

describe('OAuthHandler', () => {
  let axiosInstance
  let oauthHandler
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    axiosInstance = axios.create({
      uiBaseUrl: 'https://example.com', // Make sure this is correctly set
      developerHubBaseUrl: 'https://developer.example.com',
      baseURL: 'https://api.example.com'
    })
    oauthHandler = new OAuthHandler(axiosInstance, 'appId', 'clientId', 'http://localhost:8184', 'clientSecret')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should initialize OAuthHandler with correct properties', () => {
    expect(oauthHandler.appId).to.equal('appId')
    expect(oauthHandler.clientId).to.equal('clientId')
    expect(oauthHandler.redirectUri).to.equal('http://localhost:8184')
    expect(oauthHandler.responseType).to.equal('code')
    expect(oauthHandler.scope).to.equal('')
    expect(oauthHandler.clientSecret).to.equal('clientSecret')
    expect(oauthHandler.OAuthBaseURL).to.equal('https://example.com')
    expect(oauthHandler.axiosInstance).to.equal(axiosInstance)
  })

  it('should generate code verifier', () => {
    const codeVerifier = oauthHandler.generateCodeVerifier()
    expect(codeVerifier).to.have.lengthOf(128)
  })

  it('should generate code challenge', async () => {
    const codeVerifier = 'testCodeVerifier'
    const codeChallenge = await oauthHandler.generateCodeChallenge(codeVerifier)
    // eslint-disable-next-line no-unused-expressions
    expect(codeChallenge).to.exist
  })

  it('should authorize and return authorization URL', async () => {
    const authUrl = await oauthHandler.authorize()
    expect(authUrl).to.include('https://example.com/')
    expect(authUrl).to.include('response_type=code')
    expect(authUrl).to.include('client_id=clientId')
  })

  it('should exchange code for token', async () => {
    const tokenData = { access_token: 'accessToken', refresh_token: 'refreshToken', expires_in: 3600 }
    sandbox.stub(axiosInstance, 'post').resolves({ data: tokenData })

    const result = await oauthHandler.exchangeCodeForToken('authorization_code')
    expect(result).to.deep.equal(tokenData)
  })

  it('should refresh access token', async () => {
    // NAT = 'newAccessToken'
    const tokenData = { access_token: 'NAT', refresh_token: 'newRefreshToken', expires_in: 3600 }
    sandbox.stub(axiosInstance, 'post').resolves({ data: tokenData })

    const result = await oauthHandler.refreshAccessToken('refreshToken')
    expect(result).to.deep.equal(tokenData)
  })

  it('should logout successfully', async () => {
    sandbox.stub(oauthHandler, 'getOauthAppAuthorization').resolves('authorizationId')
    sandbox.stub(oauthHandler, 'revokeOauthAppAuthorization').resolves({})

    const result = await oauthHandler.logout()
    expect(result).to.equal('Logged out successfully')
  })

  it('should handle redirect and exchange code for token', async () => {
    const exchangeStub = sandbox.stub(oauthHandler, 'exchangeCodeForToken').resolves({})

    await oauthHandler.handleRedirect('http://localhost:8184?code=authorization_code')
    // eslint-disable-next-line no-unused-expressions
    expect(exchangeStub.calledWith('authorization_code')).to.be.true
  })

  it('should get access token', () => {
    oauthHandler.axiosInstance.oauth = { accessToken: 'accessToken' }
    const accessToken = oauthHandler.getAccessToken()
    expect(accessToken).to.equal('accessToken')
  })

  it('should get refresh token', () => {
    oauthHandler.axiosInstance.oauth = { refreshToken: 'refreshToken' }
    const refreshToken = oauthHandler.getRefreshToken()
    expect(refreshToken).to.equal('refreshToken')
  })

  it('should get organization UID', () => {
    oauthHandler.axiosInstance.oauth = { organizationUID: 'organizationUID' }
    const organizationUID = oauthHandler.getOrganizationUID()
    expect(organizationUID).to.equal('organizationUID')
  })

  it('should get user UID', () => {
    oauthHandler.axiosInstance.oauth = { userUID: 'userUID' }
    const userUID = oauthHandler.getUserUID()
    expect(userUID).to.equal('userUID')
  })

  it('should get token expiry time', () => {
    oauthHandler.axiosInstance.oauth = { tokenExpiryTime: 1234567890 }
    const tokenExpiryTime = oauthHandler.getTokenExpiryTime()
    expect(tokenExpiryTime).to.equal(1234567890)
  })

  it('should set access token', () => {
    oauthHandler.setAccessToken('newAccessToken')
    expect(oauthHandler.axiosInstance.oauth.accessToken).to.equal('newAccessToken')
  })

  it('should set refresh token', () => {
    oauthHandler.setRefreshToken('newRefreshToken')
    expect(oauthHandler.axiosInstance.oauth.refreshToken).to.equal('newRefreshToken')
  })

  it('should set organization UID', () => {
    oauthHandler.setOrganizationUID('newOrganizationUID')
    expect(oauthHandler.axiosInstance.oauth.organizationUID).to.equal('newOrganizationUID')
  })

  it('should set user UID', () => {
    oauthHandler.setUserUID('newUserUID')
    expect(oauthHandler.axiosInstance.oauth.userUID).to.equal('newUserUID')
  })

  it('should set token expiry time', () => {
    oauthHandler.setTokenExpiryTime(1234567890)
    expect(oauthHandler.axiosInstance.oauth.tokenExpiryTime).to.equal(1234567890)
  })

  it('should generate codeVerifier and set codeChallenge to null if clientSecret is not provided', () => {
    const oauthHandlerWithoutClientSecret = new OAuthHandler(
      axiosInstance,
      'appId',
      'clientId',
      'http://localhost:8184',
      null // No clientSecret
    )

    // Ensure codeVerifier is generated
    // eslint-disable-next-line no-unused-expressions
    expect(oauthHandlerWithoutClientSecret.codeVerifier).to.exist

    // Ensure codeChallenge is null initially
    expect(oauthHandlerWithoutClientSecret.codeChallenge).to.equal(null)
  })

  it('should not generate codeVerifier or codeChallenge if clientSecret is provided', () => {
    const oauthHandlerWithClientSecret = new OAuthHandler(
      axiosInstance,
      'appId',
      'clientId',
      'http://localhost:8184',
      'clientSecret' // clientSecret is provided
    )

    // codeVerifier and codeChallenge should not be set if clientSecret is provided
    expect(oauthHandlerWithClientSecret.codeVerifier).to.equal(undefined)
    expect(oauthHandlerWithClientSecret.codeChallenge).to.equal(undefined)
  })

  it('should generate codeChallenge after calling generateCodeChallenge when clientSecret is not provided', async () => {
    const oauthHandlerWithoutClientSecret = new OAuthHandler(
      axiosInstance,
      'appId',
      'clientId',
      'http://localhost:8184',
      null // No clientSecret
    )

    const codeVerifier = oauthHandlerWithoutClientSecret.codeVerifier
    // eslint-disable-next-line no-unused-expressions
    expect(codeVerifier).to.exist // Ensure codeVerifier is generated

    const codeChallenge = await oauthHandlerWithoutClientSecret.generateCodeChallenge(codeVerifier)

    // Ensure the codeChallenge is a URL-safe Base64 string
    expect(codeChallenge).to.match(/^[A-Za-z0-9-_]+$/) // URL-safe Base64
  })

  it('should use the Web Crypto API in a browser environment', async () => {
    // Mock the browser environment
    global.window = {
      crypto: {
        subtle: {
          digest: sinon.stub().resolves(new Uint8Array([1, 2, 3, 4])) // Mock hash result
        }
      }
    }

    const oauthHandlerWithoutClientSecret = new OAuthHandler(
      axiosInstance,
      'appId',
      'clientId',
      'http://localhost:8184',
      null // No clientSecret
    )

    const codeVerifier = oauthHandlerWithoutClientSecret.codeVerifier
    // eslint-disable-next-line no-unused-expressions
    expect(codeVerifier).to.exist // Ensure codeVerifier is generated

    const codeChallenge = await oauthHandlerWithoutClientSecret.generateCodeChallenge(codeVerifier)

    // Ensure the codeChallenge is a URL-safe Base64 string
    expect(codeChallenge).to.match(/^[A-Za-z0-9-_]+$/) // URL-safe Base64

    // Clean up after the test to avoid affecting other tests
    delete global.window
  })

  it('should generate authorization URL with code_challenge when clientSecret is not provided', async () => {
    // Mock OAuthHandler without clientSecret
    oauthHandler = new OAuthHandler(
      axiosInstance,
      'appId',
      'clientId',
      'http://localhost:8184',
      null // No clientSecret (PKCE)
    )

    // Stub the generateCodeChallenge to return a dummy value
    const codeChallenge = 'dummyCodeChallenge'
    sandbox.stub(oauthHandler, 'generateCodeChallenge').resolves(codeChallenge)

    const authUrl = await oauthHandler.authorize()

    // Check that code_challenge and code_challenge_method are included in the URL
    expect(authUrl).to.include('https://example.com/')
    expect(authUrl).to.include('response_type=code')
    expect(authUrl).to.include('client_id=clientId')
    expect(authUrl).to.include('code_challenge=dummyCodeChallenge')
    expect(authUrl).to.include('code_challenge_method=S256')
  })

  // Test cases for getOauthAppAuthorization
  describe('getOauthAppAuthorization', () => {
    it('should return authorization_uid when authorizations exist for the current user', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              user: { uid: 'currentUserUid' },
              authorization_uid: 'authorizationUid1'
            }
          ]
        }
      }

      sandbox.stub(axiosInstance, 'get').resolves(mockResponse)

      oauthHandler.axiosInstance.oauth.userUID = 'currentUserUid'
      const authorizationUid = await oauthHandler.getOauthAppAuthorization()

      expect(authorizationUid).to.equal('authorizationUid1')
    })

    it('should throw an error when no authorizations found for the current user', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              user: { uid: 'otherUserUid' },
              authorization_uid: 'authorizationUid2'
            }
          ]
        }
      }

      sandbox.stub(axiosInstance, 'get').resolves(mockResponse)

      oauthHandler.axiosInstance.oauth.userUID = 'currentUserUid'

      try {
        await oauthHandler.getOauthAppAuthorization()
        throw new Error('Expected error not thrown')
      } catch (error) {
        expect(error.message).to.equal('No authorizations found for the current user. Verify user permissions and try again.')
      }
    })

    it('should throw an error when no authorizations found for the app', async () => {
      const mockResponse = { data: { data: [] } }

      sandbox.stub(axiosInstance, 'get').resolves(mockResponse)

      try {
        await oauthHandler.getOauthAppAuthorization()
        throw new Error('Expected error not thrown')
      } catch (error) {
        expect(error.message).to.equal('No authorizations found for the app. Verify app configuration and try again.')
      }
    })
  })

  describe('revokeOauthAppAuthorization', () => {
    it('should make a DELETE request to revoke authorization when valid authorizationId is provided', async () => {
      const authorizationId = 'authorizationUid1'
      const mockResponse = { data: { success: true } }

      sandbox.stub(axiosInstance, 'delete').resolves(mockResponse)
      const result = await oauthHandler.revokeOauthAppAuthorization(authorizationId)

      // eslint-disable-next-line no-unused-expressions
      expect(result.success).to.be.true
      // eslint-disable-next-line no-unused-expressions
      expect(axiosInstance.delete.calledOnce).to.be.true
    })

    it('should not make a DELETE request when authorizationId is invalid or empty', async () => {
      const invalidAuthorizationId = ''
      const deleteStub = sandbox.stub(axiosInstance, 'delete')

      await oauthHandler.revokeOauthAppAuthorization(invalidAuthorizationId)
      // eslint-disable-next-line no-unused-expressions
      expect(deleteStub.called).to.be.false
    })
  })
})
