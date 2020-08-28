import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { environmentCreate, environmentProdCreate } from './mock/environment.js'
import { cloneDeep } from 'lodash'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
describe('Environment api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Add a Environment development', done => {
    makeEnvironment()
      .create(environmentCreate)
      .then((environment) => {
        expect(environment.name).to.be.equal(environmentCreate.environment.name)
        expect(environment.deploy_content).to.be.equal(environmentCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a Environment production', done => {
    makeEnvironment()
      .create(environmentProdCreate)
      .then((environment) => {
        expect(environment.name).to.be.equal(environmentProdCreate.environment.name)
        expect(environment.deploy_content).to.be.equal(environmentProdCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get a Environment development', done => {
    makeEnvironment(environmentCreate.environment.name)
      .fetch()
      .then((environment) => {
        expect(environment.name).to.be.equal(environmentCreate.environment.name)
        expect(environment.deploy_content).to.be.equal(environmentCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Query a Environment development', done => {
    makeEnvironment()
      .query({ query: { name: environmentCreate.environment.name } })
      .find()
      .then((environments) => {
        environments.items.forEach((environment) => {
          expect(environment.name).to.be.equal(environmentCreate.environment.name)
          expect(environment.deploy_content).to.be.equal(environmentCreate.environment.deploy_content)
          expect(environment.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Query all Environments', done => {
    makeEnvironment()
      .query()
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

  it('Fetch and Update a Environment', done => {
    makeEnvironment(environmentCreate.environment.name)
      .fetch()
      .then((environment) => {
        environment.name = 'dev'
        return environment.update()
      })
      .then((environment) => {
        expect(environment.name).to.be.equal('dev')
        expect(environment.deploy_content).to.be.equal(environmentCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update a Environment', done => {
    var environment = makeEnvironment('dev')
    Object.assign(environment, cloneDeep(environmentCreate.environment))
    environment.update()
      .then((environment) => {
        expect(environment.name).to.be.equal(environmentCreate.environment.name)
        expect(environment.deploy_content).to.be.equal(environmentCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('delete a Environment', done => {
    makeEnvironment(environmentProdCreate.environment.name)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Environment deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('Add a Environment production', done => {
    makeEnvironment()
      .create(environmentProdCreate)
      .then((environment) => {
        expect(environment.name).to.be.equal(environmentProdCreate.environment.name)
        expect(environment.deploy_content).to.be.equal(environmentProdCreate.environment.deploy_content)
        expect(environment.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })
})

function makeEnvironment (uid = null) {
  return client.stack({ api_key: stack.api_key }).environment(uid)
}
