import { expect } from "chai"
import { Stack } from "../../types/stack";
import { DeliveryToken, DeliveryTokens } from "../../types/stack/deliveryToken";
import { deliveryToken1, deliveryToken2 } from "./mock/delivertToken";
var tokenUID = ''
export function createDeliveryToken(deliveryToken: DeliveryTokens) {
    describe('Delivery token create', () => {
        test('Create a delivery token', done => {
            deliveryToken.create(deliveryToken1)
            .then((token) => {
                expect(token.name).to.be.equal(deliveryToken1.token.name)
                expect(token.description).to.be.equal(deliveryToken1.token.description)
                expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken1.token.scope[0].environments[0])
                expect(token.scope[0].module).to.be.equal(deliveryToken1.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })

        test('Create delivery token for production', done => {
            deliveryToken.create(deliveryToken2)
            .then((token) => {
                tokenUID = token.uid
                expect(token.name).to.be.equal(deliveryToken2.token.name)
                expect(token.description).to.be.equal(deliveryToken2.token.description)
                expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken2.token.scope[0].environments[0])
                expect(token.scope[0].module).to.be.equal(deliveryToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}   

export function queryDeliveryToken(deliveryToken: DeliveryTokens) {
    describe('Query delivery token', () => {
        test('Get all delivery token', done => {
            deliveryToken.query().find()
            .then((tokens) => {
                tokens.items.forEach((token) => {
                  expect(token.name).to.be.not.equal(null)
                  expect(token.description).to.be.not.equal(null)
                  expect(token.scope[0].environments[0].name).to.be.not.equal(null)
                  expect(token.scope[0].module).to.be.not.equal(null)
                  expect(token.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Get delivery token from name', done => {
            deliveryToken.query({query: {name: deliveryToken1.token.name}})
            .find()
            .then((tokens) => {
                tokens.items.forEach((token) => {
                  expect(token.name).to.be.equal(deliveryToken1.token.name)
                  expect(token.description).to.be.equal(deliveryToken1.token.description)
                  expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken1.token.scope[0].environments[0])
                  expect(token.scope[0].module).to.be.equal(deliveryToken1.token.scope[0].module)
                  expect(token.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}
export function deliveryToken(stack: Stack) {
    describe('Delivery token operations', () => {
        test('Fetch delivery token', done => {
            stack.deliveryToken(tokenUID)
            .fetch()
            .then((token) => {
                expect(token.name).to.be.equal(deliveryToken2.token.name)
                expect(token.description).to.be.equal(deliveryToken2.token.description)
                expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken2.token.scope[0].environments[0])
                expect(token.scope[0].module).to.be.equal(deliveryToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Fetch and update a Delivery Token from uid', done => {
            stack.deliveryToken(tokenUID)
            .fetch()
            .then((token) => {
                token.name = 'Update Production Name'
                token.description = 'Update Production description'
                token.scope = deliveryToken2.token.scope
                return token.update()
              })
              .then((token) => {
                expect(token.name).to.be.equal('Update Production Name')
                expect(token.description).to.be.equal('Update Production description')
                expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken2.token.scope[0].environments[0])
                expect(token.scope[0].module).to.be.equal(deliveryToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Update delivery token from uid', done => {
            const token = stack.deliveryToken(tokenUID)
            Object.assign(token, deliveryToken2.token)

            token.update()
            .then((token) => {
                expect(token.name).to.be.equal(deliveryToken2.token.name)
                expect(token.description).to.be.equal(deliveryToken2.token.description)
                expect(token.scope[0].environments[0].name).to.be.equal(deliveryToken2.token.scope[0].environments[0])
                expect(token.scope[0].module).to.be.equal(deliveryToken2.token.scope[0].module)
                expect(token.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function deleteDeliveryToken(stack: Stack) {
    describe('Delete delivery token', () => {
        test('Delete token from uid', done => {
            stack.deliveryToken(tokenUID)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Delivery Token deleted successfully.')
                done()
              })
              .catch(done)
        })
    })
}