import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { branch, devBranch } from './mock/branch'

var client = {}
var stack = {}

describe('Branch api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Branch query should return master branch', done => {
    makeBranch()
      .query()
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        var item = response.items[0]
        expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
        expect(item.delete).to.not.equal(undefined)
        expect(item.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should create Branch', done => {
    makeBranch()
      .create({ branch })
      .then((response) => {
        expect(response.uid).to.be.equal(branch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
        expect(response.source).to.be.equal(branch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should create Branch from staging', done => {
    makeBranch()
      .create({ branch: devBranch })
      .then((response) => {
        expect(response.uid).to.be.equal(devBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${devBranch.uid}`)
        expect(response.source).to.be.equal(devBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should fetch branch from branch uid', done => {
    makeBranch(devBranch.uid)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(devBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${devBranch.uid}`)
        expect(response.source).to.be.equal(devBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Branch query should return all branches', done => {
    makeBranch()
      .query()
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(3)
        response.items.forEach(item => {
          expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
          expect(item.delete).to.not.equal(undefined)
          expect(item.fetch).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('Branch query for specific condition', done => {
    makeBranch()
      .query({ query: { source: 'master' } })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        response.items.forEach(item => {
          expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
          expect(item.source).to.be.equal(`master`)
          expect(item.delete).to.not.equal(undefined)
          expect(item.fetch).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('Should delete branch from branch uid', done => {
    makeBranch(devBranch.uid)
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Branch deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('Should provide list of content types and global fields that exist in only one branch or are different between the two branches', done => {
    makeBranch(branch.uid)
      .compare(devBranch.uid)
      .all()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })

  it('Should list differences for a single content type between two branches', done => {
    makeBranch(branch.uid)
      .compare(devBranch.uid)
      .contentTypes()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })

  it('Should list differences for a single global field between two branches', done => {
    makeBranch(branch.uid)
      .compare(devBranch.uid)
      .globalFields()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })

  it('Should provide list of global fields that exist in only one branch or are different between the two branches', done => {
    const params = {
      base_branch: branch.uid,
      compare_branch: devBranch.uid,
      default_merge_strategy: "ignore",
      merge_comment: "Merging dev into main",
    }
    const mergeObj = {
      item_merge_strategies: [
        {
          "uid": "global_field_uid", 
          "type": "global_field", 
          "merge_strategy": "merge_prefer_base"
        },
        {
          "uid": "ct5", 
          "type": "content_type",
          "merge_strategy": "merge_prefer_compare"
        },
        {
          "uid": "bot_all", 
          "type": "content_type",
          "merge_strategy": "merge_prefer_base"
        }
      ]
    }
    makeBranch()
      .merge(mergeObj, params)
      .then((response) => {
        expect(response.merge_details.base_branch).to.be.equal(branch.uid)
        expect(response.merge_details.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })

  it('Should list all recent merge jobs', done => {
    makeBranch()
      .mergeQueue()
      .find()
      .then((response) => {
        expect(response.queue).to.not.equal(undefined)
        expect(response.queue[0].merge_details.base_branch).to.be.equal(branch.uid)
        expect(response.queue[0].merge_details.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })

  it('Should list all recent merge jobs', done => {
    const mergeJobUid = 'db7bf199-2a9d-4c2c-99d5-72453f70fb40'
    makeBranch()
      .mergeQueue(mergeJobUid)
      .fetch()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(devBranch.uid)
        done()
      })
      .catch(done)
  })
})

function makeBranch (uid = null) {
  return client.stack({ api_key: stack.api_key }).branch(uid)
}
