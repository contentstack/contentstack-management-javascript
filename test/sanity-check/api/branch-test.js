import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { branch, stageBranch, devBranch } from '../mock/branch.js'

var client = {}
var mergeJobUid = ''
describe('Branch api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create Branch from staging', done => {
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

  it('should return master branch when query is called', done => {
    makeBranch()
      .query()
      .find()
      .then((response) => {
        var item = response.items[0]
        expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
        expect(item.delete).to.not.equal(undefined)
        expect(item.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('should fetch main branch from branch uid', done => {
    makeBranch(branch.uid)
      .fetch()
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

  it('should fetch staging branch from branch uid', done => {
    makeBranch(stageBranch.uid)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(stageBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
        expect(response.source).to.be.equal(stageBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('should query branch for specific condition', done => {
    makeBranch()
      .query({ query: { source: 'main' } })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        response.items.forEach(item => {
          expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
          expect(item.source).to.be.equal(`main`)
          expect(item.delete).to.not.equal(undefined)
          expect(item.fetch).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('should query branch to return all branches', done => {
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

  it('should delete branch from branch uid', done => {
    makeBranch(devBranch.uid)
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Your request to delete branch is in progress. Please check organization bulk task queue for more details.')
        done()
      })
      .catch(done)
  })

  it('should provide list of content types and global fields that exist in only one branch or are different between the two branches', done => {
    makeBranch(branch.uid)
      .compare(stageBranch.uid)
      .all()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })

  it('should list differences for a content types between two branches', done => {
    makeBranch(branch.uid)
      .compare(stageBranch.uid)
      .contentTypes()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })

  it('should list differences for a global fields between two branches', done => {
    makeBranch(branch.uid)
      .compare(stageBranch.uid)
      .globalFields()
      .then((response) => {
        expect(response.branches.base_branch).to.be.equal(branch.uid)
        expect(response.branches.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })

  it('should merge given two branches', done => {
    const params = {
      base_branch: branch.uid,
      compare_branch: stageBranch.uid,
      default_merge_strategy: 'ignore',
      merge_comment: 'Merging staging into main'
    }
    const mergeObj = {
      item_merge_strategies: [
        {
          uid: 'global_field_uid',
          type: 'global_field',
          merge_strategy: 'merge_prefer_base'
        },
        {
          uid: 'ct5',
          type: 'content_type',
          merge_strategy: 'merge_prefer_compare'
        },
        {
          uid: 'bot_all',
          type: 'content_type',
          merge_strategy: 'merge_prefer_base'
        }
      ]
    }
    makeBranch()
      .merge(mergeObj, params)
      .then((response) => {
        mergeJobUid = response.uid
        expect(response.merge_details.base_branch).to.be.equal(branch.uid)
        expect(response.merge_details.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })

  it('should list all recent merge jobs', done => {
    makeBranch()
      .mergeQueue()
      .find()
      .then((response) => {
        expect(response.queue).to.not.equal(undefined)
        expect(response.queue[0].merge_details.base_branch).to.be.equal(branch.uid)
        expect(response.queue[0].merge_details.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })

  it('should list details of merge job when job uid is passed', done => {
    makeBranch()
      .mergeQueue(mergeJobUid)
      .fetch()
      .then((response) => {
        expect(response.queue).to.not.equal(undefined)
        expect(response.queue[0].merge_details.base_branch).to.be.equal(branch.uid)
        expect(response.queue[0].merge_details.compare_branch).to.be.equal(stageBranch.uid)
        done()
      })
      .catch(done)
  })
})

function makeBranch (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).branch(uid)
}
