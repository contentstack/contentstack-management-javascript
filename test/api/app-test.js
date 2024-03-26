import dotenv from 'dotenv'
import { describe, it, setup } from 'mocha'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { expect } from 'chai'
import * as contentstack from '../../lib/contentstack.js'

dotenv.config()

let stack = {}
const orgID = process.env.ORGANIZATION
let client = {}
let appUid = ''
let installationUid = ''
const app = {
  name: 'My New App',
  description: 'My new test app',
  target_type: 'organization'
}
const config = { redirect_uri: 'https://example.com/oauth/callback', app_token_config: { enabled: true, scopes: ['scim:manage'] }, user_token_config: { enabled: true, scopes: ['user:read', 'user:write', 'scim:manage'], allow_pkce: true } }

describe('Apps api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstack.client({ host: process.env.APP_HOST, defaultHostName: process.env.DEFAULTHOST, authtoken: user.authtoken })
    stack = jsonReader('stack.json')
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

  it('Fetch all authorized apps test', done => {
    client.organization(orgID).app().findAllAuthorized()
      .then((apps) => {
        for (const index in apps.data) {
          const appObject = apps.data[index]
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
        jsonWrite(appResponse, 'apps.json')
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
    const updateApp = { name: 'Update my app name' }
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
        expect(appResponse.redirect_uri).to.be.equal(config.redirect_uri)
        expect(appResponse.app_token_config.enabled).to.be.equal(config.app_token_config.enabled)
        expect(appResponse.user_token_config.enabled).to.be.equal(config.user_token_config.enabled)
        done()
      })
      .catch(done)
  })

  it('Install app test', done => {
    client.organization(orgID).app(appUid).install({ targetType: 'organization', targetUid: process.env.ORGANIZATION })
      .then((installation) => {
        installationUid = installation.uid
        jsonWrite(installation, 'installation.json')
        expect(installation.uid).to.not.equal(undefined)
        expect(installation.params.organization_uid).to.be.equal(orgID)
        expect(installation.urlPath).to.be.equal(`/installations/${installation.uid}`)
        expect(installation.fetch).to.not.equal(undefined)
        expect(installation.update).to.not.equal(undefined)
        expect(installation.uninstall).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Get installationData for installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).installationData()
      .then((installation) => {
        expect(installation).to.not.equal(null)
        done()
      }).catch(done)
  })

  it('Get configuration for installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).configuration()
      .then((config) => {
        expect(config).to.not.equal(null)
        done()
      }).catch(done)
  })
  it('Set configuration for installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).setConfiguration({})
      .then((config) => {
        expect(config.data).to.deep.equal({})
        done()
      }).catch(done)
  })
  it('Get server config for installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).serverConfig()
      .then((config) => {
        expect(config).to.not.equal(null)
        done()
      }).catch(done)
  })
  it('Set server config for installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).setServerConfig({})
      .then((config) => {
        expect(config.data).to.deep.equal({})
        done()
      }).catch(done)
  })

  it('Fetch installation test', done => {
    client.organization(orgID).app(appUid).installation(installationUid).fetch()
      .then((installation) => {
        expect(installation.uid).to.be.equal(installationUid)
        expect(installation.params.organization_uid).to.be.equal(orgID)
        expect(installation.urlPath).to.be.equal(`/installations/${installation.uid}`)
        expect(installation.target.type).to.be.equal('organization')
        expect(installation.target.uid).to.be.equal(orgID)
        expect(installation.status).to.be.equal('installed')
        done()
      }).catch(done)
  })
  it('test fetch app request', done => {
    client.organization(orgID).app(appUid)
      .getRequests()
      .then((response) => {
        expect(response.data).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })
})
