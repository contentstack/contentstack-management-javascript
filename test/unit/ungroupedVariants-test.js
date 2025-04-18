import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Variants, VariantsCollection } from '../../lib/stack/variants'
import { systemUidMock, stackHeadersMock, variantsMock1, checkSystemFields, noticeMock } from './mock/objects'

describe('Contentstack Variants test', () => {
  it('Variants test without uid', done => {
    const variants = makeVariants()
    expect(variants.urlPath).to.be.equal('/variants')
    expect(variants.stackHeaders).to.be.equal(undefined)
    expect(variants.delete).to.be.equal(undefined)
    expect(variants.fetch).to.be.equal(undefined)
    expect(variants.create).to.not.equal(undefined)
    expect(variants.query).to.not.equal(undefined)
    done()
  })

  it('Variants test with uid', done => {
    const variants = makeVariants({
      variants: {
        ...systemUidMock
      }
    })
    expect(variants.urlPath).to.be.equal(`/variants/${systemUidMock.uid}`)
    expect(variants.stackHeaders).to.be.equal(undefined)
    expect(variants.delete).to.not.equal(undefined)
    expect(variants.fetch).to.not.equal(undefined)
    expect(variants.create).to.be.equal(undefined)
    expect(variants.query).to.be.equal(undefined)
    done()
  })

  it('Variants test with Stack Headers', done => {
    const variants = makeVariants({
      variants: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(variants.urlPath).to.be.equal(`/variants/${systemUidMock.uid}`)
    expect(variants.stackHeaders).to.not.equal(undefined)
    expect(variants.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(variants.delete).to.not.equal(undefined)
    expect(variants.fetch).to.not.equal(undefined)
    expect(variants.create).to.be.equal(undefined)
    expect(variants.fetchAll).to.be.equal(undefined)
    expect(variants.query).to.be.equal(undefined)
    done()
  })

  it('Variants Collection test with blank data', done => {
    const variants = new VariantsCollection(Axios, {})
    expect(variants.length).to.be.equal(0)
    done()
  })

  it('Variants Collection test with data', done => {
    const variants = new VariantsCollection(Axios, {
      variants: [
        variantsMock1
      ]
    })
    expect(variants.length).to.be.equal(1)
    checkVariants(variants[0])
    done()
  })

  it('Variants create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/variants').reply(200, {
      variants: {
        ...variantsMock1
      }
    })
    makeVariants()
      .create()
      .then((variants) => {
        checkVariants(variants)
        done()
      })
      .catch(done)
  })

  it('Variants Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variants').reply(200, {
      variants: [
        variantsMock1
      ]
    })
    makeVariants()
      .query()
      .find()
      .then((variants) => {
        checkVariants(variants.items[0])
        done()
      })
      .catch(done)
  })

  it('Variants fetchByUIDs test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variants').reply(200, {
      variants: [
        variantsMock1
      ]
    })
    makeVariants()
      .fetchByUIDs(['uid1', 'uid2'])
      .then((variants) => {
        checkVariants(variants.variants[0])
        done()
      })
      .catch(done)
  })

  it('Variants fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variants/UID').reply(200, {
      variants: {
        ...variantsMock1
      }
    })
    makeVariants({
      variants: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((variants) => {
        checkVariants(variants)
        done()
      })
      .catch(done)
  })

  it('Variants delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/variants/UID').reply(200, {
      ...noticeMock
    })
    makeVariants({
      variants: {
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

function makeVariants (data = {}) {
  return new Variants(Axios, data)
}

function checkVariants (variants) {
  if (variants.variants) {
    variants = variants.variants
  }
  checkSystemFields(variants)
  expect(variants.name).to.be.equal('name')
}
