import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { VariantGroup, VariantGroupCollection } from '../../lib/stack/variantGroup'
import { systemUidMock, stackHeadersMock, variantGroupMock, noticeMock, checkSystemFields, variantGroupsMock } from './mock/objects'
import { checkEnvironment } from './variantGroup-test'

describe('Contentstack VariantGroup test', () => {
  it('VariantGroup test without uid', done => {
    const variantGroup = makeVariantGroup()
    expect(variantGroup.urlPath).to.be.equal('/variant_groups')
    expect(variantGroup.stackHeaders).to.be.equal(undefined)
    expect(variantGroup.update).to.be.equal(undefined)
    expect(variantGroup.delete).to.be.equal(undefined)
    expect(variantGroup.create).to.not.equal(undefined)
    expect(variantGroup.query).to.not.equal(undefined)
    done()
  })

  it('VariantGroup test with uid', done => {
    const variantGroup = makeVariantGroup({variant_group: {...systemUidMock}})
    expect(variantGroup.urlPath).to.be.equal(`/variant_groups/${systemUidMock.uid}`)
    expect(variantGroup.stackHeaders).to.be.equal(undefined)
    expect(variantGroup.update).to.not.equal(undefined)
    expect(variantGroup.delete).to.not.equal(undefined)
    expect(variantGroup.create).to.be.equal(undefined)
    expect(variantGroup.query).to.be.equal(undefined)
    done()
  })

  it('VariantGroup test with Stack Headers', done => {
    const variantGroup = makeVariantGroup({ variant_group:{
        ...systemUidMock,
      stackHeaders: stackHeadersMock
    }
    })
    expect(variantGroup.urlPath).to.be.equal(`/variant_groups/${systemUidMock.uid}`)
    expect(variantGroup.stackHeaders).to.not.equal(undefined)
    expect(variantGroup.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(variantGroup.update).to.not.equal(undefined)
    expect(variantGroup.delete).to.not.equal(undefined)
    expect(variantGroup.create).to.be.equal(undefined)
    expect(variantGroup.query).to.be.equal(undefined)
    done()
  })

  it('VariantGroup Collection test with blank data', done => {
    const variantGroup = new VariantGroupCollection(Axios, {})
    expect(variantGroup.length).to.be.equal(0)
    done()
  })

  it('VariantGroup Collection test with data', done => {
    const variantGroup = new VariantGroupCollection(Axios, {
      variant_groups: [
        variantGroupMock
      ]
    })
    expect(variantGroup.length).to.be.equal(1)
    checkVariantGroup(variantGroup[0])
    done()
  })

  it('VariantGroup create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/variant_groups').reply(200, {
      variant_group: {
        ...variantGroupMock
      }
    })
    makeVariantGroup()
      .create()
      .then((variantGroup) => {
        checkVariantGroup(variantGroup)
        done()
      })
      .catch(done)
  })

  it('VariantGroup Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/variant_groups').reply(200, { ...variantGroupsMock 
    })
    makeVariantGroup()
      .query()
      .find()
      .then((variantGroups) => {
        checkVariantGroup(variantGroups.items[0])
        done()
      })
      .catch(done)
  })

  it('VariantGroup update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/variant_groups/UID').reply(200, {
      variant_group: {
        ...variantGroupMock
      }
    })
    makeVariantGroup({variant_group:{
        ...systemUidMock,
      stackHeaders: stackHeadersMock
    }
    })
      .update({name: 'test'})
      .then((variantGroup) => {
        checkVariantGroup(variantGroup.variant_group)
        done()
      })
      .catch(done)
  })

  // Fetch API not present in the variant group
  // it('VariantGroup fetch test', done => {
  //   var mock = new MockAdapter(Axios)
  //   mock.onGet('/variant_groups/UID').reply(200, {
  //     variant_group: {
  //       ...variantGroupMock
  //     }
  //   })
  //   makeVariantGroup({
  //     variant_group: {
  //       ...systemUidMock
  //     },
  //     stackHeaders: stackHeadersMock
  //   })
  //     .fetch()
  //     .then((variantGroup) => {
  //       checkVariantGroup(variantGroup)
  //       done()
  //     })
  //     .catch(done)
  // })

  it('VariantGroup delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/variant_groups/UID').reply(200, {
      ...noticeMock
    })
    makeVariantGroup({
      variant_group: {
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

function makeVariantGroup (data = {}) {
  return new VariantGroup(Axios, data)
}

function checkVariantGroup (variantGroup) {
  if(variantGroup.variant_group){
    variantGroup = variantGroup.variant_group
  }
  checkSystemFields(variantGroup)
  expect(variantGroup.name).to.be.equal('Test')
  expect(variantGroup.source).to.be.equal('Personalize')
  expect(variantGroup.content_types.length).to.be.equal(1)
}