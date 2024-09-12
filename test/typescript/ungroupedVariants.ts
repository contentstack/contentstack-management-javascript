import { expect } from "chai"
import path from "path"
import { Stack } from "../../types/stack";
import {  Variants } from "../../types/stack/variants";
import { variant, variants1, variants2 } from "./mock/ungroupedvariants";
var variantUID = ''
export function createVariants(stack: Stack) {
    describe('Variants create', () => {
        test('Create a Variants', done => {
            stack.variant().create(variants1)
            .then((variant) => {
                expect(variant.name).to.be.equal(variants.name)
                expect(variant.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })

        test('Create Variants for production', done => {
            stack.variant().create(variants1)
            .then((variant) => {
                variantUID = variant.uid
                expect(variant.name).to.be.equal(variants2.name)
                expect(variant.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}   

export function queryVariants(variants: Variants) {
    describe('Query Variants', () => {
        test('Get all Variants', done => {
            variants.query().find()
            .then((variants) => {
                variants.items.forEach((variant) => {
                  expect(variant.name).to.be.not.equal(null)
                  expect(variant.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Get Variants from name', done => {
            variants.query({query: {name: variants1.name}})
            .find()
            .then((variants) => {
                variants.items.forEach((variant) => {
                  expect(variant.name).to.be.equal(variants1.name)
                  expect(variant.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}
export function variants(stack: Stack) {
    describe('Variants operations', () => {
        test('Fetch Variants', done => {
            stack.variants(variantUID)
            .fetch()
            .then((variant) => {
                expect(variant.name).to.be.equal(variants2.name)
                expect(variant.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function deleteVariants(stack: Stack) {
    describe('Delete Variants', () => {
        test('Delete variant from uid', done => {
            stack.variants(variantUID)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Variants deleted successfully.')
                done()
              })
              .catch(done)
        })
    })
}