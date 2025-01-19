import { expect } from "chai"
import path from "path"
import { Stack } from "../../types/stack";
import { variantEntry, variantEntry2 } from "./mock/variants";
var tokenUID = ''
export function createVariant(stack: Stack) {
    describe('Variant create', () => {
        test('Create a variant', done => {
            stack.VariantGroup('variant_group_uid').variants().create({variantEntry})
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry.name)
                expect(response.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })
    })
}   

export function queryVariant(stack: Stack) {
    describe('Query variants', () => {
        test('Get all variants', done => {
            stack.VariantGroup('variant_group_uid').variants().query().find()
            .then((response) => {
                response.items.forEach((variant) => {
                  expect(variant.name).to.be.not.equal(null)
                  expect(variant.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Get variants from name', done => {
            stack.VariantGroup(tokenUID).variants().query({query: {name: variantEntry2[0].name}})
            .find()
            .then((response) => {
                response.items.forEach((variant_groups) => {
                  expect(variant_groups.name).to.be.equal(variantEntry.name)
                  expect(variant_groups.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}
export function variant(stack: Stack) {
    describe('Variants operations', () => {
        test('Fetch variant', done => {
            stack.variantGroup(tokenUID).variant(variantEntry.uid)
            .fetch()
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry.name)
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Fetch and update a Variant from uid', done => {
            stack.variantGroup(tokenUID).variant('uid')
            .fetch()
            .then((response) => {
                response.name = 'Update Variant name'
                return response.update()
              })
              .then((response) => {
                expect(response.name).to.be.equal('Update Variant name')
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Update variant from uid', done => {
            const variants = stack.variantGroup(tokenUID).variant(variantEntry.uid)
            Object.assign(variants, variantEntry)
            variants.update()
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry.name)
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}