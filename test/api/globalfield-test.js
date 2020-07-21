import path from 'path'
import axios from 'axios'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createGlobalField } from '../unit/mock/globalfield'

var client = {}

var stack = {}

describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('Create global fields', done => {
    makeGlobalField().create(createGlobalField)
      .then((globalField) => {
        expect(globalField.uid).to.be.equal(createGlobalField.global_field.uid)
        expect(globalField.title).to.be.equal(createGlobalField.global_field.title)
        expect(globalField.schema[0].uid).to.be.equal(createGlobalField.global_field.schema[0].uid)
        expect(globalField.schema[0].data_type).to.be.equal(createGlobalField.global_field.schema[0].data_type)
        expect(globalField.schema[0].display_name).to.be.equal(createGlobalField.global_field.schema[0].display_name)
        done()
      })
      .catch(done)
  })

  it('Fetch global Field', done => {
    makeGlobalField(createGlobalField.global_field.uid).fetch()
      .then((globalField) => {
        expect(globalField.uid).to.be.equal(createGlobalField.global_field.uid)
        expect(globalField.title).to.be.equal(createGlobalField.global_field.title)
        expect(globalField.schema[0].uid).to.be.equal(createGlobalField.global_field.schema[0].uid)
        expect(globalField.schema[0].data_type).to.be.equal(createGlobalField.global_field.schema[0].data_type)
        expect(globalField.schema[0].display_name).to.be.equal(createGlobalField.global_field.schema[0].display_name)
        done()
      })
      .catch(done)
  })

  it('Fetch and update global Field', done => {
    makeGlobalField(createGlobalField.global_field.uid).fetch()
      .then((globalField) => {
        globalField.title = 'Update title'
        return globalField.update()
      })
      .then((updateGlobal) => {
        expect(updateGlobal.uid).to.be.equal(createGlobalField.global_field.uid)
        expect(updateGlobal.title).to.be.equal('Update title')
        expect(updateGlobal.schema[0].uid).to.be.equal(createGlobalField.global_field.schema[0].uid)
        expect(updateGlobal.schema[0].data_type).to.be.equal(createGlobalField.global_field.schema[0].data_type)
        expect(updateGlobal.schema[0].display_name).to.be.equal(createGlobalField.global_field.schema[0].display_name)
        done()
      })
      .catch(done)
  })

  it('Update global Field', done => {
    var globalField = makeGlobalField(createGlobalField.global_field.uid)
    Object.assign(globalField, cloneDeep(createGlobalField.global_field))
    globalField.update()
      .then((updateGlobal) => {
        expect(updateGlobal.uid).to.be.equal(createGlobalField.global_field.uid)
        expect(updateGlobal.title).to.be.equal(createGlobalField.global_field.title)
        expect(updateGlobal.schema[0].uid).to.be.equal(createGlobalField.global_field.schema[0].uid)
        expect(updateGlobal.schema[0].data_type).to.be.equal(createGlobalField.global_field.schema[0].data_type)
        expect(updateGlobal.schema[0].display_name).to.be.equal(createGlobalField.global_field.schema[0].display_name)
        done()
      })
      .catch(done)
  })

  it('Import global Field', done => {
    makeGlobalField().import({
      global_field: path.join(__dirname, '../unit/mock/globalfield.json')
    })
      .then((response) => {
        expect(response.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get all global field from Query', done => {
    makeGlobalField().query()
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

  it('Get global field title matching Upload', done => {
    makeGlobalField().query({ query: { title: 'Upload' } })
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

function makeGlobalField (uid = null) {
  return client.stack(stack.api_key).globalField(uid)
}
