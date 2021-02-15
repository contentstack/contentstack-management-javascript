import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetch,
  upload,
  parseData
} from '../../entity'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'
import ContentstackCollection from '../../contentstackCollection'

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
     * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
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
     * @description The Get executions of a webhook call will provide the execution details of a specific webhook, which includes the execution UID.
     * @memberof Webhook
     * @returns {Promise<JSON.JSON>} JSON response for webhook execution
     * @func executions
     * @param {*} param.skip - to skip number of data
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
     *
     * @param {String} executionUid execution UID that you receive when you execute the 'Get executions of webhooks' call.
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
     * @param {Int} limit The limit parameter will return a specific number of webhooks in the output.
     * @param {Int} skip The skip parameter will skip a specific number of webhooks in the output.
     * @param {String} asc When fetching webhooks, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @param {String} desc When fetching webhooks, you can sort them in the decending order with respect to the value of a specific field in the response body.
     * @param {Boolean}include_count To retrieve the count of webhooks.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = async (params) => {
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
        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return new ContentstackCollection(response, http, null, WebhookCollection)
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }

  /**
   * @description The 'Import Webhook' section consists of the following two requests that will help you to import new Webhooks or update existing ones by uploading JSON files.
   * @memberof Webhook
   * @func import
   * @param {String} data.webhook path to file
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const data = {
   *  webhook: 'path/to/file.png',
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

function createFormData (data) {
  const formData = new FormData()
  const uploadStream = createReadStream(data.webhook)
  formData.append('webhook', uploadStream)
  return formData
}
