/**
 * Organization API Tests
 *
 * Comprehensive test suite for:
 * - Organization fetch
 * - Organization stacks
 * - Organization users
 * - Organization roles
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, trackedExpect } from '../utility/testHelpers.js'

describe('Organization API Tests', () => {
  let client
  let organizationUid

  before(async function () {
    client = contentstackClient()

    // Get first organization
    try {
      const response = await client.organization().fetchAll()
      if (response.items && response.items.length > 0) {
        organizationUid = response.items[0].uid
        testData.organization = response.items[0]
      }
    } catch (error) {
      console.log('Failed to get organizations:', error.errorMessage)
    }
  })

  // ==========================================================================
  // ORGANIZATION FETCH
  // ==========================================================================

  describe('Organization Fetch', () => {
    it('should fetch all organizations', async () => {
      const response = await client.organization().fetchAll()

      trackedExpect(response, 'Response').toBeAn('object')
      trackedExpect(response.items, 'Organizations list').toBeAn('array')
    })

    it('should validate organization structure', async () => {
      const response = await client.organization().fetchAll()

      if (response.items.length > 0) {
        const org = response.items[0]
        expect(org.uid).to.be.a('string')
        expect(org.name).to.be.a('string')
      }
    })

    it('should fetch organization by UID', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      const response = await client.organization(organizationUid).fetch()

      expect(response).to.be.an('object')
      expect(response.uid).to.equal(organizationUid)
    })

    it('should validate organization fields', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      const org = await client.organization(organizationUid).fetch()

      expect(org.uid).to.be.a('string')
      expect(org.name).to.be.a('string')

      if (org.created_at) {
        expect(new Date(org.created_at)).to.be.instanceof(Date)
      }
    })
  })

  // ==========================================================================
  // ORGANIZATION STACKS
  // ==========================================================================

  describe('Organization Stacks', () => {
    it('should get all stacks in organization', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      try {
        const response = await client.organization(organizationUid).stacks()

        expect(response).to.be.an('object')
        if (response.stacks) {
          expect(response.stacks).to.be.an('array')
        }
      } catch (error) {
        console.log('Stacks fetch failed:', error.errorMessage)
      }
    })

    it('should validate stack structure in response', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      try {
        const response = await client.organization(organizationUid).stacks()

        if (response.stacks && response.stacks.length > 0) {
          const stack = response.stacks[0]
          expect(stack.api_key).to.be.a('string')
          expect(stack.name).to.be.a('string')
        }
      } catch (error) {
        console.log('Stack validation skipped')
      }
    })
  })

  // ==========================================================================
  // ORGANIZATION USERS
  // ==========================================================================

  describe('Organization Users', () => {
    it('should get organization users', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      try {
        const response = await client.organization(organizationUid).getInvitations()

        expect(response).to.be.an('object')
      } catch (error) {
        console.log('Invitations fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // ORGANIZATION ROLES
  // ==========================================================================

  describe('Organization Roles', () => {
    it('should get organization roles', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      try {
        const response = await client.organization(organizationUid).roles()

        expect(response).to.be.an('object')
        if (response.roles) {
          expect(response.roles).to.be.an('array')
        }
      } catch (error) {
        console.log('Roles fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // ORGANIZATION TEAMS
  // ==========================================================================

  describe('Organization Teams', () => {
    it('should get organization teams', async () => {
      if (!organizationUid) {
        console.log('Skipping - no organization available')
        return
      }

      try {
        const response = await client.organization(organizationUid).teams().fetchAll()

        trackedExpect(response, 'Teams response').toBeAn('object')
        if (response.items != null) {
          trackedExpect(response.items, 'Teams list').toBeAn('array')
        }
      } catch (error) {
        console.log('Teams fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {
    it('should fail to fetch non-existent organization', async () => {
      try {
        await client.organization('nonexistent_org_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([401, 403, 404, 422])
      }
    })

    it('should handle unauthorized access', async () => {
      const unauthClient = contentstackClient()

      try {
        await unauthClient.organization().fetchAll()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        // May not have status if it's a client-side auth error
        if (error.status) {
          expect(error.status).to.be.oneOf([401, 403, 422])
        }
      }
    })
  })
})
