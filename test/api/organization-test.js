import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
var orgID = 'blt4217d3e62dbf7564'
const user = jsonReader('loggedinuser.json')
const client = contentstack.client(axios, { authtoken: user.authtoken })
const organization = client.organization(orgID)
describe('Organization api test', () => {
  it('Fetch all organizations', done => {
    client.organization().fetchAll()
      .then((response) => {
        for (const index in response.items) {
          const organization = response.items[index]
          expect(organization.name).to.not.equal(null, 'Organization name cannot be null')
          expect(organization.uid).to.not.equal(null, 'Organization uid cannot be null')
        }
        done()
      })
      .catch((error) => {
        console.log(error)
        expect(error).to.be.equal(null, 'Failed Organization call find all.')
        done()
      })
  })

  it('Find One organizations', done => {
    organization.fetch()
      .then((organization) => {
        console.log(organization)
        expect(organization.name).to.be.equal('Contentstack Employees', 'Organization name dose not match')
        done()
      })
      .catch((error) => {
        console.log(error)
        expect(error).to.be.equal(null, 'Failed Organization call find one.')
        done()
      })
  })

  it('Get all stacks in an Organization', done => {
    organization.stacks()
      .then((response) => {
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.not.equal(null, 'Organization name cannot be null')
          expect(stack.uid).to.not.equal(null, 'Organization uid cannot be null')
          expect(stack.org_uid).to.equal('orgID', 'Organization uid cannot be null')
        }
      })
      .catch((error) => {
        console.log(error)
        expect(error).to.be.equal(null, 'Failed Organization call find one.')
        done()
      })
  })

  it('Transfer Organization Ownership', done => {
    organization.transferOwnership('em@em.com')
      .then((notice) => expect(notice).to.be.equal('Email has been successfully sent to the user.', 'Message does not match'))
      .catch((error) => {
        console.log(error)
        expect(error).to.be.equal(null, 'Failed Transfer Organization Ownership')
        done()
      })
  })
})
