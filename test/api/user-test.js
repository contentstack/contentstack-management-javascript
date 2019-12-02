import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonWrite } from '../utility/fileOperations/readwrite'
const contentstackClient = contentstack.client(axios, {})
var authToken = ''
var loggedinUserID = ''

describe('Contentstack User Session api Test', () => {
  it('User login wrong credentials', done => {
    contentstackClient.login({ email: 'uttam.ukkoji@contentstack.com', password: 'contentstack' })
      .then((response) => {
        console.log(response)
        done()
      }).catch((error) => {
        const jsonMessage = JSON.parse(error.message)
        const payload = JSON.parse(jsonMessage.request.data)
        expect(jsonMessage.status).to.be.equal(422, 'Status code does not match')
        expect(jsonMessage.errorMessage).to.not.equal(null, 'Error message not proper')
        expect(jsonMessage.errorCode).to.be.equal(104, 'Error code does not match')
        expect(payload.user.email).to.be.equal('uttam.ukkoji@contentstack.com', 'Email id does not match')
        expect(payload.user.password).to.be.equal('contentstack', 'Password does not match')
        done()
      })
  })

  it('User Login test', done => {
    contentstackClient.login({ email: 'uttam.ukkoji@contentstack.com', password: 'c0ntentst@ck' }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((response) => {
      loggedinUserID = response.user.uid
      jsonWrite(response.user, 'loggedinuser.json')
      expect(response.notice).to.be.equal('Login Successful.', 'Login success messsage does not match.')
      done()
    }).catch((error) => {
      console.log(error)
      done()
    })
  })

  it('Get Current user info test', done => {
    contentstackClient.getUser().then((user) => {
      authToken = user.authtoken
      expect(user.uid).to.be.equal(loggedinUserID)
      done()
    }).catch((error) => {
      console.log(error)
      expect(error).to.be.equal(null)
      done()
    })
  })

  it('Get user info from authtoken', done => {
    contentstack.client(axios, { authtoken: authToken })
      .getUser()
      .then((user) => {
        expect(user.uid).to.be.equal(loggedinUserID)
        expect(true).to.be.equal(true)
        done()
      }).catch((error) => {
        console.log(error)
        expect(error).to.be.equal(null)
        done()
      })
  })
})
