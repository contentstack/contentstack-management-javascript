import { expect } from 'chai'
import { describe, it } from 'mocha'
import { contentstackClient } from '../../sanity-check/utility/ContentstackClient'
import { jsonWrite } from '../../sanity-check/utility/fileOperations/readwrite'
import axios from 'axios'
import dotenv from 'dotenv'
import * as contentstack from '../../../lib/contentstack.js'

dotenv.config()
var authtoken = ''
var loggedinUserID = ''
var client = contentstackClient()
describe('Contentstack User Session api Test', () => {
  it('should check user login with wrong credentials', done => {
    contentstackClient().login({ email: process.env.EMAIL, password: process.env.PASSWORD })
      .then((response) => {
        done()
      }).catch((error) => {
        const jsonMessage = JSON.parse(error.message)
        const payload = JSON.parse(jsonMessage.request.data)
        expect(jsonMessage.status).to.be.equal(422, 'Status code does not match')
        expect(jsonMessage.errorMessage).to.not.equal(null, 'Error message not proper')
        expect(jsonMessage.errorCode).to.be.equal(104, 'Error code does not match')
        expect(payload.user.email).to.be.equal(process.env.EMAIL, 'Email id does not match')
        expect(payload.user.password).to.be.equal('contentstack', 'Password does not match')
        done()
      })
  })

  it('should Login user', done => {
    client.login({ email: process.env.EMAIL, password: process.env.PASSWORD }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      jsonWrite(response.user, 'loggedinuser.json')
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    })
      .catch(done)
  })

  it('should logout user', done => {
    client.logout()
      .then((response) => {
        expect(axios.defaults.headers.common.authtoken).to.be.equal(undefined)
        expect(response.notice).to.be.equal('You\'ve logged out successfully.')
        done()
      })
      .catch(done)
  })

  it('should login with credentials', done => {
    client.login({ email: process.env.EMAIL, password: process.env.PASSWORD }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      loggedinUserID = response.user.uid
      jsonWrite(response.user, 'loggedinuser.json')
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    })
      .catch(done)
  })

  it('should get Current user info test', done => {
    client.getUser().then((user) => {
      authtoken = user.authtoken
      expect(user.uid).to.be.equal(loggedinUserID)
      done()
    })
      .catch(done)
  })

  it('should get user info from authtoken', done => {
    contentstackClient(authtoken)
      .getUser()
      .then((user) => {
        expect(user.uid).to.be.equal(loggedinUserID)
        expect(true).to.be.equal(true)
        done()
      })
      .catch(done)
  })

  it('should get host for NA region by default', done => {
    const client = contentstack.client()
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('api.contentstack.io', 'region NA set correctly by default')
    done()
  })

  it('should get host for NA region', done => {
    const client = contentstack.client({ region: 'NA' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('api.contentstack.io', 'region NA set correctly')
    done()
  })

  it('should get host for NA region on priority', done => {
    const client = contentstack.client({ region: 'NA', host: 'dev11-api.csnonprod.com' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('api.contentstack.io', 'region NA set correctly with priority')
    done()
  })

  it('should get custom host', done => {
    const client = contentstack.client({ host: 'dev11-api.csnonprod.com' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('dev11-api.csnonprod.com', 'custom host set correctly')
    done()
  })

  it('should get host for EU region', done => {
    const client = contentstack.client({ region: 'EU' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('eu-api.contentstack.com', 'region EU set correctly')
    done()
  })

  it('should get host for AZURE_NA region', done => {
    const client = contentstack.client({ region: 'AZURE_NA' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('azure-na-api.contentstack.com', 'region AZURE_NA set correctly')
    done()
  })

  it('should get host for GCP_NA region', done => {
    const client = contentstack.client({ region: 'GCP_NA' })
    const baseUrl = client.axiosInstance.defaults.baseURL
    expect(baseUrl).to.include('gcp-na-api.contentstack.com', 'region GCP_NA set correctly')
    done()
  })

  it('should throw error for invalid region', done => {
    try {
      contentstack.client({ region: 'DUMMYREGION' })
      done(new Error('Expected error was not thrown for invalid region'))
    } catch (error) {
      expect(error.message).to.include('Invalid region', 'Error message should indicate invalid region')
      done()
    }
  })
})
