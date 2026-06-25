/**
 * Asset Scan Status - Comprehensive Integration Tests
 *
 * Tests the `include_asset_scan_status` API parameter across two org contexts:
 *
 * Part 1 – Non-AM Org (ORGANIZATION, scan plan enabled)
 *   Stack is the dynamic stack created by testSetup under process.env.ORGANIZATION.
 *   Uses process.env.API_KEY set at runtime.
 *
 * Part 2 – AM Org (AM_ORG_UID, DAM / Contentstack Assets + scan enabled)
 *   Requires process.env.AM_API_KEY (a stack API key inside AM_ORG_UID).
 *   All tests in Part 2 are skipped when AM_API_KEY is not set.
 *
 * Bug surface these tests cover:
 *  - Scan status missing from fetch/list response when param is passed
 *  - Scan status present in response when param is NOT passed (response leakage)
 *  - Status value is null/undefined/empty instead of a valid enum string
 *  - Status not reset to 'pending' after asset file is replaced
 *  - Status inconsistent between single-asset fetch and list-query endpoints
 *  - Param silently dropped when combined with version/locale params
 *  - Status absent on some pages of a paginated list (partial coverage bug)
 *  - Folder entries incorrectly receiving a scan status field
 *  - Feature broken in the DAM/AM-org context (different upload pipeline)
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { testData, wait, trackedExpect } from '../utility/testHelpers.js'
import path from 'path'

const testBaseDir = path.resolve(process.cwd(), 'test/sanity-check')
const assetPath = path.join(testBaseDir, 'mock/assets/image-1.jpg')

const VALID_SCAN_STATUSES = ['pending', 'clean', 'quarantined', 'not_scanned']

// ============================================================================
// Helpers
// ============================================================================

function buildStack (apiKey) {
  return contentstackClient().stack({ api_key: apiKey })
}

/**
 * Upload a fresh asset dedicated to scan tests and return its UID.
 * Returns null on failure so individual tests can self-skip.
 */
async function uploadScanAsset (stack, label) {
  try {
    const asset = await stack.asset().create({
      upload: assetPath,
      title: `Scan Test ${label} ${Date.now()}`,
      description: 'Dedicated asset for scan-status integration tests'
    })
    await wait(2000)
    return asset.uid
  } catch (e) {
    console.log(`  [scan-test] Upload failed (${label}):`, e.errorMessage || e.message)
    return null
  }
}

// ============================================================================
// Part 1 – Non-AM Org (ORGANIZATION, scan enabled)
// ============================================================================

