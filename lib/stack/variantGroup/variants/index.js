import cloneDeep from 'lodash/cloneDeep'
import { create, fetch, query, deleteEntity } from '../../../entity'

/**
 * Contentstack has a sophisticated multilingual capability. It allows you to create and publish entries in any language. This feature allows you to set up multilingual websites and cater to a wide variety of audience by serving content in their local language(s). Read more about <a href='https://www.contentstack.com/docs/developers/multi-language-content'>VariantGroups</a>.
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
       * @description The Update Variants call lets you update the name and description of an existing Variants.
       * @memberof Variants
       * @func update
       * @returns {Promise<Variants.Variants>} Promise for Variants instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       * const data = { "name": "Update name" }
       * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').variants('variant_uid').update(data)
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
       * @description The fetch Variants call fetches Variants details.
       * @memberof Variants
       * @func fetch
       * @returns {Promise<Variants.Variants>} Promise for Variants instance
       * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').variants('variant_uid').fetch()
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
       * @description The Delete Variant call is used to delete an existing Variant permanently from your Stack.
       * @memberof VariantGroup
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).VariantGroup('variant_group_uid').variants('variant_uid').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)
  } else {
    /**
     * @description The Create a variant group call creates a new variant group in a particular stack of your Contentstack account.
     * @memberof Variants
     * @func create
     * @returns {Promise<Variants.Variants>} Promise for Variants instance
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
     * client.stack().VariantGroup('variant_group_uid').variants().create({ data } )
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
     * @description The Query on Variant Groups will allow to fetch details of all or specific Variant Groups
     * @memberof Variants
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Array<VariantGroup>} Array of ContentTyoe.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()

     * client.stack(api_key).VariantGroup('variant_group_uid').variants().query({ query: { name: 'white' } }).find()
     * .then((variant_groups) => console.log(variant_groups))
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
