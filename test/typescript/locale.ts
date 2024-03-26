import { expect } from "chai";
import { Stack } from "../../types/stack";
export function createLocale(stack: Stack) {
    describe('Locale create', () => {
        test('Add a language English-Austria', done => {
            stack.locale().create({ locale: { code: 'en-at' } })
            .then((locale) => {
                expect(locale.code).to.be.equal('en-at')
                expect(locale.name).to.be.equal('English - Austria')
                expect(locale.fallback_locale).to.be.equal('en-us')
                expect(locale.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })

        test('Add a language Hindi-India', done => {
            stack.locale().create({ locale: { code: 'hi-in' } })
            .then((locale) => {
                expect(locale.code).to.be.equal('hi-in')
                expect(locale.name).to.be.equal('Hindi - India')
                expect(locale.fallback_locale).to.be.equal('en-us')
                expect(locale.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
        test('Add a language Marathi - India with Fallback en-at', done => {
            stack.locale().create({ locale: { code: 'mr-in', fallback_locale: 'en-at' } })
            .then((locale) => {
                expect(locale.code).to.be.equal('mr-in')
                expect(locale.name).to.be.equal('Marathi - India')
                expect(locale.fallback_locale).to.be.equal('en-at')
                expect(locale.uid).to.be.not.equal(null)
                done()
              })
              .catch(done)
        })
    })
}

export function getLocale(stack: Stack) {
    describe('Local get functions', () => {
        test('Get a All languages', done => {
            stack.locale().query()
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

        test('Query a language Hindi - India', done => {
            stack.locale().query({ query: { name: 'Hindi - India' } })
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

        test('Get a language Hindi - India', done => {
            stack.locale('hi-in')
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

        test('Get and update a language Hindi - India', done => {
            stack.locale('hi-in').fetch()
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
    })
}

export function deleteLocale(stack: Stack) {
    describe('Delete Locale', () => {
        test('Removed a language Hindi - India' , done => { 
            stack.locale('hi-in').delete()
            .then((data) => {
              expect(data.notice).to.be.equal('Language removed successfully.')
              done()
            })
            .catch(done)

        })
    })
}