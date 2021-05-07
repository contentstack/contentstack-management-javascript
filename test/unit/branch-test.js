import axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Branch } from '../../lib/stack/branch'

describe('Contentstack Branch test', () => {
  it('Branch test without uid', done => {
    const branch = makeBranch()
    expect(branch).to.not.equal(undefined)
    expect(branch.name).to.be.equal(undefined)
    expect(branch.urlPath).to.be.equal('/stacks/branches')
    expect(branch.create).to.not.equal(undefined)
    expect(branch.query).to.not.equal(undefined)
    expect(branch.update).to.equal(undefined)
    expect(branch.delete).to.equal(undefined)
    expect(branch.fetch).to.equal(undefined)
    done()
  })

  it('Branch test with uid', done => {
    const branch = makeBranch({ branch: { name: 'branch' } })
    expect(branch).to.not.equal(undefined)
    expect(branch.name).to.be.equal('branch')
    expect(branch.urlPath).to.be.equal('/stacks/branches/branch')
    expect(branch.create).to.equal(undefined)
    expect(branch.query).to.equal(undefined)
    expect(branch.update).to.not.equal(undefined)
    expect(branch.delete).to.not.equal(undefined)
    expect(branch.fetch).to.not.equal(undefined)
    done()
  })
})

function makeBranch (data) {
  return new Branch(axios, data)
}

// function checkBranch (environment) {
// }
