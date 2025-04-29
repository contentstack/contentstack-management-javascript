import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Webhook, WebhookCollection, createFormData } from '../../lib/stack/webhook'
import { systemUidMock, stackHeadersMock, webhookMock, checkSystemFields, noticeMock } from './mock/objects'

describe('Contentstack Webhook test', () => {
  it('Webhook test without uid', done => {
    const webhook = makeWebhook()
    expect(webhook.urlPath).to.be.equal('/webhooks')
    expect(webhook.stackHeaders).to.be.equal(undefined)
    expect(webhook.update).to.be.equal(undefined)
    expect(webhook.delete).to.be.equal(undefined)
    expect(webhook.fetch).to.be.equal(undefined)
    expect(webhook.executions).to.be.equal(undefined)
    expect(webhook.retry).to.be.equal(undefined)
    expect(webhook.create).to.not.equal(undefined)
    expect(webhook.fetchAll).to.not.equal(undefined)
    expect(webhook.import).to.not.equal(undefined)
    done()
  })

  it('Webhook test with uid', done => {
    const webhook = makeWebhook({ webhook: { ...systemUidMock } })
    expect(webhook.urlPath).to.be.equal('/webhooks/UID')
    expect(webhook.uid).to.be.equal('UID')
    expect(webhook.stackHeaders).to.be.equal(undefined)
    expect(webhook.update).to.not.equal(undefined)
    expect(webhook.delete).to.not.equal(undefined)
    expect(webhook.fetch).to.not.equal(undefined)
    expect(webhook.executions).to.not.equal(undefined)
    expect(webhook.retry).to.not.equal(undefined)
    expect(webhook.create).to.be.equal(undefined)
    expect(webhook.fetchAll).to.be.equal(undefined)
    expect(webhook.import).to.not.equal(undefined)
    done()
  })

  it('Webhook test with uid and stack headers', done => {
    const webhook = makeWebhook({ webhook: { ...systemUidMock }, stackHeaders: { ...stackHeadersMock } })
    expect(webhook.urlPath).to.be.equal('/webhooks/UID')
    expect(webhook.uid).to.be.equal('UID')
    expect(webhook.stackHeaders).to.not.equal(undefined)
    expect(webhook.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(webhook.update).to.not.equal(undefined)
    expect(webhook.delete).to.not.equal(undefined)
    expect(webhook.fetch).to.not.equal(undefined)
    expect(webhook.executions).to.not.equal(undefined)
    expect(webhook.retry).to.not.equal(undefined)
    expect(webhook.create).to.be.equal(undefined)
    expect(webhook.fetchAll).to.be.equal(undefined)
    expect(webhook.import).to.not.equal(undefined)
    done()
  })

  it('Webhook Collection test with blank data', done => {
    const webhook = new WebhookCollection(Axios, {})
    expect(webhook.length).to.be.equal(0)
    done()
  })

  it('Webhook Collection test with data', done => {
    const webhook = new WebhookCollection(Axios, {
      webhooks: [
        webhookMock
      ]
    })
    expect(webhook.length).to.be.equal(1)
    checkWebhook(webhook[0])
    done()
  })

  it('Webhook create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/webhooks').reply(200, {
      webhook: {
        ...webhookMock
      }
    })
    makeWebhook()
      .create()
      .then((webhook) => {
        checkWebhook(webhook)
        done()
      })
      .catch(done)
  })

  it('Webhook Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks').reply(200, {
      webhooks: [
        webhookMock
      ]
    })
    makeWebhook()
      .fetchAll()
      .then((webhooks) => {
        checkWebhook(webhooks.items[0])
        done()
      })
      .catch(done)
  })

  it('Webhook Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks').reply(200, {
      webhooks: [
        webhookMock
      ]
    })
    makeWebhook({ stackHeaders: stackHeadersMock })
      .fetchAll({})
      .then((webhooks) => {
        checkWebhook(webhooks.items[0])
        done()
      })
      .catch(done)
  })

  it('Webhook Fetch all without paramstest', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks').reply(200, {
      webhooks: [
        webhookMock
      ]
    })
    makeWebhook({ stackHeaders: stackHeadersMock })
      .fetchAll(null)
      .then((webhooks) => {
        checkWebhook(webhooks.items[0])
        done()
      })
      .catch(done)
  })

  it('Webhook update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/webhooks/UID').reply(200, {
      webhook: {
        ...webhookMock
      }
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((webhook) => {
        checkWebhook(webhook)
        done()
      })
      .catch(done)
  })

  it('Webhook fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks/UID').reply(200, {
      webhook: {
        ...webhookMock
      }
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((webhook) => {
        checkWebhook(webhook)
        done()
      })
      .catch(done)
  })

  it('Webhook delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/webhooks/UID').reply(200, {
      ...noticeMock
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((webhook) => {
        expect(webhook.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Webhook executions without Stack details test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks/UID/executions').reply(200, {
      webhooks: [
        systemUidMock
      ]
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      }
    })
      .executions()
      .then((response) => {
        expect(response.webhooks.length).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('Webhook executions test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks/UID/executions').reply(200, {
      webhooks: [
        systemUidMock
      ]
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .executions()
      .then((response) => {
        expect(response.webhooks.length).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('Webhook executions params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/webhooks/UID/executions').reply(200, {
      webhooks: [
        systemUidMock
      ]
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .executions({ skip: 1 })
      .then((response) => {
        expect(response.webhooks.length).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('Webhook retry without Stack details test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/webhooks/UID/retry').reply(200, {
      ...noticeMock
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      }
    })
      .retry()
      .then((webhook) => {
        expect(webhook.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Webhook retry test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/webhooks/UID/retry').reply(200, {
      ...noticeMock
    })
    makeWebhook({
      webhook: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .retry('exe_id')
      .then((webhook) => {
        expect(webhook.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Webhook import test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/webhooks/import').reply(200, {
      webhook: {
        ...webhookMock
      }
    })
    const webhookUpload = { webhook: path.join(__dirname, '../sanity-check/mock/customUpload.html') }
    const form = createFormData(webhookUpload)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeWebhook()
      .import(webhookUpload)
      .then((webhook) => {
        checkWebhook(webhook)
        done()
      })
      .catch(done)
  })
})

function makeWebhook (data) {
  return new Webhook(Axios, data)
}

function checkWebhook (webhook) {
  checkSystemFields(webhook)
  expect(webhook.name).to.be.equal('Test')
  expect(webhook.retry_policy).to.be.equal('manual')
  expect(webhook.channels.length).to.be.equal(1)
  expect(webhook.destinations.length).to.be.equal(1)
}
