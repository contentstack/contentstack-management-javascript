import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
// import { jsonReader } from '../utility/fileOperations/readwrite'
var client = {}

// var stack = {}
describe('ContentType api Test', () => {
  setup(() => {
    // const user = jsonReader('loggedinuser.json')
    // stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: 'blteb569b73ed880cf6' })
  })

  // it('Create ContentType', done => {
  //   makeContentTyoe()
  //     .create()
  //     .then((contentType) => {
  //       console.log(contentType)
  //       done()
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       done()
  //     })
  // })

  // it('Get all ContentType', done => {
  //   makeContentTyoe()
  //     .query()
  //     .find()
  //     .then((response) => {
  //       console.log(response)
  //       done()
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       expect(error).to.not.equal(null, 'Error not be null')
  //       done()
  //     })
  // })
  it('Get all ContentType', done => {
    client.stack('bltd839e80e01647f7c').contentType('product').entry('bltfbf08bccdb6096b3')
      .fetch({ include_schema: true, include_global_field_schema: true, include_content_type: true })
      .then((response) => {
        console.log(response)
        done()
      })
      .catch((error) => {
        console.log(error)
        expect(error).to.not.equal(null, 'Error not be null')
        done()
      })
  })
})

// function makeContentTyoe(uid = null) {
//   return client.stack(stack.api_key).contentType(uid)
// }
