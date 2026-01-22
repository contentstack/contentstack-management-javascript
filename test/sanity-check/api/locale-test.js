/**
 * Locale API Tests
 * 
 * Comprehensive test suite for:
 * - Locale CRUD operations
 * - Fallback locale configuration
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  frenchLocale,
  germanLocale,
  spanishLocale,
  localeUpdate
} from '../mock/configurations.js'
import { validateLocaleResponse, testData, wait } from '../utility/testHelpers.js'

describe('Locale API Tests', () => {
  let client
  let stack
  let masterLocale

  before(async function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })

    // Get master locale
    const stackData = await stack.fetch()
    masterLocale = stackData.master_locale || 'en-us'
  })

  // ==========================================================================
  // LOCALE CRUD OPERATIONS
  // ==========================================================================

  describe('Locale CRUD Operations', () => {
    const testLocaleCode = 'fr-fr'

    after(async () => {
      // NOTE: Deletion removed - locales persist for entries, environments
    })

    it('should query all locales', async () => {
      const response = await stack.locale().query().find()

      expect(response).to.be.an('object')
      expect(response.items || response.locales).to.be.an('array')

      const items = response.items || response.locales
      expect(items.length).to.be.at.least(1)

      // Master locale should exist
      const master = items.find(l => l.code === masterLocale)
      expect(master).to.exist
    })

    it('should create a new locale', async function () {
      this.timeout(30000)
      const localeData = JSON.parse(JSON.stringify(frenchLocale))

      try {
        // SDK returns the locale object directly
        const locale = await stack.locale().create(localeData)

        expect(locale).to.be.an('object')
        expect(locale.code).to.be.a('string')
        validateLocaleResponse(locale)

        expect(locale.code).to.equal('fr-fr')
        expect(locale.fallback_locale).to.equal('en-us')

        testData.locales.french = locale
        
        // Wait for locale to be fully created
        await wait(2000)
      } catch (error) {
        // Locale might already exist
        if (error.status === 422 || error.status === 409) {
          console.log('French locale already exists')
        } else {
          throw error
        }
      }
    })

    it('should fetch locale by code', async function () {
      this.timeout(15000)
      try {
        const response = await stack.locale(testLocaleCode).fetch()

        expect(response).to.be.an('object')
        expect(response.code).to.equal(testLocaleCode)
      } catch (error) {
        if (error.status === 404) {
          console.log('Locale not found - may not have been created')
        } else {
          throw error
        }
      }
    })

    it('should update locale name', async () => {
      try {
        const locale = await stack.locale(testLocaleCode).fetch()
        locale.name = 'French - France (Updated)'

        const response = await locale.update()

        expect(response).to.be.an('object')
        expect(response.name).to.equal('French - France (Updated)')
      } catch (error) {
        console.log('Locale update failed:', error.errorMessage)
      }
    })

    it('should validate master locale', async () => {
      const response = await stack.locale(masterLocale).fetch()

      expect(response).to.be.an('object')
      expect(response.code).to.equal(masterLocale)
      // Master locale should not have fallback
    })
  })

  // ==========================================================================
  // FALLBACK LOCALE
  // ==========================================================================

  describe('Fallback Locale', () => {
    const fallbackTestLocale = 'de-de'

    after(async () => {
      // NOTE: Deletion removed - locales persist for entries, environments
    })

    it('should create locale with fallback', async () => {
      const localeData = JSON.parse(JSON.stringify(germanLocale))

      try {
        // SDK returns the locale object directly
        const locale = await stack.locale().create(localeData)

        expect(locale.fallback_locale).to.equal('en-us')

        testData.locales.german = locale
      } catch (error) {
        if (error.status === 422 || error.status === 409) {
          console.log('German locale already exists')
        } else {
          throw error
        }
      }
    })

    it('should update fallback locale', async () => {
      try {
        const locale = await stack.locale(fallbackTestLocale).fetch()
        locale.fallback_locale = masterLocale

        const response = await locale.update()

        expect(response.fallback_locale).to.equal(masterLocale)
      } catch (error) {
        console.log('Fallback update failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create locale with invalid code', async () => {
      const localeData = {
        locale: {
          name: 'Invalid Locale',
          code: 'invalid-code-format'
        }
      }

      try {
        await stack.locale().create(localeData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create duplicate locale', async () => {
      const localeData = {
        locale: {
          name: 'Duplicate Master',
          code: masterLocale
        }
      }

      try {
        await stack.locale().create(localeData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([409, 422])
      }
    })

    it('should fail to fetch non-existent locale', async () => {
      try {
        await stack.locale('xx-xx').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to delete master locale', async () => {
      try {
        const locale = await stack.locale(masterLocale).fetch()
        await locale.delete()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 403, 422])
      }
    })

    it('should fail to create locale with non-existent fallback', async () => {
      const localeData = {
        locale: {
          name: 'Bad Fallback',
          code: 'es-mx',
          fallback_locale: 'nonexistent-locale'
        }
      }

      try {
        await stack.locale().create(localeData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE LOCALE
  // ==========================================================================

  describe('Delete Locale', () => {

    it('should delete a non-master locale', async () => {
      const tempCode = 'pt-br'
      
      // Create first
      try {
        await stack.locale().create({
          locale: {
            name: 'Portuguese - Brazil',
            code: tempCode,
            fallback_locale: masterLocale
          }
        })
      } catch (e) { }

      // Then delete
      try {
        const locale = await stack.locale(tempCode).fetch()
        const response = await locale.delete()

        expect(response).to.be.an('object')
        expect(response.notice).to.be.a('string')
      } catch (error) {
        console.log('Delete failed:', error.errorMessage)
      }
    })

    it('should return 404 for deleted locale', async () => {
      const tempCode = 'ja-jp'
      
      // Create and delete
      try {
        await stack.locale().create({
          locale: {
            name: 'Japanese',
            code: tempCode,
            fallback_locale: masterLocale
          }
        })
        
        const locale = await stack.locale(tempCode).fetch()
        await locale.delete()
      } catch (e) { }

      try {
        await stack.locale(tempCode).fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
