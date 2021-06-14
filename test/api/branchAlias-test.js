import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { branch } from './mock/branch'

var client = {}
var stack = {}

describe('Branch api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Branch query should return master branch', done => {
    makeBranchAlias()
      .fetchAll({ query: { uid: 'master' } })
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        var item = response.items[0]
        expect(item.urlPath).to.be.equal(`/stacks/branches/master`)
        expect(item.delete).to.not.equal(undefined)
        expect(item.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should create Branch Alias', done => {
    makeBranchAlias(`${branch.uid}_alias`)
      .createOrUpdate(branch.uid)
      .then((response) => {
        expect(response.uid).to.be.equal(branch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
        expect(response.source).to.be.equal(branch.source)
        expect(response.alias.length).to.be.equal(1)
        expect(response.alias[0].uid).to.be.equal(`${branch.uid}_alias`)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should fetch Branch Alias', done => {
    makeBranchAlias(`${branch.uid}_alias`)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(branch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
        expect(response.source).to.be.equal(branch.source)
        expect(response.alias.length).to.be.equal(1)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should delete Branch Alias', done => {
    try {
      makeBranchAlias(`${branch.uid}_alias`)
        .delete()
        .then((response) => {
          expect(response.notice).to.be.equal('BranchAlias deleted successfully.')
          done()
        })
        .catch(done)
    }
    catch (e) {
      done()
    }
  })
})

function makeBranchAlias (uid = null) {
  return client.stack({ api_key: stack.api_key }).branchAlias(uid)
}
