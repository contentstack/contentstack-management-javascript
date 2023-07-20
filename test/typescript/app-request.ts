import { expect } from 'chai'
import * as dotenv from 'dotenv'
import { AppRequest } from '../../types/marketplace/apprequest'
dotenv.config()
let requestUID = ''

export function orgAppRequest (request: AppRequest) {
    describe('Org App request api', () => {
        test('test get all request for oranization', done => {
            request
              .findAll()
              .then((response) => {
                expect(response.data).to.not.equal(undefined)
                done()
              })
              .catch(done)
          })
        
        test('test delete app request', done => {
        request
            .delete(requestUID)
            .then((response) => {
            expect(response.data).to.not.equal(undefined)
            done()
            })
            .catch(done)
        })
        test('test create app request', done => {
            request
              .create({ appUid: '', targetUid: process.env.APIKEY as string})
              .then((response) => {
                requestUID = response.data.data.uid
                expect(response.data).to.not.equal(undefined)
                done()
              })
              .catch(done)
          })
    })
}
