import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { firstWorkflow, secondWorkflow, finalWorkflow } from '../mock/workflow.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}

let user = {}
let workflowUid = ''
let workflowUid2 = ''
let workflowUid3 = ''

describe('Workflow api Test', () => {
  setup(async () => {
    user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create Workflow Content type Multi page from JSON', done => {
    const workflow = { ...firstWorkflow }
    makeWorkflow()
      .create({ workflow })
      .then(workflowResponse => {
        workflowUid = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal(firstWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should create Workflow Content type Multi page', done => {
    const workflow = { ...secondWorkflow }
    makeWorkflow()
      .create({ workflow })
      .then(workflowResponse => {
        workflowUid2 = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal(secondWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(secondWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(secondWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should create Workflow Content type single page', done => {
    const workflow = { ...finalWorkflow }
    makeWorkflow()
      .create({ workflow })
      .then(workflowResponse => {
        workflowUid3 = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal(finalWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(finalWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(finalWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should fetch Workflow from UID', done => {
    makeWorkflow(workflowUid)
      .fetch()
      .then(workflowResponse => {
        workflowUid = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal(firstWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should update Workflow from UID', done => {
    const workflowObj = makeWorkflow(workflowUid)
    Object.assign(workflowObj, firstWorkflow)
    workflowObj.name = 'Updated name'

    workflowObj
      .update()
      .then(workflowResponse => {
        workflowUid = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal('Updated name')
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should fetch and update Workflow from UID', done => {
    makeWorkflow(workflowUid)
      .fetch()
      .then(workflowResponse => {
        workflowResponse.name = firstWorkflow.name
        return workflowResponse.update()
      })
      .then(workflowResponse => {
        expect(workflowResponse.name).to.be.equal(firstWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
      })
      .catch(done)
  })

  it('should delete Workflow from UID', done => {
    makeWorkflow(workflowUid)
      .delete()
      .then(response => {
        expect(response.notice).to.be.equal('Workflow deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete Workflow from UID2 ', done => {
    makeWorkflow(workflowUid2)
      .delete()
      .then(response => {
        expect(response.notice).to.be.equal('Workflow deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete Workflow from UID3 ', done => {
    makeWorkflow(workflowUid3)
      .delete()
      .then(response => {
        expect(response.notice).to.be.equal('Workflow deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeWorkflow (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).workflow(uid)
}
