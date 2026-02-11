import axios from 'axios'
import ContentstackClient from '../../lib/contentstackClient'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import MockAdapter from 'axios-mock-adapter'

var host = 'http://localhost/'

describe('Contentstack Client', () => {
  beforeEach(function () {
    host = 'http://localhost/'
    axios.defaults.host = host
    axios.defaults.adapter = 'http'
  })

  it('Contentstack Client Object successful', done => {
    var contentstackClient = ContentstackClient({ http: axios })
    expect(contentstackClient).to.not.equal(null, 'Contentstack client object should not be undefine')
    done()
  })

  it('Contentstack Client login success', done => {
    var mock = new MockAdapter(axios)
    mock.onPost('/user-session').reply(200, {
      user: {
        authtoken: 'Test Auth'
      }
    })
    ContentstackClient({ http: axios })
      .login()
      .then((response) => {
        expect(response.user.authtoken).to.be.equal('Test Auth')
        done()
      })
      .catch(done)
  })
  it('Contentstack Client get user info', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/user').reply(200, {
      user: {
        uid: 'test uid'
      }
    })
    ContentstackClient({ http: axios })
      .getUser()
      .then((user) => {
        expect(user.uid).to.be.equal('test uid')
        done()
      })
      .catch(done)
  })

  it('Contentstack Client Logout with Authtoken', done => {
    var mock = new MockAdapter(axios)
    mock.onDelete('/user-session').reply(200, {
      notice: 'You\'ve logged out successfully'
    })
    ContentstackClient({ http: axios })
      .logout('Test Auth')
      .then((response) => {
        expect(response.notice).to.be.equal('You\'ve logged out successfully')
        done()
      })
      .catch(done)
  })

  it('Contentstack Client Logout', done => {
    var mock = new MockAdapter(axios)
    mock.onDelete('/user-session').reply(200, {
      notice: 'You\'ve logged out successfully'
    })
    axios.defaults.headers = {
      common: {
        authtoken: 'Authtoken'
      },
      authtoken: 'Authtoken'

    }
    axios.httpClientParams = {
      headers: {
        authtoken: 'Authtoken'
      },
      authtoken: 'Authtoken'
    }

    ContentstackClient({ http: axios })
      .logout()
      .then((response) => {
        expect(response.notice).to.be.equal('You\'ve logged out successfully')
        done()
      })
      .catch(done)
  })

  it('Contentstack Client Organization without UID test', done => {
    const organization = ContentstackClient({ http: axios }).organization()
    expect(organization.urlPath).to.be.equal('/organizations')
    expect(organization.fetchAll).to.not.equal(undefined)
    expect(organization.fetch).to.be.equal(undefined)
    done()
  })

  it('Contentstack Client Organization with UID test', done => {
    const organizationWithUID = ContentstackClient({ http: axios }).organization('ORGUID')
    expect(organizationWithUID.urlPath).to.be.equal('/organizations/ORGUID')
    expect(organizationWithUID.uid).to.be.equal('ORGUID')
    expect(organizationWithUID.fetchAll).to.be.equal(undefined)
    expect(organizationWithUID.fetch).to.not.equal(undefined)
    done()
  })

  it('Contentstack Client Stack without API key test', done => {
    const stack = ContentstackClient({ http: axios }).stack()
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.delete).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Contentstack Client Stack with Org UID test', done => {
    const stack = ContentstackClient({ http: axios }).stack({ organization_uid: 'ORG_UID' })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal('ORG_UID')
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.delete).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Contentstack Client Stack with API key test', done => {
    const stack = ContentstackClient({ http: axios }).stack({ api_key: 'stack_api_key' })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })

  describe('Enhanced Login Tests', () => {
    let mock

    beforeEach(() => {
      mock = new MockAdapter(axios)
    })

    it('should handle direct login with tfa_token', done => {
      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user).to.deep.equal({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456'
        })
        return [200, {
          user: {
            authtoken: 'Test Auth With TFA',
            email: 'test@example.com'
          }
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456'
        })
        .then(response => {
          expect(response.user.authtoken).to.equal('Test Auth With TFA')
          expect(response.user.email).to.equal('test@example.com')
          done()
        })
        .catch(done)
    })

    it('should handle login with TOTP secret', done => {
      const mfaSecret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP'

      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user.email).to.equal('test@example.com')
        expect(data.user.password).to.equal('password123')
        expect(data.user.tfa_token).to.have.lengthOf(6)
        expect(data.user.tfa_token).to.match(/^\d{6}$/)
        expect(data.user.mfaSecret).to.equal(undefined)
        return [200, {
          user: {
            authtoken: 'Test Auth With TOTP',
            email: 'test@example.com'
          }
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          mfaSecret: mfaSecret
        })
        .then(response => {
          expect(response.user.authtoken).to.equal('Test Auth With TOTP')
          expect(response.user.email).to.equal('test@example.com')
          done()
        })
        .catch(done)
    })

    it('should prioritize tfa_token over mfaSecret', done => {
      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user).to.deep.equal({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456'
        })
        return [200, {
          user: {
            authtoken: 'Test Auth Direct TFA',
            email: 'test@example.com'
          }
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456',
          mfaSecret: 'MFASECRET'
        })
        .then(response => {
          expect(response.user.authtoken).to.equal('Test Auth Direct TFA')
          expect(response.user.email).to.equal('test@example.com')
          done()
        })
        .catch(done)
    })

    it('should handle 2FA requirement response', done => {
      mock.onPost('/user-session').reply(function (config) {
        const data = JSON.parse(config.data)
        expect(data.user).to.deep.equal({
          email: 'test@example.com',
          password: 'password123'
        })
        return [422, {
          error_message: 'Please login using the Two-Factor verification Token',
          error_code: 294,
          errors: [],
          tfa_type: 'totp_authenticator'
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123'
        })
        .then(() => {
          done(new Error('Expected 2FA error was not thrown'))
        })
        .catch(error => {
          try {
            const errorData = JSON.parse(error.message)
            expect(errorData.errorCode).to.equal(294)
            expect(errorData.errorMessage).to.include('Two-Factor verification')
            expect(errorData.errors).to.be.an('array').with.lengthOf(0)
            expect(errorData.tfa_type).to.equal('totp_authenticator')
            done()
          } catch (e) {
            done(e)
          }
        })
    })

    it('should handle invalid 2FA token', done => {
      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user.tfa_token).to.equal('111111')
        return [422, {
          error_message: 'Invalid verification code',
          error_code: 295,
          errors: []
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '111111'
        })
        .then(() => {
          done(new Error('Expected invalid token error was not thrown'))
        })
        .catch(error => {
          expect(error.errorCode).to.equal(295)
          expect(error.errorMessage).to.include('Invalid verification code')
          expect(error.errors).to.be.an('array').with.lengthOf(0)
          done()
        })
    })

    it('should handle both tfa_token and mfaSecret with tfa_token taking precedence', done => {
      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user).to.deep.equal({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456'
        })
        return [200, {
          user: {
            authtoken: 'Test Auth',
            email: 'test@example.com'
          }
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          tfa_token: '123456',
          mfaSecret: 'MFASECRET'
        })
        .then(response => {
          expect(response.user.authtoken).to.equal('Test Auth')
          expect(response.user.email).to.equal('test@example.com')
          done()
        })
        .catch(done)
    })

    it('should generate tfa_token from mfaSecret when no tfa_token provided', done => {
      mock.onPost('/user-session').reply(config => {
        const data = JSON.parse(config.data)
        expect(data.user.email).to.equal('test@example.com')
        expect(data.user.password).to.equal('password123')
        expect(data.user.tfa_token).to.match(/^\d{6}$/)
        expect(data.user.mfaSecret).to.equal(undefined)
        return [200, {
          user: {
            authtoken: 'Test Auth',
            email: 'test@example.com'
          }
        }]
      })

      ContentstackClient({ http: axios })
        .login({
          email: 'test@example.com',
          password: 'password123',
          mfaSecret: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP'
        })
        .then(response => {
          expect(response.user.authtoken).to.equal('Test Auth')
          expect(response.user.email).to.equal('test@example.com')
          done()
        })
        .catch(done)
    })
  })

  it('Contentstack Client Stack with API key and management token test', done => {
    const stack = ContentstackClient({ http: axios }).stack({ api_key: 'stack_api_key', management_token: 'stack_management_token' })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })
})
