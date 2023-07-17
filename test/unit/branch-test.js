import axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Branch, BranchCollection } from '../../lib/stack/branch'
import {
  branchCompareAllMock,
  branchCompareContentTypeMock,
  branchCompareGlobalFieldMock,
  branchMergeAllMock,
  branchMergeQueueFindMock,
  branchMergeQueueFetchMock,
  branchMock,
  checkSystemFields,
  noticeMock,
  stackHeadersMock,
  systemUidMock
} from './mock/objects'

describe('Contentstack Branch test', () => {
  it('Branch test without uid', done => {
    const branch = makeBranch()
    expect(branch).to.not.equal(undefined)
    expect(branch.name).to.be.equal(undefined)
    expect(branch.urlPath).to.be.equal('/stacks/branches')
    expect(branch.create).to.not.equal(undefined)
    expect(branch.query).to.not.equal(undefined)
    expect(branch.compare).to.be.equal(undefined)
    expect(branch.merge).to.not.equal(undefined)
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
    expect(branch.compare).to.not.equal(undefined)
    expect(branch.merge).to.be.equal(undefined)
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

  it('Branch compare all test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_compare', { params: { base_branch: 'UID', compare_branch: 'dev' } }).reply(200, branchCompareAllMock)
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' }
    })
      .compare('dev')
      .all()
      .then((response) => {
        expect(response.branches.base_branch).to.eql(systemUidMock.uid)
        expect(response.branches.compare_branch).to.eql(branchCompareAllMock.branches.compare_branch)
        expect(response.diff).to.eql(branchCompareAllMock.diff)
        expect(response.next_url).to.eql(branchCompareAllMock.next_url)
        done()
      })
      .catch(done)
  })

  it('Branch compare content types test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_compare/content_types/contentTypeUID', { params: { base_branch: 'UID', compare_branch: 'dev', skip: 0, limit: 100 } }).reply(200, branchCompareContentTypeMock)
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' }
    })
      .compare('dev')
      .contentTypes({ skip: 0, limit: 100, uid: 'contentTypeUID' })
      .then((response) => {
        expect(response.branches.base_branch).to.eql(systemUidMock.uid)
        expect(response.branches.compare_branch).to.eql(branchCompareContentTypeMock.branches.compare_branch)
        expect(response.diff).to.eql(branchCompareContentTypeMock.diff)
        expect(response.next_url).to.eql(branchCompareContentTypeMock.next_url)
        done()
      })
      .catch(done)
  })

  it('Branch compare content types test without params', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_compare/content_types', { params: { base_branch: 'UID', compare_branch: 'dev' } }).reply(200, branchCompareContentTypeMock)
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' }
    })
      .compare('dev')
      .contentTypes()
      .then((response) => {
        expect(response.branches.base_branch).to.eql(systemUidMock.uid)
        expect(response.branches.compare_branch).to.eql(branchCompareContentTypeMock.branches.compare_branch)
        expect(response.diff).to.eql(branchCompareContentTypeMock.diff)
        expect(response.next_url).to.eql(branchCompareContentTypeMock.next_url)
        done()
      })
      .catch(done)
  })

  it('Branch compare global fields test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_compare/global_fields/globalFieldUID', { params: { base_branch: 'UID', compare_branch: 'dev', skip: 0, limit: 100 } }).reply(200, branchCompareGlobalFieldMock)
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' }
    })
      .compare('dev')
      .globalFields({ skip: 0, limit: 100, uid: 'globalFieldUID' })
      .then((response) => {
        expect(response.branches.base_branch).to.eql(systemUidMock.uid)
        expect(response.branches.compare_branch).to.eql(branchCompareGlobalFieldMock.branches.compare_branch)
        expect(response.diff).to.eql(branchCompareGlobalFieldMock.diff)
        expect(response.next_url).to.eql(branchCompareGlobalFieldMock.next_url)
        done()
      })
      .catch(done)
  })

  it('Branch compare global fields test without params', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_compare/global_fields', { params: { base_branch: 'UID', compare_branch: 'dev' } }).reply(200, branchCompareGlobalFieldMock)
    makeBranch({
      branch: {
        ...systemUidMock
      },
      stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' }
    })
      .compare('dev')
      .globalFields()
      .then((response) => {
        expect(response.branches.base_branch).to.eql(systemUidMock.uid)
        expect(response.branches.compare_branch).to.eql(branchCompareGlobalFieldMock.branches.compare_branch)
        expect(response.diff).to.eql(branchCompareGlobalFieldMock.diff)
        expect(response.next_url).to.eql(branchCompareGlobalFieldMock.next_url)
        done()
      })
      .catch(done)
  })

  it('Branch Merge All test', done => {
    var mock = new MockAdapter(axios)
    const params = {
      base_branch: 'main',
      compare_branch: 'dev',
      default_merge_strategy: 'merge_prefer_base',
      merge_comment: 'Merging dev into main',
      no_revert: true
    }
    const mergeObj = {
      item_merge_strategies: [
        {
          uid: 'global_field_uid',
          type: 'global_field',
          merge_strategy: 'merge_prefer_base'
        }
      ]
    }
    mock.onPost('/stacks/branches_merge').reply(200, branchMergeAllMock)
    makeBranch({ stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' } })
      .merge(mergeObj, params)
      .then((response) => {
        checkBranch(response)
        expect(response.merge_details).to.eql(branchMergeAllMock.merge_details)
        expect(response.errors).to.eql(branchMergeAllMock.errors)
        done()
      })
      .catch(done)
  })

  it('Branch Merge All failing test', done => {
    var mock = new MockAdapter(axios)
    const params = {
      base_branch: 'main',
      compare_branch: 'dev',
      default_merge_strategy: 'merge_prefer_base',
      merge_comment: 'Merging dev into main',
      no_revert: true
    }
    const mergeObj = {
      item_merge_strategies: [
        {
          uid: 'global_field_uid',
          type: 'global_field',
          merge_strategy: 'merge_prefer_base'
        }
      ]
    }
    mock.onPost('/stacks/branches_merge').reply(400, {})
    makeBranch({ stackHeaders: { ...stackHeadersMock, authtoken: 'authtoken' } })
      .merge(mergeObj, params)
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })

  it('Branch MergeQueue find test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_queue').reply(200, branchMergeQueueFindMock)
    makeBranch()
      .mergeQueue()
      .find()
      .then((response) => {
        expect(response.queue).to.not.eql(undefined)
        checkBranch(response.queue[0])
        expect(response.queue).to.eql(branchMergeQueueFindMock.queue)
        done()
      })
      .catch(done)
  })

  it('Branch MergeQueue fetch test', done => {
    var mock = new MockAdapter(axios)
    mock.onGet('/stacks/branches_queue/UID').reply(200, branchMergeQueueFetchMock)
    makeBranch()
      .mergeQueue('UID')
      .fetch()
      .then((response) => {
        checkBranch(response)
        expect(response.merge_details).to.eql(branchMergeQueueFetchMock.merge_details)
        expect(response.errors).to.eql(branchMergeQueueFetchMock.errors)
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
