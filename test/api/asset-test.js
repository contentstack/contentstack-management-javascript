import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'

var client = {}

describe('ContentType api Test', () => {
  setup(() => {
    client = contentstack.client(axios, { authtoken: 'bltfa472b464438dee2' })
  })

  it('test asset Upload ', done => {
    const asset = {
      upload: '/Users/uttamukkoji/Documents/JS/contentstack/Modular/assets/blt85b501e49352272c/mobile_ad_campaign_0.gif'
    }
    client.stack('blt3490707e04b3febd').asset().create(asset)
      .then((asset) => {
        console.log(asset.uid)
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
