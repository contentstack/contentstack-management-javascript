import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Variants, VariantsCollection } from '../../lib/stack/variantGroup/variants'
import { systemUidMock, stackHeadersMock, variantMock, noticeMock, checkSystemFields, variantsMock } from './mock/objects'
import { checkEnvironment } from './variantsWithVariantsGroup-test'

describe('Contentstack  Variants test', () => {
  it(' Variants test without uid', done => {
     const variants =  makeVariants({variant_group_uid: systemUidMock.uid})
    expect(variants.urlPath).to.be.equal(`/variant_groups/${systemUidMock.uid}/variants`)
    expect(variants.stackHeaders).to.be.equal(undefined)
    expect(variants.update).to.be.equal(undefined)
    expect(variants.delete).to.be.equal(undefined)
    expect(variants.fetch).to.be.equal(undefined)
    expect(variants.create).to.not.equal(undefined)
    expect(variants.query).to.not.equal(undefined)
    done()
  })

  it(' Variants test with uid', done => {
     const variants =  makeVariants({variant_group_uid: systemUidMock.uid, variants: {uid: systemUidMock.uid}})
    expect(variants.urlPath).to.be.equal(`/variant_groups/${systemUidMock.uid}/variants/${systemUidMock.uid}`)
    expect(variants.stackHeaders).to.be.equal(undefined)
    expect(variants.update).to.not.equal(undefined)
    expect(variants.fetch).to.not.equal(undefined)
    expect(variants.create).to.be.equal(undefined)
    expect(variants.query).to.be.equal(undefined)
    done()
  })

  it(' Variants test with Stack Headers', done => {
     const variants =  makeVariants({ variant_group_uid: systemUidMock.uid, 
      stackHeaders: stackHeadersMock
    })
    expect(variants.urlPath).to.be.equal(`/variant_groups/${systemUidMock.uid}/variants`)
    expect(variants.stackHeaders).to.not.equal(undefined)
    expect(variants.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    done()
  })

  it(' Variants Collection test with blank data', done => {
     const variants = new  VariantsCollection(Axios, {})
    expect(variants.length).to.be.equal(0)
    done()
  })

  it(' Variants Collection test with data', done => {
     const variants = new  VariantsCollection(Axios, { variant_group_uid: systemUidMock.uid,
      variants: [
        variantMock
      ]
    })
    expect(variants.length).to.be.equal(1)
    checkVariants(variants[0])
    done()
  })

  it(' Variants create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/variant_groups/UID/variants').reply(200, { variant_group_uid: systemUidMock.uid,
      variants: {
        ...variantMock
      }
    })
     makeVariants({variant_group_uid: systemUidMock.uid})
      .create()
      .then((variant) => {
        checkVariants(variant)
        done()
      })
      .catch(done)
  })

  it(' Variants Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variant_groups/UID/variants').reply(200, { variant_group_uid: systemUidMock.uid, ...variantsMock 
    })
     makeVariants({variant_group_uid: systemUidMock.uid})
      .query()
      .find()
      .then((variants) => {
        checkVariants(variants.items[0])
        done()
      })
      .catch(done)
  })

  it(' Variants update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/variant_groups/UID/variants/UID').reply(200, { variant_group_uid: systemUidMock.uid,
        variants: {
        ...variantMock
      }
    })
     makeVariants({variant_group_uid: systemUidMock.uid, variants:{
        ...systemUidMock,
      stackHeaders: stackHeadersMock
    }
    })
      .update()
      .then((variant) => {
        checkVariants(variant)
        done()
      })
      .catch(done)
  })

  it(' Variants fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variant_groups/UID/variants/UID').reply(200, { variant_group_uid: systemUidMock.uid,
        variants: {
        ...variantMock
      }
    })
     makeVariants({ variant_group_uid: systemUidMock.uid,
        variants: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((variant) => {
        checkVariants(variant)
        done()
      })
      .catch(done)
  })

})

function makeVariants (data = {}) {
  return new Variants(Axios, data)
}

function checkVariants (variant) {
  checkSystemFields(variant)
  expect(variant.name).to.be.equal('Test')
  expect(variant.uid).to.be.equal('UID')
}