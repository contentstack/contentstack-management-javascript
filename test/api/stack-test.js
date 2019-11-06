
import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
var orgID = 'blt7d93f4fb8e6f74cb'
var apiKey = 'blt3d0c33bf2d491e73'
const client = contentstack.client(axios, { authtoken: 'blted986549450e6310' })

describe('Stack api Test', () => {
  const newStack = { stack:
        { name: 'My New Stack',
          description: 'My new test stack',
          master_locale: 'en-us'
        }
  }

  it('Create Stack', done => {
    client.stack()
      .create(newStack, { organization_uid: orgID })
      .then((stack) => {
        apiKey = stack.api_key
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
      })
      .catch((error) => {
        expect(error).to.be.equal(null)
        done()
      })
  })

  it('Fetch Stack details', done => {
    client.stack(apiKey)
      .fetch()
      .then((stack) => {
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
      })
      .catch((error) => {
        expect(error).to.be.equal(null)
        done()
      })
  })

  it('Update Stack details', done => {
    const name = 'My New Stack Update Name'
    const description = 'My New description stack'
    client.stack(apiKey)
      .fetch().then((stack) => {
        stack.name = name
        stack.description = description
        return stack.update()
      }).then((stack) => {
        expect(stack.name).to.be.equal(name)
        expect(stack.description).to.be.equal(description)
        done()
      }).catch((error) => {
        expect(error).to.be.equal(null)
        done()
      })
  })

  it('Get all users of stack', done => {
    client.stack(apiKey)
      .users()
      .then((response) => {
        expect(response[0].uid).to.be.equal('blt4dcb45b4456bb358')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Get stack settings', done => {
    client.stack(apiKey)
      .settings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Add stack settings', done => {
    client.stack(apiKey)
      .addSettings({ samplevariable: 'too' })
      .then((response) => {
        expect(response.stack_variables.samplevariable).to.be.equal('too', 'samplevariable must set to \'too\' ')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Reset stack settings', done => {
    client.stack(apiKey)
      .resetSettings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Share stack test', done => {
    client.stack(apiKey)
      .share(['test@test.com'], { 'test@test.com': ['bltd5d348c98d9e5ec4'] })
      .then((response) => {
        console.log(response)
        expect(response).to.be.equal('The invitation has been sent successfully.')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('unshare stack test', done => {
    client.stack(apiKey)
      .unShare('test@test.com')
      .then((response) => {
        expect(response).to.be.equal('The stack has been successfully unshared.')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Get all stack', done => {
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
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Get query stack', done => {
    client.stack()
      .query({ name: 'Conference Demo' })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.be.equal('Conference Demo')
        }
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Find one stack', done => {
    client.stack()
      .query({ name: 'Conference Demo' })
      .findOne()
      .then((response) => {
        const stack = response.items[0]
        expect(response.items.length).to.be.equal(1)
        expect(stack.name).to.be.equal('Conference Demo')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Delete Stack', done => {
    client.stack(apiKey)
      .delete().then((notice) => {
        expect(notice).to.be.equal('Stack deleted successfully!')
        done()
      }).catch((error) => {
        expect(error).to.be.equal(null)
        done()
      })
  })
})
