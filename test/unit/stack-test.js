import { describe, it } from 'mocha'
import { Stack, StackCollection } from '../../lib/stack/index'
import Axios from 'axios'
import { expect } from 'chai'
import { stackMock, noticeMock, systemUidMock, stackHeadersMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'

describe('Contentstack Stack test', () => {
  it('Stack without API key', done => {
    const stack = makeStack({})
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.branch).to.be.equal(undefined)
    expect(stack.branchAlias).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.workflow).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.updateUsersRoles).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Stack without data', done => {
    const stack = makeStack()
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.branch).to.be.equal(undefined)
    expect(stack.branchAlias).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.workflow).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.updateUsersRoles).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Stack without API key, with Management Token', done => {
    const stack = makeStack({ stack: { management_token: 'Management_Token' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.branch).to.be.equal(undefined)
    expect(stack.branchAlias).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.workflow).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.updateUsersRoles).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Stack without API key, with Branch', done => {
    const stack = makeStack({ stack: { branch_name: 'branch' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.branch).to.be.equal(undefined)
    expect(stack.branchAlias).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.workflow).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.updateUsersRoles).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Stack with Organization UID', done => {
    const stack = makeStack({ organization_uid: 'UID' })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal('UID')
    expect(stack.stackHeaders).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal(undefined)
    expect(stack.create).to.not.equal(undefined)
    expect(stack.query).to.not.equal(undefined)
    expect(stack.update).to.be.equal(undefined)
    expect(stack.fetch).to.be.equal(undefined)
    expect(stack.contentType).to.be.equal(undefined)
    expect(stack.locale).to.be.equal(undefined)
    expect(stack.asset).to.be.equal(undefined)
    expect(stack.globalField).to.be.equal(undefined)
    expect(stack.environment).to.be.equal(undefined)
    expect(stack.branch).to.be.equal(undefined)
    expect(stack.branchAlias).to.be.equal(undefined)
    expect(stack.deliveryToken).to.be.equal(undefined)
    expect(stack.extension).to.be.equal(undefined)
    expect(stack.webhook).to.be.equal(undefined)
    expect(stack.workflow).to.be.equal(undefined)
    expect(stack.label).to.be.equal(undefined)
    expect(stack.release).to.be.equal(undefined)
    expect(stack.bulkOperation).to.be.equal(undefined)
    expect(stack.users).to.be.equal(undefined)
    expect(stack.updateUsersRoles).to.be.equal(undefined)
    expect(stack.transferOwnership).to.be.equal(undefined)
    expect(stack.settings).to.be.equal(undefined)
    expect(stack.resetSettings).to.be.equal(undefined)
    expect(stack.addSettings).to.be.equal(undefined)
    expect(stack.share).to.be.equal(undefined)
    expect(stack.unShare).to.be.equal(undefined)
    expect(stack.role).to.be.equal(undefined)
    done()
  })

  it('Stack with API key', done => {
    const stack = makeStack({ stack: { api_key: 'API_KEY' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.not.equal(undefined)
    expect(stack.stackHeaders.api_key).to.be.equal('API_KEY')
    expect(stack.stackHeaders.authorization).to.be.equal(undefined)
    expect(stack.api_key).to.be.equal('API_KEY')
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.branch).to.not.equal(undefined)
    expect(stack.branchAlias).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.workflow).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.updateUsersRoles).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })

  it('Stack with API key and Management token', done => {
    const stack = makeStack({ stack: { api_key: 'API_KEY', management_token: 'Management_Token' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.not.equal(undefined)
    expect(stack.stackHeaders.api_key).to.be.equal('API_KEY')
    expect(stack.api_key).to.be.equal('API_KEY')
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.branch).to.not.equal(undefined)
    expect(stack.branchAlias).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.workflow).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.updateUsersRoles).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })

  it('Stack with API key and Management token', done => {
    const stack = makeStack({ stack: { api_key: 'API_KEY', branch_name: 'branch' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.not.equal(undefined)
    expect(stack.stackHeaders.api_key).to.be.equal('API_KEY')
    expect(stack.branch_name).to.be.equal('branch')
    expect(stack.api_key).to.be.equal('API_KEY')
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.branch).to.not.equal(undefined)
    expect(stack.branchAlias).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.workflow).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.updateUsersRoles).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })

  it('Stack with API key and Management token', done => {
    const stack = makeStack({ stack: { api_key: 'API_KEY', management_token: 'Management_Token', branch_name: 'branch' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.not.equal(undefined)
    expect(stack.stackHeaders.api_key).to.be.equal('API_KEY')
    expect(stack.branch_name).to.be.equal('branch')
    expect(stack.api_key).to.be.equal('API_KEY')
    expect(stack.create).to.be.equal(undefined)
    expect(stack.query).to.be.equal(undefined)
    expect(stack.update).to.not.equal(undefined)
    expect(stack.fetch).to.not.equal(undefined)
    expect(stack.contentType).to.not.equal(undefined)
    expect(stack.locale).to.not.equal(undefined)
    expect(stack.asset).to.not.equal(undefined)
    expect(stack.globalField).to.not.equal(undefined)
    expect(stack.environment).to.not.equal(undefined)
    expect(stack.branch).to.not.equal(undefined)
    expect(stack.branchAlias).to.not.equal(undefined)
    expect(stack.deliveryToken).to.not.equal(undefined)
    expect(stack.extension).to.not.equal(undefined)
    expect(stack.webhook).to.not.equal(undefined)
    expect(stack.workflow).to.not.equal(undefined)
    expect(stack.label).to.not.equal(undefined)
    expect(stack.release).to.not.equal(undefined)
    expect(stack.bulkOperation).to.not.equal(undefined)
    expect(stack.users).to.not.equal(undefined)
    expect(stack.updateUsersRoles).to.not.equal(undefined)
    expect(stack.transferOwnership).to.not.equal(undefined)
    expect(stack.settings).to.not.equal(undefined)
    expect(stack.resetSettings).to.not.equal(undefined)
    expect(stack.addSettings).to.not.equal(undefined)
    expect(stack.share).to.not.equal(undefined)
    expect(stack.unShare).to.not.equal(undefined)
    expect(stack.role).to.not.equal(undefined)
    done()
  })

  it('Stack Collection test with data blank', done => {
    const collection = new StackCollection(Axios, {})
    expect(collection.length).to.be.equal(0)
    done()
  })

  it('Stack Collection test with data blank', done => {
    const collection = new StackCollection(Axios, {
      stack: [stackMock]
    })
    expect(collection.length).to.be.equal(0)
    done()
  })

  it('Stack create test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks').reply(200, {
      stack: {
        ...stackMock
      }
    })
    makeStack()
      .create()
      .then((stack) => {
        checkStack(stack)
        done()
      })
      .catch(done)
  })

  it('Organization Stack Query test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/stacks').reply(200, {
      stacks: [
        stackMock
      ]
    })
    makeStack({ organization_uid: 'org_uid' })
      .query()
      .find()
      .then((stacks) => {
        checkStack(stacks.items[0])
        done()
      })
      .catch(done)
  })

  it('Stack Query test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/stacks').reply(200, {
      stacks: [
        stackMock
      ]
    })
    makeStack()
      .query()
      .find()
      .then((stacks) => {
        checkStack(stacks.items[0])
        done()
      })
      .catch(done)
  })

  it('Stack update test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPut('/stacks').reply(200, {
      stack: {
        ...stackMock
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .update()
      .then((stack) => {
        checkStack(stack)
        done()
      })
      .catch(done)
  })

  it('Stack fetch test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/stacks').reply(200, {
      stack: {
        ...stackMock
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .fetch()
      .then((stack) => {
        checkStack(stack)
        done()
      })
      .catch(done)
  })

  it('Content Type initialization without content type uid', done => {
    const contentType = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .contentType()
    expect(contentType.uid).to.be.equal(undefined)
    expect(contentType.stackHeaders).to.not.equal(undefined)
    expect(contentType.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Content Type initialization with content type uid', done => {
    const contentType = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .contentType(systemUidMock.uid)
    expect(contentType.uid).to.be.equal(systemUidMock.uid)
    expect(contentType.stackHeaders).to.not.equal(undefined)
    expect(contentType.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Local initialization without code', done => {
    const locale = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .locale()
    expect(locale.code).to.be.equal(undefined)
    expect(locale.stackHeaders).to.not.equal(undefined)
    expect(locale.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Local initialization with code', done => {
    const locale = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .locale(systemUidMock.uid)
    expect(locale.code).to.be.equal(systemUidMock.uid)
    expect(locale.stackHeaders).to.not.equal(undefined)
    expect(locale.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Asset initialization without uid', done => {
    const asset = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .asset()
    expect(asset.uid).to.be.equal(undefined)
    expect(asset.stackHeaders).to.not.equal(undefined)
    expect(asset.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Asset initialization with uid', done => {
    const asset = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .asset(systemUidMock.uid)
    expect(asset.uid).to.be.equal(systemUidMock.uid)
    expect(asset.stackHeaders).to.not.equal(undefined)
    expect(asset.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Global Field initialization without uid', done => {
    const globalField = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .globalField()
    expect(globalField.uid).to.be.equal(undefined)
    expect(globalField.stackHeaders).to.not.equal(undefined)
    expect(globalField.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Global Field initialization with uid', done => {
    const globalField = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .globalField(systemUidMock.uid)
    expect(globalField.uid).to.be.equal(systemUidMock.uid)
    expect(globalField.stackHeaders).to.not.equal(undefined)
    expect(globalField.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Environment initialization without uid', done => {
    const environment = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .environment()
    expect(environment.name).to.be.equal(undefined)
    expect(environment.stackHeaders).to.not.equal(undefined)
    expect(environment.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Environment initialization with uid', done => {
    const environment = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .environment(systemUidMock.uid)
    expect(environment.name).to.be.equal(systemUidMock.uid)
    expect(environment.stackHeaders).to.not.equal(undefined)
    expect(environment.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Delivery Token initialization without uid', done => {
    const deliveryToken = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .deliveryToken()
    expect(deliveryToken.uid).to.be.equal(undefined)
    expect(deliveryToken.stackHeaders).to.not.equal(undefined)
    expect(deliveryToken.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Delivery Token initialization with uid', done => {
    const deliveryToken = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .deliveryToken(systemUidMock.uid)
    expect(deliveryToken.uid).to.be.equal(systemUidMock.uid)
    expect(deliveryToken.stackHeaders).to.not.equal(undefined)
    expect(deliveryToken.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Extensions initialization without uid', done => {
    const extension = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .extension()
    expect(extension.uid).to.be.equal(undefined)
    expect(extension.stackHeaders).to.not.equal(undefined)
    expect(extension.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Extensions initialization with uid', done => {
    const extension = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .extension(systemUidMock.uid)
    expect(extension.uid).to.be.equal(systemUidMock.uid)
    expect(extension.stackHeaders).to.not.equal(undefined)
    expect(extension.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Webhooks initialization without uid', done => {
    const webhook = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .webhook()
    expect(webhook.uid).to.be.equal(undefined)
    expect(webhook.stackHeaders).to.not.equal(undefined)
    expect(webhook.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Webhooks initialization with uid', done => {
    const webhook = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .webhook(systemUidMock.uid)
    expect(webhook.uid).to.be.equal(systemUidMock.uid)
    expect(webhook.stackHeaders).to.not.equal(undefined)
    expect(webhook.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Workflow initialization without uid', done => {
    const workflow = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .workflow()
    expect(workflow.uid).to.be.equal(undefined)
    expect(workflow.stackHeaders).to.not.equal(undefined)
    expect(workflow.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Workflow initialization with uid', done => {
    const workflow = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .workflow(systemUidMock.uid)
    expect(workflow.uid).to.be.equal(systemUidMock.uid)
    expect(workflow.stackHeaders).to.not.equal(undefined)
    expect(workflow.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Labels initialization without uid', done => {
    const label = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .label()
    expect(label.uid).to.be.equal(undefined)
    expect(label.stackHeaders).to.not.equal(undefined)
    expect(label.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Labels initialization with uid', done => {
    const label = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .label(systemUidMock.uid)
    expect(label.uid).to.be.equal(systemUidMock.uid)
    expect(label.stackHeaders).to.not.equal(undefined)
    expect(label.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Release initialization without uid', done => {
    const release = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .release()
    expect(release.uid).to.be.equal(undefined)
    expect(release.stackHeaders).to.not.equal(undefined)
    expect(release.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Release initialization with uid', done => {
    const release = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .release(systemUidMock.uid)
    expect(release.uid).to.be.equal(systemUidMock.uid)
    expect(release.stackHeaders).to.not.equal(undefined)
    expect(release.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Bulk operations initialization without uid', done => {
    const bulkOperation = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .bulkOperation()
    expect(bulkOperation.publish).to.not.equal(undefined)
    expect(bulkOperation.unpublish).to.not.equal(undefined)
    expect(bulkOperation.stackHeaders).to.not.equal(undefined)
    expect(bulkOperation.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Role initialization without uid', done => {
    const role = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .role()
    expect(role.uid).to.be.equal(undefined)
    expect(role.stackHeaders).to.not.equal(undefined)
    expect(role.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Role initialization with uid', done => {
    const role = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .role(systemUidMock.uid)
    expect(role.uid).to.be.equal(systemUidMock.uid)
    expect(role.stackHeaders).to.not.equal(undefined)
    expect(role.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Branch initialization without branch', done => {
    const branch = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .branch()
    expect(branch.uid).to.be.equal(undefined)
    expect(branch.stackHeaders).to.not.equal(undefined)
    expect(branch.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Branch initialization with branch', done => {
    const branch = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .branch('branch')
    expect(branch.uid).to.be.equal('branch')
    expect(branch.stackHeaders).to.not.equal(undefined)
    expect(branch.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('BranchAlias initialization without branch', done => {
    const branchAlias = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .branchAlias()
    expect(branchAlias.uid).to.be.equal(undefined)
    expect(branchAlias.stackHeaders).to.not.equal(undefined)
    expect(branchAlias.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('BranchAlias initialization with branch', done => {
    const branchAlias = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .branchAlias('branch')
    expect(branchAlias.uid).to.be.equal('branch')
    expect(branchAlias.stackHeaders).to.not.equal(undefined)
    expect(branchAlias.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Stack users test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/stacks').reply(200, {
      stack: {
        ...stackMock
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .users()
      .then((users) => {
        const user = users[0]
        expect(user.created_at).to.be.equal('created_at_date')
        expect(user.updated_at).to.be.equal('updated_at_date')
        expect(user.uid).to.be.equal('UID')
        expect(user.email).to.be.equal('EMAIL')
        done()
      })
      .catch(done)
  })
  // it('Update users roles in Stack test', done => {
  //   const mock = new MockAdapter(Axios)
  //   mock.onGet('/stacks').reply(200, {
  //     notice: "The roles were applied successfully.",
  //   })
  //   makeStack({
  //     stack: {
  //       api_key: 'stack_api_key'
  //     }
  //   })
  //   .updateUsersRoles({ user_id: ['role1', 'role2']})
  //   .then((response) => {
  //     expect(response.notice).to.be.equal(noticeMock.notice)
  //     done()
  //   })
  //   .catch(done)
  // })


  it('Stack transfer ownership test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/transfer_ownership').reply(200, {
      ...noticeMock
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .transferOwnership()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Stack settings test', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/stacks/settings').reply(200, {
      stack_settings: {
        discrete_variables: {},
        stack_variables: {}
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .settings()
      .then((response) => {
        expect(response.discrete_variables).to.not.equal(undefined)
        expect(response.stack_variables).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Stack reset settings test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/settings').reply(200, {
      stack_settings: {
        discrete_variables: {},
        stack_variables: {}
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .resetSettings()
      .then((response) => {
        expect(response.discrete_variables).to.not.equal(undefined)
        expect(response.stack_variables).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Stack add settings test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/settings').reply(200, {
      stack_settings: {
        discrete_variables: {},
        stack_variables: {}
      }
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .addSettings()
      .then((response) => {
        expect(response.discrete_variables).to.not.equal(undefined)
        expect(response.stack_variables).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Stack share test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/share').reply(200, {
      ...noticeMock
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .share(['test@email.id'], { 'test@email.id': ['test roles'] })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Stack share none test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/share').reply(200, {
      ...noticeMock
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .share()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Stack unshare test', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost('/stacks/unshare').reply(200, {
      ...noticeMock
    })
    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .unShare('test@email.id')
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Global fields initialization without uid', done => {
    const global_field = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
    .globalField()
    expect(global_field.uid).to.be.equal(undefined)
    expect(global_field.stackHeaders).to.not.equal(undefined)
    expect(global_field.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Management token initialization without uid', done => {
    const management_token = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
    .managementToken()
    expect(management_token.uid).to.be.equal(undefined)
    expect(management_token.stackHeaders).to.not.equal(undefined)
    expect(management_token.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Global fields initialization uid', done => {
    const global_field = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
    .globalField(systemUidMock.uid)
    expect(global_field.uid).to.be.equal(systemUidMock.uid)
    expect(global_field.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })

  it('Management token initialization uid', done => {
    const management_token = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
    .managementToken(systemUidMock.uid)
    expect(management_token.uid).to.be.equal(systemUidMock.uid)
    expect(management_token.stackHeaders.api_key).to.be.equal('stack_api_key')
    done()
  })
  
  it('should update users roles', done => {
    var mock = new MockAdapter(Axios)
    const usersRolesData = {
      user_uid: ['role_uid_1', 'role_uid_2']
    }

    mock.onPost('/stacks/users/roles').reply(200, {
      notice: 'Roles updated successfully'
    })

    makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .updateUsersRoles(usersRolesData)
      .then((response) => {
        expect(response.notice).to.be.equal('Roles updated successfully')
        done()
      })
      .catch(done)
  })

  it('should fetch variants of a stack', done => {
    var mock = new MockAdapter(Axios)
    const variantsResponse = makeStack({
      stack: {
        api_key: 'stack_api_key'
      }
    })
      .variants()
      expect(variantsResponse.create).to.be.not.equal(undefined)
      expect(variantsResponse.query).to.be.not.equal(undefined)
      expect(variantsResponse.fetchByUIDs).to.be.not.equal(undefined)
      done()
  })
})

function makeStack (data) {
  return new Stack(Axios, data)
}

function checkStack (stack) {
  expect(stack.urlPath).to.be.equal('/stacks')
  expect(stack.created_at).to.be.equal('created_at_date')
  expect(stack.updated_at).to.be.equal('updated_at_date')
  expect(stack.uid).to.be.equal('UID')
  expect(stack.name).to.be.equal('Stack')
  expect(stack.description).to.be.equal('stack')
  expect(stack.org_uid).to.be.equal('orgUID')
  expect(stack.api_key).to.be.equal('stack_api_key')
  expect(stack.master_locale).to.be.equal('en-us')
  expect(stack.is_asset_download_public).to.be.equal(true)
  expect(stack.owner_uid).to.be.equal('ownerUID')
  expect(stack.user_uids.length).to.be.equal(0)
  expect(stack.collaborators.length).to.be.equal(1)
  expect(stack.stackHeaders).to.not.equal(undefined)
  expect(stack.stackHeaders.api_key).to.be.equal('stack_api_key')
}

export { checkStack }
