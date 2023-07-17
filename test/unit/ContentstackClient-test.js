import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import ContentstackClient from '../../lib/contentstackClient'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
var host = 'http://localhost/'

describe('Contentstack Client', () => {
  beforeEach(function () {
    host = 'http://localhost/'
    axios.defaults.host = host
    axios.defaults.adapter = httpAdapter
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
