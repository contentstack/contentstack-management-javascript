import { expect } from 'chai';
import * as dotenv from 'dotenv'
import { ContentstackClient } from '../..';
dotenv.config()
 
export function login(client: ContentstackClient) { 
    describe('Contentstack Client Test', () => {
        test('Client initialization', done => {
            client.login({ email: process.env.EMAIL as string, password: process.env.PASSWORD as string }, { include_orgs: true, include_orgs_roles: true, include_stack_roles: true, include_user_settings: true })
            .then((response) => {
                expect(response.notice).to.be.equal('Login Successful.')
                expect(response.user.email).to.be.equal(process.env.EMAIL)                
                done();
            })
            .catch(done)
        })
    })
}

export var getUser = (client: ContentstackClient) => describe('Get logged in user details', () => {
    test('Client Get User', done => {
        client.getUser()
        .then((user) => {
            expect(user.email).to.be.equal(process.env.EMAIL)            
            expect(user.organizations).to.not.equal(undefined)
            done();
        })
        .catch(done)
    })
})

export var logout = (client: ContentstackClient) => describe('User logout test', () => {
    test('Client logout', done => {
        client.logout()
        .then((response) => {
            expect(response.notice).to.be.equal(`You've logged out successfully.`)
            done()
        })
        .catch(done)
    })
} )