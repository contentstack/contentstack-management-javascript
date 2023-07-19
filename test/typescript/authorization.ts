import { expect } from 'chai'
import * as dotenv from 'dotenv'
import { Authorization } from '../../types/marketplace/authorization'
dotenv.config()


export function authorization (authorization: Authorization) {
    describe('Authorization Apps api', () => {
        test('test get all authorization for apps', done => {
            authorization.findAll()
            .then((response) => {
                expect(response).to.not.equal(undefined)
                done()
              })
              .catch(done)
        })
        test('test revoke all authorization for apps', done => {
            authorization.revokeAll()
            .then((response) => {
                expect(response).to.not.equal(undefined)
                done()
              })
              .catch(done)
        })
    })
}