import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import ContentstackClient from '../../lib/contentstackClient'
import { expect } from 'chai'
import { describe, it, after } from 'mocha'
import nock from 'nock'

const host = 'http://localhost/'
axios.defaults.host = host
axios.defaults.adapter = httpAdapter

describe('Contentstack Client', () => {
  after('all', function () {
    nock.restore()
    nock.cleanAll()
  })

  it('Contentstack Client Object successful', done => {
    var contentstackClient = ContentstackClient({ http: axios })
    expect(contentstackClient).to.not.equal(null, 'Contentstack client object should not be undefine')
    done()
  })

  it('Contentstack Client login success', done => {
    nock(host)
      .post('/user-session', {})
      .reply(200, 'test data')
    ContentstackClient({ http: axios })
      .login()
      .then((response) => {
        expect(response).to.be.equal('test data')
        done()
      })
  })

  it('Contentstack Client get user info', done => {
    nock(host)
      .get('/user')
      .reply(200, {
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
  })
  // it('Contentstack Client get Stack', done => {
  //   const stack = ContentstackClient({ http: axios })
  //     .stack()
  //   stack.create
  // })
})
