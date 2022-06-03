import { expect } from "chai";
import { Stack } from "../../types/stack";

const branch =  {
    uid: 'staging',
    source: 'master'
} 
const dev_branch = {
    uid: 'development',
    source: 'staging'
}
export function createBranch(stack: Stack) {
    describe('Branch create', () => {
        it('Create Branch from Master', done => {
            stack.branch().create({ branch })
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

        it('Create branch from staging', done => {
            stack.branch().create({ branch: dev_branch })
            .then((response) => {
                expect(response.uid).to.be.equal(dev_branch.uid)
                expect(response.urlPath).to.be.equal(`/stacks/branches/${dev_branch.uid}`)
                expect(response.source).to.be.equal(dev_branch.source)
                expect(response.alias).to.not.equal(undefined)
                expect(response.delete).to.not.equal(undefined)
                expect(response.fetch).to.not.equal(undefined)
                done()
            })
            .catch(done)
        })
    })
}

export function queryBranch(stack: Stack) {
    describe('Branch Query', () => {
        it('Query Branch get all branches', done => {
            stack.branch().query().find()
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

        it('Create branch from staging', done => {
            stack.branch().query({ query: { source: 'master' } })
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
    })
}

export function deleteBranch(stack: Stack) {
    describe('Branch delete', () => {
        it('Should delete branch from branch uid', done => {
            stack.branch(dev_branch.uid)
            .delete()
            .then((response) => {
                expect(response.notice).to.be.equal('Branch deleted successfully.')
                done()
            })
            .catch(done)
        })
    })
}
