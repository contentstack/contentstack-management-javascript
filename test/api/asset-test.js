import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'

var client = {}
var stack = {}

describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')

    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })

  it('test asset Upload ', done => {
    makeAsset().query({ query: { is_dir: true } }).count()
      .then((asset) => {
        console.log(asset)
        done()
      })
      .catch(done)
  })

  // it('test Asset Publish', done => {
  //   const publishDetails = {
  //     locales: ['en-us'],
  //     environments: ['blt564298c6f084a0aa']
  //   }
  //   client.stack('blt3490707e04b3febd').asset('blt141a3e3b2b7162db').publish(publishDetails)
  //     .then((response) => {
  //       console.log(response)
  //       done()
  //     })
  //     .catch(done)
  // })
})

function makeAsset (uid = null) {
  return client.stack(stack.api_key).asset(uid)
}
