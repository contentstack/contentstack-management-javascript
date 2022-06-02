import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import role from './mock/role'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
var stack = {}
var client = {}
var roleUID = ''

describe('Role api test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Get all role in stack', done => {
    getRole()
      .fetchAll()
      .then((roles) => {
        jsonWrite(roles.items, 'roles.json')
        for (const index in roles.items) {
          const role1 = roles.items[index]
          expect(role1.uid).to.not.equal(null, 'Role uid cannot be null')
        }
        done()
      })
      .catch(done)
  })

  it('Get 1 role in stack with limit', done => {
    getRole()
      .fetchAll({ limit: 1 })
      .then((roles) => {
        expect(roles.items.length).to.not.equal(1, 'Role fetch with limit 1 not work')
        done()
      })
      .catch(done)
  })

  it('Get 2 role in stack with skip first', done => {
    getRole()
      .fetchAll({ skip: 1 })
      .then((roles) => {
        expect(roles.items.lenth).to.not.equal(1, 'Role fetch with limit 1 not work')
        done()
      })
      .catch(done)
  })

  it('Create new role in stack', done => {
    getRole()
      .create(role)
      .then((roles) => {
        roleUID = roles.uid
        expect(roles.name).to.be.equal(role.role.name, 'Role name not match')
        expect(roles.description).to.be.equal(role.role.description, 'Role description not match')
        expect(roles.rules.length).to.be.equal(3, 'Role rule length not match')
        done()
      })
      .catch(done)
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
      .catch(done)
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
      .catch(done)
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
      .catch(done)
  })

  it('Get query Role', done => {
    getRole()
      .query({ query: { name: 'Developer' } })
      .find()
      .then((response) => {
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.be.equal('Developer')
        }
        done()
      })
      .catch(done)
  })

  it('Find one role', done => {
    getRole()
      .query({ name: 'Developer' })
      .findOne()
      .then((response) => {
        const stack = response.items[0]
        expect(response.items.length).to.be.equal(1)
        expect(stack.name).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })
})

// Helper
function getRole (uid = null) {
  return client.stack({ api_key: stack.api_key }).role(uid)
}
