import Axios from 'axios'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { describe, it } from 'mocha'
import { User, UserCollection } from '../../lib/user'
import MockAdapter from 'axios-mock-adapter'
import { userMock, orgMock, noticeMock, mockCollection, userAssignments, stackHeadersMock } from './mock/objects'
import ContentstackCollection from '../../lib/contentstackCollection'

describe('Contentstack User test', () => {
  it('User test without authtoken', done => {
    const user = new User(Axios, {})
    expect(user.urlPath).to.be.equal('/user')
    expect(user.update).to.be.equal(undefined)
    expect(user.delete).to.be.equal(undefined)
    expect(user.requestPassword).to.be.equal(undefined)
    expect(user.resetPassword).to.be.equal(undefined)
    expect(user.getTasks).to.be.equal(undefined)
    done()
  })

  it('User test with authtoken', done => {
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })
    expect(user.urlPath).to.be.equal('/user')
    expect(user.update).to.not.equal(undefined)
    expect(user.delete).to.not.equal(undefined)
    expect(user.requestPassword).to.not.equal(undefined)
    expect(user.resetPassword).to.not.equal(undefined)
    expect(user.getTasks).to.not.equal(undefined)
    done()
  })

  it('User test user parsing', done => {
    expectTest(new User(Axios, { user: userMock }))
    done()
  })

  it('User test Org Parsing', done => {
    const user = new User(Axios, {
      user: {
        authtoken: 'authtoken',
        ...cloneDeep(userMock),
        organizations: [orgMock]
      }
    })
    expectTest(user)
    expect(user.organizations.length).to.be.equal(1)
    done()
  })

  it('User Update Mock test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('user').reply(200, {
      user: {
        ...userMock
      }
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })
    user.update()
      .then((response) => {
        expectTest(response)
        done()
      })
      .catch(done)
  })

  it('User Delete Mock test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/user').reply(200, {
      ...noticeMock
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })
    user.delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('User Forgot Password Mock test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/user/forgot_password').reply(200, {
      ...noticeMock
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken',
      email: userMock.email
    }
    })
    user.requestPassword()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('User Reset Password Mock test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/user/reset_password').reply(200, {
      ...noticeMock
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })
    user.resetPassword({ resetPasswordToken: 'reset_token', password: 'password', passwordConfirm: 'passwordConfirm' })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('User Collection Test', done => {
    var users = new UserCollection(Axios, {})
    expect(users.length).to.be.equal(0)
    done()
  })

  it('User Collaborators Test', done => {
    var users = new UserCollection(Axios, { collaborators: [userMock] })
    expect(users.length).to.be.equal(1)
    expectTest(users[0])
    done()
  })

  it('User Shares Test', done => {
    var users = new UserCollection(Axios, { shares: [userMock] })
    expect(users.length).to.be.equal(1)
    expectTest(users[0])
    done()
  })

  it('User with ContentstackCollection Test', done => {
    var collection = new ContentstackCollection({ data: mockCollection(userMock, 'shares') }, Axios, null, UserCollection)
    expect(collection.items.length).to.be.equal(1)
    expectTest(collection.items[0])
    done()
  })

  it('User get task test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/user/assignments').reply(200, {
      asassignments: {
        ...userAssignments
      }
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })

    user.getTasks()
      .then((userTasks) => {
        const assignment = userTasks.asassignments
        expect(assignment.api_key).to.be.equal(stackHeadersMock.api_key)
        expect(assignment.content_type).to.be.equal('CT_UID')
        expect(assignment.entry_uid).to.be.equal('ETR_UID')
        expect(assignment.locale).to.be.equal('en-us')
        expect(assignment.org_uid).to.be.equal('orgUID')
        expect(assignment.type).to.be.equal('workflow_stage')
        expect(assignment.entry_locale).to.be.equal('en-us')
        expect(assignment.version).to.be.equal(1)
        expect(assignment.assigned_to[0]).to.be.equal('user_UID')
        expect(assignment.assigned_at).to.be.equal('assign_date')
        expect(assignment.assigned_by).to.be.equal('assign_by')
        expect(assignment.due_date).to.be.equal('due_date')
        done()
      })
      .catch(done)
  })

  it('User get task failing test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/user/assignments').reply(400, {})
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })

    user.getTasks()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('User get task with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/user/assignments').reply(200, {
      asassignments: {
        ...userAssignments
      }
    })
    const user = new User(Axios, { user: {
      authtoken: 'authtoken'
    }
    })

    user.getTasks({ sort: 'sort' })
      .then((userTasks) => {
        const assignment = userTasks.asassignments
        expect(assignment.api_key).to.be.equal(stackHeadersMock.api_key)
        expect(assignment.content_type).to.be.equal('CT_UID')
        expect(assignment.entry_uid).to.be.equal('ETR_UID')
        expect(assignment.locale).to.be.equal('en-us')
        expect(assignment.org_uid).to.be.equal('orgUID')
        expect(assignment.type).to.be.equal('workflow_stage')
        expect(assignment.entry_locale).to.be.equal('en-us')
        expect(assignment.version).to.be.equal(1)
        expect(assignment.assigned_to[0]).to.be.equal('user_UID')
        expect(assignment.assigned_at).to.be.equal('assign_date')
        expect(assignment.assigned_by).to.be.equal('assign_by')
        expect(assignment.due_date).to.be.equal('due_date')
        done()
      })
      .catch(done)
  })
})

function expectTest (user) {
  expect(user.created_at).to.be.equal('created_at_date')
  expect(user.updated_at).to.be.equal('updated_at_date')
  expect(user.uid).to.be.equal('UID')
  expect(user.email).to.be.equal('sample@email.com')
  expect(user.username).to.be.equal('UserName')
  expect(user.first_name).to.be.equal('first_name')
  expect(user.last_name).to.be.equal('last_name')
  expect(user.company).to.be.equal('company')
  expect(user.mobile_number).to.be.equal('mobile_number')
  expect(user.country_code).to.be.equal('country_code')
  expect(user.tfa_status).to.be.equal('verified')
}

export { expectTest as checkUser }
