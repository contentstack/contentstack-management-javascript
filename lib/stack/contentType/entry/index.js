import cloneDeep from 'lodash/cloneDeep'
import { create,
  update,
  deleteEntity,
  fetch,
  query,
  upload,
  parseData,
  publish,
  unpublish }
  from '../../../entity'
import FormData from 'form-data'
import { createReadStream } from 'fs'
import error from '../../../core/contentstackError'

/**
 * An entry is the actual piece of content created using one of the defined content types. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Entries</a>.
 * @namespace Entry
 */

export function Entry (http, data) {
  this.stackHeaders = data.stackHeaders
  this.content_type_uid = data.content_type_uid
  this.urlPath = `/content_types/${this.content_type_uid}/entries`

  if (data && data.entry) {
    Object.assign(this, cloneDeep(data.entry))
    this.urlPath = `/content_types/${this.content_type_uid}/entries/${this.uid}`

    /**
     * @description The Create an entry call creates a new entry for the selected content type.
     * @memberof Entry
     * @func update
     * @param locale - Locale code to localized entry
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.description = 'Entry description'
     *  return entry.update()
     * })
     * .then((entry) => console.log(entry))
     *
     * @example
     * // To Localize Entry pass locale in parameter
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.description = 'Entry description'
     *  return entry.update({ locale: 'en-at' })
     * })
     * .then((entry) => console.log(entry))
     *
     * @example
     * // To update entry with asset field
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.file = entry.file.uid // for single asset pass asset uid to entry asset field value
     *  entry.multiple_file = ['asset_uid_1', 'asset_uid_2'] // for multiple asset pass array of asset uid to entry asset field values
     *  return entry.update({ locale: 'en-at' })
     * })
     * .then((entry) => console.log(entry))
     *
     * @example
     * // To update entry with reference field
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.reference = entry.reference.uid // for single reference pass reference uid to entry reference field value
     *  entry.multiple_reference = ['reference_uid_1', 'reference_uid_2'] // for multiple reference pass array of reference uid to entry reference field values
     *  entry.multiple_content_type_reference = [{_content_type_uid: 'content_type_uid_1', uid: 'reference_uid_1'}, {_content_type_uid: 'content_type_uid_2', uid: 'reference_uid_2'}] // for multiple reference pass array of reference uid to entry reference field values
     *  return entry.update({ locale: 'en-at' })
     * })
     * .then((entry) => console.log(entry))
     */
    this.update = update(http, 'entry')

    /**
     * @description The Delete an entry call is used to delete a specific entry from a content type.
     * @memberof Entry
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Entry call fetches Entry details.
     * @memberof Entry
     * @func fetch
     * @param {Int} version Enter the version number of the entry that you want to retrieve. However, to retrieve a specific version of an entry, you need to keep the environment parameter blank.
     * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
     * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
     * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => console.log(entry))
     *
     */
    this.fetch = fetch(http, 'entry')

    /**
     * @description The Publish an asset call is used to publish a specific version of an asset on the desired environment either immediately or at a later date/time.
     * @memberof Entry
     * @func publish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').publish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */
    this.publish = publish(http, 'entry')

    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Entry
     * @func unpublish
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').unpublish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((response) => console.log(response.notice))
     *
     */
    this.unpublish = unpublish(http, 'entry')

    /**
     * @description This multipurpose request allows you to either send a publish request or accept/reject a received publish request.
     * @memberof Entry
     * @func publishRequest
     * @returns {Promise<Object>} Response Object.
     * @param {Object} publishing_rule Details for the publish request
     * @param {String} locale Enter the code of the locale that the entry belongs to.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const publishing_rule = {
     * "uid": "uid",
     * "action": "publish" //(‘publish’, ‘unpublish’, or ’both’)
     * "status": 1, //(this could be ‘0’ for Approval Requested, ‘1’ for ‘Approval Accepted’, and ‘-1’ for ‘Approval Rejected’),
     * "notify": false,
     * comment": "Please review this."
     * }
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').publishRequest({ publishing_rule, locale: 'en-us'})
     * .then((response) => console.log(response.notice))
     */
    this.publishRequest = async ({publishing_rule, locale}) => {
      const publishDetails = {
        workflow: { publishing_rule }
      }
      const headers = {}
      if (this.stackHeaders) {
        headers.headers = this.stackHeaders
      }
      headers.params = {
        locale
      }
      try {
        const response = await http.post(`${this.urlPath}/workflow`, publishDetails, headers)
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
     * @description The Set Entry Workflow Stage request allows you to either set a particular workflow stage of an entry or update the workflow stage details of an entry.
     * @memberof Entry
     * @func setWorkflowStage
     * @returns {Promise<Object>} Response Object.
     * @param {Object} publishing_rule Details for the publish request
     * @param {String} locale Enter the code of the locale that the entry belongs to.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const workflow_stage = {
     *    "comment": "Workflow Comment",
     *    "due_date": "Thu Dec 01 2018",
     *    "notify": false,
     *    "uid": "workflow_stage_uid",
     *    "assigned_to": [{
     *      "uid": "user_uid",
     *      "name": "Username",
     *      "email": "user_email_id"
     *      }],
     *    "assigned_by_roles": [{
     *    "uid": "role_uid",
     *    "name": "Role name"
     *  }]
     * }
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').publishRequest({ publishing_rule, locale: 'en-us'})
     * .then((response) => console.log(response.notice));
     */
    this.setWorkflowStage = async ({workflow_stage, locale}) => { 
      const publishDetails = {
        workflow: { workflow_stage }
      }
      const headers = {}
      if (this.stackHeaders) {
        headers.headers = this.stackHeaders
      }
      headers.params = {
        locale
      }
      try {
        const response = await http.post(`${this.urlPath}/workflow`, publishDetails, headers)
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
   * @description The Create an entry call creates a new entry for the selected content type.
   * @memberof Entry
   * @func create
   * @returns {Promise<Entry.Entry>} Promise for Entry instance
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * const entry  = {
   *  title: 'Sample Entry',
   *  url: '/sampleEntry'
   * }
   * client.stack().contentType('content_type_uid').entry().create({ entry })
   * .then((entry) => console.log(entry))
   */
    this.create = create({ http: http })

    /**
   * @description The Query on Entry will allow to fetch details of all or specific Entry
   * @memberof Entry
   * @func query
   * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
   * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
   * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
   * @param {Object} query Queries that you can use to fetch filtered results.
   * @returns {Array<Entry>} Array of Entry.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack().contentType('content_type_uid').entry().query({ query: { title: 'Entry title' } }).find()
   * .then((entries) => console.log(entries))
   */
    this.query = query({ http: http, wrapperCollection: EntryCollection })
  }

  /**
   * @description The Import Entry calls given below help you to import entries by uploading JSON files.
   * @memberof Entry
   * @func import
   * @param {String} entry Select the JSON file of the entry that you wish to import.
   * @param {String} locale Enter the code of the language to import the entry of that particular language.
   * @param {Boolean} overwrite Select 'true' to replace an existing entry with the imported entry file.
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry()
   * .import({
   *  entry: 'path/to/file.json',
   *  overwrite: true
   * })
   * .then((entry) => console.log(entry))
   *
   */
  this.import = async ({ entry, locale = null, overwrite = false }) => {
    var importUrl = `${this.urlPath}/import?overwrite=${overwrite}`
    if (locale) {
      importUrl = `${importUrl}&locale=${locale}`
    }
    try {
      const response = await upload({
        http: http,
        urlPath: importUrl,
        stackHeaders: this.stackHeaders,
        formData: createFormData(entry)
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

export function EntryCollection (http, data) {
  const obj = cloneDeep(data.entries) || []
  const entryCollection = obj.map((entry) => {
    return new Entry(http, { entry: entry, content_type_uid: data.content_type_uid, stackHeaders: data.stackHeaders })
  })
  return entryCollection
}

export function createFormData (entry) {
  return () => {
    const formData = new FormData()
    const uploadStream = createReadStream(entry)
    formData.append('entry', uploadStream)
    return formData
  }
}
