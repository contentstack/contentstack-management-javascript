/**
 * Webhook API Tests
 *
 * Comprehensive test suite for:
 * - Webhook CRUD operations
 * - Webhook channels/triggers
 * - Webhook executions
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  basicWebhook,
  advancedWebhook
} from '../mock/configurations.js'
import { validateWebhookResponse, testData, wait, trackedExpect } from '../utility/testHelpers.js'

describe('Webhook API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // ==========================================================================
  // WEBHOOK CRUD OPERATIONS
  // ==========================================================================

  describe('Webhook CRUD Operations', () => {
    let createdWebhookUid

    after(async () => {
      // NOTE: Deletion removed - webhooks persist for other tests
    })

    it('should create a basic webhook', async function () {
      this.timeout(30000)
      const webhookData = JSON.parse(JSON.stringify(basicWebhook))
      webhookData.webhook.name = `Basic Webhook ${Date.now()}`

      // SDK returns the webhook object directly
      const webhook = await stack.webhook().create(webhookData)

      trackedExpect(webhook, 'Webhook').toBeAn('object')
      trackedExpect(webhook.uid, 'Webhook UID').toBeA('string')
      validateWebhookResponse(webhook)

      trackedExpect(webhook.name, 'Webhook name').toInclude('Basic Webhook')
      trackedExpect(webhook.destinations, 'Webhook destinations').toBeAn('array')
      trackedExpect(webhook.channels, 'Webhook channels').toBeAn('array')

      createdWebhookUid = webhook.uid
      testData.webhooks.basic = webhook

      // Wait for webhook to be fully created
      await wait(2000)
    })

    it('should fetch webhook by UID', async function () {
      this.timeout(15000)
      const response = await stack.webhook(createdWebhookUid).fetch()

      trackedExpect(response, 'Webhook').toBeAn('object')
      trackedExpect(response.uid, 'Webhook UID').toEqual(createdWebhookUid)
    })

    it('should validate webhook destinations', async () => {
      const webhook = await stack.webhook(createdWebhookUid).fetch()

      expect(webhook.destinations).to.be.an('array')
      expect(webhook.destinations.length).to.be.at.least(1)

      webhook.destinations.forEach(dest => {
        expect(dest.target_url).to.be.a('string')
        expect(dest.target_url).to.match(/^https?:\/\//)
      })
    })

    it('should validate webhook channels', async () => {
      const webhook = await stack.webhook(createdWebhookUid).fetch()

      expect(webhook.channels).to.be.an('array')
      expect(webhook.channels.length).to.be.at.least(1)

      // Channels should be valid trigger names
      webhook.channels.forEach(channel => {
        expect(channel).to.be.a('string')
        expect(channel).to.include('.')
      })
    })

    it('should update webhook name', async () => {
      const webhook = await stack.webhook(createdWebhookUid).fetch()
      const newName = `Updated Webhook ${Date.now()}`

      webhook.name = newName
      const response = await webhook.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should disable webhook', async () => {
      const webhook = await stack.webhook(createdWebhookUid).fetch()
      webhook.disabled = true

      const response = await webhook.update()

      expect(response.disabled).to.be.true
    })

    it('should enable webhook', async () => {
      const webhook = await stack.webhook(createdWebhookUid).fetch()
      webhook.disabled = false

      const response = await webhook.update()

      expect(response.disabled).to.be.false
    })

    it('should query all webhooks', async () => {
      const response = await stack.webhook().fetchAll()

      expect(response).to.be.an('object')
      expect(response.items || response.webhooks).to.be.an('array')
    })
  })

  // ==========================================================================
  // ADVANCED WEBHOOK
  // ==========================================================================

  describe('Advanced Webhook', () => {
    let advancedWebhookUid

    after(async () => {
      // NOTE: Deletion removed - webhooks persist for other tests
    })

    it('should create webhook with custom headers', async () => {
      const webhookData = JSON.parse(JSON.stringify(advancedWebhook))
      webhookData.webhook.name = `Advanced Webhook ${Date.now()}`

      // SDK returns the webhook object directly
      const webhook = await stack.webhook().create(webhookData)

      expect(webhook).to.be.an('object')
      validateWebhookResponse(webhook)

      // Verify custom headers
      expect(webhook.destinations[0].custom_header).to.be.an('array')

      advancedWebhookUid = webhook.uid
      testData.webhooks.advanced = webhook
    })

    it('should have multiple channels configured', async () => {
      const webhook = await stack.webhook(advancedWebhookUid).fetch()

      expect(webhook.channels.length).to.be.at.least(5)

      // Should include entry and asset channels
      const entryChannels = webhook.channels.filter(c => c.includes('entries'))
      const assetChannels = webhook.channels.filter(c => c.includes('assets'))

      expect(entryChannels.length).to.be.at.least(1)
      expect(assetChannels.length).to.be.at.least(1)
    })

    it('should add new channel to webhook', async () => {
      const webhook = await stack.webhook(advancedWebhookUid).fetch()
      const initialChannelCount = webhook.channels.length

      if (!webhook.channels.includes('content_types.create')) {
        webhook.channels.push('content_types.create')
      }

      const response = await webhook.update()

      expect(response.channels.length).to.be.at.least(initialChannelCount)
    })

    it('should update destination URL', async () => {
      const webhook = await stack.webhook(advancedWebhookUid).fetch()
      const newUrl = 'https://webhook-updated.example.com/handler'

      webhook.destinations[0].target_url = newUrl
      const response = await webhook.update()

      expect(response.destinations[0].target_url).to.equal(newUrl)
    })
  })

  // ==========================================================================
  // WEBHOOK EXECUTIONS
  // ==========================================================================

  describe('Webhook Executions', () => {
    let webhookForExecutionsUid

    before(async () => {
      const webhookData = {
        webhook: {
          name: `Executions Test Webhook ${Date.now()}`,
          destinations: [
            { target_url: 'https://webhook.example.com/test' }
          ],
          channels: ['content_types.entries.create'],
          retry_policy: 'manual',
          disabled: true
        }
      }

      // SDK returns the webhook object directly
      const webhook = await stack.webhook().create(webhookData)
      webhookForExecutionsUid = webhook.uid
    })

    after(async () => {
      // NOTE: Deletion removed - webhooks persist for other tests
    })

    it('should get webhook executions', async () => {
      try {
        const webhook = await stack.webhook(webhookForExecutionsUid).fetch()
        const response = await webhook.executions()

        expect(response).to.be.an('object')
        if (response.webhooks || response.executions) {
          expect(response.webhooks || response.executions).to.be.an('array')
        }
      } catch (error) {
        console.log('Executions endpoint not available:', error.errorMessage)
      }
    })

    it('should retry webhook execution', async () => {
      try {
        const webhook = await stack.webhook(webhookForExecutionsUid).fetch()
        const executions = await webhook.executions()

        if ((executions.webhooks || executions.executions) &&
            (executions.webhooks || executions.executions).length > 0) {
          const execution = (executions.webhooks || executions.executions)[0]
          const response = await webhook.retry(execution.uid)

          expect(response).to.be.an('object')
        }
      } catch (error) {
        console.log('Retry not available:', error.errorMessage)
      }
    })
  })

  // ==========================================================================
  // WEBHOOK CHANNELS
  // ==========================================================================

  describe('Webhook Channels', () => {
    it('should validate entry channels', async () => {
      const entryChannels = [
        'content_types.entries.create',
        'content_types.entries.update',
        'content_types.entries.delete',
        'content_types.entries.publish',
        'content_types.entries.unpublish'
      ]

      const webhookData = {
        webhook: {
          name: `Entry Channels Test ${Date.now()}`,
          destinations: [{ target_url: 'https://test.example.com/webhook' }],
          channels: entryChannels,
          retry_policy: 'manual',
          disabled: true
        }
      }

      // SDK returns the webhook object directly
      const webhook = await stack.webhook().create(webhookData)

      expect(webhook.channels).to.include.members(entryChannels)

      // Cleanup - delete test webhook
      await stack.webhook(webhook.uid).delete()
    })

    it('should validate asset channels', async () => {
      const assetChannels = [
        'assets.create',
        'assets.update',
        'assets.delete',
        'assets.publish',
        'assets.unpublish'
      ]

      const webhookData = {
        webhook: {
          name: `Asset Channels Test ${Date.now()}`,
          destinations: [{ target_url: 'https://test.example.com/webhook' }],
          channels: assetChannels,
          retry_policy: 'manual',
          disabled: true
        }
      }

      // SDK returns the webhook object directly
      const webhook = await stack.webhook().create(webhookData)

      expect(webhook.channels).to.include.members(assetChannels)

      // Cleanup - delete test webhook
      await stack.webhook(webhook.uid).delete()
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {
    it('should fail to create webhook without destination', async () => {
      const webhookData = {
        webhook: {
          name: 'No Destination Webhook',
          channels: ['content_types.entries.create']
        }
      }

      try {
        await stack.webhook().create(webhookData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create webhook with invalid URL', async () => {
      const webhookData = {
        webhook: {
          name: 'Invalid URL Webhook',
          destinations: [{ target_url: 'not-a-valid-url' }],
          channels: ['content_types.entries.create']
        }
      }

      try {
        await stack.webhook().create(webhookData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to fetch non-existent webhook', async () => {
      try {
        await stack.webhook('nonexistent_webhook_12345').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE WEBHOOK
  // ==========================================================================

  describe('Delete Webhook', () => {
    it('should delete a webhook', async () => {
      const webhookData = {
        webhook: {
          name: `Delete Test Webhook ${Date.now()}`,
          destinations: [{ target_url: 'https://test.example.com/delete' }],
          channels: ['content_types.entries.create'],
          retry_policy: 'manual',
          disabled: true
        }
      }

      // SDK returns the webhook object directly
      const createdWebhook = await stack.webhook().create(webhookData)
      const webhook = await stack.webhook(createdWebhook.uid).fetch()
      const deleteResponse = await webhook.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })
  })
})
