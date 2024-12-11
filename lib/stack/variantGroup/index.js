import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'
import { Variants } from './variants/index'

/**
 * Contentstack has a sophisticated multilingual capability. It allows you to create and publish entries in any language. This feature allows you to set up multilingual websites and cater to a wide variety of audience by serving content in their local language(s). Read more about <a href='https://www.contentstack.com/docs/developers/multi-language-content'>VariantGroups</a>.
 * @namespace VariantGroup
 */

export function VariantGroup (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/variant_groups`

  if (data.variant_group) {
    Object.assign(this, cloneDeep(data.variant_group))
    this.urlPath += `/${this.uid}`
    /**
       * @description The Update VariantGroup call lets you update the name and description of an existing VariantGroup.
       * @memberof VariantGroup
       * @func update
       * @returns {Promise<VariantGroup.VariantGroup>} Promise for VariantGroup instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       * const up_data = {name: 'update name'}
       * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').update(up_data)
       * .then((variant_group) => console.log(variant_group))
       *
       */
    this.update = async (data) => {
      try {
        const response = await http.put(this.urlPath,
           data,
          {
            headers: {
              ...cloneDeep(this.stackHeaders)
            }
          })
        if (response.data) {
          return response.data
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }
    /**
       * @description The Delete VariantGroup call is used to delete an existing VariantGroup permanently from your Stack.
       * @memberof VariantGroup
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)

    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContenType} Instace of ContentType.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').variants('variant_uid').fetch()
     * .then((Variants) => console.log(Variants))
     */
    this.variants = (uid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      data.variant_group_uid = this.uid
      if (uid) {
        data.variants = { uid: uid }
      }
      return new Variants(http, data)
    }

  } else {
    /**
     * @description The Create a variant group call creates a new variant group in a particular stack of your Contentstack account.
     * @memberof VariantGroup
     * @func create
     * @returns {Promise<VariantGroup.VariantGroup>} Promise for VariantGroup instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const variant_group = {
     *      "name": "Colors",
     *        "content_types": [
     *          "iphone_product_page"
     *        ],
     *        "uid": "iphone_color_white", // optional
     *      }
     * client.stack().VariantGroup().create({ variant_group } )
     * .then((variant_group) => console.log(variant_group))
     */
    this.create = async (data) => {
      try {
        const response = await http.post(`${this.urlPath}`,
           data ,
          {
            headers: {
              ...cloneDeep(this.stackHeaders)
            }
          })
        if (response.data) {
          return response.data
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Query on Variant Groups will allow to fetch details of all or specific Variant Groups
     * @memberof VariantGroup
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Array<VariantGroup>} Array of ContentTyoe.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack(api_key).VariantGroup().query({ query: { code: 'variant_group-code' } }).find()
     * .then((variant_groups) => console.log(variant_groups))
     */
    this.query = query({ http: http, wrapperCollection: VariantGroupCollection })
  }
  return this
}

export function VariantGroupCollection (http, data) {
  const obj = cloneDeep(data.variant_groups) || []
  const variant_groupCollection = obj.map((userdata) => {
    return new VariantGroup(http, { variant_group: userdata, stackHeaders: data.stackHeaders })
  })
  return variant_groupCollection
}
