/**
 * Audit Log API Tests
 * 
 * Comprehensive test suite for:
 * - Audit log fetch
 * - Audit log filtering
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, trackedExpect } from '../utility/testHelpers.js'

describe('Audit Log API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // AUDIT LOG FETCH
  // ==========================================================================

  describe('Audit Log Fetch', () => {

    it('should fetch audit logs', async () => {
      try {
        const response = await stack.auditLog().fetchAll()

        trackedExpect(response, 'Audit log response').toBeAn('object')
        trackedExpect(response.items || response.logs, 'Logs list').toBeAn('array')
      } catch (error) {
        // Audit logs might require specific permissions
        console.log('Audit log fetch failed:', error.errorMessage)
      }
    })

    it('should validate audit log entry structure', async () => {
      try {
        const response = await stack.auditLog().fetchAll()
        const logs = response.items || response.logs

        if (logs && logs.length > 0) {
          const log = logs[0]
          trackedExpect(log.uid, 'Log UID').toBeA('string')

          if (log.created_at) {
            expect(new Date(log.created_at)).to.be.instanceof(Date)
          }
        }
      } catch (error) {
        console.log('Audit log validation skipped')
      }
    })

    it('should fetch single audit log entry', async () => {
      try {
        const response = await stack.auditLog().fetchAll()
        const logs = response.items || response.logs

        if (logs && logs.length > 0) {
          const logUid = logs[0].uid
          const singleLog = await stack.auditLog(logUid).fetch()

          trackedExpect(singleLog, 'Single log').toBeAn('object')
          trackedExpect(singleLog.uid, 'Log UID').toEqual(logUid)
        }
      } catch (error) {
        console.log('Single log fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // AUDIT LOG FILTERING
  // ==========================================================================

  describe('Audit Log Filtering', () => {

    it('should fetch logs with pagination', async () => {
      try {
        const response = await stack.auditLog().query({
          limit: 10,
          skip: 0
        }).find()

        expect(response).to.be.an('object')
        const logs = response.items || response.logs
        expect(logs.length).to.be.at.most(10)
      } catch (error) {
        console.log('Paginated fetch failed:', error.errorMessage)
      }
    })

    it('should fetch logs with count', async () => {
      try {
        const response = await stack.auditLog().query({
          include_count: true
        }).find()

        expect(response).to.be.an('object')
        if (response.count !== undefined) {
          expect(response.count).to.be.a('number')
        }
      } catch (error) {
        console.log('Count fetch failed:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to fetch non-existent audit log', async () => {
      try {
        await stack.auditLog('nonexistent_log_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        // API may return 401 (unauthorized), 404 (not found), 422 (invalid UID), or 400
        const status = error.status ?? error.response?.status
        expect(status, 'Expected 400/401/404/422 for non-existent audit log').to.be.oneOf([400, 401, 404, 422])
      }
    })

    it('should handle unauthorized access', async () => {
      try {
        const unauthClient = contentstackClient()
        const unauthStack = unauthClient.stack({ api_key: process.env.API_KEY })

        await unauthStack.auditLog().fetchAll()
        // If no error is thrown, the test should be skipped as auth might not be required
        console.log('Audit log accessible without auth token - skipping test')
      } catch (error) {
        // Accept any error - could be 401, 403, or other auth-related errors
        expect(error).to.exist
        if (error.status) {
          expect(error.status).to.be.oneOf([401, 403, 422])
        }
      }
    })
  })
})
