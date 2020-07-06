import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import path from 'path'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { webhook, updateWebhook } from '../unit/mock/webhook'
import { cloneDeep } from 'lodash'
var client = {}

var stack = {}
var webhookUid = 'bltb0ef6da267d340ea'
describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Create Webhook', done => {
    makeWebhook()
      .create(webhook)
      .then((response) => {
        webhookUid = response.uid
        expect(response.uid).to.be.not.equal(null)
        expect(response.name).to.be.equal(webhook.webhook.name)
        expect(response.destinations[0].target_url).to.be.equal(webhook.webhook.destinations[0].target_url)
        expect(response.destinations[0].http_basic_auth).to.be.equal(webhook.webhook.destinations[0].http_basic_auth)
        expect(response.destinations[0].http_basic_password).to.be.equal(webhook.webhook.destinations[0].http_basic_password)
        expect(response.channels[0]).to.be.equal(webhook.webhook.channels[0])
        expect(response.retry_policy).to.be.equal(webhook.webhook.retry_policy)
        expect(response.disabled).to.be.equal(webhook.webhook.disabled)
        done()
      })
      .catch(done)
  })

  it('Fetch Webhook', done => {
    makeWebhook(webhookUid)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(webhookUid)
        expect(response.name).to.be.equal(webhook.webhook.name)
        expect(response.destinations[0].target_url).to.be.equal(webhook.webhook.destinations[0].target_url)
        expect(response.destinations[0].http_basic_auth).to.be.equal(webhook.webhook.destinations[0].http_basic_auth)
        expect(response.destinations[0].http_basic_password).to.be.equal(webhook.webhook.destinations[0].http_basic_password)
        expect(response.channels[0]).to.be.equal(webhook.webhook.channels[0])
        expect(response.retry_policy).to.be.equal(webhook.webhook.retry_policy)
        expect(response.disabled).to.be.equal(webhook.webhook.disabled)
        done()
      })
      .catch(done)
  })

  it('Fetch and update Webhook', done => {
    makeWebhook(webhookUid)
      .fetch()
      .then((webhookRes) => {
        Object.assign(webhookRes, cloneDeep(updateWebhook.webhook))
        return webhookRes.update()
      })
      .then((response) => {
        expect(response.uid).to.be.equal(webhookUid)
        expect(response.name).to.be.equal(updateWebhook.webhook.name)
        expect(response.destinations[0].target_url).to.be.equal(updateWebhook.webhook.destinations[0].target_url)
        expect(response.destinations[0].http_basic_auth).to.be.equal(updateWebhook.webhook.destinations[0].http_basic_auth)
        expect(response.destinations[0].http_basic_password).to.be.equal(updateWebhook.webhook.destinations[0].http_basic_password)
        expect(response.channels[0]).to.be.equal(updateWebhook.webhook.channels[0])
        expect(response.retry_policy).to.be.equal(updateWebhook.webhook.retry_policy)
        expect(response.disabled).to.be.equal(updateWebhook.webhook.disabled)
        done()
      })
      .catch(done)
  })

  it('Update Webhook', done => {
    var webhookObject = makeWebhook(webhookUid)
    Object.assign(webhookObject, cloneDeep(updateWebhook.webhook))
    webhookObject.update()
      .then((response) => {
        expect(response.uid).to.be.equal(webhookUid)
        expect(response.name).to.be.equal(updateWebhook.webhook.name)
        expect(response.destinations[0].target_url).to.be.equal(updateWebhook.webhook.destinations[0].target_url)
        expect(response.destinations[0].http_basic_auth).to.be.equal(updateWebhook.webhook.destinations[0].http_basic_auth)
        expect(response.destinations[0].http_basic_password).to.be.equal(updateWebhook.webhook.destinations[0].http_basic_password)
        expect(response.channels[0]).to.be.equal(updateWebhook.webhook.channels[0])
        expect(response.retry_policy).to.be.equal(updateWebhook.webhook.retry_policy)
        expect(response.disabled).to.be.equal(updateWebhook.webhook.disabled)
        done()
      })
      .catch(done)
  })

  it('Import Webhook', done => {
    makeWebhook().import({
      webhook: path.join(__dirname, '../unit/mock/webhook.json')
    })
      .then((response) => {
        expect(response.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get executions of a webhook', done => {
    const asset = {
      upload: path.join(__dirname, '../unit/mock/webhook.json')
    }
    client.stack(stack.api_key).asset().create(asset)
      .then((assetFile) => {
        makeWebhook(webhookUid).executions()
          .then((response) => {
            console.log(response)
            response.webhooks.forEach(webhook => {
              expect(webhook.uid).to.be.not.equal(null)
              expect(webhook.status).to.be.equal(200)
              expect(webhook.event_data.module).to.be.equal('asset')
              expect(webhook.event_data.api_key).to.be.equal(stack.api_key)

              const webhookasset = webhook.event_data.data.asset
              expect(webhookasset.uid).to.be.equal(assetFile.uid)
              expect(webhookasset.filename).to.be.equal(assetFile.filename)
              expect(webhookasset.url).to.be.equal(assetFile.url)
              expect(webhookasset.title).to.be.equal(assetFile.title)

              expect(webhook.webhooks[0]).to.be.equal(webhookUid)
              expect(webhook.channel[0]).to.be.equal('assets.create')
            })
            done()
          })
          .catch(done)
      })
  })
})

function makeWebhook (uid = null) {
  return client.stack(stack.api_key).webhook(uid)
}
