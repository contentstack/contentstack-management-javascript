import cloneDeep from 'lodash/cloneDeep'
import { query, deleteEntity } from '../../../entity'
import error from '../../../core/contentstackError'

/**
 * Variants within a variant group allow you to manage individual variants that belong to a specific variant group. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-variants'>Variants</a>.
 * @namespace Variants
 */

export function Variants (http, data = {}) {
  Object.assign(this, cloneDeep(data.variants))
  this.stackHeaders = data.stackHeaders
  this.variant_group_uid = data.variant_group_uid
  this.urlPath = `/variant_groups/${this.variant_group_uid}/variants`

  if (data.variants) {
    this.urlPath += `/${this.uid}`
    /**
       * @description The Update Variant call lets you update the name and description of an existing Variant.
       * @memberof Variants
       * @func update
       * @returns {Promise<Object>} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       * const data = { "name": "Update name" }
       * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').variants('variant_uid').update(data)
       * .then((variants) => console.log(variants))
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
       * @description The fetch Variant call fetches Variant details.
       * @memberof Variants
       * @func fetch
       * @returns {Promise<Object>} Response Object.
       * @param {Object} param - Query parameters for fetching variant details
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').variants('variant_uid').fetch()
       * .then((variants) => console.log(variants))
       *
       */
    this.fetch = async (param = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          params: {
            ...cloneDeep(param)
          }
        } || {}

        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        error(err)
      }
    }

    /**
       * @description The Delete Variant call is used to delete an existing Variant permanently from your Variant Group.
       * @memberof Variants
       * @func delete
       * @returns {Promise<Object>} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').variants('variant_uid').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)
  } else {
    /**
     * @description The Create a variant call creates a new variant in a particular Variant Group.
     * @memberof Variants
     * @func create
     * @returns {Promise<Object>} Response Object.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const data = {
     *      "uid": "iphone_color_white", // optional
     *      "name": "White",
     *      "personalize_metadata": {   // optional sent from personalize while creating variant
     *          "experience_uid": "exp1",
     *          "experience_short_uid": "expShortUid1",
     *          "project_uid": "project_uid1",
     *          "variant_short_uid": "variantShort_uid1"
     *      },
     *      }
     * client.stack().variantGroup('variant_group_uid').variants().create({ data })
     * .then((variants) => console.log(variants))
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
     * @description The Query on Variants will allow you to fetch details of all or specific Variants.
     * @memberof Variants
     * @func query
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results for variants.
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()

     * client.stack({ api_key: 'api_key' }).variantGroup('variant_group_uid').variants().query({ query: { name: 'white' } }).find()
     * .then((variants) => console.log(variants))
     */
    this.query = query({ http: http, wrapperCollection: VariantsCollection })
  }
  return this
}

export function VariantsCollection (http, data) {
  const obj = cloneDeep(data.variants) || []
  const variantsCollection = obj.map((userdata) => {
    return new Variants(http, { variants: userdata, variant_group_uid: data.uid, stackHeaders: data.stackHeaders })
  })
  return variantsCollection
}
