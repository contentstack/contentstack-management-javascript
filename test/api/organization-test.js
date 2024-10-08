import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var user = {}
var client = {}
var organization = {}

describe('Organization api test', () => {
  setup(() => {
    user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('Fetch all organizations', done => {
    client.organization().fetchAll()
      .then((response) => {
        for (const index in response.items) {
          const organizations = response.items[index]
          expect(organizations.name).to.not.equal(null, 'Organization name cannot be null')
          expect(organizations.uid).to.not.equal(null, 'Organization uid cannot be null')
        }
        done()
      })
      .catch(done)
  })

  it('Get Current user info test', done => {
    client.getUser({ include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true }).then((user) => {
      for (const index in user.organizations) {
        const organizations = user.organizations[index]
        if (organizations.org_roles && (organizations.org_roles.filter(function (role) { return role.admin === true }).length > 0)) {
          organization = organizations
          break
        }
      }
      done()
    })
      .catch(done)
  })

  it('Fetch organization', done => {
    client.organization(organization).fetch()
      .then((organizations) => {
        expect(organizations.name).to.be.equal('SDK org', 'Organization name dose not match')
        done()
      })
      .catch(done)
  })

  it('Get all stacks in an Organization', done => {
    client.organization(organization).stacks()
      .then((response) => {
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.not.equal(null, 'Organization name cannot be null')
          expect(stack.uid).to.not.equal(null, 'Organization uid cannot be null')
        }
        done()
      })
      .catch(done)
  })
  // need to test with transfer ownership
  // it('Transfer Organization Ownership', done => {
  //   organization.transferOwnership('em@em.com')
  //     .then((data) => {
  //       expect(data.notice).to.be.equal('Email has been successfully sent to the user.', 'Message does not match')
  //       done()
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       expect(error).to.be.equal(null, 'Failed Transfer Organization Ownership')
  //       done()
  //     })
  // })

  it('Get all roles in an organization', done => {
    organization.roles()
      .then((roles) => {
        for (const i in roles.items) {
          expect(roles.items[i].uid).to.not.equal(null, 'Role uid cannot be null')
          expect(roles.items[i].name).to.not.equal(null, 'Role name cannot be null')
          expect(roles.items[i].org_uid).to.be.equal(organization.uid, 'Role org_uid not match')
        }
        done()
      })
      .catch(done)
  })

  it('Get all invitations in an organization', done => {
    organization.getInvitations({ include_count: true })
      .then((response) => {
        expect(response.count).to.not.equal(null, 'Failed Transfer Organization Ownership')
        for (const i in response.items) {
          expect(response.items[i].uid).to.not.equal(null, 'User uid cannot be null')
          expect(response.items[i].email).to.not.equal(null, 'User name cannot be null')
          expect(response.items[i].user_uid).to.not.equal(null, 'User name cannot be null')
          expect(response.items[i].org_uid).to.not.equal(null, 'User name cannot be null')
        }
        done()
      })
      .catch(done)
  })

  // addUser
  // Resend invitation
})
