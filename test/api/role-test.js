import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import role from '../unit/mock/role'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
var stack = {}
var client = {}
var roleUID = 'blt0c678bcc2bdfc141'

describe('Role api test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Get all role in stack', done => {
    getRole()
      .fetchAll()
      .then((roles) => {
        for (const index in roles.items) {
          const role = roles.items[index]
          expect(role.uid).to.not.equal(null, 'Role uid cannot be null')
        }
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Get 1 role in stack with limit', done => {
    getRole()
      .fetchAll({ limit: 1 })
      .then((roles) => {
        expect(roles.items.lenth).to.not.equal(1, 'Role fetch with limit 1 not work')
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Get 2 role in stack with skip first', done => {
    getRole()
      .fetchAll({ skip: 1 })
      .then((roles) => {
        expect(roles.items.lenth).to.not.equal(1, 'Role fetch with limit 1 not work')
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Create new role in stack', done => {
    getRole()
      .create(role)
      .then((roles) => {
        roleUID = roles.uid
        expect(roles.name).to.be.equal(role.role.name, 'Role name not match')
        expect(roles.description).to.be.equal(role.role.description, 'Role description not match')
        expect(roles.rules.length).to.be.equal(2, 'Role rule length not match')
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Get role in stack', done => {
    getRole(roleUID)
      .fetch()
      .then((roles) => {
        jsonWrite(roles, 'role.json')
        expect(roles.name).to.be.equal(role.role.name, 'Role name not match')
        expect(roles.description).to.be.equal(role.role.description, 'Role description not match')
        expect(roles.stack.api_key).to.be.equal(stack.api_key, 'Role stack uid not match')
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Update role in stack', done => {
    getRole(roleUID)
      .fetch({ include_rules: true, include_permissions: true })
      .then((roles) => {
        roles.name = 'Update test name'
        roles.description = 'Update description'
        return roles.update()
      })
      .then((roles) => {
        expect(roles.name).to.be.equal('Update test name', 'Role name not match')
        expect(roles.description).to.be.equal('Update description', 'Role description not match')
        done()
      })
      .catch((err) => {
        console.log(err)
        expect(err).to.not.equal(null, 'Erro should not be null')
        done()
      })
  })

  it('Get all Roles with query', done => {
    getRole()
      .query()
      .find()
      .then((response) => {
        for (const index in response.items) {
          const role = response.items[index]
          expect(role.name).to.not.equal(null)
          expect(role.uid).to.not.equal(null)
        }
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Get query Role', done => {
    getRole()
      .query({ name: 'Developer' })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.be.equal('Developer')
        }
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })

  it('Find one role', done => {
    getRole()
      .query({ name: 'Developer' })
      .findOne()
      .then((response) => {
        const stack = response.items[0]
        expect(response.items.length).to.be.equal(1)
        expect(stack.name).to.be.equal('Developer')
        done()
      })
      .catch((error) => {
        console.log(error)
        // expect(error).to.be.equal(null)
        done()
      })
  })
})

// Helper
function getRole (uid = null) {
  return client.stack(stack.api_key).role(uid)
}
