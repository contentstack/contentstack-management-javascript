import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var stack = {}
describe('Locale api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Add a language English - Austria', done => {
    makeLocale()
      .create({ locale: { code: 'en-at' } })
      .then((locale) => {
        expect(locale.code).to.be.equal('en-at')
        expect(locale.name).to.be.equal('English - Austria')
        expect(locale.fallback_locale).to.be.equal('en-us')
        expect(locale.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a language Hindi - India', done => {
    makeLocale()
      .create({ locale: { code: 'hi-in' } })
      .then((locale) => {
        expect(locale.code).to.be.equal('hi-in')
        expect(locale.name).to.be.equal('Hindi - India')
        expect(locale.fallback_locale).to.be.equal('en-us')
        expect(locale.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Add a language Marathi - India with Fallback en-at', done => {
    makeLocale()
      .create({ locale: { code: 'mr-in', fallback_locale: 'en-at' } })
      .then((locale) => {
        expect(locale.code).to.be.equal('mr-in')
        expect(locale.name).to.be.equal('Marathi - India')
        expect(locale.fallback_locale).to.be.equal('en-at')
        expect(locale.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get a All languages', done => {
    makeLocale()
      .query()
      .find()
      .then((locales) => {
        locales.items.forEach((locale) => {
          expect(locale.code).to.be.not.equal(null)
          expect(locale.name).to.be.not.equal(null)
          expect(locale.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Query a language Hindi - India', done => {
    makeLocale()
      .query({ query: { name: 'Hindi - India' } })
      .find()
      .then((locales) => {
        locales.items.forEach((locale) => {
          expect(locale.code).to.be.equal('hi-in')
          expect(locale.name).to.be.equal('Hindi - India')
          expect(locale.fallback_locale).to.be.equal('en-us')
          expect(locale.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Get a language Hindi - India', done => {
    makeLocale('hi-in')
      .fetch()
      .then((locale) => {
        expect(locale.code).to.be.equal('hi-in')
        expect(locale.name).to.be.equal('Hindi - India')
        expect(locale.fallback_locale).to.be.equal('en-us')
        expect(locale.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get and update a language Hindi - India', done => {
    makeLocale('hi-in')
      .fetch()
      .then((locale) => {
        locale.fallback_locale = 'en-at'
        return locale.update()
      })
      .then((locale) => {
        expect(locale.code).to.be.equal('hi-in')
        expect(locale.name).to.be.equal('Hindi - India')
        expect(locale.fallback_locale).to.be.equal('en-at')
        expect(locale.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get and update a language Hindi - India', done => {
    makeLocale('mr-in')
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Language removed successfully.')
        done()
      })
      .catch(done)
  })
})

function makeLocale (uid = null) {
  return client.stack(stack.api_key).locale(uid)
}
