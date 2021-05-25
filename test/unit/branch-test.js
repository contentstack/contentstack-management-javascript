import axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Branch, BranchCollection } from '../../lib/stack/branch'
import { branchMock, checkSystemFields, noticeMock, stackHeadersMock, systemUidMock } from './mock/objects'

describe('Contentstack Branch test', () => {
  it('Branch test without uid', done => {
    const branch = makeBranch()
    expect(branch).to.not.equal(undefined)
    expect(branch.name).to.be.equal(undefined)
    expect(branch.urlPath).to.be.equal('/stacks/branches')
    expect(branch.create).to.not.equal(undefined)
    expect(branch.query).to.not.equal(undefined)
    expect(branch.delete).to.equal(undefined)
    expect(branch.fetch).to.equal(undefined)
    done()
  })

  it('Branch test with uid', done => {
    const branch = makeBranch({ branch: { uid: 'branch' } })
    expect(branch).to.not.equal(undefined)
    expect(branch.uid).to.be.equal('branch')
    expect(branch.urlPath).to.be.equal('/stacks/branches/branch')
    expect(branch.create).to.equal(undefined)
    expect(branch.query).to.equal(undefined)
    expect(branch.delete).to.not.equal(undefined)
    expect(branch.fetch).to.not.equal(undefined)
    done()
  })

  it('Branch Collection test with blank data', done => {
    const branch = new BranchCollection(axios, {})
    expect(branch.length).to.be.equal(0)
    done()
  })

  it('Branch Collection test with data', done => {
    const branch = new BranchCollection(axios, { branches: [branchMock] })
    expect(branch.length).to.be.equal(1)
    checkBranch(branch[0])
    done()
  })

  it('Branch create test', done => {
    var mock = new MockAdapter(axios)
    mock.onPost('/stacks/branches').reply(200, {
      branch: {
        ...branchMock
      }
    })
    makeBranch()
      .create()
      .then((branchAlias) => {
        checkBranch(branchAlias)
        done()
      })
      .catch(done)
  })

  it('Branch Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches').reply(200, {
      branches: [
        branchMock
      ]
    })
    makeBranch()
      .query()
      .find()
      .then((workflows) => {
        checkBranch(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Branch Fetch all with params test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches').reply(200, {
      branches: [
        branchMock
      ]
    })
    makeBranch({ stackHeaders: stackHeadersMock })
      .query()
      .find({})
      .then((workflows) => {
        checkBranch(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Branch Fetch all without params test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches').reply(200, {
      branches: [
        branchMock
      ]
    })
    makeBranch({ stackHeaders: stackHeadersMock })
      .query()
      .find(null)
      .then((workflows) => {
        checkBranch(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('Branch fetch test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches/UID').reply(200, {
      branch: {
        ...branchMock
      }
    })
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((workflow) => {
        checkBranch(workflow)
        done()
      })
      .catch(done)
  })

  it('Branch delete test', done => {
    var mock = new MockAdapter(axios)
    mock.onDelete('/stacks/branches/UID').reply(200, {
      ...noticeMock
    })
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((workflow) => {
        expect(workflow.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeBranch (data) {
  return new Branch(axios, data)
}

function checkBranch (branch) {
  checkSystemFields(branch)
}
