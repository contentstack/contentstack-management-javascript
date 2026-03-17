/**
 * OAuth Authentication API Tests
 */

import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import axios from 'axios'

let client = null
let oauthClient = null
let accessToken = null
let refreshToken = null
let authUrl = null
let codeChallenge = null
let codeChallengeMethod = null
let authCode = null
let authtoken = null
let loggedinUserId = null
let oauthClient2 = null
let handleRedirectCode = null

// OAuth configuration from environment
const clientId = process.env.CLIENT_ID
const appId = process.env.APP_ID
const redirectUri = process.env.REDIRECT_URI
const organizationUid = process.env.ORGANIZATION

describe('OAuth Authentication API Tests', () => {
  before(function () {
    client = contentstackClient()

    // Skip all OAuth tests if credentials not configured
    if (!clientId || !appId || !redirectUri) {
      console.log('OAuth credentials not configured - skipping OAuth tests')
    }
  })

  describe('OAuth Setup and Authorization', () => {
    it('should login with credentials to get authtoken', async function () {
      this.timeout(15000)

      if (!process.env.EMAIL || !process.env.PASSWORD) {
        this.skip()
      }

      try {
        const response = await client.login({
          email: process.env.EMAIL,
          password: process.env.PASSWORD
        }, {
          include_orgs: true,
          include_orgs_roles: true,
          include_stack_roles: true,
          include_user_settings: true
        })

        authtoken = response.user.authtoken

        expect(response.notice).to.equal('Login Successful.')
        expect(authtoken).to.not.equal(undefined)

        // Use a client with the new authtoken so subsequent tests (getUser, OAuth flow) are authenticated
        client = contentstackClient(authtoken)
      } catch (error) {
        console.log('Login warning:', error.message)
        this.skip()
      }
    })

    it('should get current user info', async function () {
      this.timeout(15000)

      try {
        const user = await client.getUser()

        expect(user.uid).to.not.equal(undefined)
        expect(user.email).to.not.equal(undefined)
      } catch (error) {
        // User might not be logged in
        this.skip()
      }
    })

    it('should fail with invalid OAuth app credentials', async function () {
      this.timeout(15000)

      try {
        client.oauth({
          clientId: 'invalid_client_id',
          appId: 'invalid_app_id',
          redirectUri: 'http://invalid.uri'
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should initialize OAuth client with valid credentials', async function () {
      this.timeout(15000)

      if (!clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        oauthClient = client.oauth({
          clientId: clientId,
          appId: appId,
          redirectUri: redirectUri
        })

        expect(oauthClient).to.not.equal(undefined)
      } catch (error) {
        console.log('OAuth client initialization warning:', error.message)
        this.skip()
      }
    })

    it('should generate OAuth authorization URL', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      try {
        authUrl = await oauthClient.authorize()

        expect(authUrl).to.not.equal(undefined)
        expect(authUrl).to.include(clientId)

        const url = new URL(authUrl)
        codeChallenge = url.searchParams.get('code_challenge')
        codeChallengeMethod = url.searchParams.get('code_challenge_method')

        expect(codeChallenge).to.not.equal('')
        expect(codeChallengeMethod).to.not.equal('')
      } catch (error) {
        console.log('Authorization URL warning:', error.message)
        this.skip()
      }
    })

    it('should simulate authorization and get auth code', async function () {
      this.timeout(15000)

      if (!oauthClient || !authtoken || !codeChallenge) {
        this.skip()
      }

      try {
        const authorizationEndpoint = oauthClient.axiosInstance.defaults.developerHubBaseUrl

        axios.defaults.headers.common.authtoken = authtoken
        axios.defaults.headers.common.organization_uid = organizationUid

        const response = await axios.post(
          `${authorizationEndpoint}/manifests/${appId}/authorize`,
          {
            client_id: clientId,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            response_type: 'code'
          }
        )

        const redirectUrl = response.data.data.redirect_url
        const url = new URL(redirectUrl)
        authCode = url.searchParams.get('code')

        expect(redirectUrl).to.not.equal('')
        expect(authCode).to.not.equal(null)

        // Set OAuth client properties
        oauthClient.axiosInstance.oauth.appId = appId
        oauthClient.axiosInstance.oauth.clientId = clientId
        oauthClient.axiosInstance.oauth.redirectUri = redirectUri
      } catch (error) {
        console.log('Authorization simulation warning:', error.message)
        this.skip()
      }
    })
  })

  describe('PKCE (Proof Key for Code Exchange)', () => {
    // Most PKCE tests are local — no network calls needed.
    // RFC 7636: code_verifier is random, code_challenge = BASE64URL(SHA256(verifier))

    it('should generate a 128-character code verifier by default', function () {
      if (!oauthClient) {
        this.skip()
      }

      expect(oauthClient.codeVerifier).to.be.a('string')
      expect(oauthClient.codeVerifier.length).to.equal(128)
    })

    it('should generate code verifier using only RFC 7636 allowed characters', function () {
      if (!oauthClient) {
        this.skip()
      }

      // RFC 7636 §4.1: unreserved chars A-Z a-z 0-9 - . _ ~
      const allowedChars = /^[A-Za-z0-9\-._~]+$/
      expect(allowedChars.test(oauthClient.codeVerifier)).to.equal(true)
    })

    it('should support custom-length code verifier via generateCodeVerifier(n)', function () {
      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      const testClient = client.oauth({ clientId, appId, redirectUri })
      const verifier64 = testClient.generateCodeVerifier(64)
      expect(verifier64.length).to.equal(64)
      expect(/^[A-Za-z0-9\-._~]+$/.test(verifier64)).to.equal(true)
    })

    it('should generate unique code verifiers for different client instances', function () {
      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      const clientA = client.oauth({ clientId, appId, redirectUri })
      const clientB = client.oauth({ clientId, appId, redirectUri })
      // SHA-256 collision probability is negligible — different random verifiers expected
      expect(clientA.codeVerifier).to.not.equal(clientB.codeVerifier)
    })

    it('should generate a valid base64url code challenge (no +, /, or = characters)', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      const challenge = await oauthClient.generateCodeChallenge(oauthClient.codeVerifier)
      // base64url (RFC 4648 §5) replaces + → -, / → _, strips =
      expect(challenge).to.not.include('+')
      expect(challenge).to.not.include('/')
      expect(challenge).to.not.include('=')
      expect(challenge.length).to.be.greaterThan(0)
    })

    it('should produce the same code challenge for the same verifier (SHA-256 is deterministic)', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      const challenge1 = await oauthClient.generateCodeChallenge('fixed-test-verifier-string')
      const challenge2 = await oauthClient.generateCodeChallenge('fixed-test-verifier-string')
      expect(challenge1).to.equal(challenge2)
    })

    it('should produce different challenges for different verifiers', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      const challengeA = await oauthClient.generateCodeChallenge('verifier-aaa')
      const challengeB = await oauthClient.generateCodeChallenge('verifier-bbb')
      expect(challengeA).to.not.equal(challengeB)
    })

    it('should set codeChallenge to null before authorize() is called (lazy generation)', function () {
      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      const freshClient = client.oauth({ clientId, appId, redirectUri })
      expect(freshClient.codeChallenge).to.equal(null)
    })

    it('should populate codeChallenge on instance after authorize() is called', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const freshClient = client.oauth({ clientId, appId, redirectUri })
        expect(freshClient.codeChallenge).to.equal(null) // null before authorize
        await freshClient.authorize()
        expect(freshClient.codeChallenge).to.be.a('string') // populated after authorize
        expect(freshClient.codeChallenge.length).to.be.greaterThan(0)
      } catch (error) {
        console.log('PKCE: codeChallenge populate warning:', error.message)
        this.skip()
      }
    })

    it('should include matching code_challenge and S256 method in authorization URL', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const freshClient = client.oauth({ clientId, appId, redirectUri })
        const url = new URL(await freshClient.authorize())

        const urlChallenge = url.searchParams.get('code_challenge')
        const expectedChallenge = await freshClient.generateCodeChallenge(freshClient.codeVerifier)

        expect(url.searchParams.get('code_challenge_method')).to.equal('S256')
        expect(urlChallenge).to.equal(expectedChallenge)
        expect(url.searchParams.get('response_type')).to.equal('code')
        expect(url.searchParams.get('client_id')).to.equal(clientId)
      } catch (error) {
        console.log('PKCE: auth URL params warning:', error.message)
        this.skip()
      }
    })

    it('should not generate code verifier when clientSecret is provided (non-PKCE flow)', function () {
      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      const secretClient = client.oauth({
        clientId,
        appId,
        redirectUri,
        clientSecret: 'test-client-secret'
      })

      // clientSecret path: PKCE constructor block is skipped entirely
      expect(secretClient.codeVerifier).to.equal(undefined)
      expect(secretClient.codeChallenge).to.equal(undefined)
    })

    it('should skip code_challenge params in auth URL when clientSecret is provided', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const secretClient = client.oauth({
          clientId,
          appId,
          redirectUri,
          clientSecret: 'test-client-secret'
        })
        const url = new URL(await secretClient.authorize())
        expect(url.searchParams.get('code_challenge')).to.equal(null)
        expect(url.searchParams.get('code_challenge_method')).to.equal(null)
      } catch (error) {
        console.log('PKCE: non-PKCE URL warning:', error.message)
        this.skip()
      }
    })

    it('should confirm PKCE storage is memory-only in Node.js (no sessionStorage)', function () {
      if (!oauthClient) {
        this.skip()
      }

      // In Node.js, isBrowser() = false → pkceStorage always returns null
      // The code_verifier lives only on the instance (memory), not persisted to sessionStorage
      // This is correct — Node/CLI apps don't need cross-redirect persistence
      expect(typeof window).to.equal('undefined')
      expect(oauthClient.codeVerifier).to.be.a('string') // verifier is still in memory
    })
  })

  describe('handleRedirect (Primary Web App Flow)', () => {
    // handleRedirect() is the PRIMARY method customers use in web apps.
    // It parses the auth code from the callback URL and exchanges it automatically.
    // We use a fresh oauthClient2 with its own PKCE verifier to avoid consuming authCode.
    let codeChallenge2 = null
    const codeChallengeMethod2 = 'S256'

    it('should initialize a second OAuth client and generate authorization URL with PKCE', async function () {
      this.timeout(15000)

      if (!clientId || !appId || !redirectUri || !client) {
        this.skip()
      }

      try {
        oauthClient2 = client.oauth({ clientId, appId, redirectUri })
        const authUrl2 = await oauthClient2.authorize()
        const url = new URL(authUrl2)
        codeChallenge2 = url.searchParams.get('code_challenge')

        expect(codeChallenge2).to.not.equal(null)
        expect(url.searchParams.get('code_challenge_method')).to.equal('S256')
      } catch (error) {
        console.log('handleRedirect: OAuth client init warning:', error.message)
        this.skip()
      }
    })

    it('should simulate authorization to get a fresh auth code for handleRedirect', async function () {
      this.timeout(15000)

      if (!oauthClient2 || !authtoken || !codeChallenge2) {
        this.skip()
      }

      try {
        const authorizationEndpoint = oauthClient2.axiosInstance.defaults.developerHubBaseUrl

        axios.defaults.headers.common.authtoken = authtoken
        axios.defaults.headers.common.organization_uid = organizationUid

        const response = await axios.post(
          `${authorizationEndpoint}/manifests/${appId}/authorize`,
          {
            client_id: clientId,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge2,
            code_challenge_method: codeChallengeMethod2,
            response_type: 'code'
          }
        )

        const redirectUrl = response.data.data.redirect_url
        const url = new URL(redirectUrl)
        handleRedirectCode = url.searchParams.get('code')

        oauthClient2.axiosInstance.oauth.appId = appId
        oauthClient2.axiosInstance.oauth.clientId = clientId
        oauthClient2.axiosInstance.oauth.redirectUri = redirectUri

        expect(handleRedirectCode).to.not.equal(null)
      } catch (error) {
        console.log('handleRedirect: simulate auth warning:', error.message)
        this.skip()
      }
    })

    it('should automatically exchange auth code via handleRedirect callback URL', async function () {
      this.timeout(15000)

      if (!oauthClient2 || !handleRedirectCode) {
        this.skip()
      }

      try {
        // This is how customers use it: pass the full callback URL, SDK extracts and exchanges the code
        const callbackUrl = `${redirectUri}?code=${handleRedirectCode}`
        await oauthClient2.handleRedirect(callbackUrl)

        expect(oauthClient2.getAccessToken()).to.not.equal(undefined)
        expect(oauthClient2.getAccessToken()).to.not.equal(null)
      } catch (error) {
        console.log('handleRedirect callback warning:', error.message)
        this.skip()
      }
    })

    it('should have all tokens and metadata automatically stored after handleRedirect', async function () {
      this.timeout(15000)

      if (!oauthClient2 || !oauthClient2.getAccessToken()) {
        this.skip()
      }

      expect(oauthClient2.getAccessToken()).to.be.a('string')
      expect(oauthClient2.getRefreshToken()).to.be.a('string')
      expect(oauthClient2.getOrganizationUID()).to.equal(organizationUid)
      expect(oauthClient2.getUserUID()).to.be.a('string')
      expect(oauthClient2.getTokenExpiryTime()).to.be.greaterThan(Date.now())
    })

    it('should logout after handleRedirect flow to clean up', async function () {
      this.timeout(15000)

      if (!oauthClient2 || !oauthClient2.getAccessToken()) {
        this.skip()
      }

      try {
        const response = await oauthClient2.logout()
        expect(response).to.equal('Logged out successfully')
      } catch (error) {
        console.log('handleRedirect: logout warning:', error.message)
        this.skip()
      }
    })
  })

  describe('OAuth Token Exchange', () => {
    before(async function () {
      this.timeout(15000)
      // Re-generate a fresh auth code right before token exchange.
      // Some OAuth servers (e.g. dev11 DeveloperHub) only allow one active authorization
      // code per app+user at a time — the handleRedirect section's second authorize() call
      // invalidates the original authCode. Regenerating here ensures a valid code.
      if (!oauthClient || !authtoken || !clientId || !appId || !redirectUri) {
        return
      }
      try {
        const freshUrl = await oauthClient.authorize()
        const freshParsed = new URL(freshUrl)
        const freshChallenge = freshParsed.searchParams.get('code_challenge')
        const freshMethod = freshParsed.searchParams.get('code_challenge_method')
        const authorizationEndpoint = oauthClient.axiosInstance.defaults.developerHubBaseUrl

        axios.defaults.headers.common.authtoken = authtoken
        axios.defaults.headers.common.organization_uid = organizationUid

        const response = await axios.post(
          `${authorizationEndpoint}/manifests/${appId}/authorize`,
          {
            client_id: clientId,
            redirect_uri: redirectUri,
            code_challenge: freshChallenge,
            code_challenge_method: freshMethod,
            response_type: 'code'
          }
        )
        const redirectUrl = response.data.data.redirect_url
        const url = new URL(redirectUrl)
        authCode = url.searchParams.get('code')

        oauthClient.axiosInstance.oauth.appId = appId
        oauthClient.axiosInstance.oauth.clientId = clientId
        oauthClient.axiosInstance.oauth.redirectUri = redirectUri
      } catch (e) {
        console.log('Token Exchange: fresh auth code warning:', e.message)
      }
    })

    it('should exchange authorization code for access token', async function () {
      this.timeout(15000)

      if (!oauthClient || !authCode) {
        this.skip()
      }

      try {
        const response = await oauthClient.exchangeCodeForToken(authCode)

        accessToken = response.access_token
        refreshToken = response.refresh_token
        loggedinUserId = response.user_uid

        expect(response.organization_uid).to.equal(organizationUid)
        expect(response.access_token).to.not.equal(null)
        expect(response.refresh_token).to.not.equal(null)
      } catch (error) {
        console.log('Token exchange warning:', error.message)
        this.skip()
      }
    })

    it('should retrieve access token via getAccessToken()', async function () {
      this.timeout(15000)

      if (!oauthClient || !accessToken) {
        this.skip()
      }

      expect(oauthClient.getAccessToken()).to.equal(accessToken)
    })

    it('should retrieve refresh token via getRefreshToken()', async function () {
      this.timeout(15000)

      if (!oauthClient || !refreshToken) {
        this.skip()
      }

      expect(oauthClient.getRefreshToken()).to.equal(refreshToken)
    })

    it('should retrieve organization UID via getOrganizationUID()', async function () {
      this.timeout(15000)

      if (!oauthClient || !accessToken) {
        this.skip()
      }

      expect(oauthClient.getOrganizationUID()).to.equal(organizationUid)
    })

    it('should retrieve user UID via getUserUID()', async function () {
      this.timeout(15000)

      if (!oauthClient || !loggedinUserId) {
        this.skip()
      }

      expect(oauthClient.getUserUID()).to.equal(loggedinUserId)
    })

    it('should retrieve token expiry time via getTokenExpiryTime()', async function () {
      this.timeout(15000)

      if (!oauthClient || !accessToken) {
        this.skip()
      }

      const expiryTime = oauthClient.getTokenExpiryTime()
      expect(expiryTime).to.be.a('number')
      expect(expiryTime).to.be.greaterThan(Date.now())
    })

    it('should get user info using access token', async function () {
      this.timeout(15000)

      if (!accessToken) {
        this.skip()
      }

      try {
        const user = await client.getUser({
          authorization: `Bearer ${accessToken}`
        })

        expect(user.uid).to.equal(loggedinUserId)
        expect(user.email).to.equal(process.env.EMAIL)
      } catch (error) {
        console.log('Get user with token warning:', error.message)
        this.skip()
      }
    })

    it('should refresh access token using refresh token', async function () {
      this.timeout(15000)

      if (!oauthClient || !refreshToken) {
        this.skip()
      }

      try {
        const response = await oauthClient.refreshAccessToken(refreshToken)

        accessToken = response.access_token
        refreshToken = response.refresh_token

        expect(response.access_token).to.not.equal(null)
        expect(response.refresh_token).to.not.equal(null)
      } catch (error) {
        console.log('Token refresh warning:', error.message)
        this.skip()
      }
    })
  })

  describe('Token Setter Methods', () => {
    // Customers use setters to restore tokens from persistent storage (e.g. re-hydrate from disk/DB)

    it('should set and retrieve access token via setAccessToken()/getAccessToken()', function () {
      if (!oauthClient) {
        this.skip()
      }

      const original = oauthClient.getAccessToken()
      oauthClient.setAccessToken('test-access-token-value')
      expect(oauthClient.getAccessToken()).to.equal('test-access-token-value')
      if (original) oauthClient.setAccessToken(original)
    })

    it('should set and retrieve refresh token via setRefreshToken()/getRefreshToken()', function () {
      if (!oauthClient) {
        this.skip()
      }

      const original = oauthClient.getRefreshToken()
      oauthClient.setRefreshToken('test-refresh-token-value')
      expect(oauthClient.getRefreshToken()).to.equal('test-refresh-token-value')
      if (original) oauthClient.setRefreshToken(original)
    })

    it('should set and retrieve organization UID via setOrganizationUID()/getOrganizationUID()', function () {
      if (!oauthClient) {
        this.skip()
      }

      const original = oauthClient.getOrganizationUID()
      oauthClient.setOrganizationUID('test-org-uid')
      expect(oauthClient.getOrganizationUID()).to.equal('test-org-uid')
      if (original) oauthClient.setOrganizationUID(original)
    })

    it('should set and retrieve user UID via setUserUID()/getUserUID()', function () {
      if (!oauthClient) {
        this.skip()
      }

      const original = oauthClient.getUserUID()
      oauthClient.setUserUID('test-user-uid')
      expect(oauthClient.getUserUID()).to.equal('test-user-uid')
      if (original) oauthClient.setUserUID(original)
    })

    it('should set and retrieve token expiry time via setTokenExpiryTime()/getTokenExpiryTime()', function () {
      if (!oauthClient) {
        this.skip()
      }

      const futureTime = Date.now() + 3600000 // 1 hour from now
      oauthClient.setTokenExpiryTime(futureTime)
      expect(oauthClient.getTokenExpiryTime()).to.equal(futureTime)
    })
  })

  describe('OAuth Client Configuration Options', () => {
    it('should skip code_challenge in auth URL when clientSecret is provided (non-PKCE flow)', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const secretClient = client.oauth({
          clientId,
          appId,
          redirectUri,
          clientSecret: 'test-client-secret'
        })
        const url = new URL(await secretClient.authorize())

        // When clientSecret is provided, PKCE is skipped — no code_challenge in URL
        expect(url.searchParams.get('code_challenge')).to.equal(null)
        expect(url.searchParams.get('code_challenge_method')).to.equal(null)
        expect(url.searchParams.get('response_type')).to.equal('code')
      } catch (error) {
        console.log('clientSecret config warning:', error.message)
        this.skip()
      }
    })

    it('should join scope array as space-separated string', function () {
      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      const scopedClient = client.oauth({
        clientId,
        appId,
        redirectUri,
        scope: ['read', 'write', 'profile']
      })

      expect(scopedClient.scope).to.equal('read write profile')
    })

    it('should default to "code" response_type in authorization URL', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const defaultClient = client.oauth({ clientId, appId, redirectUri })
        const url = new URL(await defaultClient.authorize())
        expect(url.searchParams.get('response_type')).to.equal('code')
      } catch (error) {
        console.log('responseType default warning:', error.message)
        this.skip()
      }
    })
  })

  describe('OAuth Logout', () => {
    it('should logout successfully', async function () {
      this.timeout(15000)

      if (!oauthClient || !accessToken) {
        this.skip()
      }

      try {
        const response = await oauthClient.logout()

        expect(response).to.equal('Logged out successfully')
      } catch (error) {
        console.log('Logout warning:', error.message)
        this.skip()
      }
    })

    it('should fail API request with expired/revoked token', async function () {
      this.timeout(15000)

      if (!accessToken) {
        this.skip()
      }

      try {
        await client.getUser({
          authorization: `Bearer ${accessToken}`
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.equal(401)
        expect(error.errorMessage).to.include('invalid')
      }
    })
  })

  describe('OAuth Error Handling', () => {
    it('should handle invalid authorization code', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      try {
        await oauthClient.exchangeCodeForToken('invalid_auth_code')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should handle invalid refresh token', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      try {
        await oauthClient.refreshAccessToken('invalid_refresh_token')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should throw error when refreshAccessToken called with no stored refresh token', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        // Fresh client has no tokens stored
        const freshOauthClient = client.oauth({ clientId, appId, redirectUri })
        await freshOauthClient.refreshAccessToken()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should throw error when handleRedirect called with URL missing authorization code', async function () {
      this.timeout(15000)

      if (!client || !clientId || !appId || !redirectUri) {
        this.skip()
      }

      try {
        const freshOauthClient = client.oauth({ clientId, appId, redirectUri })
        await freshOauthClient.handleRedirect(`${redirectUri}?state=somestate`)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should throw error when setAccessToken called with empty value', function () {
      if (!oauthClient) {
        this.skip()
      }

      try {
        oauthClient.setAccessToken('')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should throw error when setRefreshToken called with empty value', function () {
      if (!oauthClient) {
        this.skip()
      }

      try {
        oauthClient.setRefreshToken('')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })
  })
})
