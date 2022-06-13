import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { branchAliasMock, checkSystemFields, noticeMock, stackHeadersMock, systemUidMock } from './mock/objects'
import { BranchAlias, BranchAliasCollection } from '../../lib/stack/branchAlias'

describe('Contentstack BranchAlias test', () => {
  it('BranchAlias test without uid', done => {
    const branch = makeBranchAlias()
    expect(branch).to.not.equal(undefined)
    expect(branch.uid).to.be.equal(undefined)
    expect(branch.urlPath).to.be.equal('/stacks/branch_aliases')
    expect(branch.createOrUpdate).to.equal(undefined)
    expect(branch.delete).to.equal(undefined)
    expect(branch.fetch).to.equal(undefined)
    done()
  })

  it('BranchAlias test with uid', done => {
    const branch = makeBranchAlias({ branch_alias: { uid: 'branch' } })
    expect(branch).to.not.equal(undefined)
    expect(branch.uid).to.be.equal('branch')
    expect(branch.urlPath).to.be.equal('/stacks/branch_aliases/branch')
    expect(branch.createOrUpdate).to.not.equal(undefined)
    expect(branch.delete).to.not.equal(undefined)
    expect(branch.fetch).to.not.equal(undefined)
    done()
  })

  it('BranchAlias Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/branch_aliases').reply(200, {
      branch_aliases: [
        branchAliasMock
      ]
    })
    makeBranchAlias()
      .fetchAll()
      .then((workflows) => {
        checkBranchAlias(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('BranchAlias Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/branch_aliases').reply(200, {
      branch_aliases: [
        branchAliasMock
      ]
    })
    makeBranchAlias({ stackHeaders: stackHeadersMock })
      .fetchAll({})
      .then((workflows) => {
        checkBranchAlias(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('BranchAlias Fetch all without params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/branch_aliases').reply(200, {
      branch_aliases: [
        branchAliasMock
      ]
    })
    makeBranchAlias({ stackHeaders: stackHeadersMock })
      .fetchAll(null)
      .then((workflows) => {
        checkBranchAlias(workflows.items[0])
        done()
      })
      .catch(done)
  })

  it('BranchAlias update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/stacks/branch_aliases/UID').reply(200, {
      branch_alias: {
        ...branchAliasMock
      }
    })
    makeBranchAlias({
      branch_alias: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .createOrUpdate()
      .then((workflow) => {
        checkBranchAlias(workflow)
        done()
      })
      .catch(done)
  })

  it('BranchAlias fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/branch_aliases/UID').reply(200, {
      branch_alias: {
        ...branchAliasMock
      }
    })
    makeBranchAlias({
      branch_alias: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((workflow) => {
        checkBranchAlias(workflow)
        done()
      })
      .catch(done)
  })

  it('BranchAlias delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/stacks/branch_aliases/UID').reply(200, {
      ...noticeMock
    })
    makeBranchAlias({
      branch_alias: {
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

function makeBranchAlias (data) {
  return new BranchAlias(Axios, data)
}

function checkBranchAlias (branchAlias) {
  checkSystemFields(branchAlias)
}
