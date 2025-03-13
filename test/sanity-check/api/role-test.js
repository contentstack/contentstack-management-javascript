import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import role from '../mock/role.js'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}
let roleUID = ''

describe('Role api test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should get all role in stack', done => {
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

  it('should get 1 role in stack with limit', done => {
    getRole()
      .fetchAll({ limit: 2 })
      .then((roles) => {
        expect(roles.items.length).to.not.equal(1)
        done()
      })
      .catch(done)
  })

  it('should get role in stack with skip first', done => {
    getRole()
      .fetchAll({ skip: 1 })
      .then((roles) => {
        expect(roles.items.lenth).to.not.equal(1, 'Role fetch with limit 1 not work')
        done()
      })
      .catch(done)
  })

  // it('should create taxonomy', async () => {
  //   await client.stack({ api_key: process.env.API_KEY }).taxonomy().create({ taxonomy })
  // })

  // it('should create term', done => {
  //   makeTerms(taxonomy.uid).create(term)
  //     .then((response) => {
  //       expect(response.uid).to.be.equal(term.term.uid)
  //       done()
  //     })
  //     .catch(done)
  // })

  it('should create new role in stack', done => {
    getRole()
      .create(role)
      .then((roles) => {
        roleUID = roles.uid
        expect(roles.name).to.be.equal(role.role.name, 'Role name not match')
        expect(roles.description).to.be.equal(role.role.description, 'Role description not match')
        done()
      })
      .catch(done)
  })

  it('should get role in stack', done => {
    getRole(roleUID)
      .fetch()
      .then((roles) => {
        jsonWrite(roles, 'role.json')
        expect(roles.name).to.be.equal(role.role.name, 'Role name not match')
        expect(roles.description).to.be.equal(role.role.description, 'Role description not match')
        expect(roles.stack.api_key).to.be.equal(process.env.API_KEY, 'Role stack uid not match')
        done()
      })
      .catch(done)
  })

  it('should update role in stack', done => {
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

  it('should get all Roles with query', done => {
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

  it('should get query Role', done => {
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

  it('should find one role', done => {
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

  it('should delete role in stack', done => {
    getRole(roleUID)
      .delete()
      .then((roles) => {
        expect(roles.notice).to.be.equal('The role deleted successfully.')
        done()
      })
      .catch(done)
  })
  // it('should delete of the term uid passed', done => {
  //   makeTerms(taxonomy.uid, term.term.uid).delete({ force: true })
  //     .then((response) => {
  //       expect(response.status).to.be.equal(204)
  //       done()
  //     })
  //     .catch(done)
  // })

  // it('should delete taxonomy', async () => {
  //   const taxonomyResponse = await client.stack({ api_key: process.env.API_KEY }).taxonomy(taxonomy.uid).delete({ force: true })
  //   expect(taxonomyResponse.status).to.be.equal(204)
  // })
})

function getRole (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).role(uid)
}