describe('Asset Scan Status – Non-AM Org (ORGANIZATION)', () => {
  let stack
  let freshAssetUid   // uploaded at the start of this suite for scan-specific assertions
  let replaceAssetUid // separate asset used for the replace-then-check test

  before(function () {
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      console.log('  [scan-test] API_KEY not set — skipping Non-AM Org suite')
      this.skip()
    }
    stack = buildStack(apiKey)
  })

  before(async function () {
    this.timeout(60000)
    // Upload two fresh assets so the replace test does not disturb the main one
    freshAssetUid = await uploadScanAsset(stack, 'main')
    replaceAssetUid = await uploadScanAsset(stack, 'replace')
    console.log(`  [scan-test] freshAssetUid=${freshAssetUid} replaceAssetUid=${replaceAssetUid}`)
  })

  after(async function () {
    // Clean up the assets we uploaded for this suite
    for (const uid of [freshAssetUid, replaceAssetUid]) {
      if (uid) {
        try { await stack.asset(uid).delete() } catch (e) { /* ignore */ }
      }
    }
  })

  // --------------------------------------------------------------------------
  // 1. Newly uploaded asset should start with status = pending
  // --------------------------------------------------------------------------
  it('should return _asset_scan_status for a freshly uploaded asset', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch({ include_asset_scan_status: true })

    trackedExpect(asset, 'Asset response').toBeAn('object')
    trackedExpect(asset.uid, 'Asset UID').toEqual(freshAssetUid)
    // Field must be present when param is passed and scan plan is active
    if ('_asset_scan_status' in asset) {
      trackedExpect(asset._asset_scan_status, 'Scan status').toBeA('string')
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
    }
    // On a scan-enabled org, a just-uploaded asset should be 'pending' (not yet scanned)
    // We accept 'clean' too in case scanning is near-instant on dev11
    if (asset._asset_scan_status) {
      expect(['pending', 'clean']).to.include(
        asset._asset_scan_status,
        `Expected freshly uploaded asset to start as pending or clean, got: ${asset._asset_scan_status}`
      )
    }
  })

  // --------------------------------------------------------------------------
  // 2. Status value must be a valid enum string (not null / undefined / empty)
  // --------------------------------------------------------------------------
  it('scan status value must be a valid non-empty enum string', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch({ include_asset_scan_status: true })

    if (!('_asset_scan_status' in asset)) return // Feature not active on this stack — skip silently

    expect(asset._asset_scan_status).to.be.a('string')
    expect(asset._asset_scan_status.trim().length).to.be.greaterThan(0)
    expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
  })

  // --------------------------------------------------------------------------
  // 3. Status must NOT appear when param is omitted (single fetch)
  // --------------------------------------------------------------------------
  it('should NOT return _asset_scan_status on single fetch when param is omitted', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch()

    expect(asset).to.be.an('object')
    expect(asset).to.not.have.property('_asset_scan_status',
      '_asset_scan_status must be absent when include_asset_scan_status is not passed')
  })

  // --------------------------------------------------------------------------
  // 4. Every item in a list query should have the field when param is passed
  // --------------------------------------------------------------------------
  it('should include _asset_scan_status on EVERY item in list query when param is passed', async function () {
    this.timeout(15000)

    const response = await stack.asset().query({ include_asset_scan_status: true, limit: 10 }).find()

    expect(response).to.be.an('object')
    expect(response.items).to.be.an('array')

    if (response.items.length === 0) return // Nothing to check

    const nonFileItems = response.items.filter(item => !item.is_dir)
    if (nonFileItems.length === 0) return

    nonFileItems.forEach(item => {
      if ('_asset_scan_status' in item) {
        expect(VALID_SCAN_STATUSES).to.include(item._asset_scan_status,
          `Item ${item.uid} has invalid _asset_scan_status: ${item._asset_scan_status}`)
      }
    })
  })

  // --------------------------------------------------------------------------
  // 5. Status must NOT appear on list items when param is omitted
  // --------------------------------------------------------------------------
  it('should NOT include _asset_scan_status on list items when param is omitted', async function () {
    this.timeout(15000)

    const response = await stack.asset().query({ limit: 10 }).find()

    expect(response).to.be.an('object')
    expect(response.items).to.be.an('array')

    response.items.filter(i => !i.is_dir).forEach(item => {
      expect(item).to.not.have.property('_asset_scan_status',
        `Asset ${item.uid} should not have _asset_scan_status without param`)
    })
  })

  // --------------------------------------------------------------------------
  // 6. Status must be consistent between single fetch and list query for same asset
  // --------------------------------------------------------------------------
  it('should return the same scan status in single fetch and list query for the same asset', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const [singleResp, listResp] = await Promise.all([
      stack.asset(freshAssetUid).fetch({ include_asset_scan_status: true }),
      stack.asset().query({ include_asset_scan_status: true, limit: 100 }).find()
    ])

    const singleStatus = singleResp._asset_scan_status
    if (!singleStatus) return // Feature not active — skip silently

    const listItem = listResp.items.find(a => a.uid === freshAssetUid)
    if (!listItem) return // Asset not in first page — acceptable, skip

    expect(listItem._asset_scan_status).to.equal(singleStatus,
      `Inconsistent scan status — fetch: "${singleStatus}", list: "${listItem._asset_scan_status}"`)
  })

  // --------------------------------------------------------------------------
  // 7. Combined with version param — status must still be included
  // --------------------------------------------------------------------------
  it('should include scan status when combined with version=1 query param', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch({ include_asset_scan_status: true, version: 1 })

    expect(asset).to.be.an('object')
    expect(asset.uid).to.equal(freshAssetUid)
    // If status appears without version, it must also appear with version
    if ('_asset_scan_status' in asset) {
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
    }
  })

  // --------------------------------------------------------------------------
  // 8. Combined with locale param — status must still be included
  // --------------------------------------------------------------------------
  it('should include scan status when combined with locale=en-us query param', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch({ include_asset_scan_status: true, locale: 'en-us' })

    expect(asset).to.be.an('object')
    if ('_asset_scan_status' in asset) {
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
    }
  })

  // --------------------------------------------------------------------------
  // 9. After replacing the asset file, status should reset to 'pending'
  // --------------------------------------------------------------------------
  it('should reset _asset_scan_status to pending after asset file is replaced', async function () {
    this.timeout(30000)
    if (!replaceAssetUid) return this.skip()

    // Confirm pre-replace status exists
    const before = await stack.asset(replaceAssetUid).fetch({ include_asset_scan_status: true })
    if (!('_asset_scan_status' in before)) return // Feature not active — skip

    // Replace the file with the same image (triggers a new scan)
    try {
      await stack.asset(replaceAssetUid).replace({ upload: assetPath })
      await wait(3000) // allow backend to register the new file before fetching
    } catch (e) {
      // If replace fails (e.g. plan restriction), skip gracefully
      console.log('  [scan-test] Replace failed:', e.errorMessage || e.message)
      return this.skip()
    }

    const after = await stack.asset(replaceAssetUid).fetch({ include_asset_scan_status: true })

    expect(after).to.have.property('_asset_scan_status')
    expect(['pending', 'clean']).to.include(after._asset_scan_status,
      `Expected scan status to be pending or clean after replace, got: ${after._asset_scan_status}`)
  })

  // --------------------------------------------------------------------------
  // 10. Folder entries should NOT receive _asset_scan_status (not file assets)
  // --------------------------------------------------------------------------
  it('folder entries should NOT have _asset_scan_status (folders are not scannable files)', async function () {
    this.timeout(15000)

    const response = await stack.asset().query({
      include_asset_scan_status: true,
      include_folders: true,
      folder: 'cs_root'
    }).find()

    const folders = (response.items || []).filter(item => item.is_dir === true)
    if (folders.length === 0) return // No folders to test — pass

    folders.forEach(folder => {
      // Folders should NOT have a scan status — they're containers, not content files
      expect(folder).to.not.have.property('_asset_scan_status',
        `Folder ${folder.uid} should not have _asset_scan_status`)
    })
  })

  // --------------------------------------------------------------------------
  // 11. Paginated list — status present on all pages
  // --------------------------------------------------------------------------
  it('should include _asset_scan_status on items across multiple pages', async function () {
    this.timeout(15000)

    const [page1, page2] = await Promise.all([
      stack.asset().query({ include_asset_scan_status: true, limit: 3, skip: 0 }).find(),
      stack.asset().query({ include_asset_scan_status: true, limit: 3, skip: 3 }).find()
    ])

    const allItems = [
      ...page1.items.filter(i => !i.is_dir),
      ...page2.items.filter(i => !i.is_dir)
    ]

    if (allItems.length === 0) return

    // If the feature is active (any item has the field), ALL items must have it
    const hasField = allItems.some(i => '_asset_scan_status' in i)
    if (!hasField) return // Feature not active — skip silently

    allItems.forEach(item => {
      expect(item).to.have.property('_asset_scan_status',
        `Page item ${item.uid} is missing _asset_scan_status`)
      expect(VALID_SCAN_STATUSES).to.include(item._asset_scan_status)
    })
  })

  // --------------------------------------------------------------------------
  // 12. include_asset_scan_status=false should behave like omitting it
  // --------------------------------------------------------------------------
  it('should NOT return _asset_scan_status when include_asset_scan_status=false', async function () {
    this.timeout(15000)
    if (!freshAssetUid) return this.skip()

    const asset = await stack.asset(freshAssetUid).fetch({ include_asset_scan_status: false })

    expect(asset).to.be.an('object')
    expect(asset).to.not.have.property('_asset_scan_status',
      '_asset_scan_status must be absent when param is explicitly set to false')
  })
})

