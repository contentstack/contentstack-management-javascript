import { expect } from "chai";
import { Stack } from "../../types/stack";
import { environmentCreate, environmentProdCreate } from "./mock/environment.mock";
import cloneDeep from "lodash/cloneDeep";

export function createEnvironment(stack: Stack) {
    describe('Environment create', () => {
        test('Create a development environment', done => {
            stack.environment().create({ environment: environmentCreate})
            .then((environment) => {
                expect(environment.name).to.be.equal(environmentCreate.name)
                expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                expect(environment.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Create a production environment', done => {
            stack.environment().create({ environment: environmentProdCreate})
            .then((environment) => {
                expect(environment.name).to.be.equal(environmentCreate.name)
                expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                expect(environment.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function getEnvironment(stack: Stack) {
    describe('Get Environment functions', () => {
        test('Query all Environments', done => {
            stack.environment().query()
            .find()
            .then((environments) => {
              environments.items.forEach((environment) => {
                expect(environment.name).to.be.not.equal(null)
                expect(environment.deploy_content).to.be.not.equal(null)
                expect(environment.uid).to.be.not.equal(null)
              })
              done()
            })
            .catch(done)
        })

        test('Query a Environment development', done => {
            stack.environment().query({ query: { name: environmentCreate.name } })
            .find()
            .then((environments) => {
                environments.items.forEach((environment) => {
                    expect(environment.name).to.be.equal(environmentCreate.name)
                    expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                    expect(environment.uid).to.be.not.equal(null)
                })
                done()
            })
            .catch(done)
        })

        test('Fetch development environment', done => {
            stack.environment(environmentCreate.name)
            .fetch()
            .then((environment) => {
                expect(environment.name).to.be.equal(environmentCreate.name)
                expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                expect(environment.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })
    })
}
export function updateEnvironment(stack: Stack) {
    describe('Update Environment functions', () => {
        test('Fetch and Update a Environment', done => {
            stack.environment(environmentCreate.name)
            .fetch()
            .then((environment) => {
              environment.name = 'dev'
              return environment.update()
            })
            .then((environment) => {
                expect(environment.name).to.be.equal('dev')
                expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                expect(environment.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })

        test('Update a Environment', done => {
            const environment = stack.environment(environmentCreate.name)
            Object.assign(environment, cloneDeep(environmentCreate))

            environment.update()
            .then((environment) => {
                expect(environment.name).to.be.equal(environmentCreate.name)
                expect(environment.deploy_content).to.be.equal(environmentCreate.deploy_content)
                expect(environment.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}
export function deleteEnvironment(stack: Stack) {
    describe('Delete Environment functions', () => {
        test('Delete a Environment', done => {
            stack.environment(environmentProdCreate.name)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Environment deleted successfully.')
                done()
            })
            .catch(done)
        })
    })
}