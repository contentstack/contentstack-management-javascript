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
export function createBranchAlias(stack: Stack) {
    describe('Branch Alias create', () => {
        it('Create Branch Alias with target branch', done => {
            stack.branchAlias(`${branch.uid}_alias`).createOrUpdate(branch.uid)
            .then((response) => {
                expect(response.uid).to.be.equal(branch.uid)
                expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
                expect(response.source).to.be.equal(branch.source)
                expect(response.alias).to.be.equal(`${branch.uid}_alias`)
                expect(response.delete).to.not.equal(undefined)
                expect(response.fetch).to.not.equal(undefined)
                done()
            })
            .catch(done)
        })
    })
}

export function queryBranchAlias(stack: Stack) {
    describe('Branch alias Query', () => {
        it('Query Branch get all branches', done => {
            stack.branchAlias()
            .fetchAll({ query: { uid: branch.uid } })
            .then((response) => {
                expect(response.items.length).to.be.equal(1)
                var item = response.items[0]
                expect(item.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
                expect(item.delete).to.not.equal(undefined)
                expect(item.fetch).to.not.equal(undefined)
                done()
            })
            .catch(done)
        })

        it('Create branch from staging', done => {
            stack.branchAlias(`${branch.uid}_alias`)
            .fetch()
            .then((response) => {
              expect(response.uid).to.be.equal(branch.uid)
              expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
              expect(response.source).to.be.equal(branch.source)
              expect(response.alias).to.be.equal(`${branch.uid}_alias`)
              expect(response.delete).to.not.equal(undefined)
              expect(response.fetch).to.not.equal(undefined)
              done()
            })
            .catch(done)
        })
    })
}

export function deleteBranchAlias(stack: Stack) {
    describe('Branch delete', () => {
        it('Should delete branch from branch uid', done => {
            stack.branchAlias(`${branch.uid}_alias`)
            .delete()
            .then((response) => {
                expect(response.notice).to.be.equal('BranchAlias deleted successfully.')
                done()
            })
            .catch(done)
        })
    })
}
