import Axios from 'axios'
import { expect } from 'chai'
import { Marketplace } from '../../lib/marketplace'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { appsMock } from './mock/objects'
import { App } from '../../lib/marketplace/app'
import { Installation } from '../../lib/marketplace/installation'
import { AppRequest } from '../../lib/marketplace/apprequest'
describe('marketplace test', () => {
  it('should create Marketplace object with params when marketplace function is called with data', () => {
    const mktplace = marketplaceObj({ organization_uid: 'organization_uid' })
    expect(mktplace).to.be.instanceOf(Marketplace)
    expect(mktplace.app).to.not.equal(undefined)
    expect(mktplace.appRequests).to.not.equal(undefined)
    expect(mktplace.findAllApps).to.not.equal(undefined)
    expect(mktplace.findAllAuthorizedApps).to.not.equal(undefined)
    expect(mktplace.installation).to.not.equal(undefined)
    expect(mktplace.params).to.be.eql({ organization_uid: 'organization_uid' })
  })

  it('should create Marketplace object without params when marketplace function is called without data', () => {
    const mktplace = marketplaceObj({})
    expect(mktplace).to.be.instanceOf(Marketplace)
    expect(mktplace.app).to.not.equal(undefined)
    expect(mktplace.appRequests).to.not.equal(undefined)
    expect(mktplace.findAllApps).to.not.equal(undefined)
    expect(mktplace.findAllAuthorizedApps).to.not.equal(undefined)
    expect(mktplace.installation).to.not.equal(undefined)
    expect(mktplace.params).to.be.eql({})
  })

  it('should get object of App when app function is called with uid', () => {
    const appUid = 'manifestUid'
    const app = marketplaceObj({}).app(appUid)
    const appWithoutUid = marketplaceObj({}).app()

    expect(app).to.be.instanceOf(App)
    expect(app.uid).to.be.equal(appUid)
    expect(app.create).to.be.equal(undefined)

    expect(appWithoutUid).to.be.instanceOf(App)
    expect(appWithoutUid.uid).to.be.equal(undefined)
    expect(appWithoutUid.create).to.not.equal(undefined)
  })

  it('should get object of Installation when installation function is called with uid', () => {
    const instUid = 'manifestUid'
    const instObj = marketplaceObj({}).installation(instUid)
    const instObjWithoutUid = marketplaceObj({}).installation()

    expect(instObj).to.be.instanceOf(Installation)
    expect(instObj.uid).to.be.equal(instUid)
    expect(instObj.fetch).to.not.equal(undefined)
    expect(instObj.fetchAll).to.be.equal(undefined)

    expect(instObjWithoutUid).to.be.instanceOf(Installation)
    expect(instObjWithoutUid.uid).to.be.equal(undefined)
    expect(instObjWithoutUid.fetch).to.be.equal(undefined)
    expect(instObjWithoutUid.fetchAll).to.not.equal(undefined)
  })

  it('should get object of AppRequest when appRequests function is called', () => {
    const appReq = marketplaceObj({}).appRequests()
    expect(appReq).to.be.instanceOf(AppRequest)
  })

  it('should get all apps in organization when findAllApps is called', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests`).reply(200, appsMock)

    marketplaceObj({})
      .findAllApps()
      .then((response) => {
        expect(response.items[0].visibility).to.be.equal(appsMock.data[0].visibility)
        expect(response.items[0].description).to.be.equal(appsMock.data[0].description)
        expect(response.items[0].name).to.be.equal(appsMock.data[0].name)
        expect(response.items[0].organization_uid).to.be.equal(appsMock.data[0].organization_uid)
        expect(response.items[0].created_at).to.be.equal(appsMock.data[0].created_at)
        expect(response.items[0].updated_at).to.be.equal(appsMock.data[0].updated_at)
        expect(response.items[0].uid).to.be.equal(appsMock.data[0].uid)
        done()
      })
      .catch(done)
  })

  it('should provide proper error response when findAllApps fails', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/manifests`).reply(400, {})

    marketplaceObj({})
      .findAllApps()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })

  it('Get all authorized apps in organization test', done => {
    const content = {
      visibility: 'private',
      description: 'This is a test App.',
      name: 'New App',
      org_id: 'org_uid',
      created_at: '2021-07-20T13:34:54.791Z',
      updated_at: '2021-07-27T14:05:19.452Z',
      id: 'id'
    }
    const mock = new MockAdapter(Axios)
    mock.onGet(`/authorized-apps`).reply(200, {
      data: [
        content
      ]
    })

    marketplaceObj({})
      .findAllAuthorizedApps({ skip: 10 })
      .then((response) => {
        expect(response.data[0].visibility).to.be.equal(content.visibility)
        expect(response.data[0].description).to.be.equal(content.description)
        expect(response.data[0].name).to.be.equal(content.name)
        expect(response.data[0].org_id).to.be.equal(content.org_id)
        expect(response.data[0].created_at).to.be.equal(content.created_at)
        expect(response.data[0].updated_at).to.be.equal(content.updated_at)
        expect(response.data[0].id).to.be.equal(content.id)
        done()
      })
      .catch(done)
  })

  it('Get all authorized apps in organization fail request', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/authorized-apps`).reply(400, {})

    marketplaceObj({})
      .findAllAuthorizedApps()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(undefined)
        done()
      })
  })
})

function marketplaceObj (data) {
  return new Marketplace(Axios, data)
}
