import { expect } from "chai"
import cloneDeep from "lodash/cloneDeep"
import path from "path"
import { Stack } from "../../types/stack"
import { GlobalFields } from "../../types/stack/globalField"
import { globalFieldContent } from "./mock/globalField"


export function createGlobalField(globalField: GlobalFields) {
    describe('Global field create', () => { 
        test('Create global field', done => {
            globalField.create({global_field: globalFieldContent.global_field})
            .then(response => { 
                expect(response.uid).to.be.equal(globalFieldContent.global_field.uid)
                expect(response.title).to.be.equal(globalFieldContent.global_field.title)
                expect(response.schema[0].uid).to.be.equal(globalFieldContent.global_field.schema[0].uid)
                expect(response.schema[0].data_type).to.be.equal(globalFieldContent.global_field.schema[0].data_type)
                expect(response.schema[0].display_name).to.be.equal(globalFieldContent.global_field.schema[0].display_name)
                done()
            })
            .catch(done)
        })

        test('Import global field', done => {
            globalField.import({
                global_field: path.join(__dirname, '../api/mock/globalfield.json')
            })
            .then((response) => {
                expect(response.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })
    })
}

export function queryGlobalField(globalField: GlobalFields) {
    describe('Query on global field', () => {
        test('Get all global field from Query', done => {
            globalField.query()
            .find()
            .then((collection) => {
                collection.items.forEach(globalField => {
                    expect(globalField.uid).to.be.not.equal(null)
                    expect(globalField.title).to.be.not.equal(null)
                    expect(globalField.schema).to.be.not.equal(null)
                })
                done()
            })
            .catch(done)
        })

        test('Get global field title matching Upload', done => {
            globalField.query({ query: { title: 'Upload' } })
            .find()
            .then((collection) => {
              collection.items.forEach(globalField => {
                expect(globalField.uid).to.be.not.equal(null)
                expect(globalField.title).to.be.equal('Upload')
              })
              done()
            })
            .catch(done)

        })
    })
}

export function globalField(stack: Stack) {
    describe('Content Type operations', () => { 
        test('Fetch global field', done => {
            stack.globalField(globalFieldContent.global_field.uid).fetch()
            .then((globalField) => {
                expect(globalField.uid).to.be.equal(globalFieldContent.global_field.uid)
                expect(globalField.title).to.be.equal(globalFieldContent.global_field.title)
                expect(globalField.schema[0].uid).to.be.equal(globalFieldContent.global_field.schema[0].uid)
                expect(globalField.schema[0].data_type).to.be.equal(globalFieldContent.global_field.schema[0].data_type)
                expect(globalField.schema[0].display_name).to.be.equal(globalFieldContent.global_field.schema[0].display_name)
                done()
              })
              .catch(done)
        })

        test('Fetch and update global field', done => {
            stack.globalField(globalFieldContent.global_field.uid).fetch()
            .then((globalField) => {
                globalField.title = 'Update title'
                return globalField.update()
            })
            .then((updateGlobal) => {
                expect(updateGlobal.uid).to.be.equal(globalFieldContent.global_field.uid)
                expect(updateGlobal.title).to.be.equal('Update title')
                expect(updateGlobal.schema[0].uid).to.be.equal(globalFieldContent.global_field.schema[0].uid)
                expect(updateGlobal.schema[0].data_type).to.be.equal(globalFieldContent.global_field.schema[0].data_type)
                expect(updateGlobal.schema[0].display_name).to.be.equal(globalFieldContent.global_field.schema[0].display_name)
                done()
            })
            .catch(done)
        })

        test('Update global field', done => {
            var globalField = stack.globalField(globalFieldContent.global_field.uid)
            Object.assign(globalField, cloneDeep(globalFieldContent.global_field))
            globalField.update()
            .then((updateGlobal) => {
                expect(updateGlobal.uid).to.be.equal(globalFieldContent.global_field.uid)
                expect(updateGlobal.title).to.be.equal(globalFieldContent.global_field.title)
                expect(updateGlobal.schema[0].uid).to.be.equal(globalFieldContent.global_field.schema[0].uid)
                expect(updateGlobal.schema[0].data_type).to.be.equal(globalFieldContent.global_field.schema[0].data_type)
                expect(updateGlobal.schema[0].display_name).to.be.equal(globalFieldContent.global_field.schema[0].display_name)
                done()
            })
            .catch(done)
        })
    })
}
