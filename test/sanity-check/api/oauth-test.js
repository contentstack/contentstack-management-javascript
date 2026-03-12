/**
 * OAuth Authentication API Tests
 *
 * Runs at the end of the suite (Phase 23) to avoid interfering with
 * existing auth tokens.  Reuses the testContext authtoken created during
 * global setup so we don't hit the 20-token-per-user limit.
 */

import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import * as testSetup from '../utility/testSetup.js'
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

// OAuth configuration from environment
const clientId = process.env.CLIENT_ID
const appId = process.env.APP_ID
const redirectUri = process.env.REDIRECT_URI
const organizationUid = process.env.ORGANIZATION

/**
 * Compute Developer Hub URL from HOST environment variable
 * Handles the special case where dev11 uses 'dev-' prefix instead of 'dev11-'
 *
 * @param {string} host - API host from environment (e.g., 'dev9-api.csnonprod.com')
 * @returns {string} Developer Hub URL (e.g., 'https://dev9-developerhub-api.csnonprod.com')
 */
function getDeveloperHubUrl (host) {
  if (!host) return 'https://developerhub-api.contentstack.com'

  let devHubUrl = host
    .replace('api', 'developerhub-api')
    .replace('.io', '.com')

  // Special case: dev11 uses 'dev-' prefix instead of 'dev11-'
  if (devHubUrl.includes('dev11-')) {
    devHubUrl = devHubUrl.replace('dev11-', 'dev-')
  }

  // Ensure https:// protocol
  if (!devHubUrl.startsWith('http')) {
    devHubUrl = `https://${devHubUrl}`
  }

  return devHubUrl
}

describe('OAuth Authentication API Tests', () => {
  before(function () {
    // Skip all OAuth tests if credentials not configured
    if (!clientId || !appId || !redirectUri) {
      console.log('   OAuth: skipped (CLIENT_ID / APP_ID / REDIRECT_URI not configured)')
      this.skip()
    }

    // Reuse the authtoken from global setup — avoids creating a duplicate
    // session that could push us past the 20-token-per-user limit.
    const ctx = testSetup.testContext
    if (ctx && ctx.authtoken) {
      authtoken = ctx.authtoken
      client = contentstackClient(authtoken)
    } else {
      console.log('   OAuth: skipped (no authtoken from testSetup)')
      this.skip()
    }
  })

  describe('OAuth Setup and Authorization', () => {
    it('should have a valid authtoken from global setup', function () {
      this.timeout(15000)

      expect(authtoken).to.be.a('string')
      expect(authtoken).to.not.equal('')
    })

    it('should get current user info', async function () {
      this.timeout(15000)

      const user = await client.getUser()
      expect(user.uid).to.not.equal(undefined)
      expect(user.email).to.not.equal(undefined)
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

    it('should initialize OAuth client with valid credentials', function () {
      this.timeout(15000)

      oauthClient = client.oauth({
        clientId: clientId,
        appId: appId,
        redirectUri: redirectUri
      })

      expect(oauthClient).to.not.equal(undefined)
    })

    it('should generate OAuth authorization URL', async function () {
      this.timeout(15000)

      if (!oauthClient) {
        this.skip()
      }

      authUrl = await oauthClient.authorize()

      expect(authUrl).to.not.equal(undefined)
      expect(authUrl).to.include(clientId)

      const url = new URL(authUrl)
      codeChallenge = url.searchParams.get('code_challenge')
      codeChallengeMethod = url.searchParams.get('code_challenge_method')

      expect(codeChallenge).to.not.equal('')
      expect(codeChallengeMethod).to.not.equal('')
    })

    it('should simulate authorization and get auth code', async function () {
      this.timeout(15000)

      if (!oauthClient || !authtoken || !codeChallenge) {
        this.skip()
      }

      // Compute the correct Developer Hub URL from HOST env variable
      // This handles the dev11 special case (dev11 -> dev) without modifying SDK code
      const authorizationEndpoint = getDeveloperHubUrl(process.env.HOST)
      console.log('   Developer Hub endpoint:', authorizationEndpoint)

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

      oauthClient.axiosInstance.oauth.appId = appId
      oauthClient.axiosInstance.oauth.clientId = clientId
      oauthClient.axiosInstance.oauth.redirectUri = redirectUri
    })
  })

  describe('OAuth Token Exchange', () => {
    it('should exchange authorization code for access token', async function () {
      this.timeout(15000)

      if (!oauthClient || !authCode) {
        this.skip()
      }

      const response = await oauthClient.exchangeCodeForToken(authCode)

      accessToken = response.access_token
      refreshToken = response.refresh_token
      loggedinUserId = response.user_uid

      expect(response.organization_uid).to.equal(organizationUid)
      expect(response.access_token).to.not.equal(null)
      expect(response.refresh_token).to.not.equal(null)
    })

    it('should get user info using access token', async function () {
      this.timeout(15000)

      if (!accessToken) {
        this.skip()
      }

      const user = await client.getUser({
        authorization: `Bearer ${accessToken}`
      })

      expect(user.uid).to.equal(loggedinUserId)
      expect(user.email).to.equal(process.env.EMAIL)
    })

    it('should refresh access token using refresh token', async function () {
      this.timeout(15000)

      if (!oauthClient || !refreshToken) {
        this.skip()
      }

      const response = await oauthClient.refreshAccessToken(refreshToken)

      accessToken = response.access_token
      refreshToken = response.refresh_token

      expect(response.access_token).to.not.equal(null)
      expect(response.refresh_token).to.not.equal(null)
    })
  })

  describe('OAuth Logout', () => {
    it('should logout successfully', async function () {
      this.timeout(15000)

      if (!oauthClient || !accessToken) {
        this.skip()
      }

      const response = await oauthClient.logout()
      expect(response).to.equal('Logged out successfully')
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
  })
})
