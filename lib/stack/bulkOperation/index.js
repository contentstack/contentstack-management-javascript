import cloneDeep from 'lodash/cloneDeep'
import { publishUnpublish } from '../../entity'

/**
 * Bulk operations such as Publish, Unpublish, and Delete on multiple entries or assets.
 * @namespace BulkOperation
 */
export function BulkOperation (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/bulk`

  /**
   * The Publish entries and assets in bulk request allows you to publish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func publish
   * @returns {Promise<Object>} Response Object.
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to publish the entries or assets.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       version: '{{version}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }],
   *   locales: [
   *     'en'
   *   ],
   *   environments: [
   *     '{{env_uid}}'
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   * @example
   * // Bulk nested publish
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * {
   * environments:["{{env_uid}}","{{env_uid}}"],
   * locales:["en-us"],
   * items:[
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * }
   * ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails, is_nested: true })
   * .then((response) => {  console.log(response.notice) })
   *
   */
  this.publish = async ({ details, skip_workflow_stage = false, approvals = false, is_nested = false, api_version = '' }) => {
    var httpBody = {}
    if (details) {
      httpBody = cloneDeep(details)
    }
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    if (is_nested) {
      headers.params = {
        nested: true,
        event_type: 'bulk'
      }
    }
    if (skip_workflow_stage) {
      headers.headers.skip_workflow_stage_check = skip_workflow_stage
    }
    if (approvals) {
      headers.headers.approvals = approvals
    }

    if (api_version) headers.headers.api_version = api_version

    return publishUnpublish(http, '/bulk/publish', httpBody, headers)
  }

  /**
   * The Unpublish entries and assets in bulk request allows you to unpublish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func unpublish
   * @returns {Promise<Object>} Response Object.
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to unpublish the entries or assets. If you do not specify a source locale, the entries or assets will be unpublished in the master locale automatically.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       version: '{{version}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }],
   *   locales: [
   *     'en'
   *   ],
   *   environments: [
   *     '{{env_uid}}'
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().unpublish({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   * @example
   * // Bulk nested publish
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * {
   * environments:["{{env_uid}}","{{env_uid}}"],
   * locales:["en-us"],
   * items:[
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * }
   * ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().unpublish({ details:  publishDetails, is_nested: true })
   * .then((response) => {  console.log(response.notice) })
   */
  this.unpublish = async ({ details, skip_workflow_stage = false, approvals = false, is_nested = false, api_version = ''}) => {
    var httpBody = {}
    if (details) {
      httpBody = cloneDeep(details)
    }
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    if (is_nested) {
      headers.params = {
        nested: true,
        event_type: 'bulk'
      }
    }
    if (skip_workflow_stage) {
      headers.headers.skip_workflow_stage_check = skip_workflow_stage
    }
    if (approvals) {
      headers.headers.approvals = approvals
    }
    if (api_version) headers.headers.api_version = api_version
    return publishUnpublish(http, '/bulk/unpublish', httpBody, headers)
  }

  /**
   * The Delete entries and assets in bulk request allows you to delete multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func delete
   * @returns {Promise<String>} Success message
   * @param {Boolean} params.details - Set this with details specifing the content type UIDs, entry UIDs or asset UIDs, and locales of which the entries or assets you want to delete.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().delete({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   */
  this.delete = async (params = {}) => {
    var httpBody = {}
    if (params.details) {
      httpBody = cloneDeep(params.details)
    }
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    return publishUnpublish(http, '/bulk/delete', httpBody, headers)
  }
}
