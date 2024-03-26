import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Locale, LocaleCollection } from '../../lib/stack/locale'
import { systemUidMock, stackHeadersMock, localeMock, noticeMock, checkSystemFields } from './mock/objects'

describe('Contentstack Locale test', () => {
  it('Locale test without uid', done => {
    const locale = makeLocale()
    expect(locale.urlPath).to.be.equal('/locales')
    expect(locale.stackHeaders).to.be.equal(undefined)
    expect(locale.update).to.be.equal(undefined)
    expect(locale.delete).to.be.equal(undefined)
    expect(locale.fetch).to.be.equal(undefined)
    expect(locale.create).to.not.equal(undefined)
    expect(locale.query).to.not.equal(undefined)
    done()
  })

  it('Locale test with uid', done => {
    const locale = makeLocale({
      locale: {
        code: systemUidMock.uid
      }
    })
    expect(locale.urlPath).to.be.equal(`/locales/${systemUidMock.uid}`)
    expect(locale.stackHeaders).to.be.equal(undefined)
    expect(locale.update).to.not.equal(undefined)
    expect(locale.delete).to.not.equal(undefined)
    expect(locale.fetch).to.not.equal(undefined)
    expect(locale.create).to.be.equal(undefined)
    expect(locale.query).to.be.equal(undefined)
    done()
  })

  it('Locale test with Stack Headers', done => {
    const locale = makeLocale({
      locale: {
        code: systemUidMock.uid

      },
      stackHeaders: stackHeadersMock
    })
    expect(locale.urlPath).to.be.equal(`/locales/${systemUidMock.uid}`)
    expect(locale.stackHeaders).to.not.equal(undefined)
    expect(locale.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(locale.update).to.not.equal(undefined)
    expect(locale.delete).to.not.equal(undefined)
    expect(locale.fetch).to.not.equal(undefined)
    expect(locale.create).to.be.equal(undefined)
    expect(locale.query).to.be.equal(undefined)
    done()
  })

  it('Locale Collection test with blank data', done => {
    const locales = new LocaleCollection(Axios, {})
    expect(locales.length).to.be.equal(0)
    done()
  })

  it('Locale Collection test with data', done => {
    const locales = new LocaleCollection(Axios, {
      locales: [
        localeMock
      ]
    })
    expect(locales.length).to.be.equal(1)
    checkLocale(locales[0])
    done()
  })

  it('Locale create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/locales').reply(200, {
      locale: {
        ...localeMock
      }
    })
    makeLocale()
      .create()
      .then((locale) => {
        checkLocale(locale)
        done()
      })
      .catch(done)
  })

  it('Locale Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/locales').reply(200, {
      locales: [
        localeMock
      ]
    })
    makeLocale()
      .query()
      .find()
      .then((locales) => {
        checkLocale(locales.items[0])
        done()
      })
      .catch(done)
  })

  it('Locale update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/locales/UID').reply(200, {
      locale: {
        ...localeMock
      }
    })
    makeLocale({
      locale: {
        code: systemUidMock.uid

      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((locale) => {
        checkLocale(locale)
        done()
      })
      .catch(done)
  })

  it('Locale fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/locales/UID').reply(200, {
      locale: {
        ...localeMock
      }
    })
    makeLocale({
      locale: {
        code: systemUidMock.uid

      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((locale) => {
        checkLocale(locale)
        done()
      })
      .catch(done)
  })

  it('Locale delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/locales/UID').reply(200, {
      ...noticeMock
    })
    makeLocale({
      locale: {
        code: systemUidMock.uid

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

function makeLocale (data) {
  return new Locale(Axios, data)
}

function checkLocale (locale) {
  checkSystemFields(locale)
  expect(locale.code).to.be.equal('zh-cn')
  expect(locale.name).to.be.equal('Chinese - China')
  expect(locale._version).to.be.equal(1)
  expect(locale.fallback_locale).to.be.equal('en-us')
}
