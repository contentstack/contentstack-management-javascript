import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { firstWorkflow, secondWorkflow, finalWorkflow, firstPublishRules, secondPublishRules } from './mock/workflow'
import { cloneDeep } from 'lodash'
var client = {}
var environment = {}
var entries = {}
var roles = {}
var stack = {}
var user = {}
var workflowUid = ''
var publishRuleUid = ''
var publishRequestUid = ''

describe('Workflow api Test', () => {
  setup(async () => {
    user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
    environment = jsonReader('environments.json')
    roles = jsonReader('roles.json')
    entries =jsonReader('entry.json')
  })

  it('Create Workflow Content type Multi page from JSON', done => {
    const workflow = { ...firstWorkflow }
    makeWorkflow()
    .create({workflow})
    .then(workflowResponse => {
        workflowUid = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal(firstWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
    })
    .catch(done)
  })

  it('Create Workflow Content type Multi page', done => {
    const workflow = { ...secondWorkflow }
    makeWorkflow()
    .create({workflow})
    .then(workflowResponse => {
        expect(workflowResponse.name).to.be.equal(secondWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(secondWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(secondWorkflow.workflow_stages.length)
        done()
    })
    .catch(done)
  })

  it('Create Workflow Content type single page', done => {
    const workflow = { ...finalWorkflow }
    makeWorkflow()
    .create({workflow})
    .then(workflowResponse => {
        console.log(workflowResponse);
        expect(workflowResponse.name).to.be.equal(finalWorkflow.name)
        expect(workflowResponse.content_types.length).to.be.equal(finalWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(finalWorkflow.workflow_stages.length)
        done()
    })
    .catch(done)
  })

  it('Fetch Workflow from UID', done => {
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

  it('Update Workflow from UID', done => {
    const workflowObj = makeWorkflow(workflowUid)
    Object.assign(workflowObj, firstWorkflow)
    workflowObj.name = "Updated name"

    workflowObj
    .update()
    .then(workflowResponse => {
        workflowUid = workflowResponse.uid
        expect(workflowResponse.name).to.be.equal("Updated name")
        expect(workflowResponse.content_types.length).to.be.equal(firstWorkflow.content_types.length)
        expect(workflowResponse.workflow_stages.length).to.be.equal(firstWorkflow.workflow_stages.length)
        done()
    })
    .catch(done)
  })

  it('Fetch and update Workflow from UID', done => {
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
  it('Fetch all workflow', done => {
    makeWorkflow()
    .fetchAll()
    .then(collection => {
        expect(collection.items.length).to.be.equal(3)
        done()
    })
    .catch(done)
  })

  it('Fetch all workflow include count', done => {
    makeWorkflow()
    .fetchAll({include_count: true})
    .then(collection => {
        expect(collection.count).to.be.equal(3)
        done()
    })
    .catch(done)
  })

  it('Fetch all workflow skip and limit', done => {
    makeWorkflow()
    .fetchAll({skip: 1, limit: 1})
    .then(collection => {
        expect(collection.items.length).to.be.equal(1)
        done()
    })
    .catch(done)
  })

  it('Enable Workflow from uid', done => {
      makeWorkflow(workflowUid)
      .enable()
      .then(response => {
        expect(response.notice).to.be.equal('Workflow enabled successfully.')
        done()
      })
      .catch(done)
  })

  it('Disable Workflow from uid', done => {
    makeWorkflow(workflowUid)
    .disable()
    .then(response => {
      expect(response.notice).to.be.equal('Workflow disabled successfully.')
      done()
    })
    .catch(done)
  })

  it('Create Publish rules', done => {
    const publishing_rule = cloneDeep(firstPublishRules)
    publishing_rule.environment = environment[0].uid
    publishing_rule.approvers = {
        users: [user.uid],
        roles: [roles[0].uid]
    }
    makeWorkflow()
    .publishRule()
    .create({publishing_rule})
    .then(publishRule => {
        publishRuleUid = publishRule.uid
        expect(publishRule.actions.length).to.be.equal(publishing_rule.actions.length)
        expect(publishRule.environment).to.be.equal(publishing_rule.environment)
        expect(publishRule.content_types.length).to.be.equal(publishing_rule.content_types.length)
        expect(publishRule.content_types[0]).to.be.equal(publishing_rule.content_types[0])
        expect(publishRule.approvers.users[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

  it('Create second Publish rules', done => {
    const publishing_rule = cloneDeep(secondPublishRules)
    publishing_rule.environment = environment[1].uid
    publishing_rule.approvers = {
        users: [user.uid],
        roles: [roles[1].uid]
    }
    makeWorkflow()
    .publishRule()
    .create({publishing_rule})
    .then(publishRule => {
        publishRequestUid = publishRule.uid
        expect(publishRule.actions.length).to.be.equal(publishing_rule.actions.length)
        expect(publishRule.environment).to.be.equal(publishing_rule.environment)
        expect(publishRule.content_types.length).to.be.equal(publishing_rule.content_types.length)
        expect(publishRule.content_types[0]).to.be.equal(publishing_rule.content_types[0])
        expect(publishRule.approvers.users[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

  it('Create Single page Publish rules', done => {
    const publishing_rule = cloneDeep(secondPublishRules)
    publishing_rule.content_types = ['single_page']
    publishing_rule.environment = environment[1].uid
    publishing_rule.approvers = {
        users: [user.uid],
        roles: [roles[1].uid]
    }
    makeWorkflow()
    .publishRule()
    .create({publishing_rule})
    .then(publishRule => {
        expect(publishRule.actions.length).to.be.equal(publishing_rule.actions.length)
        expect(publishRule.environment).to.be.equal(publishing_rule.environment)
        expect(publishRule.content_types.length).to.be.equal(publishing_rule.content_types.length)
        expect(publishRule.content_types[0]).to.be.equal(publishing_rule.content_types[0])
        expect(publishRule.approvers.users[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

  it('Create second Publish rules should fail', done => {
    const publishing_rule = cloneDeep(secondPublishRules)
    publishing_rule.environment = environment[1].uid
    publishing_rule.approvers = {
        users: [user.uid],
        roles: [roles[1].uid]
    }
    makeWorkflow()
    .publishRule()
    .create({publishing_rule})
    .then(publishRule => {
        expect(publishRule).to.be.equal(undefined)
        done()
    })
    .catch(error => {
        const jsonMessage = JSON.parse(error.message)
        expect(jsonMessage.status).to.be.equal(422)
        expect(jsonMessage.statusText).to.be.equal('Unprocessable Entity')
        expect(jsonMessage.errorMessage).to.be.equal('Publish rule could not be created. Please try again.')
        expect(jsonMessage.statusText).to.be.equal('Unprocessable Entity')
        expect(jsonMessage.errors.publishing_rule[0]).to.be.equal("publishing rule is already set for multi_page and en-at for publish action(s).")
        done()
    })
    .catch(done)
  })

  it('Fetch Publish rules', done => {
    makeWorkflow()
    .publishRule(publishRuleUid)
    .fetch()
    .then(publishRule => {
        expect(publishRule.actions.length).to.be.equal(firstPublishRules.actions.length)
        expect(publishRule.environment).to.be.equal(environment[0].uid)
        expect(publishRule.content_types.length).to.be.equal(firstPublishRules.content_types.length)
        expect(publishRule.content_types[0]).to.be.equal(firstPublishRules.content_types[0])
        expect(publishRule.approvers.users[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

  it('Update Publish rules', done => {
    makeWorkflow()
    .publishRule(publishRuleUid)
    .fetch()
    .then(publishRule => {
       publishRule.approvers = {
        users: [user.uid],
        roles: [roles[1].uid]
      }
      delete publishRule.status
      return publishRule.update()
    })
    .then(publishRule => {
        expect(publishRule.actions.length).to.be.equal(firstPublishRules.actions.length)
        expect(publishRule.environment).to.be.equal(environment[0].uid)
        expect(publishRule.content_types.length).to.be.equal(firstPublishRules.content_types.length)
        expect(publishRule.content_types[0]).to.be.equal(firstPublishRules.content_types[0])
        expect(publishRule.approvers.users[0]).to.be.equal(user.uid)
        expect(publishRule.approvers.roles[0]).to.be.equal(roles[1].uid)
        done()
    })
    .catch(done)
  })

  it('Fetch All the PublishRules', done => {
    makeWorkflow()
    .publishRule()
    .fetchAll()
    .then(response => {
        expect(response.items.length).to.be.equal(3)
        done()
    })
    .catch(done)
  })

  it('Fetch All the PublishRules include count', done => {
    makeWorkflow()
    .publishRule()
    .fetchAll({include_count: true})
    .then(response => {
        expect(response.count).to.be.equal(3)
        done()
    })
    .catch(done)
  })

  it('Fetch All the PublishRules skip', done => {
    makeWorkflow()
    .publishRule()
    .fetchAll({skip: 1})
    .then(response => {
        expect(response.items.length).to.be.equal(2)
        done()
    })
    .catch(done)
  })

  it('Fetch All the PublishRules limit', done => {
    makeWorkflow()
    .publishRule()
    .fetchAll({limit: 1})
    .then(response => {
        expect(response.items.length).to.be.equal(1)
        done()
    })
    .catch(done)
  })

  it('Fetch All the PublishRules Content type', done => {
    const contentTypes = 'multi_page_from_json,multi_page'
    makeWorkflow()
    .publishRule()
    .fetchAll({content_types: contentTypes})
    .then(response => {
        expect(response.items.length).to.be.equal(2)
        expect(contentTypes).to.contain(response.items[0].content_types[0])
        expect(contentTypes).to.contain(response.items[1].content_types[0])
        done()
    })
    .catch(done)
  })

  it('Get Publish rules by content type', done => {
      makeWorkflow()
      .contentType('multi_page')
      .getPublishRules({action: 'publish'})
      .then(response => {
          expect(response.items.length).to.be.equal(1)
          const publishRule = response.items[0]
          expect(publishRule.action).to.be.equal('publish')
          expect(publishRule.environment).to.be.equal(environment[1].uid)
          expect(publishRule.approvers[0]).to.be.equal(user.uid)
          done()
      })
      .catch(done)
  })

  it('Get unpublish rules by content type', done => {
    makeWorkflow()
    .contentType('multi_page')
    .getPublishRules({action: 'unpublish'})
    .then(response => {
        expect(response.items.length).to.be.equal(0)
        done()
    })
    .catch(done)
  })

  it('Get publish rules by content type specific locale  not present', done => {
    makeWorkflow()
    .contentType('multi_page')
    .getPublishRules({action: 'publish', locale:'en-us'})
    .then(response => {
        expect(response.items.length).to.be.equal(0)
        done()
    })
    .catch(done)
  })

  it('Get publish rules by content type specific locale', done => {
    makeWorkflow()
    .contentType('multi_page')
    .getPublishRules({action: 'publish', locale:'en-at'})
    .then(response => {
        expect(response.items.length).to.be.equal(1)
        const publishRule = response.items[0]
        expect(publishRule.action).to.be.equal('publish')
        expect(publishRule.environment).to.be.equal(environment[1].uid)
        expect(publishRule.approvers[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

  it('Get publish rules by content type specific environment not present', done => {
    makeWorkflow()
    .contentType('multi_page')
    .getPublishRules({action: 'publish',  environment:environment[0].uid})
    .then(response => {
        expect(response.items.length).to.be.equal(0)
        done()
    })
    .catch(done)
  })

  it('Get publish rules by content type specific environment', done => {
    makeWorkflow()
    .contentType('multi_page')
    .getPublishRules({action: 'publish', environment:environment[1].uid})
    .then(response => {
        expect(response.items.length).to.be.equal(1)
        const publishRule = response.items[0]
        expect(publishRule.action).to.be.equal('publish')
        expect(publishRule.environment).to.be.equal(environment[1].uid)
        expect(publishRule.approvers[0]).to.be.equal(user.uid)
        done()
    })
    .catch(done)
  })

    // it('Request Publish entry', done => {
    //     const publishing_rule = {
    //         uid: publishRequestUid,
    //         action: 'publish',
    //         status: 0,
    //         notify: false,
    //         comment: "Please review the publish"
    //     }
    //     client.stack({ api_key: stack.api_key })
    //     .contentType(multiPageCT.content_type.uid)
    //     .entry(entries[0].uid)
    //     .publishRequest({publishing_rule})
    //     .then(response => {
    //         console.log(response)
    //         done()
    //     })
    //     .catch(done)
    // })

  it('Delete Publish rule from UID', done => {
    makeWorkflow()
    .publishRule(publishRuleUid)
    .delete()
    .then(response => {
        expect(response.notice).to.be.equal('Publish rule deleted successfully.')
        done()
    })
    .catch(done)
  })

  it('Delete Workflow from UID', done => {
    makeWorkflow(workflowUid)
    .delete()
    .then(response => {
        expect(response.notice).to.be.equal('Workflow deleted successfully.')
        done()
    })
    .catch(done)
  })
})

function makeWorkflow (uid = null) {
  return client.stack({ api_key: stack.api_key }).workflow(uid)
}
