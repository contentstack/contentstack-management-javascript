import { expect } from "chai"
import path from "path"
import { Stack } from "../../types/stack";
import { VariantGroup, VariantGroups } from "../../types/stack/VariantGroup";
import { variantEntry, variantEntry1, variantEntry2 } from "./mock/variantGroup";
var tokenUID = ''
export function createVariantGroup(variantGroup: VariantGroup) {
    describe('Variant group create', () => {
        test('Create a management token', done => {
            variantGroup.create({variantEntry})
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry.name)
                expect(response.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })
    })
}   

export function queryVariantGroup(variantGroup: VariantGroups) {
    describe('Query variant group', () => {
        test('Get all variant group', done => {
            variantGroup.query().find()
            .then((response) => {
                response.items.forEach((variant_groups) => {
                  expect(variant_groups.name).to.be.not.equal(null)
                  expect(variant_groups.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Get variant group from name', done => {
            variantGroup.query({query: {name: variantEntry2[0].name}})
            .find()
            .then((response) => {
                response.items.forEach((variant_groups) => {
                  expect(variant_groups.name).to.be.equal(variantEntry1.name)
                  expect(variant_groups.uid).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })
    })
}
export function variantGroup(stack: Stack) {
    describe('Variant group operations', () => {
        test('Fetch variant group', done => {
            stack.variantGroup(tokenUID)
            .fetch()
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry1.name)
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Fetch and update a Variant Group from uid', done => {
            stack.variantGroup(tokenUID)
            .fetch()
            .then((response) => {
                response.name = 'Update Variant Group'
                return response.update()
              })
              .then((response) => {
                expect(response.name).to.be.equal('Update Variant Group')
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Update variant group from uid', done => {
            const variantgroup = stack.variantGroup(tokenUID)
            Object.assign(variantgroup, variantEntry)
            variantgroup.update()
            .then((response) => {
                expect(response.name).to.be.equal(variantEntry.name)
                expect(response.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function deleteVariantGroup(stack: Stack) {
    describe('Delete variant group', () => {
        test('Delete token from uid', done => {
            stack.variantGroup(tokenUID)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Variant Group deleted successfully.')
                done()
              })
              .catch(done)
        })
    })
}