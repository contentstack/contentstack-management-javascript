import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { stageBranch } from '../mock/branch.js'

var client = {}

describe('Branch Alias api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('Should create Branch Alias', done => {
    makeBranchAlias(`${stageBranch.uid}_alias`)
      .createOrUpdate(stageBranch.uid)
      .then((response) => {
        expect(response.uid).to.be.equal(stageBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
        expect(response.source).to.be.equal(stageBranch.source)
        expect(response.alias).to.be.equal(`${stageBranch.uid}_alias`)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Branch query should return master branch', done => {
    makeBranchAlias()
      .fetchAll({ query: { uid: stageBranch.uid } })
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        var item = response.items[0]
        expect(item.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
        expect(item.delete).to.not.equal(undefined)
        expect(item.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should fetch Branch Alias', done => {
    makeBranchAlias(`${stageBranch.uid}_alias`)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(stageBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${stageBranch.uid}`)
        expect(response.source).to.be.equal(stageBranch.source)
        expect(response.alias).to.be.equal(`${stageBranch.uid}_alias`)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should delete Branch Alias', done => {
    try {
      makeBranchAlias(`${stageBranch.uid}_alias`)
        .delete()
        .then((response) => {
          expect(response.notice).to.be.equal('Branch alias deleted successfully.')
          done()
        })
        .catch(done)
    } catch (e) {
      done()
    }
  })
  it('Should delete stage branch from uid', done => {
    client.stack({ api_key: process.env.API_KEY }).branch(stageBranch.uid)
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Your request to delete branch is in progress. Please check organization bulk task queue for more details.')
        done()
      })
      .catch(done)
  })
})

function makeBranchAlias (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).branchAlias(uid)
}
