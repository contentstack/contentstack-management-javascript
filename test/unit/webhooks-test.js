
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { WebHooks } from '../../lib/marketplace/installation/webhooks'
import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { executionLogMock, executionLogsListMock } from './mock/execution-mock'

describe('Installation WebHook function', () => {
  it('should create Webhook object when WebHook function is called', () => {
    const webhooks = webHookObj({ installationUid: 'installationUid', uid: 'uid' })
    expect(webhooks).to.be.instanceOf(WebHooks)
    expect(webhooks.installationUid).to.be.equal('installationUid')
    expect(webhooks.uid).to.be.equal('uid')
    expect(webhooks.urlPath).to.be.equal('installations/installationUid/webhooks/uid')
    expect(webhooks.listExecutionLogs).to.not.equal(undefined)
    expect(webhooks.getExecutionLog).to.not.equal(undefined)
    expect(webhooks.retryExecution).to.not.equal(undefined)
  })

  it('should create Webhook object when WebHook function is called without data', () => {
    const webhooks = webHookObj({})
    expect(webhooks).to.be.instanceOf(WebHooks)
    expect(webhooks.installationUid).to.be.equal(undefined)
    expect(webhooks.uid).to.be.equal(undefined)
    expect(webhooks.urlPath).to.be.equal(undefined)
    expect(webhooks.listExecutionLogs).to.be.equal(undefined)
    expect(webhooks.getExecutionLog).to.be.equal(undefined)
    expect(webhooks.retryExecution).to.be.equal(undefined)
  })

  it('should list all the execution logs when listExecutionLogs function is called', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions'

    mockClient.onGet(url).reply(200, executionLogsListMock)
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .listExecutionLogs()
      .then(response => {
        expect(response.data).to.be.eql(executionLogsListMock.data)
        done()
      })
      .catch(done)
  })

  it('should get detailed of an execution when execution uid is passed', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions/execUid'

    mockClient.onGet(url).reply(200, {
      data: { ...executionLogMock }
    })
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .getExecutionLog('execUid')
      .then(response => {
        expect(response.data).to.be.eql(executionLogMock)
        done()
      })
      .catch(done)
  })

  it('should retry the execution and get data when execution uid is passed', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions/execUid/retry'

    mockClient.onPost(url).reply(200, {
      data: { ...executionLogMock }
    })
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .retryExecution('execUid')
      .then(response => {
        expect(response.data).to.be.eql(executionLogMock)
        done()
      })
      .catch(done)
  })

  it('should fail in listing all the execution logs when listExecutionLogs function is called', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions'

    mockClient.onGet(url).reply(400, {})
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .listExecutionLogs()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('should fail to get detailed of an execution when execution uid is passed', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions/execUid'

    mockClient.onGet(url).reply(400, {})
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .getExecutionLog('execUid')
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('should fail in retry execution and get data when execution uid is passed', (done) => {
    const mockClient = new MockAdapter(Axios)
    const url = 'installations/installationUid/webhooks/uid/executions/execUid/retry'

    mockClient.onPost(url).reply(400, {})
    webHookObj({
      installationUid: 'installationUid', uid: 'uid'
    })
      .retryExecution('execUid')
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

const webHookObj = (data) => {
  return new WebHooks(Axios, data)
}
