import { describe, it } from 'mocha'
import { Stack, StackCollection } from '../../lib/stack/index'
import Axios from 'axios'
import { expect } from 'chai'
import { stackMock, noticeMock, systemUidMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'

describe('Contentststack Stack test', () => {
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

  it('Stack with API key and Management token', done => {
    const stack = makeStack({ stack: { api_key: 'API_KEY', management_token: 'Management_Token' } })
    expect(stack.urlPath).to.be.equal('/stacks')
    expect(stack.organization_uid).to.be.equal(undefined)
    expect(stack.stackHeaders).to.not.equal(undefined)
    expect(stack.stackHeaders.api_key).to.be.equal('API_KEY')
    expect(stack.stackHeaders.authorization).to.be.equal('Management_Token')
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

  it('Content Type initialisation without content type uid', done => {
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

  it('Content Type initialisation with content type uid', done => {
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

  it('Local initialisation without code', done => {
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

  it('Local initialisation with code', done => {
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

  it('Asset initialisation without uid', done => {
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

  it('Asset initialisation with uid', done => {
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

  it('Global Field initialisation without uid', done => {
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

  it('Global Field initialisation with uid', done => {
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

  it('Environment initialisation without uid', done => {
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

  it('Environment initialisation with uid', done => {
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

  it('Delivery Token initialisation without uid', done => {
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

  it('Delivery Token initialisation with uid', done => {
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

  it('Extensions initialisation without uid', done => {
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

  it('Extensions initialisation with uid', done => {
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

  it('Webhooks initialisation without uid', done => {
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

  it('Webhooks initialisation with uid', done => {
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

  it('Labels initialisation without uid', done => {
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

  it('Labels initialisation with uid', done => {
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

  it('Release initialisation without uid', done => {
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

  it('Release initialisation with uid', done => {
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

  it('Bulk operations initialisation without uid', done => {
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

  it('Role initialisation without uid', done => {
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

  it('Role initialisation with uid', done => {
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
