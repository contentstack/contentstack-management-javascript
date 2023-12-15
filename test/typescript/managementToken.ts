import { expect } from "chai"
import path from "path"
import { Stack } from "../../types/stack";
import { ManagementToken, ManagementTokens } from "../../types/stack/managementToken";
import { managementToken1, managementToken2 } from "./mock/managementToken";
var tokenUID = ''
export function createManagementToken(managementToken: ManagementTokens) {
    describe('Management token create', () => {
        test('Create a management token', done => {
            managementToken.create(managementToken1)
            .then((token) => {
                expect(token.name).to.be.equal(managementToken1.token.name)
                expect(token.description).to.be.equal(managementToken1.token.description)
                expect(token.scope[0].module).to.be.equal(managementToken1.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })

        test('Create management token for production', done => {
            managementToken.create(managementToken2)
            .then((token) => {
                tokenUID = token.uid
                expect(token.name).to.be.equal(managementToken2.token.name)
                expect(token.description).to.be.equal(managementToken2.token.description)
                expect(token.scope[0].module).to.be.equal(managementToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}   

export function queryManagementToken(managementToken: ManagementTokens) {
    describe('Query management token', () => {
        test('Get all management token', done => {
            managementToken.query().find()
            .then((tokens) => {
                tokens.items.forEach((token) => {
                  expect(token.name).to.be.not.equal(null)
                  expect(token.description).to.be.not.equal(null)
                   expect(token.scope[0].module).to.be.not.equal(null)
                  expect(token.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Get management token from name', done => {
            managementToken.query({query: {name: managementToken1.token.name}})
            .find()
            .then((tokens) => {
                tokens.items.forEach((token) => {
                  expect(token.name).to.be.equal(managementToken1.token.name)
                  expect(token.description).to.be.equal(managementToken1.token.description)
                  expect(token.scope[0].module).to.be.equal(managementToken1.token.scope[0].module)
                  expect(token.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}
export function managementToken(stack: Stack) {
    describe('Management token operations', () => {
        test('Fetch management token', done => {
            stack.managementToken(tokenUID)
            .fetch()
            .then((token) => {
                expect(token.name).to.be.equal(managementToken2.token.name)
                expect(token.description).to.be.equal(managementToken2.token.description)
                expect(token.scope[0].module).to.be.equal(managementToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Fetch and update a Management Token from uid', done => {
            stack.managementToken(tokenUID)
            .fetch()
            .then((token) => {
                token.name = 'Update Production Name'
                token.description = 'Update Production description'
                token.scope = managementToken2.token.scope
                return token.update()
              })
              .then((token) => {
                expect(token.name).to.be.equal('Update Production Name')
                expect(token.description).to.be.equal('Update Production description')
                expect(token.scope[0].module).to.be.equal(managementToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Update management token from uid', done => {
            const token = stack.managementToken(tokenUID)
            Object.assign(token, managementToken2.token)

            token.update()
            .then((token) => {
                expect(token.name).to.be.equal(managementToken2.token.name)
                expect(token.description).to.be.equal(managementToken2.token.description)
                expect(token.scope[0].module).to.be.equal(managementToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function deleteManagementToken(stack: Stack) {
    describe('Delete management token', () => {
        test('Delete token from uid', done => {
            stack.managementToken(tokenUID)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Management Token deleted successfully.')
                done()
              })
              .catch(done)
        })
    })
}