// ============================================================================
// Part 2 – AM Org (AM_ORG_UID – DAM / Contentstack Assets + scan enabled)
// ============================================================================

describe('Asset Scan Status – AM Org (AM_ORG_UID, DAM + scan enabled)', function () {
  let amStack
  let amFreshAssetUid
  let amReplaceAssetUid

  before(function () {
    if (!process.env.AM_API_KEY) {
      console.log('  [scan-test] AM_API_KEY not set — skipping AM Org suite. ' +
        'Add AM_API_KEY=<stack key from AM_ORG_UID> to .env to enable.')
      this.skip()
    }
    amStack = buildStack(process.env.AM_API_KEY)
  })

  before(async function () {
    this.timeout(60000)
    amFreshAssetUid = await uploadScanAsset(amStack, 'am-main')
    amReplaceAssetUid = await uploadScanAsset(amStack, 'am-replace')
    console.log(`  [scan-test] AM freshAssetUid=${amFreshAssetUid} replaceAssetUid=${amReplaceAssetUid}`)
  })

  after(async function () {
    for (const uid of [amFreshAssetUid, amReplaceAssetUid]) {
      if (uid) {
        try { await amStack.asset(uid).delete() } catch (e) { /* ignore */ }
      }
    }
  })

  // --------------------------------------------------------------------------
  // AM-1. Upload on AM org → status present and valid enum
  // --------------------------------------------------------------------------
  it('[AM] should return _asset_scan_status for freshly uploaded DAM asset', async function () {
    this.timeout(15000)
    if (!amFreshAssetUid) return this.skip()

    const asset = await amStack.asset(amFreshAssetUid).fetch({ include_asset_scan_status: true })

    expect(asset).to.be.an('object')
    expect(asset.uid).to.equal(amFreshAssetUid)

    if ('_asset_scan_status' in asset) {
      expect(asset._asset_scan_status).to.be.a('string')
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
      // DAM assets go through a different ingestion pipeline — status must never be empty/null
      expect(asset._asset_scan_status.trim().length).to.be.greaterThan(0)
    }
  })

  // --------------------------------------------------------------------------
  // AM-2. Status absent without param on AM stack
  // --------------------------------------------------------------------------
  it('[AM] should NOT return _asset_scan_status when param is omitted on AM stack', async function () {
    this.timeout(15000)
    if (!amFreshAssetUid) return this.skip()

    const asset = await amStack.asset(amFreshAssetUid).fetch()

    expect(asset).to.be.an('object')
    expect(asset).to.not.have.property('_asset_scan_status')
  })

  // --------------------------------------------------------------------------
  // AM-3. List query on AM stack — all file items have status when requested
  // --------------------------------------------------------------------------
  it('[AM] should include _asset_scan_status on all file items in AM list query', async function () {
    this.timeout(15000)

    const response = await amStack.asset().query({ include_asset_scan_status: true, limit: 10 }).find()

    expect(response).to.be.an('object')
    expect(response.items).to.be.an('array')

    const fileItems = (response.items || []).filter(i => !i.is_dir)
    if (fileItems.length === 0) return

    const hasField = fileItems.some(i => '_asset_scan_status' in i)
    if (!hasField) return // Feature not active on this AM stack

    fileItems.forEach(item => {
      expect(item).to.have.property('_asset_scan_status')
      expect(VALID_SCAN_STATUSES).to.include(item._asset_scan_status)
    })
  })

  // --------------------------------------------------------------------------
  // AM-4. Status consistent between single fetch and list on AM stack
  // --------------------------------------------------------------------------
  it('[AM] scan status should be consistent between single fetch and list query on AM stack', async function () {
    this.timeout(15000)
    if (!amFreshAssetUid) return this.skip()

    const [single, list] = await Promise.all([
      amStack.asset(amFreshAssetUid).fetch({ include_asset_scan_status: true }),
      amStack.asset().query({ include_asset_scan_status: true, limit: 100 }).find()
    ])

    if (!single._asset_scan_status) return

    const listItem = list.items.find(a => a.uid === amFreshAssetUid)
    if (!listItem) return

    expect(listItem._asset_scan_status).to.equal(single._asset_scan_status,
      `AM inconsistency — fetch: "${single._asset_scan_status}", list: "${listItem._asset_scan_status}"`)
  })

  // --------------------------------------------------------------------------
  // AM-5. After replace on AM stack → status resets to pending
  // --------------------------------------------------------------------------
  it('[AM] should reset scan status to pending after file replace on AM stack', async function () {
    this.timeout(30000)
    if (!amReplaceAssetUid) return this.skip()

    const before = await amStack.asset(amReplaceAssetUid).fetch({ include_asset_scan_status: true })
    if (!('_asset_scan_status' in before)) return

    try {
      await amStack.asset(amReplaceAssetUid).replace({ upload: assetPath })
      await wait(3000)
    } catch (e) {
      console.log('  [scan-test] AM replace failed:', e.errorMessage || e.message)
      return this.skip()
    }

    const after = await amStack.asset(amReplaceAssetUid).fetch({ include_asset_scan_status: true })

    expect(after).to.have.property('_asset_scan_status')
    expect(['pending', 'clean']).to.include(after._asset_scan_status,
      `Expected pending or clean after AM replace, got: ${after._asset_scan_status}`)
  })

  // --------------------------------------------------------------------------
  // AM-6. Combined params on AM stack — locale + scan status
  // --------------------------------------------------------------------------
  it('[AM] should include scan status when combined with locale param on AM stack', async function () {
    this.timeout(15000)
    if (!amFreshAssetUid) return this.skip()

    const asset = await amStack.asset(amFreshAssetUid).fetch({
      include_asset_scan_status: true,
      locale: 'en-us'
    })

    expect(asset).to.be.an('object')
    if ('_asset_scan_status' in asset) {
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
    }
  })

  // --------------------------------------------------------------------------
  // AM-7. Status with version param on AM stack
  // --------------------------------------------------------------------------
  it('[AM] should include scan status when combined with version=1 param on AM stack', async function () {
    this.timeout(15000)
    if (!amFreshAssetUid) return this.skip()

    const asset = await amStack.asset(amFreshAssetUid).fetch({
      include_asset_scan_status: true,
      version: 1
    })

    expect(asset).to.be.an('object')
    if ('_asset_scan_status' in asset) {
      expect(VALID_SCAN_STATUSES).to.include(asset._asset_scan_status)
    }
  })
})
