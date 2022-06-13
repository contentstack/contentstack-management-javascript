import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { PublishRules, PublishRulesCollection } from '../../lib/stack/workflow/publishRules'
import { systemUidMock, stackHeadersMock, checkSystemFields, noticeMock, publishRulesMock } from './mock/objects'

describe('Contentstack PublishRule test', () => {
  it('PublishRule test without uid', done => {
    const publishRules = makePublishRule()
    expect(publishRules.urlPath).to.be.equal('/workflows/publishing_rules')
    expect(publishRules.stackHeaders).to.be.equal(undefined)
    expect(publishRules.update).to.be.equal(undefined)
    expect(publishRules.delete).to.be.equal(undefined)
    expect(publishRules.fetch).to.be.equal(undefined)
    expect(publishRules.create).to.not.equal(undefined)
    expect(publishRules.fetchAll).to.not.equal(undefined)
    done()
  })

  it('PublishRule test with uid', done => {
    const publishRules = makePublishRule({ publishing_rule: { ...systemUidMock } })
    expect(publishRules.urlPath).to.be.equal('/workflows/publishing_rules/UID')
    expect(publishRules.uid).to.be.equal('UID')
    expect(publishRules.stackHeaders).to.be.equal(undefined)
    expect(publishRules.update).to.not.equal(undefined)
    expect(publishRules.delete).to.not.equal(undefined)
    expect(publishRules.fetch).to.not.equal(undefined)
    expect(publishRules.create).to.be.equal(undefined)
    expect(publishRules.fetchAll).to.be.equal(undefined)
    done()
  })

  it('PublishRule test with uid and stack headers', done => {
    const publishRules = makePublishRule({ publishing_rule: { ...systemUidMock }, stackHeaders: { ...stackHeadersMock } })
    expect(publishRules.urlPath).to.be.equal('/workflows/publishing_rules/UID')
    expect(publishRules.uid).to.be.equal('UID')
    expect(publishRules.stackHeaders).to.not.equal(undefined)
    expect(publishRules.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(publishRules.update).to.not.equal(undefined)
    expect(publishRules.delete).to.not.equal(undefined)
    expect(publishRules.fetch).to.not.equal(undefined)
    expect(publishRules.create).to.be.equal(undefined)
    expect(publishRules.fetchAll).to.be.equal(undefined)
    done()
  })

  it('PublishRule Collection test with blank data', done => {
    const publishRules = new PublishRulesCollection(Axios, {})
    expect(publishRules.length).to.be.equal(0)
    done()
  })

  it('PublishRule Collection test with data', done => {
    const publishRules = new PublishRulesCollection(Axios, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    expect(publishRules.length).to.be.equal(1)
    checkPublishRules(publishRules[0])
    done()
  })

  it('PublishRule create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/workflows/publishing_rules').reply(200, {
        publishing_rule: {
        ...publishRulesMock
      }
    })
    makePublishRule()
      .create()
      .then((publish_rule) => {
        checkPublishRules(publish_rule)
        done()
      })
      .catch(done)
  })

  it('PublishRule Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/publishing_rules').reply(200, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    makePublishRule()
      .fetchAll()
      .then((publish_rule) => {
        checkPublishRules(publish_rule.items[0])
        done()
      })
      .catch(done)
  })

  it('PublishRule Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/publishing_rules').reply(200, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    makePublishRule({ stackHeaders: stackHeadersMock })
      .fetchAll({})
      .then((publish_rule) => {
        checkPublishRules(publish_rule.items[0])
        done()
      })
      .catch(done)
  })

  it('PublishRule Fetch all without paramstest', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/publishing_rules').reply(200, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    makePublishRule({ stackHeaders: stackHeadersMock })
      .fetchAll(null)
      .then((publish_rule) => {
        checkPublishRules(publish_rule.items[0])
        done()
      })
      .catch(done)
  })

  it('PublishRule update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/workflows/publishing_rules/UID').reply(200, {
        publishing_rule: {
        ...publishRulesMock
      }
    })
    makePublishRule({
        publishing_rule: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((publish_rule) => {
        checkPublishRules(publish_rule)
        done()
      })
      .catch(done)
  })

  it('PublishRule fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/publishing_rules/UID').reply(200, {
      publishing_rule: {
        ...publishRulesMock
      }
    })
    makePublishRule({
      publishing_rule: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((publish_rule) => {
        checkPublishRules(publish_rule)
        done()
      })
      .catch(done)
  })

  it('PublishRule delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/workflows/publishing_rules/UID').reply(200, {
      ...noticeMock
    })
    makePublishRule({
      publishing_rule: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((publish_rule) => {
        expect(publish_rule.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

})


function makePublishRule(data) {
    return new PublishRules(Axios, data)
}

function checkPublishRules (publishRules) {
  checkSystemFields(publishRules)
  expect(publishRules.locale).to.be.equal('en-us')
  expect(publishRules.action).to.be.equal('publish')
  expect(publishRules.environment).to.be.equal("env")
  expect(publishRules.workflow_stage).to.be.equal("stage")
}
  