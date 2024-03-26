import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { stageBranch } from '../mock/branch.js'

import dotenv from 'dotenv'
dotenv.config()

var orgID = process.env.ORGANIZATION
var user = {}
var client = {}

var stacks = {}
describe('Stack api Test', () => {
  setup(() => {
    user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  const newStack = {
    stack:
        {
          name: 'My New Stack',
          description: 'My new test stack',
          master_locale: 'en-us'
        }
  }

  it('should create Stack', done => {
    client.stack()
      .create(newStack, { organization_uid: orgID })
      .then((stack) => {
        jsonWrite(stack, 'stack.json')
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
        stacks = jsonReader('stack.json')
      })
      .catch(done)
  })

  it('should fetch Stack details', done => {
    client.stack({ api_key: stacks.api_key })
      .fetch()
      .then((stack) => {
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
      })
      .catch(done)
  })

  it('should update Stack details', done => {
    const name = 'My New Stack Update Name'
    const description = 'My New description stack'
    client.stack({ api_key: stacks.api_key })
      .fetch().then((stack) => {
        stack.name = name
        stack.description = description
        return stack.update()
      }).then((stack) => {
        expect(stack.name).to.be.equal(name)
        expect(stack.description).to.be.equal(description)
        done()
      })
      .catch(done)
  })

  it('should get all users of stack', done => {
    client.stack({ api_key: stacks.api_key })
      .users()
      .then((response) => {
        expect(response[0].uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get stack settings', done => {
    client.stack({ api_key: stacks.api_key })
      .settings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch(done)
  })

  it('should add stack settings', done => {
    client.stack({ api_key: stacks.api_key })
      .addSettings({ samplevariable: 'too' })
      .then((response) => {
        expect(response.stack_variables.samplevariable).to.be.equal('too', 'samplevariable must set to \'too\' ')
        done()
      })
      .catch(done)
  })

  it('should reset stack settings', done => {
    client.stack({ api_key: stacks.api_key })
      .resetSettings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch(done)
  })

  it('should get all stack', done => {
    client.stack()
      .query()
      .find()
      .then((response) => {
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.not.equal(null)
          expect(stack.uid).to.not.equal(null)
          expect(stack.owner_uid).to.not.equal(null)
        }
        done()
      })
      .catch(done)
  })

  it('should get query stack', done => {
    client.stack()
      .query({ query: { name: 'My New Stack Update Name' } })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.be.equal('My New Stack Update Name')
        }
        done()
      })
      .catch(done)
  })

  it('should find one stack', done => {
    client.stack()
      .query({ query: { name: 'My New Stack Update Name' } })
      .findOne()
      .then((response) => {
        const stack = response.items[0]
        expect(response.items.length).to.be.equal(1)
        expect(stack.name).to.be.equal('My New Stack Update Name')
        done()
      })
      .catch(done)
  })
})

describe('Branch creation api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create staging branch', done => {
    makeBranch()
      .create({ branch: stageBranch })
      .then((response) => {
        expect(response.uid).to.be.equal(stageBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
        expect(response.source).to.be.equal(stageBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })
})

function makeBranch (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).branch(uid)
}
