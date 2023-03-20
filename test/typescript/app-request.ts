import { expect } from 'chai'
import * as dotenv from 'dotenv'
import { Hosting } from '../../types/app/hosting'
import { Request, Requests } from '../../types/app/request'
dotenv.config()
let requestUID = ''

export function orgAppRequest (request: Requests) {
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
    })
}

export function appRequest (request: Request) {
    describe('App request', () => {
        test('test create app request', done => {
            request
              .create(process.env.APIKEY as string)
              .then((response) => {
                requestUID = response.data.data.uid
                expect(response.data).to.not.equal(undefined)
                done()
              })
              .catch(done)
          })
        
        test('test fetch app request', done => {
        request
            .fetch()
            .then((response) => {
            expect(response.data).to.not.equal(undefined)
            done()
            })
            .catch(done)
        })
    })
}
