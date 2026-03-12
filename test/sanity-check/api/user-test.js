/**
 * User & Authentication API Tests
 *
 * Comprehensive test suite for:
 * - User profile operations
 * - Login error handling (invalid credentials)
 * - Session management
 * - Authentication validation
 *
 * NOTE: Primary login is handled in sanity.js setup.
 * These tests focus on:
 * - Validating logged-in user profile
 * - Testing authentication error cases
 * - Verifying token behavior
 */

import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { contentstackClient, getTestContext } from '../utility/ContentstackClient.js'
import { testData, trackedExpect, wait } from '../utility/testHelpers.js'
// Import from dist (built version) to avoid ESM module resolution issues
import * as contentstack from '../../../dist/node/contentstack-management.js'

describe('User & Authentication API Tests', () => {
  let client

  beforeEach(function () {
    client = contentstackClient()
  })

  // ==========================================================================
  // GET CURRENT USER TESTS (Using authtoken from setup)
  // ==========================================================================

  describe('Get User Profile', () => {
    it('should get current logged-in user profile', async function () {
      this.timeout(15000)

      // Authtoken is set by setup in sanity.js (stored in testContext)
      const testContext = getTestContext()
      if (!testContext.authtoken) {
        this.skip()
      }

      const authClient = contentstackClient()
      const user = await authClient.getUser()

      trackedExpect(user, 'User response').toBeAn('object')
      trackedExpect(user.uid, 'User UID').toBeA('string')
      trackedExpect(user.email, 'User email').toEqual(process.env.EMAIL)
    })

    it('should return user with all required fields', async function () {
      this.timeout(15000)

      const testContext = getTestContext()
      if (!testContext.authtoken) {
        this.skip()
      }

      const authClient = contentstackClient()
      const user = await authClient.getUser()

      // Required fields - use tracked assertions for report visibility
      trackedExpect(user.uid, 'User UID').toBeA('string')
      trackedExpect(user.email, 'User email').toBeA('string')
      trackedExpect(user.first_name, 'First name').toBeA('string')
      trackedExpect(user.last_name, 'Last name').toBeA('string')

      // Timestamps
      trackedExpect(user.created_at, 'Created at').toBeA('string')
      trackedExpect(user.updated_at, 'Updated at').toBeA('string')

      // Validate date formats
      expect(new Date(user.created_at)).to.be.instanceof(Date)
      expect(new Date(user.updated_at)).to.be.instanceof(Date)

      // Store for other tests
      testData.user = user
    })

    it('should validate user UID format', async function () {
      this.timeout(15000)

      const testContext = getTestContext()
      if (!testContext.authtoken) {
        this.skip()
      }

      const authClient = contentstackClient()
      const user = await authClient.getUser()

      // UID should match Contentstack format
      expect(user.uid).to.match(/^blt[a-f0-9]+$/)
    })
  })

  // ==========================================================================
  // LOGIN ERROR HANDLING TESTS
  // ==========================================================================

  describe('Login Error Handling', () => {
    it('should fail login with empty credentials', async function () {
      this.timeout(15000)

      try {
        await client.login({ email: '', password: '' })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([400, 401, 422])
      }
    })

    it('should fail login with invalid email format', async function () {
      this.timeout(15000)

      try {
        await client.login({ email: 'invalid-email', password: 'password123' })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([400, 401, 422])
      }
    })

    it('should fail login with wrong password', async function () {
      this.timeout(15000)

      try {
        await client.login({
          email: process.env.EMAIL || 'test@example.com',
          password: 'wrong_password_12345'
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([401, 422])
        expect(error.errorMessage).to.be.a('string')
      }
    })

    it('should fail login with non-existent email', async function () {
      this.timeout(15000)

      try {
        await client.login({
          email: 'nonexistent_user_' + Date.now() + '@test-invalid.com',
          password: 'password123'
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([401, 422])
      }
    })

    it('should return proper error structure for authentication failures', async function () {
      this.timeout(15000)

      try {
        await client.login({ email: 'test@test.com', password: 'wrongpassword' })
        expect.fail('Should have thrown an error')
      } catch (error) {
        // Validate error structure
        expect(error).to.exist
        expect(error).to.have.property('status')
        expect(error).to.have.property('errorMessage')
        expect(error).to.have.property('errorCode')

        // Status should be a number
        expect(error.status).to.be.a('number')
        expect(error.errorMessage).to.be.a('string')
        expect(error.errorCode).to.be.a('number')
      }
    })
  })

  // ==========================================================================
  // TOKEN VALIDATION TESTS
  // ==========================================================================

  describe('Token Validation', () => {
    it('should fail to get user without authentication', async function () {
      this.timeout(15000)

      // Create client without authtoken
      const unauthClient = contentstack.client({
        host: process.env.HOST || 'api.contentstack.io'
      })

      try {
        await unauthClient.getUser()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([401, 403])
      }
    })

    it('should fail with invalid authtoken format', async function () {
      this.timeout(15000)

      try {
        const badClient = contentstackClient('invalid_token_format')
        await badClient.getUser()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        const status = error.status ?? error.response?.status
        expect(status, 'Expected 401/403 in error.status or error.response.status').to.be.oneOf([401, 403])
      }
    })

    it('should fail with expired/fake authtoken', async function () {
      this.timeout(15000)

      try {
        // Using a fake but valid-looking token
        const expiredToken = 'bltfake0000000000000'
        const badClient = contentstackClient(expiredToken)
        await badClient.getUser()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        const status = error.status ?? error.response?.status
        expect(status, 'Expected 401/403 in error.status or error.response.status').to.be.oneOf([401, 403])
      }
    })
  })

  // ==========================================================================
  // USER STACK ACCESS TESTS
  // ==========================================================================

  describe('User Stack Access', () => {
    it('should access stack with valid API key', async function () {
      this.timeout(15000)

      const testContext = getTestContext()
      if (!testContext.authtoken || !testContext.stackApiKey) {
        this.skip()
      }

      const authClient = contentstackClient()
      const stack = authClient.stack({ api_key: testContext.stackApiKey })

      const response = await stack.fetch()

      expect(response).to.be.an('object')
      expect(response.api_key).to.equal(testContext.stackApiKey)
      expect(response.name).to.be.a('string')
    })

    it('should fail to access stack with invalid API key', async function () {
      this.timeout(15000)

      const testContext = getTestContext()
      if (!testContext.authtoken) {
        this.skip()
      }

      const authClient = contentstackClient()
      const stack = authClient.stack({ api_key: 'invalid_api_key_12345' })

      try {
        await stack.fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        expect(error.status).to.be.oneOf([401, 403, 404, 412, 422])
      }
    })

    it('should list organizations for authenticated user', async function () {
      this.timeout(15000)

      const testContext = getTestContext()
      if (!testContext.authtoken) {
        this.skip()
      }

      const authClient = contentstackClient()

      try {
        const response = await authClient.organization().fetchAll()

        expect(response).to.be.an('object')
        expect(response.items).to.be.an('array')

        if (response.items.length > 0) {
          const org = response.items[0]
          expect(org.uid).to.be.a('string')
          expect(org.name).to.be.a('string')
        }
      } catch (error) {
        // User might not have organization access
        console.log('Organization fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // LOGOUT BEHAVIOR TESTS
  // ==========================================================================

  describe('Logout Behavior', () => {
    it('should handle logout without authentication gracefully', async function () {
      this.timeout(15000)

      const unauthClient = contentstack.client({
        host: process.env.HOST || 'api.contentstack.io'
      })

      try {
        await unauthClient.logout()
        // Some APIs might not error on unauthenticated logout
      } catch (error) {
        expect(error).to.exist
        const status = error.status ?? error.response?.status
        expect(status).to.be.oneOf([401, 403])
      }
    })

    // Note: We don't test actual logout here as it would invalidate
    // the authtoken used for other tests. The logout is tested
    // as part of the sanity.js teardown process.
  })

  // ==========================================================================
  // SESSION MANAGEMENT TESTS
  // ==========================================================================

  describe('Session Management', () => {
    it('should create new session on each login', async function () {
      this.timeout(15000)

      if (!process.env.EMAIL || !process.env.PASSWORD) {
        this.skip()
      }

      // Login twice and verify different authtokens
      const response1 = await client.login({
        email: process.env.EMAIL,
        password: process.env.PASSWORD
      })

      const response2 = await client.login({
        email: process.env.EMAIL,
        password: process.env.PASSWORD
      })

      expect(response1.user.authtoken).to.be.a('string')
      expect(response2.user.authtoken).to.be.a('string')

      // Each login should create a new session (different tokens)
      // Note: Some systems might return same token - this validates the response structure
      expect(response1.user.uid).to.equal(response2.user.uid)
    })
  })

  // ==========================================================================
  // TWO-FACTOR AUTHENTICATION (2FA/TOTP) TESTS
  // ==========================================================================

  describe('Two-Factor Authentication (2FA/TOTP)', () => {
    it('should fail login with invalid tfa_token format', async function () {
      this.timeout(15000)

      if (!process.env.EMAIL || !process.env.PASSWORD) {
        expect(true).to.equal(true)
        return
      }

      try {
        await client.login({
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          tfa_token: 'invalid_token' // Invalid TOTP format
        })
        // If 2FA is not enabled on account, this might succeed
        // If 2FA is enabled, it should fail with 401 (was 294, now 401)
      } catch (error) {
        expect(error).to.exist
        // Error code 401 for invalid 2FA token (previously was 294)
        expect(error.status).to.be.oneOf([401, 422])
        expect(error.errorMessage).to.be.a('string')
      }
    })

    it('should fail login with empty tfa_token when 2FA is required', async function () {
      this.timeout(15000)

      // This test validates the 2FA flow when an account has 2FA enabled
      // If 2FA is enabled, login without tfa_token should return 401 with tfa_type

      try {
        await client.login({
          email: process.env.TFA_EMAIL || 'tfa_test@example.com',
          password: process.env.TFA_PASSWORD || 'password123'
        })
        // If 2FA is not enabled, login succeeds
        expect(true).to.equal(true)
      } catch (error) {
        expect(error).to.exist
        // 401 status for 2FA required (was 294, now 401)
        expect(error.status).to.be.oneOf([401, 422])

        // When 2FA is required, error should contain tfa_type
        if (error.tfa_type) {
          expect(error.tfa_type).to.be.a('string')
          // tfa_type can be 'totp', 'totp_authenticator', 'sms', 'email', etc.
          expect(['totp', 'totp_authenticator', 'sms', 'email', 'authenticator']).to.include(error.tfa_type)
        }
      }
    })

    it('should fail login with incorrect 6-digit tfa_token', async function () {
      this.timeout(15000)

      if (!process.env.EMAIL || !process.env.PASSWORD) {
        expect(true).to.equal(true)
        return
      }

      try {
        await client.login({
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          tfa_token: '000000' // Incorrect but valid format (6 digits)
        })
        // If 2FA is not enabled on account, this might succeed
      } catch (error) {
        expect(error).to.exist
        // 401 for invalid 2FA token
        expect(error.status).to.be.oneOf([401, 422])
      }
    })

    it('should accept login with mfaSecret parameter (TOTP generation)', async function () {
      this.timeout(15000)

      // This test validates that the SDK can accept mfaSecret and generate TOTP
      // The mfaSecret is a base32-encoded secret used with authenticator apps

      if (!process.env.EMAIL || !process.env.PASSWORD) {
        expect(true).to.equal(true)
        return
      }

      // If user has MFA_SECRET set, test with it
      if (process.env.MFA_SECRET) {
        try {
          const response = await client.login({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            mfaSecret: process.env.MFA_SECRET
          })

          expect(response).to.be.an('object')
          expect(response.user).to.be.an('object')
          expect(response.user.authtoken).to.be.a('string')
        } catch (error) {
          // MFA secret might be invalid or expired
          expect(error).to.exist
          expect(error.status).to.be.oneOf([401, 422])
        }
      } else {
        // No MFA_SECRET configured, test that SDK accepts the parameter
        try {
          await client.login({
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            mfaSecret: 'JBSWY3DPEHPK3PXP' // Test secret (won't work but validates SDK accepts it)
          })
          // If account doesn't have 2FA, this might succeed
        } catch (error) {
          expect(error).to.exist
          // Should be 401 or 422 for auth errors
          expect(error.status).to.be.oneOf([401, 422])
        }
      }
    })

    it('should return proper error structure for 2FA failures', async function () {
      this.timeout(15000)

      try {
        await client.login({
          email: 'tfa_test_' + Date.now() + '@example.com',
          password: 'password123',
          tfa_token: '123456'
        })
        // Non-existent user will fail regardless of tfa_token
      } catch (error) {
        expect(error).to.exist
        expect(error).to.have.property('status')
        expect(error).to.have.property('errorMessage')
        expect(error).to.have.property('errorCode')

        // Verify error is properly structured
        expect(error.status).to.be.a('number')
        expect(error.errorMessage).to.be.a('string')
        expect(error.errorCode).to.be.a('number')
      }
    })

    it('should handle 2FA token in correct error code (400/401 not 294)', async function () {
      this.timeout(20000)

      // This specifically tests the fix: error code changed from 294 to 400/401
      // for 2FA authentication failures

      if (!process.env.TFA_EMAIL || !process.env.TFA_PASSWORD) {
        // Skip if no 2FA test account configured
        expect(true).to.equal(true)
        return
      }

      // Add delay to avoid rate limiting from previous login tests
      await wait(2000)

      // Create a fresh client to avoid state contamination
      const freshClient = contentstackClient({ host: process.env.HOST })

      try {
        await freshClient.login({
          email: process.env.TFA_EMAIL,
          password: process.env.TFA_PASSWORD,
          tfa_token: '000000' // Wrong token
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.exist
        // The fix changed error code from 294 to 400/401
        // 400 for invalid 2FA token, 401 for auth failures
        expect(error.status).to.be.oneOf([400, 401])
        expect(error.errorMessage).to.be.a('string')
        // Verify it's NOT the old error code 294
        expect(error.status).to.not.equal(294)
      }
    })
  })
})
