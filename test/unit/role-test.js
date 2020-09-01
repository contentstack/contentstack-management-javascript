import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Role, RoleCollection } from '../../lib/stack/roles'
import { systemUidMock, stackHeadersMock, roleMock, noticeMock } from './mock/objects'

describe('Contentstack Role test', () => {
  it('Role test without uid', done => {
    const role = makeRole()
    expect(role.urlPath).to.be.equal('/roles')
    expect(role.update).to.be.equal(undefined)
    expect(role.delete).to.be.equal(undefined)
    expect(role.fetch).to.be.equal(undefined)
    expect(role.create).to.not.equal(undefined)
    expect(role.fetchAll).to.not.equal(undefined)
    expect(role.query).to.not.equal(undefined)
    done()
  })

  it('Role test with uid', done => {
    const role = makeRole({
      role: {
        ...systemUidMock
      }
    })
    expect(role.urlPath).to.be.equal(`/roles/${systemUidMock.uid}`)
    expect(role.update).to.be.equal(undefined)
    expect(role.delete).to.be.equal(undefined)
    expect(role.fetch).to.be.equal(undefined)
    expect(role.create).to.be.equal(undefined)
    expect(role.fetchAll).to.be.equal(undefined)
    expect(role.query).to.be.equal(undefined)
    done()
  })

  it('Role test with Stack Headers', done => {
    const role = makeRole({
      role: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(role.urlPath).to.be.equal(`/roles/${systemUidMock.uid}`)
    expect(role.update).to.not.equal(undefined)
    expect(role.delete).to.not.equal(undefined)
    expect(role.fetch).to.not.equal(undefined)
    expect(role.create).to.be.equal(undefined)
    expect(role.fetchAll).to.be.equal(undefined)
    expect(role.query).to.be.equal(undefined)
    done()
  })

  it('Role Collection test with blank data', done => {
    const roles = new RoleCollection(Axios, {})
    expect(roles.length).to.be.equal(0)
    done()
  })

  it('Role Collection test with data', done => {
    const roles = new RoleCollection(Axios, {
      roles: [
        roleMock
      ]
    })
    expect(roles.length).to.be.equal(1)
    checkRole(roles[0])
    done()
  })

  it('Role create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/roles').reply(200, {
      role: {
        ...roleMock
      }
    })
    makeRole()
      .create()
      .then((role) => {
        checkRole(role)
        done()
      })
      .catch(done)
  })

  it('Role Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/roles').reply(200, {
      roles: [
        roleMock
      ]
    })
    makeRole()
      .fetchAll()
      .then((roles) => {
        checkRole(roles.items[0])
        done()
      })
      .catch(done)
  })

  it('Role Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/roles').reply(200, {
      roles: [
        roleMock
      ]
    })
    makeRole({ stackHeaders: stackHeadersMock })
      .fetchAll()
      .then((roles) => {
        checkRole(roles.items[0])
        done()
      })
      .catch(done)
  })

  it('Role Fetch all without paramstest', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/roles').reply(200, {
      roles: [
        roleMock
      ]
    })
    makeRole({ stackHeaders: stackHeadersMock })
      .fetchAll(null)
      .then((roles) => {
        checkRole(roles.items[0])
        done()
      })
      .catch(done)
  })

  it('Role Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/roles').reply(200, {
      roles: [
        roleMock
      ]
    })
    makeRole()
      .query()
      .find()
      .then((roles) => {
        checkRole(roles.items[0])
        done()
      })
      .catch(done)
  })

  it('Role update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/roles/UID').reply(200, {
      role: {
        ...roleMock
      }
    })
    makeRole({
      role: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((role) => {
        checkRole(role)
        done()
      })
      .catch(done)
  })

  it('Role fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/roles/UID').reply(200, {
      role: {
        ...roleMock
      }
    })
    makeRole({
      role: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((role) => {
        checkRole(role)
        done()
      })
      .catch(done)
  })

  it('Role delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/roles/UID').reply(200, {
      ...noticeMock
    })
    makeRole({
      role: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((role) => {
        expect(role.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeRole (data = {}) {
  return new Role(Axios, data)
}

function checkAdminRole (role) {
  expect(role.created_at).to.be.equal('created_at_date')
  expect(role.updated_at).to.be.equal('updated_at_date')
  expect(role.uid).to.be.equal('UID')
  expect(role.name).to.be.equal('Admin')
  expect(role.description).to.be.equal('Admin Role')
  expect(role.org_uid).to.be.equal('org_uid')
  expect(role.admin).to.be.equal(true)
  expect(role.default).to.be.equal(true)
  expect(role.users.length).to.be.equal(1)
}

function checkRole (role) {
  expect(role.created_at).to.be.equal('created_at_date')
  expect(role.updated_at).to.be.equal('updated_at_date')
  expect(role.uid).to.be.equal('UID')
  expect(role.name).to.be.equal('Admin')
  expect(role.description).to.be.equal('Admin Role')
  expect(role.org_uid).to.be.equal('org_uid')
  expect(role.admin).to.be.equal(false)
  expect(role.default).to.be.equal(true)
  expect(role.users.length).to.be.equal(1)
}

export { checkAdminRole, checkRole }
