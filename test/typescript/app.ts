import { expect } from 'chai';
import * as dotenv from 'dotenv'
import { AppData, AppOAuth, Apps } from '../../types/marketplace'
import { Organization } from '../../types/organization';
dotenv.config()
let appUid = ''
let installationUid = ''

const app: AppData  = {
    name: 'My New App',
    description: 'My new test app',
    target_type: 'organization',
  }
const config: AppOAuth = { redirect_uri: 'https://example.com/oauth/callback', app_token_config: { enabled: true, scopes: ['scim:manage'] }, user_token_config: { enabled: true, scopes: ['user:read', 'user:write', 'scim:manage'], allow_pkce: true } }
  
export function createApp(apps: Apps) {
    describe('App create', () => { 
        test('Create App', done => {
            apps.create(app)
            .then((appResponse) => {
                appUid = appResponse.uid
                process.env.APP_UID =  appResponse.uid
                expect(appResponse.uid).to.not.equal(undefined)
                expect(appResponse.name).to.be.equal(app.name)
                expect(appResponse.description).to.be.equal(app.description)
                expect(appResponse.target_type).to.be.equal(app.target_type)
                done()
            })
            .catch(done)
        })
    })
}

export function fetchApp(organization: Organization) {
    describe('App fetch', () => { 
        test('Fetch App', done => {
            organization.app(appUid).fetch()
            .then((appResponse) => {
                expect(appResponse.uid).to.not.equal(undefined)
                expect(appResponse.name).to.be.equal(app.name)
                expect(appResponse.description).to.be.equal(app.description)
                expect(appResponse.target_type).to.be.equal(app.target_type)
                done()
            }).catch(done)
        })

        test('Find all Apps', done => {
            organization.app().findAll()
            .then((apps) => {
                for (const index in apps.items) {
                    const appObject = apps.items[index]
                    expect(appObject.name).to.not.equal(null)
                    expect(appObject.uid).to.not.equal(null)
                    expect(appObject.target_type).to.not.equal(null)
                  }
                done()
            }).catch(done)
        })
        test('Find all Authorized Apps', done => {
            organization.app().findAllAuthorized()
            .then((apps) => {
                for (const index in apps.data) {
                    const appObject = apps.data[index]
                    expect(appObject.name).to.not.equal(null)
                    expect(appObject.uid).to.not.equal(null)
                    expect(appObject.target_type).to.not.equal(null)
                  }
                done()
            }).catch(done)
        })
    })
}

export function updateApp(organization: Organization) {
    describe('App update', () => {
        test('Update App', done => {
            const appObj = organization.app(appUid)
            Object.assign(appObj, { name: 'My Updated App' })
            appObj.update()
            .then((appResponse) => {
                expect(appResponse.name).to.be.equal('My Updated App')
                expect(appResponse.description).to.be.equal(app.description)
                expect(appResponse.target_type).to.be.equal(app.target_type)
                done()
            })
            .catch(done)
        })
    })
}

export function updateAuth(organization: Organization) {
    describe('App update auth', () => {
        test('Update App auth', done => {
            organization.app(appUid).updateOAuth({config})
            .then((appResponse) => {
                expect(appResponse.redirect_uri).to.be.equal(config.redirect_uri)
                expect(appResponse.app_token_config!).to.deep.equal(config.app_token_config)
                expect(appResponse.user_token_config!).to.deep.equal(config.user_token_config)
                done()
            }).catch(done)
        })
    })
    describe('App update auth', () => {
        test('Update App auth', done => {
            organization.app(appUid).fetchOAuth()
            .then((appResponse) => {
                expect(appResponse.redirect_uri).to.be.equal(config.redirect_uri)
                expect(appResponse.app_token_config!).to.deep.equal(config.app_token_config)
                expect(appResponse.user_token_config!).to.deep.equal(config.user_token_config)
                done()
            }).catch(done)
        })
    })
}

export function installation(organization: Organization) {
    describe('App installation', () => {
        test('Install App', done => {
            organization.app(appUid).install({targetType: 'stack', targetUid: process.env.APIKEY as string})
            .then((installation) => {
                installationUid = installation.uid
                expect(installation.uid).to.not.equal(undefined)
                expect(installation.params.organization_uid).to.be.equal(process.env.ORGANIZATION as string)
                expect(installation.urlPath).to.be.equal(`/installations/${installation.uid}`)
                expect(installation.fetch).to.not.equal(undefined)
                expect(installation.update).to.not.equal(undefined)
                expect(installation.uninstall).to.not.equal(undefined)
                done()
            }).catch(done)
        })

        test('Get all installations', done => {
            organization.app(appUid).installation().findAll()
            .then((installations) => {
                for (const index in installations.items) {
                    const installationObject = installations.items[index]
                    expect(installationObject.uid).to.not.equal(null)
                    expect(installationObject.params.organization_uid).to.not.equal(null)
                    expect(installationObject.urlPath).to.not.equal(null)
                    expect(installationObject.fetch).to.not.equal(null)
                    expect(installationObject.update).to.not.equal(null)
                    expect(installationObject.uninstall).to.not.equal(null)
                  }
                done()
            }).catch(done)
        })

        test('Fetch App installation', done => {
            organization.app(appUid).installation(installationUid).fetch()
            .then((installation) => {
                expect(installation.uid).to.be.equal(installationUid)
                expect(installation.params.organization_uid).to.be.equal(process.env.ORGANIZATION as string)
                expect(installation.urlPath).to.be.equal(`/installations/${installation.uid}`)
                expect(installation.target.type).to.be.equal('stack')
                expect(installation.target.uid).to.be.equal(process.env.APIKEY)
                expect(installation.status).to.be.equal('installed')
                done()
            }).catch(done)
        })

        test('Get installation data for App installation', done => {
            organization.app(appUid).installation(installationUid).installationData()
            .then(() => {
                done()
            }).catch(done)
        })

        test('Get Configuration for App installation', done => {
            organization.app(appUid).installation(installationUid).configuration()
            .then(() => {
                done()
            }).catch(done)
        })

        test('Get Server Configuration for App installation', done => {
            organization.app(appUid).installation(installationUid).serverConfig()
            .then(() => {
                done()
            }).catch(done)
        })

        test('Set Configuration for App installation', done => {
            organization.app(appUid).installation(installationUid).setConfiguration({})
            .then(() => {
                done()
            }).catch(done)
        })
        test('Set Server Configuration for App installation', done => {
            organization.app(appUid).installation(installationUid).setServerConfig({})
            .then(() => {
                done()
            }).catch(done)
        })

        test('Uninstall App installation', done => {
            organization.app(appUid).installation(installationUid).uninstall()
            .then((installation) => {
                expect(installation).to.deep.equal({})
                done()
            }).catch(done)
        })
    })
}

export function deleteApp(organization: Organization) {
    describe('App delete', () => {
        test('Delete App', done => {
            organization.app(appUid).delete()
            .then((appResponse) => {
                expect(appResponse).to.deep.equal({})
                done()
            }).catch(done)
        })
    })
}