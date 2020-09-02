import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query, upload, parseData } from '../../entity'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'

/**
 * GlobalField defines the structure or schema of a page or a section of your web or mobile property. To create global Fields for your application, you are required to first create a gloabl field. Read more about <a href='https://www.contentstack.com/docs/guide/global-fields'>Global Fields</a>.
 * @namespace GlobalField
 */

export function GlobalField (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/global_fields`

  if (data.global_field) {
    Object.assign(this, cloneDeep(data.global_field))
    this.urlPath = `/global_fields/${this.uid}`
    /**
     * @description The Update GlobalField call lets you update the name and description of an existing GlobalField.
     * @memberof GlobalField
     * @func update
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').fetch()
     * .then((globalField) => {
     *  globalField.title = 'My New Content Type'
     *  globalField.description = 'Content Type description'
     *  return globalField.update()
     * })
     * .then((globalField) => console.log(globalField))
     *
     */
    this.update = update(http, 'global_field')

    /**
     * @description The Delete GlobalField call is used to delete an existing GlobalField permanently from your Stack.
     * @memberof GlobalField
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch GlobalField call fetches GlobalField details.
     * @memberof GlobalField
     * @func fetch
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').fetch()
     * .then((globalField) => console.log(globalField))
     *
     */
    this.fetch = fetch(http, 'global_field')
  } else {
    /**
     * @description The Create a GlobalField call creates a new globalField in a particular stack of your Contentstack account.
     * @memberof GlobalField
     * @func create
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     *
     * @example
     * import * as contentstac k from '@contentstack/management'
     * const client = contentstack.client()
     * const global_field = {
     *      title: 'First',
     *      uid: 'first',
     *      schema: [{
     *          display_name: 'Name',
     *          uid: 'name',
     *          data_type: 'text'
     *      }]
     * }
     * client.stack().globalField().create({ global_field })
     * .then((globalField) => console.log(globalField))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on GlobalField will allow to fetch details of all or specific GlobalField
     * @memberof GlobalField
     * @func query
     * @returns {Array<GlobalField>} Array of GlobalField.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().globalField().query({ query: { name: 'Global Field Name' } }).find()
     * .then((globalFields) => console.log(globalFields))
     */
    this.query = query({ http: http, wrapperCollection: GlobalFieldCollection })

    /**
   * @description The Import a global field call imports a global field into a stack.
   * @memberof GlobalField
   * @func import
   * @param {String} data.global_field path to file
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   *
   * const data = {
   *  global_field: 'path/to/file.png',
   * }
   * client.stack({ api_key: 'api_key'}).globalField().import(data)
   * .then((globalField) => console.log(globalField))
   *
   */
    this.import = async function (data) {
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
  }
  return this
}

export function GlobalFieldCollection (http, data) {
  const obj = cloneDeep(data.global_fields) || []
  const globalFieldCollection = obj.map((userdata) => {
    return new GlobalField(http, { global_field: userdata, stackHeaders: data.stackHeaders })
  })
  return globalFieldCollection
}

function createFormData (data) {
  const formData = new FormData()
  const uploadStream = createReadStream(data.global_field)
  formData.append('global_field', uploadStream)
  return formData
}
