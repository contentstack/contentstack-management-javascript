import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'

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
    console.log(this)
    /**
     * @description The Update GlobalField call lets you update the name and description of an existing GlobalField.
     * @memberof GlobalField
     * @func update
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField('content_type_uid').fetch()
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
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField('global_field_uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch GlobalField call fetches GlobalField details.
     * @memberof GlobalField
     * @func fetch
     * @returns {Promise<GlobalField.GlobalField>} Promise for GlobalField instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').globalField('global_field_uid').fetch()
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
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().globalField().create({name: 'My New globalField'})
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
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().globalField().query({name: 'Global Field Name'})
     * .then((globalFields) => console.log(globalFields))
     */
    this.query = query({ http: http, wrapperCollection: GlobalFieldCollection })
  }
  return this
}

export function GlobalFieldCollection (http, data) {
  const obj = cloneDeep(data.global_fields)
  const globalFieldCollection = obj.map((userdata) => {
    return new GlobalField(http, { global_field: userdata, stackHeaders: data.stackHeaders })
  })
  return globalFieldCollection
}
