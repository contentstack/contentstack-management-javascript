import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetch,
  upload,
  parseData,
  fetchAll
} from '../../entity'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'

/**
 * A webhook is a mechanism that sends real-time information to any third-party app or service to keep your application in sync with your Contentstack account. Webhooks allow you to specify a URL to which you would like Contentstack to post data when an event happens. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-webhooks'>Webhooks</a>.
 * @namespace Webhook
 */

export function Webhook (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/webhooks`

  if (data.webhook) {
    Object.assign(this, cloneDeep(data.webhook))
    this.urlPath = `/webhooks/${this.uid}`
    /**
     * @description The Update Webhook call lets you update the name and description of an existing Webhook.
     * @memberof Webhook
     * @func update
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').fetch()
     * .then((webhook) => {
     *  webhook.title = 'My New Webhook'
     *  webhook.description = 'Webhook description'
     *  return webhook.update()
     * })
     * .then((webhook) => console.log(webhook))
     *
     */
    this.update = update(http, 'webhook')

    /**
     * @description The Delete Webhook call is used to delete an existing Webhook permanently from your Stack.
     * @memberof Webhook
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Webhook call fetches Webhook details.
     * @memberof Webhook
     * @func fetch
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     * @param {Object=} param - Query parameters
     * @prop {Int} param.version - Enter the version number of the webhook you want to retrieve.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').fetch()
     * .then((webhook) => console.log(webhook))
     *
     */
    this.fetch = fetch(http, 'webhook')

    /**
     * @description The Get executions of a webhook call provides the execution details of a specific webhook, which includes the execution UID.
     * @memberof Webhook
     * @func executions
     * @async
     * @param {Object=} params - Query parameters.
     * @prop {Number=} params.skip - To skip number of data.
     * @prop {Number=} params.limit - To limit number of results.
     * @returns {Promise<Object>} Response object for webhook execution
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').executions()
     * .then((webhook) => console.log(webhook))
     */
    this.executions = async (params) => {
      const headers = {}
      if (this.stackHeaders) {
        headers.headers = this.stackHeaders
      }
      if (params) {
        headers.params = {
          ...cloneDeep(params)
        }
      }
      try {
        const response = await http.get(`${this.urlPath}/executions`, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The Retry webhook execution call retries a failed webhook execution.
     * @memberof Webhook
     * @func retry
     * @async
     * @param {String} executionUid execution UID that you receive when you execute the 'Get executions of webhooks' call.
     * @returns {Promise<Object>} Response Object.
     */
    this.retry = async (executionUid) => {
      const headers = {}
      if (this.stackHeaders) {
        headers.headers = this.stackHeaders
      }
      try {
        const response = await http.post(`${this.urlPath}/retry`, { execution_uid: executionUid }, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  } else {
    /**
     * @description The Create a webhook request allows you to create a new webhook in a specific stack.
     * @memberof Webhook
     * @func create
     * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const webhook = {
     * name: 'Test',
     * destinations: [{
     *   target_url: 'http://example.com',
     *   http_basic_auth: 'basic',
     *   http_basic_password: 'test',
     *   custom_header: [{
     *     header_name: 'Custom',
     *     value: 'testing'
     *   }]
     * }],
     *  channels: [
     *    'assets.create'
     *  ],
     *  retry_policy: 'manual',
     *  disabled: false
     * }
     * client.stack().webhook().create({ webhook })
     * .then((webhook) => console.log(webhook))
     */
    this.create = create({ http: http })

    /**
     * @description The Get all Webhook call lists all Webhooks from Stack.
     * @memberof Webhook
     * @func fetchAll
     * @param {Object=} param - Query parameters.
     * @prop {Number=} param.limit - The limit parameter will return a specific number of webhooks in the output.
     * @prop {Number=} param.skip - The skip parameter will skip a specific number of webhooks in the output.
     * @prop {String=} param.asc - When fetching webhooks, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @prop {String=} param.desc - When fetching webhooks, you can sort them in the descending order with respect to the value of a specific field in the response body.
     * @prop {Boolean=} param.include_count - To retrieve the count of webhooks.
     * @returns {Promise<ContentstackCollection>} Promise for ContentstackCollection instance.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = fetchAll(http, WebhookCollection)
  }

  /**
   * @description The 'Import Webhook' section consists of the following two requests that will help you to import new Webhooks or update existing ones by uploading JSON files.
   * @memberof Webhook
   * @func import
   * @async
   * @param {Object} data - Import data object.
   * @prop {string} data.webhook - Path to webhook file.
   * @returns {Promise<Webhook.Webhook>} Promise for Webhook instance
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const data = {
   *  webhook: 'path/to/file.json',
   * }
   * // Import a Webhook
   * client.stack({ api_key: 'api_key'}).webhook().import(data)
   * .then((webhook) => console.log(webhook))
   *
   * // Import an Existing Webhook
   * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').import(data)
   * .then((webhook) => console.log(webhook))
   */
  this.import = async (data) => {
    try {
      const response = await upload({
        http: http,
        urlPath: `${this.urlPath}/import`,
        stackHeaders: this.stackHeaders,
        formData: createFormData(data)
      })
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
  return this
}

export function WebhookCollection (http, data) {
  const obj = cloneDeep(data.webhooks) || []
  const webhookCollection = obj.map((userdata) => {
    return new Webhook(http, { webhook: userdata, stackHeaders: data.stackHeaders })
  })
  return webhookCollection
}

export function createFormData (data) {
  return () => {
    const formData = new FormData()
    const uploadStream = createReadStream(data.webhook)
    formData.append('webhook', uploadStream)
    return formData
  }
}
