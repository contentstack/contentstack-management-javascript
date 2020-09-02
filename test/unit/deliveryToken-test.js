import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { DeliveryToken, DeliveryTokenCollection } from '../../lib/stack/deliveryToken'
import { systemUidMock, stackHeadersMock, deliveryTokenMock, noticeMock, checkSystemFields } from './mock/objects'
import { checkEnvironment } from './environment-test'

describe('Contentstack DeliveryToken test', () => {
  it('DeliveryToken test without uid', done => {
    const deliveryToken = makeDeliveryToken()
    expect(deliveryToken.urlPath).to.be.equal('/stacks/delivery_tokens')
    expect(deliveryToken.stackHeaders).to.be.equal(undefined)
    expect(deliveryToken.update).to.be.equal(undefined)
    expect(deliveryToken.delete).to.be.equal(undefined)
    expect(deliveryToken.fetch).to.be.equal(undefined)
    expect(deliveryToken.create).to.not.equal(undefined)
    expect(deliveryToken.query).to.not.equal(undefined)
    done()
  })

  it('DeliveryToken test with uid', done => {
    const deliveryToken = makeDeliveryToken({
      token: {
        ...systemUidMock
      }
    })
    expect(deliveryToken.urlPath).to.be.equal(`/stacks/delivery_tokens/${systemUidMock.uid}`)
    expect(deliveryToken.stackHeaders).to.be.equal(undefined)
    expect(deliveryToken.update).to.not.equal(undefined)
    expect(deliveryToken.delete).to.not.equal(undefined)
    expect(deliveryToken.fetch).to.not.equal(undefined)
    expect(deliveryToken.create).to.be.equal(undefined)
    expect(deliveryToken.query).to.be.equal(undefined)
    done()
  })

  it('DeliveryToken test with Stack Headers', done => {
    const deliveryToken = makeDeliveryToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(deliveryToken.urlPath).to.be.equal(`/stacks/delivery_tokens/${systemUidMock.uid}`)
    expect(deliveryToken.stackHeaders).to.not.equal(undefined)
    expect(deliveryToken.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(deliveryToken.update).to.not.equal(undefined)
    expect(deliveryToken.delete).to.not.equal(undefined)
    expect(deliveryToken.fetch).to.not.equal(undefined)
    expect(deliveryToken.create).to.be.equal(undefined)
    expect(deliveryToken.query).to.be.equal(undefined)
    done()
  })

  it('DeliveryToken Collection test with blank data', done => {
    const deliveryToken = new DeliveryTokenCollection(Axios, {})
    expect(deliveryToken.length).to.be.equal(0)
    done()
  })

  it('DeliveryToken Collection test with data', done => {
    const deliveryToken = new DeliveryTokenCollection(Axios, {
      tokens: [
        deliveryTokenMock
      ]
    })
    expect(deliveryToken.length).to.be.equal(1)
    checkDeliveryToken(deliveryToken[0])
    done()
  })

  it('DeliveryToken create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/stacks/delivery_tokens').reply(200, {
      token: {
        ...deliveryTokenMock
      }
    })
    makeDeliveryToken()
      .create()
      .then((deliveryToken) => {
        checkDeliveryToken(deliveryToken)
        done()
      })
      .catch(done)
  })

  it('DeliveryToken Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/delivery_tokens').reply(200, {
      tokens: [
        deliveryTokenMock
      ]
    })
    makeDeliveryToken()
      .query()
      .find()
      .then((deliveryTokens) => {
        checkDeliveryToken(deliveryTokens.items[0])
        done()
      })
      .catch(done)
  })

  it('DeliveryToken update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/stacks/delivery_tokens/UID').reply(200, {
      token: {
        ...deliveryTokenMock
      }
    })
    makeDeliveryToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((deliveryToken) => {
        checkDeliveryToken(deliveryToken)
        done()
      })
      .catch(done)
  })

  it('DeliveryToken fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/stacks/delivery_tokens/UID').reply(200, {
      token: {
        ...deliveryTokenMock
      }
    })
    makeDeliveryToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((deliveryToken) => {
        checkDeliveryToken(deliveryToken)
        done()
      })
      .catch(done)
  })

  it('DeliveryToken delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/stacks/delivery_tokens/UID').reply(200, {
      ...noticeMock
    })
    makeDeliveryToken({
      token: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })
})

function makeDeliveryToken (data = {}) {
  return new DeliveryToken(Axios, data)
}

function checkDeliveryToken (deliveryToken) {
  checkSystemFields(deliveryToken)
  expect(deliveryToken.name).to.be.equal('Test')
  expect(deliveryToken.description).to.be.equal('description')
  expect(deliveryToken.token).to.be.equal('token')
  expect(deliveryToken.type).to.be.equal('delivery')
  expect(deliveryToken.scope.length).to.be.equal(1)
  checkEnvironment(deliveryToken.scope[0].environments[0])
}
