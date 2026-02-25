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
   * The addItems request allows you to add multiple items to a release in bulk.
   * @memberof BulkOperation
   * @func addItems
   * @returns {Promise<Object>} Response Object.
   * @param {Object} params.data - The data containing the items to be added to the release.
   * @param {String} [params.bulk_version] - The bulk version.
   * @example
   * const itemsData = {
   *   items: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}'
   *     }
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().addItems({ data: itemsData })
   * .then((response) => { console.log(response) })
   */
  // eslint-disable-next-line camelcase
  this.addItems = async ({ data, bulk_version = '' }) => {
    this.urlPath = `/bulk/release/items`
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (bulk_version) headers.headers.bulk_version = bulk_version
    try {
      const response = await http.post(this.urlPath, data, headers)
      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * The updateItems request allows you to update multiple items in a release in bulk.
   * @memberof BulkOperation
   * @func updateItems
   * @returns {Promise<Object>} Response Object.
   * @param {Object} params.data - The data containing the items to be updated in the release.
   * @param {String} [params.bulk_version] - The bulk version.
   * @example
   * const itemsData = {
   *   items: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}'
   *     }
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().updateItems({ data: itemsData })
   * .then((response) => { console.log(response) })
   */
  // eslint-disable-next-line camelcase
  this.updateItems = async ({ data, bulk_version = '' }) => {
    this.urlPath = `/bulk/release/update_items`
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (bulk_version) headers.headers.bulk_version = bulk_version
    try {
      const response = await http.put(this.urlPath, data, headers)
      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * The jobStatus request allows you to check the status of a bulk job.
   * @memberof BulkOperation
   * @func jobStatus
   * @returns {Promise<Object>} Response Object.
   * @param {String} params.job_id - The ID of the job.
   * @param {String} [params.bulk_version] - The bulk version.
   * @param {String} [params.api_version] - The API version.
   * @example
   * client.stack({ api_key: 'api_key'}).bulkOperation().jobStatus({ job_id: 'job_id' })
   * .then((response) => { console.log(response) })
   */
  // eslint-disable-next-line camelcase
  this.jobStatus = async ({ job_id, bulk_version = '', api_version = '' }) => {
    // eslint-disable-next-line camelcase
    this.urlPath = `/bulk/jobs/${job_id}`
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (bulk_version) headers.headers.bulk_version = bulk_version
    // eslint-disable-next-line camelcase
    if (api_version) headers.headers.api_version = api_version
    try {
      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        // eslint-disable-next-line camelcase
        if (api_version) delete headers.headers.api_version
        return response.data
      }
    } catch (error) {
      // eslint-disable-next-line camelcase
      if (api_version) delete headers.headers.api_version
      console.error(error)
    }
  }

  /**
   * The getJobItems request allows you to get the items of a bulk job.
   * Response structure varies based on query params: items (always), skip/limit/total_count (when include_count=true), and other fields per params.
   * @memberof BulkOperation
   * @func getJobItems
   * @returns {Promise<Object>} Response Object. Structure varies with params - always includes items array; may include skip, limit, total_count when include_count=true.
   * @param {String} job_id - The ID of the job.
   * @param {Object} [params={}] - Query parameters. Supports: include_count, skip, limit, include_reference, status, type, ct (content type UID or array), api_version, and any other dynamic query params.
   * @example
   * client.stack({ api_key: 'api_key'}).bulkOperation().getJobItems('job_id')
   * .then((response) => { console.log(response) })
   * @example
   * client.stack({ api_key: 'api_key'}).bulkOperation().getJobItems('job_id', { skip: 0, limit: 50, include_count: true })
   * .then((response) => { console.log(response) })
   */
  // eslint-disable-next-line camelcase
  this.getJobItems = async (job_id, params = {}) => {
    // eslint-disable-next-line camelcase
    const { api_version = '3.2', ...queryParams } = cloneDeep(params)
    // eslint-disable-next-line camelcase
    this.urlPath = `/bulk/jobs/${job_id}/items`
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (api_version) headers.headers.api_version = api_version
    if (Object.keys(queryParams).length > 0) headers.params = queryParams
    try {
      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        // eslint-disable-next-line camelcase
        if (api_version) delete headers.headers.api_version
        return response.data
      }
    } catch (error) {
      // eslint-disable-next-line camelcase
      if (api_version) delete headers.headers.api_version
      console.error(error)
    }
  }

  /**
   * The Publish entries and assets in bulk request allows you to publish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func publish
   * @returns {Promise<Object>} Response Object.
   * @param {Object} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to publish the entries or assets.
   * @param {Boolean} params.skip_workflow_stage_check - Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals - Set this to 'true' to publish the entries that do not require an approval to be published.
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
   * const publishDetails = {
   *  environments:["{{env_uid}}","{{env_uid}}"],
   *  locales:["en-us"],
   *  entries:[
   *    {
   *      _content_type_uid: '{{content_type_uid}}',
   *      uid: '{{entry_uid}}'
   *    },
   *    {
   *      _content_type_uid: '{{content_type_uid}}',
   *      uid: '{{entry_uid}}'
   *    },
   *    {
   *      _content_type_uid: '{{content_type_uid}}',
   *      uid: '{{entry_uid}}'
   *    }
   *  ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails, is_nested: true })
   * .then((response) => {  console.log(response.notice) })
   *
   */
  // eslint-disable-next-line camelcase
  this.publish = async ({ details, skip_workflow_stage = false, approvals = false, is_nested = false, api_version = '', publishAllLocalized = false }) => {
    var httpBody = {}
    if (details) {
      httpBody = cloneDeep(details)
    }
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (is_nested) {
      headers.params = {
        nested: true,
        event_type: 'bulk'
      }
    }
    // eslint-disable-next-line camelcase
    if (skip_workflow_stage) {
      // eslint-disable-next-line camelcase
      headers.headers.skip_workflow_stage_check = skip_workflow_stage
    }
    if (approvals) {
      headers.headers.approvals = approvals
    }
    if (publishAllLocalized) {
      if (!headers.params) {
        headers.params = {}
      }
      headers.params.publish_all_localized = publishAllLocalized
    }

    // eslint-disable-next-line camelcase
    if (api_version) headers.headers.api_version = api_version

    return publishUnpublish(http, '/bulk/publish', httpBody, headers)
  }

  /**
   * The Unpublish entries and assets in bulk request allows you to unpublish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func unpublish
   * @returns {Promise<Object>} Response Object.
   * @param {Object} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to unpublish the entries or assets. If you do not specify a source locale, the entries or assets will be unpublished in the master locale automatically.
   * @param {Boolean} params.skip_workflow_stage_check - Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals - Set this to 'true' to publish the entries that do not require an approval to be published.
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
   * const publishDetails = {
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
  // eslint-disable-next-line camelcase
  this.unpublish = async ({ details, skip_workflow_stage = false, approvals = false, is_nested = false, api_version = '', unpublishAllLocalized = false }) => {
    var httpBody = {}
    if (details) {
      httpBody = cloneDeep(details)
    }
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    // eslint-disable-next-line camelcase
    if (is_nested) {
      headers.params = {
        nested: true,
        event_type: 'bulk'
      }
    }
    // eslint-disable-next-line camelcase
    if (skip_workflow_stage) {
      // eslint-disable-next-line camelcase
      headers.headers.skip_workflow_stage_check = skip_workflow_stage
    }
    if (approvals) {
      headers.headers.approvals = approvals
    }
    // eslint-disable-next-line camelcase
    if (api_version) headers.headers.api_version = api_version

    if (unpublishAllLocalized) {
      if (!headers.params) {
        headers.params = {}
      }
      headers.params.publish_all_localized = unpublishAllLocalized
    }
    return publishUnpublish(http, '/bulk/unpublish', httpBody, headers)
  }

  /**
   * The Delete entries and assets in bulk request allows you to delete multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func delete
   * @param {Object} params.details - Set this with details specifying the content type UIDs, entry UIDs or asset UIDs, and locales of which the entries or assets you want to delete.
   * @returns {Promise<Object>} Response Object.
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

  /**
   * The Update workflow stage for entries in bulk request allows you to update workflow stages for multiple entries at the same time.
   * @memberof BulkOperation
   * @func update
   * @param {Object} updateBody - Set this with details specifying the content type UIDs, entry UIDs or asset UIDs, and locales of which the entries or assets you want to update.
   * @returns {Promise<Object>} Response Object.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const updateBody = {
   *     "entries": [{
   *         "content_type": "content_type_uid1",
   *         "uid": "entry_uid",
   *         "locale": "en-us"
   *     }, {
   *         "content_type": "content_type_uid2",
   *         "uid": "entry_uid",
   *         "locale": "en-us"
   *     }],
   *     "workflow": {
   *         "workflow_stage": {
   *             "comment": "Workflow-related Comments",
   *             "due_date": "Thu Dec 01 2018",
   *             "notify": false,
   *             "uid": "workflow_stage_uid",
   *             "assigned_to": [{
   *                 "uid": "user_uid",
   *                 "name": "user_name",
   *                 "email": "user_email_id"
   *             }],
   *             "assigned_by_roles": [{
   *                 "uid": "role_uid",
   *                 "name": "role_name"
   *             }]
   *         }
   *     }
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().update(updateBody)
   * .then((response) => {  console.log(response.notice) })
   *
   */
  this.update = async (updateBody = {}) => {
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    }
    return publishUnpublish(http, '/bulk/workflow', updateBody, headers)
  }
}
