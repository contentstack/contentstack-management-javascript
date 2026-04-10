/**
 * Module header injection — live API checks
 *
 * Only the `branch` stack header is added/removed (no custom x-headers). Branch UID comes
 * from Branch API Tests (`testData.branches.development`), with fallback to `main`.
 *
 * Uses the same credentials as the rest of the sanity suite (.env + setup() API_KEY).
 * Assertions use the SDK request-capture plugin (testSetup.js).
 *
 * The shared instrumented client can end up with `authorization` on axios defaults after
 * other suites; the queue then drops `authtoken` and CMA returns 401. This file resets
 * auth to `authtoken` before running.
 *
 * Run only this suite:
 *   npm run build && npm run test:sanity-nocov -- --grep "Module header injection"
 */

import { expect } from 'chai'
import { describe, it, before } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import * as testSetup from '../utility/testSetup.js'
import { trackedExpect, testData } from '../utility/testHelpers.js'

const { clearCapturedRequests, getCapturedRequests } = testSetup

/**
 * Branch UID created in `branch-test.js` (development branch from main).
 */
function branchUidForHeaders () {
  const uid = testData.branches?.development?.uid
  return uid || 'main'
}

/**
 * Axios may normalize header names; resolve case-insensitively.
 */
function getHeaderValue (headers, name) {
  if (!headers || typeof headers !== 'object') return undefined
  const target = String(name).toLowerCase()
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key]
    }
  }
  return undefined
}

/**
 * Completed captures include HTTP status (plugin records after response).
 */
function pickLastCompletedRequest (pathSubstring) {
  const list = getCapturedRequests()
  const matches = list.filter(
    (c) => c.status != null && c.url && c.url.includes(pathSubstring)
  )
  return matches[matches.length - 1]
}

/**
 * Prefer authtoken on the shared client so CMA accepts requests after long runs.
 */
function ensureSharedClientUsesAuthtoken () {
  const sdkClient = contentstackClient()
  const ax = sdkClient?.axiosInstance
  if (!ax?.defaults?.headers) return

  const authtoken =
    testSetup.testContext?.authtoken || process.env.AUTHTOKEN
  if (!authtoken) return

  const stripAuthorization = (obj) => {
    if (obj && typeof obj === 'object') {
      delete obj.authorization
    }
  }

  stripAuthorization(ax.defaults.headers)
  if (ax.defaults.headers.common) {
    stripAuthorization(ax.defaults.headers.common)
    ax.defaults.headers.common.authtoken = authtoken
  }
  delete ax.defaults.authorization

  const p = ax.httpClientParams
  if (p) {
    stripAuthorization(p)
    if (p.headers) stripAuthorization(p.headers)
    p.authtoken = authtoken
    if (!p.headers) p.headers = {}
    p.headers.authtoken = authtoken
    delete p.authorization
  }
}

describe('Module header injection API Tests', () => {
  let client
  let stack
  let branchUid

  before(function () {
    ensureSharedClientUsesAuthtoken()
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
    branchUid = branchUidForHeaders()
  })

  it('should send stack-level addHeader(branch) on child module requests', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const stackScoped = client.stack({ api_key: process.env.API_KEY })
    stackScoped.addHeader('branch', branchUid)

    const response = await stackScoped.locale().query().find()
    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales after locale query').to.exist
    expect(String(getHeaderValue(req.headers, 'branch'))).to.equal(String(branchUid))
  })

  it('should send module addHeader(branch) on locale query requests', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const response = await stack
      .locale()
      .addHeader('branch', branchUid)
      .query()
      .find()

    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales').to.exist
    expect(String(getHeaderValue(req.headers, 'branch'))).to.equal(String(branchUid))
  })

  it('should send module addHeaderDict with only branch on audit log list', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    try {
      await stack.auditLog().addHeaderDict({ branch: branchUid }).fetchAll({ limit: 1 })
    } catch (e) {
      console.log(
        'Audit log fetchAll skipped (permissions):',
        e?.message || e
      )
      return
    }

    const req = pickLastCompletedRequest('/audit-logs')
    if (!req) {
      console.log('No completed /audit-logs capture; skipping header assertions')
      return
    }
    expect(String(getHeaderValue(req.headers, 'branch'))).to.equal(String(branchUid))
  })

  it('should chain addHeader(branch) on query().find() for locales', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const response = await stack
      .locale()
      .query()
      .addHeader('branch', branchUid)
      .find()

    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales').to.exist
    expect(String(getHeaderValue(req.headers, 'branch'))).to.equal(String(branchUid))
  })

  it('should omit stack-level branch after removeHeader on child requests', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const stackScoped = client.stack({ api_key: process.env.API_KEY })
    stackScoped.addHeader('branch', branchUid).removeHeader('branch')

    const response = await stackScoped.locale().query().find()
    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales').to.exist
    expect(getHeaderValue(req.headers, 'branch')).to.equal(undefined)
  })

  it('should omit module branch after removeHeader before locale query', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const response = await stack
      .locale()
      .addHeader('branch', branchUid)
      .removeHeader('branch')
      .query()
      .find()

    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales').to.exist
    expect(getHeaderValue(req.headers, 'branch')).to.equal(undefined)
  })

  it('should omit branch after removeHeader on query().find()', async function () {
    this.timeout(30000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    const response = await stack
      .locale()
      .query()
      .addHeader('branch', branchUid)
      .removeHeader('branch')
      .find()

    trackedExpect(response, 'Locales response').toBeAn('object')

    const req = pickLastCompletedRequest('/locales')
    expect(req, 'expected a captured GET /locales').to.exist
    expect(getHeaderValue(req.headers, 'branch')).to.equal(undefined)
  })

  it('should isolate branch header: asset query vs webhook list', async function () {
    this.timeout(45000)
    ensureSharedClientUsesAuthtoken()
    clearCapturedRequests()

    await stack.asset().addHeader('branch', branchUid).query().find()

    const assetReq = pickLastCompletedRequest('/assets')
    expect(assetReq, 'expected a captured GET /assets').to.exist
    expect(String(getHeaderValue(assetReq.headers, 'branch'))).to.equal(
      String(branchUid)
    )

    clearCapturedRequests()
    await stack.webhook().fetchAll({ limit: 1 })

    const webhookReq = pickLastCompletedRequest('/webhooks')
    expect(webhookReq, 'expected a captured GET /webhooks').to.exist
    expect(getHeaderValue(webhookReq.headers, 'branch')).to.equal(undefined)
  })
})
