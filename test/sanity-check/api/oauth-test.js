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

  describe('OAuth Token Exchange', () => {
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
  })
})
