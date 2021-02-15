import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Workflow, WorkflowCollection } from '../../lib/stack/workflow'
import { systemUidMock, stackHeadersMock, workflowMock, checkSystemFields, noticeMock, publishRulesMock } from './mock/objects'

describe('Contentstack Workflow test', () => {
  it('Workflow test without uid', done => {
    const workflow = makeWorkflow()
    expect(workflow.urlPath).to.be.equal('/workflows')
    expect(workflow.stackHeaders).to.be.equal(undefined)
    expect(workflow.update).to.be.equal(undefined)
    expect(workflow.delete).to.be.equal(undefined)
    expect(workflow.fetch).to.be.equal(undefined)
    expect(workflow.disable).to.be.equal(undefined)
    expect(workflow.enable).to.be.equal(undefined)
    expect(workflow.contentType).to.be.equal(undefined)
    expect(workflow.create).to.not.equal(undefined)
    expect(workflow.fetchAll).to.not.equal(undefined)
    expect(workflow.publishRule).to.not.equal(undefined)
    done()
  })

  it('Workflow test with uid', done => {
    const workflow = makeWorkflow({ workflow: { ...systemUidMock } })
    expect(workflow.urlPath).to.be.equal('/workflows/UID')
    expect(workflow.uid).to.be.equal('UID')
    expect(workflow.stackHeaders).to.be.equal(undefined)
    expect(workflow.update).to.not.equal(undefined)
    expect(workflow.delete).to.not.equal(undefined)
    expect(workflow.fetch).to.not.equal(undefined)
    expect(workflow.disable).to.not.equal(undefined)
    expect(workflow.enable).to.not.equal(undefined)
    expect(workflow.contentType).to.not.equal(undefined)
    expect(workflow.create).to.be.equal(undefined)
    expect(workflow.fetchAll).to.be.equal(undefined)
    expect(workflow.publishRule).to.be.equal(undefined)
    done()
  })

  it('Workflow test with uid and stack headers', done => {
    const workflow = makeWorkflow({ workflow: { ...systemUidMock }, stackHeaders: { ...stackHeadersMock } })
    expect(workflow.urlPath).to.be.equal('/workflows/UID')
    expect(workflow.uid).to.be.equal('UID')
    expect(workflow.stackHeaders).to.not.equal(undefined)
    expect(workflow.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(workflow.update).to.not.equal(undefined)
    expect(workflow.delete).to.not.equal(undefined)
    expect(workflow.fetch).to.not.equal(undefined)
    expect(workflow.disable).to.not.equal(undefined)
    expect(workflow.enable).to.not.equal(undefined)
    expect(workflow.contentType).to.not.equal(undefined)
    expect(workflow.create).to.be.equal(undefined)
    expect(workflow.fetchAll).to.be.equal(undefined)
    expect(workflow.publishRule).to.be.equal(undefined)
    done()
  })

  it('Workflow Collection test with blank data in publish rule', done => {
    const publishRule = makeWorkflow().publishRule()
    expect(publishRule.urlPath).to.be.equal('/workflows/publishing_rules')
    expect(publishRule.stackHeaders).to.be.equal(undefined)
    expect(publishRule.update).to.be.equal(undefined)
    expect(publishRule.delete).to.be.equal(undefined)
    expect(publishRule.fetch).to.be.equal(undefined)
    expect(publishRule.create).to.not.equal(undefined)
    expect(publishRule.fetchAll).to.not.equal(undefined)
    done()
  })

  it('Workflow Collection test with uid and stack headers in publish rule', done => {
    const publishRule = makeWorkflow({ stackHeaders: { ...stackHeadersMock } }).publishRule('UID')
    expect(publishRule.urlPath).to.be.equal('/workflows/publishing_rules/UID')
    expect(publishRule.stackHeaders).to.not.equal(undefined)
    expect(publishRule.update).to.not.equal(undefined)
    expect(publishRule.delete).to.not.equal(undefined)
    expect(publishRule.fetch).to.not.equal(undefined)
    expect(publishRule.create).to.be.equal(undefined)
    expect(publishRule.fetchAll).to.be.equal(undefined)
    done()
  })

  it('Workflow Collection test with blank data', done => {
    const workflow = new WorkflowCollection(Axios, {})
    expect(workflow.length).to.be.equal(0)
    done()
  })

  it('Workflow Collection test with data', done => {
    const workflow = new WorkflowCollection(Axios, {
      workflows: [
        workflowMock
      ]
    })
    expect(workflow.length).to.be.equal(1)
    checkWorkflow(workflow[0])
    done()
  })

  it('Workflow create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/workflows').reply(200, {
      workflow: {
        ...workflowMock
      }
    })
    makeWorkflow()
      .create()
      .then((workflow) => {
        checkWorkflow(workflow)
        done()
      })
      .catch(done)
  })

  it('Workflow Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows').reply(200, {
      workflows: [
        workflowMock
      ]
    })
    makeWorkflow()
      .fetchAll()
      .then((workflows) => {
        checkWorkflow(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Workflow Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows').reply(200, {
      workflows: [
        workflowMock
      ]
    })
    makeWorkflow({ stackHeaders: stackHeadersMock })
      .fetchAll({})
      .then((workflows) => {
        checkWorkflow(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Workflow Fetch all without paramstest', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows').reply(200, {
      workflows: [
        workflowMock
      ]
    })
    makeWorkflow({ stackHeaders: stackHeadersMock })
      .fetchAll(null)
      .then((workflows) => {
        checkWorkflow(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Workflow update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/workflows/UID').reply(200, {
      workflow: {
        ...workflowMock
      }
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((workflow) => {
        checkWorkflow(workflow)
        done()
      })
      .catch(done)
  })

  it('Workflow fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/UID').reply(200, {
      workflow: {
        ...workflowMock
      }
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((workflow) => {
        checkWorkflow(workflow)
        done()
      })
      .catch(done)
  })

  it('Workflow delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/workflows/UID').reply(200, {
      ...noticeMock
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((workflow) => {
        expect(workflow.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Workflow disable test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/workflows/UID/disable').reply(200, {
      ...noticeMock,
      workflow: {
        ...workflowMock
      }
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .disable()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        checkWorkflow(response.workflow)
        done()
      })
      .catch(done)
  })

  it('Workflow enable test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/workflows/UID/enable').reply(200, {
      ...noticeMock,
      workflow: {
        ...workflowMock
      }
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .enable()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        checkWorkflow(response.workflow)
        done()
      })
      .catch(done)
  })


  it('Workflow content type get publish rules', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/content_type/ct_UID').reply(200, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    }).contentType('ct_UID')
      .getPublishRules()
      .then((response) => {
        checkPublishRules(response.items[0])
        done()
      })
      .catch(done)
  })


  it('Workflow content type get publish rules', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/workflows/content_type/ct_UID').reply(200, {
      publishing_rules: [
        publishRulesMock
      ]
    })
    makeWorkflow({
      workflow: {
        ...systemUidMock
      },
    }).contentType('ct_UID')
      .getPublishRules({ action: "publish", locale: "en-us" })
      .then((response) => {
        checkPublishRules(response.items[0])
        done()
      })
      .catch(done)
  })
})


function makeWorkflow (data) {
    return new Workflow(Axios, data)
  }

function checkWorkflow (workflow) {
  checkSystemFields(workflow)
  expect(workflow.name).to.be.equal('TEST workflow')
  expect(workflow.description).to.be.equal('Workflow description')
  expect(workflow.org_uid).to.be.equal('orgUID')
  expect(workflow.enabled).to.be.equal(true)
  expect(workflow.content_types.length).to.be.equal(2)
  expect(workflow.admin_users.roles.length).to.be.equal(1)
}

function checkPublishRules (publishRules) {
  checkSystemFields(publishRules)
  expect(publishRules.locale).to.be.equal('en-us')
  expect(publishRules.action).to.be.equal('publish')
  expect(publishRules.environment).to.be.equal("env")
  expect(publishRules.workflow_stage).to.be.equal("stage")
}
  