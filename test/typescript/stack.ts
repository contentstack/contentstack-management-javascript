import { expect } from 'chai';
import * as dotenv from 'dotenv'
import { ContentstackClient } from '../..';
import { ContentstackCollection } from '../../types/contentstackCollection';
import { Stack, StackDetails } from '../../types/stack';
dotenv.config()

var stackName: string
var stack = {
    name: 'My New Stack Typescript',
    description: 'My new test stack',
    master_locale: 'en-us'
  }
export function stacks(client: ContentstackClient) {
    describe('Stacks Query Test', () => {
        test('Fetch all stack with Query', done => {
            client.stack().query().find()
            .then((response: ContentstackCollection<Stack>) => {
                response.items.forEach((stack) => {
                    stackName = stack.name
                    expect(stack.uid).to.not.null
                    expect(stack.name).to.not.null
                    expect(stack.api_key).to.not.null
                    expect(stack.org_uid).to.not.null
                })
                done()
            })
            .catch(done)
        })

        test('Find stack with name equal Query', done => {
            client.stack().query({query: {name: stackName}}).find()
            .then((response: ContentstackCollection<Stack>) => {
                expect(response.items.length).to.greaterThanOrEqual(1)
                expect(response.items[0].name).to.be.equal(stackName)
                done()
            })
            .catch(done)
        })

    });
    
    describe('Stack Create test', () => {
        test('Create stack', done => {
            client.stack().create({ stack }, {organization_uid: process.env.ORGANIZATION})
            .then((stackResponse: Stack) => {
                process.env.APIKEY = stackResponse.api_key
                console.log(stackResponse);
                
                expect(stackResponse.api_key).to.not.null
                expect(stackResponse.name).equal(stack.name)
                expect(stackResponse.description).equal(stack.description)
                expect(stackResponse.master_locale).equal(stack.master_locale)
                done()
            })
            .catch(done)
        })
    })
}

export function stackTest(stackInstance: Stack) {
    describe('Stack fetch update test', () => {
        test('Fetch stack details', done => {
            stackInstance.fetch()
            .then(response => {
                console.log(response);
                
                expect(response.api_key).equal(process.env.APIKEY)
                expect(response.name).equal(stack.name)
                expect(response.description).equal(stack.description)
                expect(response.master_locale).equal(stack.master_locale)
                done()
            })
            .catch(done)
        })

        test('Update stack details', done => {
            stackInstance.name = 'Updated stack name typescript'
            stackInstance.update()
            .then(response => {
                expect(response.name).equal('Updated stack name typescript')
                done()
            })
            .catch(done)
        })
    });
}

export function shareStack(stack: Stack, roleUid: string) {
    describe('Stack share', () => {
        test('Share stack', done => {
            stack.share(['test@test.com'], { 'test@test.com': [roleUid] })
            .then((response) => {
              expect(response.notice).to.be.equal('The invitation has been sent successfully.')
              done()
            })
            .catch(done)
        })
    })
}

export function unshareStack(stack: Stack) {
    describe('Stack un-share', () => {
        test('Sn-share stack', done => {
            stack.unShare('test@test.com')
            .then((response) => {
                expect(response.notice).to.be.equal('The stack has been successfully unshared.')
                done()
            })
            .catch(done)
        })
    })
}