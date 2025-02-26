import cloneDeep from 'lodash/cloneDeep'
import {
  deleteEntity,
  fetch,
  query,
  create
} from '../../entity'
/**
 * Variantss allow you to group a collection of content within a stack. Using variants you can group content types that need to work together. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-variants'>Variantss</a>.
 * @namespace Variants
 */
export function Variants (http, data) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/variants`

  if (data.variants) {
    Object.assign(this, cloneDeep(data.variants))
    this.urlPath += `/${this.uid}`

    /**
     * @description The Delete variants call is used to delete a specific variants.
     * @memberof Variants
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).variants('variants_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Variants returns information about a particular variants of a stack.
     * @memberof Variants
     * @func fetch
     * @returns {Promise<Variants.Variants>} Promise for Variants instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).variants('variants_uid').fetch()
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
  } else {
    /**
     * @description The Create an variants call creates a new variants.
     * @memberof Variants
     * @func create
     * @returns {Promise<Variants.Variants>} Promise for Variants instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const variants = {
     *       "uid": "iphone_color_white", // optional
     *       "name": "White",
     *       "personalize_metadata": {
     *           "experience_uid": "exp1",
     *           "experience_short_uid": "expShortUid1",
     *           "project_uid": "project_uid1",
     *           "variant_short_uid": "variantShort_uid1"
     *       },
     *       }
     * client.stack().variants().create({ variants })
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
     * @description The Query on Variants will allow to fetch details of all or specific Variants.
     * @memberof Variants
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @func query
     * @returns {Array<Variants>} Array of Variants.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().variants().query({ query: { name: 'Variants Name' } }).find()
     * .then((variants) => console.log(variants))
     */
    this.query = query({ http: http, wrapperCollection: VariantsCollection })

    /**
     * @description The fetchByUIDs on Variants will allow to fetch details of specific Variants UID.
     * @memberof Variants
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - fetchByUIDs that you can use to fetch filtered results.
     * @func query
     * @returns {Array<Variants>} Array of Variants.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
      * client.stack().variants().fetchByUIDs(['uid1','uid2']).find()
      * .then((variants) => console.log(variants))
     */
    this.fetchByUIDs = async (variantUids) => {
      try {
        const response = await http.get(this.urlPath, {
          params: {
            uids: variantUids
          },
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        })
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
}

export function VariantsCollection (http, data) {
  const obj = cloneDeep(data.variants) || []
  const VariantsCollection = obj.map((userdata) => {
    return new Variants(http, { variants: userdata, stackHeaders: data.stackHeaders })
  })
  return VariantsCollection
}
