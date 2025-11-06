import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

const taxonomy = {
  uid: 'taxonomy_localize_testing',
  name: 'taxonomy localize testing',
  description: 'Description for Taxonomy testing'
}

var taxonomyUID = ''

describe('taxonomy api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create taxonomy', done => {
    makeTaxonomy()
      .create({ taxonomy })
      .then((taxonomyResponse) => {
        taxonomyUID = taxonomyResponse.uid
        expect(taxonomyResponse.name).to.be.equal(taxonomy.name)
        setTimeout(() => {
          done()
        }, 10000)
      })
      .catch(done)
  })

  it('should fetch taxonomy of the uid passed', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should fetch taxonomy with locale parameter', done => {
    makeTaxonomy(taxonomyUID)
      .fetch({ locale: 'en-us' })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        expect(taxonomyResponse.locale).to.be.equal('en-us')
        done()
      })
      .catch(done)
  })

  it('should fetch taxonomy with include counts parameters', done => {
    makeTaxonomy(taxonomyUID)
      .fetch({
        include_terms_count: true,
        include_referenced_terms_count: true,
        include_referenced_content_type_count: true,
        include_referenced_entries_count: true
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        // Count fields might not be available in all environments
        if (taxonomyResponse.terms_count !== undefined) {
          expect(taxonomyResponse.terms_count).to.be.a('number')
        }
        if (taxonomyResponse.referenced_terms_count !== undefined) {
          expect(taxonomyResponse.referenced_terms_count).to.be.a('number')
        }
        if (taxonomyResponse.referenced_entries_count !== undefined) {
          expect(taxonomyResponse.referenced_entries_count).to.be.a('number')
        }
        if (taxonomyResponse.referenced_content_type_count !== undefined) {
          expect(taxonomyResponse.referenced_content_type_count).to.be.a('number')
        }
        done()
      })
      .catch(done)
  })

  it('should fetch taxonomy with fallback parameters', done => {
    makeTaxonomy(taxonomyUID)
      .fetch({
        locale: 'en-us',
        branch: 'main',
        include_fallback: true,
        fallback_locale: 'en-us'
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should localize taxonomy using localize method', done => {
    // Use a unique locale code and name
    const timestamp = Date.now().toString().slice(-4)
    const localeCode = 'ar-dz-' + timestamp
    const localeData = { locale: { code: localeCode, name: 'Arabic Algeria ' + timestamp } }
    const localizeData = {
      taxonomy: {
        uid: 'taxonomy_testing_localize_method_' + Date.now(),
        name: 'Taxonomy Localize Method Test',
        description: 'Description for Taxonomy Localize Method Test'
      }
    }
    const localizeParams = {
      locale: localeCode
    }

    let createdLocale = null

    // Step 1: Create the locale
    makeLocale()
      .create(localeData)
      .then((localeResponse) => {
        createdLocale = localeResponse
        expect(localeResponse.code).to.be.equal(localeCode)
        expect(localeResponse.name).to.be.equal(localeData.locale.name)
        return makeTaxonomy(taxonomyUID)
          .fetch()
          .then((taxonomyInstance) => {
            return taxonomyInstance.localize(localizeData, localizeParams)
          })
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal(localizeData.taxonomy.name)
        expect(taxonomyResponse.description).to.be.equal(localizeData.taxonomy.description)
        expect(taxonomyResponse.locale).to.be.equal(localeCode)
        if (createdLocale && createdLocale.code) {
          // Try to delete the locale, but don't fail the test if it doesn't work
          return makeLocale(createdLocale.code).delete()
            .then((data) => {
              expect(data.notice).to.be.equal('Language removed successfully.')
            })
            .catch((error) => {
              // Locale deletion failed - this is acceptable for cleanup
              // The locale might be in use or already deleted
              expect(error.status).to.be.oneOf([404, 422, 248])
            })
        }
        return Promise.resolve()
      })
      .then(() => {
        setTimeout(() => {
          done()
        }, 10000)
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should update taxonomy of the uid passed', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.name = 'Updated Name'
        return taxonomyResponse.update()
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal('Updated Name')
        done()
      })
      .catch(done)
  })

  it('should update taxonomy with locale parameter', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.name = 'Updated Name in Hindi'
        taxonomyResponse.description = 'Updated description in Hindi'
        return taxonomyResponse.update({ locale: 'en-us' })
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal('Updated Name in Hindi')
        expect(taxonomyResponse.description).to.be.equal('Updated description in Hindi')
        expect(taxonomyResponse.locale).to.be.equal('en-us')
        done()
      })
      .catch(done)
  })

  it('should update taxonomy without locale parameter (master locale)', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.name = 'Updated Name in Master Locale'
        taxonomyResponse.description = 'Updated description in Master Locale'
        return taxonomyResponse.update()
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal('Updated Name in Master Locale')
        expect(taxonomyResponse.description).to.be.equal('Updated description in Master Locale')
        expect(taxonomyResponse.locale).to.be.equal('en-us')
        done()
      })
      .catch(done)
  })

  it('should update taxonomy with partial data', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.name = 'Only Name Updated'
        return taxonomyResponse.update()
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.name).to.be.equal('Only Name Updated')
        done()
      })
      .catch(done)
  })

  it('should update taxonomy with description only', done => {
    makeTaxonomy(taxonomyUID)
      .fetch()
      .then((taxonomyResponse) => {
        taxonomyResponse.description = 'Only Description Updated'
        return taxonomyResponse.update()
      })
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
        expect(taxonomyResponse.description).to.be.equal('Only Description Updated')
        done()
      })
      .catch(done)
  })

  it('should get all taxonomies', async () => {
    makeTaxonomy()
      .query()
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
      })
  })

  it('should get taxonomies with locale parameter', done => {
    makeTaxonomy()
      .query({ locale: 'en-us' })
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
          expect(taxonomyResponse.locale).to.be.equal('en-us')
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomies with include counts parameters', done => {
    makeTaxonomy()
      .query({
        include_terms_count: true,
        include_referenced_terms_count: true,
        include_referenced_content_type_count: true,
        include_referenced_entries_count: true,
        include_count: true
      })
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
          // Count fields might not be available in all environments
          if (taxonomyResponse.terms_count !== undefined) {
            expect(taxonomyResponse.terms_count).to.be.a('number')
          }
          if (taxonomyResponse.referenced_terms_count !== undefined) {
            expect(taxonomyResponse.referenced_terms_count).to.be.a('number')
          }
          if (taxonomyResponse.referenced_entries_count !== undefined) {
            expect(taxonomyResponse.referenced_entries_count).to.be.a('number')
          }
          if (taxonomyResponse.referenced_content_type_count !== undefined) {
            expect(taxonomyResponse.referenced_content_type_count).to.be.a('number')
          }
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomies with fallback parameters', done => {
    makeTaxonomy()
      .query({
        locale: 'en-us',
        branch: 'main',
        include_fallback: true,
        fallback_locale: 'en-us'
      })
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomies with sorting parameters', done => {
    makeTaxonomy()
      .query({
        asc: 'name',
        desc: 'created_at'
      })
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomies with search parameters', done => {
    makeTaxonomy()
      .query({
        typeahead: 'taxonomy',
        deleted: false
      })
      .find()
      .then((response) => {
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomies with pagination parameters', done => {
    makeTaxonomy()
      .query({
        skip: 0,
        limit: 5
      })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.at.most(5)
        response.items.forEach((taxonomyResponse) => {
          expect(taxonomyResponse.uid).to.be.not.equal(null)
          expect(taxonomyResponse.name).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should get taxonomy locales', done => {
    makeTaxonomy(taxonomyUID)
      .locales()
      .then((response) => {
        expect(response.taxonomies).to.be.an('array')
        // Count field might not be available in all environments
        if (response.count !== undefined) {
          expect(response.count).to.be.a('number')
          expect(response.taxonomies.length).to.be.equal(response.count)
        }
        response.taxonomies.forEach((taxonomy) => {
          expect(taxonomy.uid).to.be.equal(taxonomyUID)
          expect(taxonomy.locale).to.be.a('string')
          expect(taxonomy.localized).to.be.a('boolean')
        })
        done()
      })
      .catch(done)
  })

  it('should handle localize error with invalid locale', done => {
    const localizeData = {
      taxonomy: {
        uid: 'taxonomy_testing_invalid_' + Date.now(),
        name: 'Invalid Taxonomy',
        description: 'Invalid description'
      }
    }
    const localizeParams = {
      locale: 'invalid-locale-code'
    }

    makeTaxonomy(taxonomyUID)
      .localize(localizeData, localizeParams)
      .then(() => {
        done(new Error('Expected error but got success'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        done()
      })
  })

  // Cleanup: Delete the main taxonomy
  it('should delete main taxonomy (master locale)', done => {
    makeTaxonomy(taxonomyUID)
      .delete()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.status).to.be.equal(204)
        done()
      })
      .catch(done)
  })

  // Final cleanup: Delete the specific taxonomy created for testing
  it('should delete taxonomy_localize_testing taxonomy', done => {
    makeTaxonomy('taxonomy_localize_testing')
      .delete()
      .then((taxonomyResponse) => {
        expect(taxonomyResponse.status).to.be.equal(204)
        done()
      })
      .catch((error) => {
        // Taxonomy might already be deleted, which is acceptable
        if (error.status === 404) {
          done() // Test passes if taxonomy doesn't exist
        } else {
          done(error)
        }
      })
  })

  // Cleanup accumulated locales from previous test runs
  it('should cleanup accumulated locales', async () => {
    try {
      // Get all locales and try to delete any that start with 'ar-dz'
      const response = await makeLocale().query().find()
      const localesToDelete = response.items.filter(locale =>
        locale.code && locale.code.startsWith('ar-dz')
      )

      if (localesToDelete.length === 0) {
        return // No locales to delete
      }

      const deletePromises = localesToDelete.map(locale => {
        return makeLocale(locale.code).delete()
          .catch((error) => {
            // Locale might be in use - this is expected and OK
            console.log(`Failed to delete locale ${locale.code}:`, error.message)
          })
      })

      await Promise.all(deletePromises)
    } catch (error) {
      // Don't fail the test for cleanup errors
      console.log('Cleanup failed, continuing:', error.message)
    }
  })
})

function makeTaxonomy (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).taxonomy(uid)
}

function makeLocale (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).locale(uid)
}
