import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { expect } from 'chai'

dotenv.config()

// var stacks = {}
var orgID = process.env.ORGANIZATION
var client = {}
var appUid = ''
const app = {
  name: 'My New App',
  description: 'My new test app',
  target_type: 'organization'
}
const config = { redirect_uri: 'https://example.com/oauth/callback', app_token_config: { enabled: true, scopes: ['scim:manage'] }, user_token_config: { enabled: true, scopes: ['user:read', 'user:write', 'scim:manage'] } }

describe('Apps api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('Fetch all apps test', done => {
    client.organization(orgID).app().findAll()
      .then((apps) => {
        for (const index in apps.items) {
          const appObject = apps.items[index]
          expect(appObject.name).to.not.equal(null)
          expect(appObject.uid).to.not.equal(null)
          expect(appObject.target_type).to.not.equal(null)
        }
        done()
      })
      .catch(done)
  })

  it('Create app test', done => {
    client.organization(orgID).app().create(app)
      .then((appResponse) => {
        appUid = appResponse.uid
        expect(appResponse.uid).to.not.equal(undefined)
        expect(appResponse.name).to.be.equal(app.name)
        expect(appResponse.description).to.be.equal(app.description)
        expect(appResponse.target_type).to.be.equal(app.target_type)
        done()
      })
      .catch(done)
  })

  it('Fetch app test', done => {
    client.organization(orgID).app(appUid).fetch()
      .then((appResponse) => {
        expect(appResponse.uid).to.be.equal(appUid)
        expect(appResponse.name).to.be.equal(app.name)
        expect(appResponse.description).to.be.equal(app.description)
        expect(appResponse.target_type).to.be.equal(app.target_type)
        done()
      })
      .catch(done)
  })

  it('Update app test', done => {
    const updateApp = { name: 'Update my app Name' }
    let appObject = client.organization(orgID).app(appUid)
    appObject = Object.assign(appObject, updateApp)
    appObject.update()
      .then((appResponse) => {
        appUid = appResponse.uid
        expect(appResponse.uid).to.not.equal(undefined)
        expect(appResponse.name).to.be.equal(updateApp.name)
        expect(appResponse.description).to.be.equal(app.description)
        expect(appResponse.target_type).to.be.equal(app.target_type)
        done()
      })
      .catch(done)
  })

  it('Update OAuth app test', done => {
    client.organization(orgID).app(appUid).updateOAuth({ config })
      .then((appResponse) => {
        expect(appResponse.redirect_uri).to.be.equal(config.redirect_uri)
        expect(appResponse.app_token_config.enabled).to.be.equal(config.app_token_config.enabled)
        expect(appResponse.user_token_config.enabled).to.be.equal(config.user_token_config.enabled)
        done()
      })
      .catch(done)
  })

  it('Fetch OAuth app test', done => {
    client.organization(orgID).app(appUid).fetchOAuth()
      .then((appResponse) => {
        appUid = appResponse.uid
        expect(appResponse.redirect_uri).to.be.equal(config.redirect_uri)
        expect(appResponse.app_token_config.enabled).to.be.equal(config.app_token_config.enabled)
        expect(appResponse.user_token_config.enabled).to.be.equal(config.user_token_config.enabled)
        done()
      })
      .catch(done)
  })

  it('Delete app test', done => {
    client.organization(orgID).app(appUid).delete()
      .then((appResponse) => {
        done()
      })
      .catch(done)
  })
})
