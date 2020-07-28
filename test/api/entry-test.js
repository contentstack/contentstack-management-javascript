// import { expect } from 'chai'
// import { describe, it, setup } from 'mocha'
// import * as contentstack from '../../lib/contentstack.js'
// import axios from 'axios'
// import { jsonReader } from '../utility/fileOperations/readwrite'

// var client = {}

// var stack = {}
// describe('Entry api Test', () => {
//   setup(() => {
//     const user = jsonReader('loggedinuser.json')
//     // stack = jsonReader('stack.json')
//     client = contentstack.client(axios, { authtoken: user.authtoken })
//   })

// it('Get Entry', done => {
//   client.stack('blt3b4595778a4aa66e').contentType('single_page').entry().query({ include_count: true }).find()
//     .then((collection) => {
//       console.log(collection)
//       done()
//     })
//     .catch(done)
// })
// })
