import cloneDeep from 'lodash/cloneDeep'
import { query, upload, parseData } from '../../entity'
import error from '../../core/contentstackError'
import FormData from 'form-data'
import { createReadStream } from 'fs'

/**
 * GlobalField defines the structure or schema of a page or a section of your web or mobile property. To create global Fields for your application, you are required to first create a gloabl field. Read more about <a href='https://www.contentstack.com/docs/guide/global-fields'>Global Fields</a>.
 * @namespace GlobalField
 */

export function GlobalField (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.apiVersion = data.api_version || undefined

  if (this.apiVersion) {
    this.stackHeaders.api_version = this.apiVersion
  }
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
    this.update = async (config) => {
      try {
        // Add `api_version` to headers if `this.apiVersion` is defined
        if (this.apiVersion) {
          this.stackHeaders.api_version = this.apiVersion
        }
        const headers = {
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        }
        const response = await http.put(`${this.urlPath}`, config, headers)
        // Remove `api_version` from headers after fetching data
        if (this.apiVersion) {
          delete this.stackHeaders.api_version
        }
        const data = response.data
        if (data) {
          if (this.stackHeaders) {
            data.stackHeaders = this.stackHeaders
          }
          return data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The Update GlobalField call lets you update the name and description of an existing GlobalField.
     * @memberof GlobalField
     * @func update
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const data = {
     *    "global_field": {
     *        "title": "Nested Global Field33",
     *        "uid": "nested_global_field33",
     *        "schema": [
     *            {
     *                "data_type": "text",
     *                "display_name": "Single Line Textbox",
     *                "uid": "single_line"
     *            },
     *            {
     *                "data_type": "global_field",
     *                "display_name": "Global",
     *                "uid": "global_field",
     *                "reference_to": "nested_global_field_123"
     *            }
     *        ]
     *    }
     *  }
     * client.stack({ api_key: 'api_key'}).globalField('global_field_uid').updateNestedGlobalField(data, { headers: { api_version: '3.2' }})
     * .then((globalField) => {
          console.log(globalField)
     * })
     */
    this.updateNestedGlobalField = async (config, headers = {}) => {
      const apiVersion = { api_version: '3.2' }
      this.stackHeaders = { ...this.stackHeaders, ...apiVersion, ...headers }
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) }
        }
        const response = await http.put(`${this.urlPath}`, config, headers)
        const data = response.data
        if (data) {
          if (this.stackHeaders) {
            data.stackHeaders = this.stackHeaders
          }
          return data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

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
     * .then((response) => console.log(response.notice))
     */
    this.delete = async () => {
      const param = {}
      try {
        // Add `api_version` to headers if `this.apiVersion` is defined
        if (this.apiVersion) {
          this.stackHeaders.api_version = this.apiVersion
        }
        const headers = {
          headers: {
            ...cloneDeep(this.stackHeaders)
          },
          params: {
            ...cloneDeep(param)
          }
        }
        const response = await http.delete(this.urlPath, headers)
        if (this.apiVersion) {
          delete this.stackHeaders.api_version
        }
        const data = response.data
        if (data) {
          if (this.stackHeaders) {
            data.stackHeaders = this.stackHeaders
          }
          return data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

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
    this.fetch = async function (param = {}) {
      try {
        if (this.apiVersion) {
          this.stackHeaders.api_version = this.apiVersion
        }
        const headers = {
          headers: {
            ...cloneDeep(this.stackHeaders)
          },
          params: {
            ...cloneDeep(param)
          }
        }
        const response = await http.get(this.urlPath, headers)
        const data = response.data
        if (data) {
          if (this.stackHeaders) {
            data.stackHeaders = this.stackHeaders
          }
          return data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
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
    this.create = async (payload) => {
      try {
        if (this.apiVersion) {
          this.stackHeaders.api_version = this.apiVersion
        }
        const headers = {
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        }
        const response = await http.post(`${this.urlPath}`, payload, headers)
        const data = response.data
        if (data) {
          if (this.stackHeaders) {
            data.stackHeaders = this.stackHeaders
          }
          return data
        } else {
          throw error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

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
    this.query = query({ http: http, wrapperCollection: GlobalFieldCollection, apiVersion: this.apiVersion })

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
   *  global_field: 'path/to/file.json',
   * }
   * client.stack({ api_key: 'api_key'}).globalField().import(data, { overwrite: true })
   * .then((globalField) => console.log(globalField))
   *
   */
    this.import = async function (data, params = {}, headers = {}) {
      try {
        this.stackHeaders = { ...this.stackHeaders, ...headers }
        const response = await upload({
          http: http,
          urlPath: `${this.urlPath}/import`,
          stackHeaders: this.stackHeaders,
          formData: createFormData(data),
          params: params
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

export function createFormData (data) {
  return () => {
    const formData = new FormData()
    const uploadStream = createReadStream(data.global_field)
    formData.append('global_field', uploadStream)
    return formData
  }
}
