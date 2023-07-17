import { expect } from 'chai'
import { describe, it } from 'mocha'

import { contentstackClient } from '../utility/ContentstackClient'
import axios from 'axios'
import { jsonWrite } from '../utility/fileOperations/readwrite'
import dotenv from 'dotenv'
dotenv.config()
var authtoken = ''
var loggedinUserID = ''
var client = contentstackClient()
describe('Contentstack User Session api Test', () => {
  it('User login wrong credentials', done => {
    contentstackClient().login({ email: process.env.EMAIL, password: process.env.PASSWORD })
      .then((response) => {
        console.log(response)
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

  it('User Login test', done => {
    client.login({ email: process.env.EMAIL, password: process.env.PASSWORD }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      jsonWrite(response.user, 'loggedinuser.json')
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    })
      .catch(done)
  })

  it('User logout test', done => {
    client.logout()
      .then((response) => {
        expect(axios.defaults.headers.common.authtoken).to.be.equal(undefined)
        expect(response.notice).to.be.equal('You\'ve logged out successfully.')
        done()
      })
      .catch(done)
  })

  it('User login with credentials', done => {
    client.login({ email: process.env.EMAIL, password: process.env.PASSWORD }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      loggedinUserID = response.user.uid
      jsonWrite(response.user, 'loggedinuser.json')
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    })
      .catch(done)
  })

  it('Get Current user info test', done => {
    client.getUser().then((user) => {
      authtoken = user.authtoken
      expect(user.uid).to.be.equal(loggedinUserID)
      done()
    })
      .catch(done)
  })

  it('Get user info from authtoken', done => {
    contentstackClient(authtoken)
      .getUser()
      .then((user) => {
        expect(user.uid).to.be.equal(loggedinUserID)
        expect(true).to.be.equal(true)
        done()
      })
      .catch(done)
  })
})
