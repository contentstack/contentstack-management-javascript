import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Organization, OrganizationCollection } from '../../lib/organization'
import { roleMock, adminRoleMock, orgMock, mockCollection, systemUidMock, stackMock, noticeMock, userMock, orgOwnerMock, orgISOwnerMock } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'
import ContentstackCollection from '../../lib/contentstackCollection'
import { checkUser } from './user-test'
import { checkAdminRole, checkRole } from './role-test'
import { checkStack } from './stack-test'

describe('Organization Test', () => {
  it('Organization without UID', done => {
    const organization = makeOrganization()
    expect(organization.urlPath).to.be.equal('/organizations')
    expect(organization.fetchAll).to.not.equal(undefined)
    expect(organization.fetch).to.be.equal(undefined)
    expect(organization.stacks).to.be.equal(undefined)
    expect(organization.transferOwnership).to.be.equal(undefined)
    expect(organization.addUser).to.be.equal(undefined)
    expect(organization.getInvitations).to.be.equal(undefined)
    expect(organization.resendInvitation).to.be.equal(undefined)
    expect(organization.roles).to.be.equal(undefined)
    done()
  })

  it('Organization with UID', done => {
    const organization = makeOrganization({ organization: {
      ...systemUidMock
    } })
    expect(organization.fetchAll).to.be.equal(undefined)
    expect(organization.fetch).to.not.equal(undefined)
    expect(organization.stacks).to.be.equal(undefined)
    expect(organization.transferOwnership).to.be.equal(undefined)
    expect(organization.addUser).to.be.equal(undefined)
    expect(organization.getInvitations).to.be.equal(undefined)
    expect(organization.resendInvitation).to.be.equal(undefined)
    expect(organization.roles).to.be.equal(undefined)
    done()
  })

  it('Organization with non admin role', done => {
    const organization = makeOrganization({ organization: {
      ...systemUidMock,
      org_roles: [roleMock]
    } })
    checknonAdminFunction(organization)
    done()
  })

  it('Organization with owner', done => {
    const organization = makeOrganization({ organization: {
      ...orgOwnerMock
    } })
    checkOrgMock(organization)
    checkAdminFunction(organization)
    done()
  })

  it('Organization with owner', done => {
    const organization = makeOrganization({ organization: {
      ...orgISOwnerMock
    } })
    checkOrgMock(organization)
    checkAdminFunction(organization)
    done()
  })

  it('Organization with admin role', done => {
    const organization = makeOrganization({ organization: {
      ...systemUidMock,
      org_roles: [adminRoleMock]
    } })
    checkAdminFunction(organization)
    done()
  })

  it('Organization with admin role', done => {
    const organization = makeOrganization({ organization: {
      ...orgMock
    } })
    checkOrgMock(organization)
    checknonAdminFunction(organization)
    done()
  })

  it('Organization Collection', done => {
    const organizations = new OrganizationCollection(Axios, {})
    expect(organizations.length).to.be.equal(0)
    done()
  })

  it('Organization Collection with data', done => {
    const organizations = new OrganizationCollection(Axios, { organizations: [orgMock] })
    expect(organizations.length).to.be.equal(1)
    checkOrgMock(organizations[0])
    done()
  })

  it('Organization Collection from ContentstackCollection', done => {
    var collection = new ContentstackCollection({ data: mockCollection(orgMock, 'organizations') }, Axios, null, OrganizationCollection)
    expect(collection.items.length).to.be.equal(1)
    checkOrgMock(collection.items[0])
    done()
  })

  it('Organization fetch all mock', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet('/organizations').reply(200, {
      organizations: [
        orgMock
      ]
    })
    makeOrganization()
      .fetchAll()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        checkOrgMock(response.items[0])
        done()
      })
      .catch(done)
  })

  it('Organization fetch', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/${systemUidMock.uid}`).reply(200, {
      organization: {
        ...orgMock
      }
    })
    makeOrganization({ organization: {
      ...systemUidMock
    } })
      .fetch()
      .then((response) => {
        checkOrgMock(response)
        done()
      })
      .catch(done)
  })

  it('Organization Stacks fetch', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/${systemUidMock.uid}/stacks`).reply(200, { stacks: [stackMock] })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .stacks()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        checkStack(response.items[0])
        done()
      })
      .catch(done)
  })

  it('Organization Transfer Ownership', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/${systemUidMock.uid}/transfer_ownership`).reply(200, { ...noticeMock })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .transferOwnership('email')
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Organization add User', done => {
    const mock = new MockAdapter(Axios)
    mock.onPost(`/organizations/${systemUidMock.uid}/share`).reply(200, { ...noticeMock, shares: [userMock] })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .addUser({})
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        checkUser(response.items[0])
        done()
      })
      .catch(done)
  })

  it('Organization Get all invitation', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/${systemUidMock.uid}/share`).reply(200, { ...noticeMock, shares: [userMock] })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .getInvitations({})
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        checkUser(response.items[0])
        done()
      })
      .catch(done)
  })

  it('Organization Resend Invitation', done => {
    const inviteID = 'inviteID'
    const mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/${systemUidMock.uid}/${inviteID}/resend_invitation`).reply(200, { ...noticeMock })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .resendInvitation(inviteID)
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Organization Roles', done => {
    const mock = new MockAdapter(Axios)
    mock.onGet(`/organizations/${systemUidMock.uid}/roles`).reply(200, { roles: [adminRoleMock, roleMock] })
    makeOrganization({
      organization: {
        ...systemUidMock,
        org_roles: [adminRoleMock]
      }
    })
      .roles()
      .then((response) => {
        expect(response.items.length).to.be.equal(2)
        checkAdminRole(response.items[0])
        checkRole(response.items[1])
        done()
      })
      .catch(done)
  })
})

function makeOrganization (params = {}) {
  return new Organization(Axios, params)
}

function checknonAdminFunction (organization) {
  expect(organization.fetchAll).to.be.equal(undefined)
  expect(organization.fetch).to.not.equal(undefined)
  expect(organization.stacks).to.be.equal(undefined)
  expect(organization.transferOwnership).to.be.equal(undefined)
  expect(organization.addUser).to.be.equal(undefined)
  expect(organization.getInvitations).to.be.equal(undefined)
  expect(organization.resendInvitation).to.be.equal(undefined)
  expect(organization.roles).to.be.equal(undefined)
}

function checkAdminFunction (organization) {
  expect(organization.urlPath).to.be.equal(`/organizations/${systemUidMock.uid}`)
  expect(organization.fetchAll).to.be.equal(undefined)
  expect(organization.fetch).to.not.equal(undefined)
  expect(organization.stacks).to.not.equal(undefined)
  expect(organization.transferOwnership).to.not.equal(undefined)
  expect(organization.addUser).to.not.equal(undefined)
  expect(organization.getInvitations).to.not.equal(undefined)
  expect(organization.resendInvitation).to.not.equal(undefined)
  expect(organization.roles).to.not.equal(undefined)
}

function checkOrgMock (organization) {
  expect(organization.urlPath).to.be.equal(`/organizations/${systemUidMock.uid}`)
  expect(organization.created_at).to.be.equal('created_at_date')
  expect(organization.updated_at).to.be.equal('updated_at_date')
  expect(organization.uid).to.be.equal('UID')
  expect(organization.name).to.be.equal('name')
  expect(organization.plan_id).to.be.equal('plan_id')
  expect(organization.owner_uid).to.be.equal('owner_uid')
  expect(organization.expires_on).to.be.equal('expires_on')
  expect(organization.enabled).to.be.equal(true)
  expect(organization.is_over_usage_allowed).to.be.equal(true)
}
