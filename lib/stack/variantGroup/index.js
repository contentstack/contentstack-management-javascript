import cloneDeep from 'lodash/cloneDeep'
import { deleteEntity, query } from '../../entity'
import { Variants } from './variants/index'
import error from '../../core/contentstackError'

/**
 * VariantGroups allow you to group a collection of variants within a stack. Using variant groups you can organize variants that need to work together. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-variants'>VariantGroups</a>.
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
       * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').update(up_data)
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
       * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)

    /**
     * @description The variants method returns a Variants instance for managing variants within this Variant Group.
     * @param {String} uid The UID of the variant you want to get details.
     * @returns {Variants} Instance of Variants.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').variants('variant_uid').fetch()
     * .then((variants) => console.log(variants))
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
     * client.stack().variantGroup().create({ variant_group })
     * .then((variant_group) => console.log(variant_group))
     */
    this.create = async (data) => {
      try {
        const response = await http.post(`${this.urlPath}`,
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
     * @description The Query on Variant Groups will allow you to fetch details of all or specific Variant Groups.
     * @memberof VariantGroup
     * @func query
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results for variant groups.
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key' }).variantGroup().query({ query: { name: 'Variant Group Name' } }).find()
     * .then((variant_groups) => console.log(variant_groups))
     */
    this.query = query({ http: http, wrapperCollection: VariantGroupCollection })
  }
  return this
}

export function VariantGroupCollection (http, data) {
  const obj = cloneDeep(data.variant_groups) || []
  const variantGroupCollection = obj.map((userdata) => {
    return new VariantGroup(http, { variant_group: userdata, stackHeaders: data.stackHeaders })
  })
  return variantGroupCollection
}
