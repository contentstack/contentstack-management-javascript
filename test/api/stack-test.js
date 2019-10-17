
import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'

var orgID = 'blt7d93f4fb8e6f74cb'
var apiKey = 'blt699ca00815b611c2'
const client = contentstack.client(axios, { authtoken: 'blt7a577b62d8d5a63b' })

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

  it('Delete stack', done => {
    client.stack(apiKey)
      .delete()
      .then((response) => {
        expect(response).to.be.equal('Stack deleted successfully!')
        done()
      })
      .catch((error) => {
        expect(error).to.be.equal(null)
        done()
      })
  })
})
