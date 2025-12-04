import { expect } from 'chai'
import { describe, it } from 'mocha'
import { contentstackClient } from '../../sanity-check/utility/ContentstackClient'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
let accessToken = ''
let loggedinUserID = ''
let authUrl = ''
let codeChallenge = ''
let codeChallengeMethod = ''
let authCode
let authtoken = ''
let redirectUrl = ''
let refreshToken = ''
const client = contentstackClient()
const oauthClient = client.oauth({
  clientId: process.env.CLIENT_ID,
  appId: process.env.APP_ID,
  redirectUri: process.env.REDIRECT_URI
})

describe('OAuth Authentication API Test', () => {
  it('should login with credentials', done => {
    client.login({ email: process.env.EMAIL, password: process.env.PASSWORD }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      authtoken = response.user.authtoken
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    })
      .catch(done)
  })

  it('should get Current user info test', done => {
    client.getUser().then((user) => {
      expect(user.uid).to.not.be.equal(undefined)
      done()
    })
      .catch(done)
  })

  it('should fail when trying to login with invalid app credentials', () => {
    try {
      client.oauth({
        clientId: 'clientId',
        appId: 'appId',
        redirectUri: 'redirectUri'
      })
    } catch (error) {
      const jsonMessage = JSON.parse(error.message)
      expect(jsonMessage.status).to.be.equal(401, 'Status code does not match for invalid credentials')
      expect(jsonMessage.errorMessage).to.not.equal(null, 'Error message not proper')
      expect(jsonMessage.errorCode).to.be.equal(104, 'Error code does not match')
    }
  })

  it('should generate OAuth authorization URL', async () => {
    authUrl = await oauthClient.authorize()
    const url = new URL(authUrl)

    codeChallenge = url.searchParams.get('code_challenge')
    codeChallengeMethod = url.searchParams.get('code_challenge_method')

    // Ensure they are not empty strings
    expect(codeChallenge).to.not.equal('')
    expect(codeChallengeMethod).to.not.equal('')
    expect(authUrl).to.include(process.env.CLIENT_ID, 'Client ID mismatch')
  })

  it('should simulate calling the authorization URL and receive authorization code', async () => {
    try {
      const authorizationEndpoint = oauthClient.axiosInstance.defaults.developerHubBaseUrl
      axios.defaults.headers.common.authtoken = authtoken
      axios.defaults.headers.common.organization_uid = process.env.ORGANIZATION
      const response = await axios
        .post(`${authorizationEndpoint}/manifests/${process.env.APP_ID}/authorize`, {
          client_id: process.env.CLIENT_ID,
          redirect_uri: process.env.REDIRECT_URI,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          response_type: 'code'
        })
      const data = response.data
      redirectUrl = data.data.redirect_url
      const url = new URL(redirectUrl)
      authCode = url.searchParams.get('code')
      oauthClient.axiosInstance.oauth.appId = process.env.APP_ID
      oauthClient.axiosInstance.oauth.clientId = process.env.CLIENT_ID
      oauthClient.axiosInstance.oauth.redirectUri = process.env.REDIRECT_URI
      // Ensure they are not empty strings
      expect(redirectUrl).to.not.equal('')
      expect(url).to.not.equal('')
    } catch (error) {
      console.log(error)
    }
  })

  it('should exchange authorization code for access token', async () => {
    const response = await oauthClient.exchangeCodeForToken(authCode)
    accessToken = response.access_token
    loggedinUserID = response.user_uid
    refreshToken = response.refresh_token

    expect(response.organization_uid).to.be.equal(process.env.ORGANIZATION, 'Organization mismatch')
    // eslint-disable-next-line no-unused-expressions
    expect(response.access_token).to.not.be.null
    // eslint-disable-next-line no-unused-expressions
    expect(response.refresh_token).to.not.be.null
  })

  it('should get the logged-in user info using the access token', async () => {
    const user = await client.getUser({
      authorization: `Bearer ${accessToken}`
    })
    expect(user.uid).to.be.equal(loggedinUserID)
    expect(user.email).to.be.equal(process.env.EMAIL, 'Email mismatch')
  })

  it('should refresh the access token using refresh token', async () => {
    const response = await oauthClient.refreshAccessToken(refreshToken)

    accessToken = response.access_token
    refreshToken = response.refresh_token
    // eslint-disable-next-line no-unused-expressions
    expect(response.access_token).to.not.be.null
    // eslint-disable-next-line no-unused-expressions
    expect(response.refresh_token).to.not.be.null
  })

  it('should logout successfully after OAuth authentication', async () => {
    const response = await oauthClient.logout()
    expect(response).to.be.equal('Logged out successfully')
  })

  it('should fail to make an API request with an expired token', async () => {
    try {
      await client.getUser({
        authorization: `Bearer ${accessToken}`
      })
    } catch (error) {
      expect(error.status).to.be.equal(401, 'API request should fail with status 401')
      expect(error.errorMessage).to.be.equal('The provided access token is invalid or expired or revoked', 'Error message mismatch')
    }
  })
})
