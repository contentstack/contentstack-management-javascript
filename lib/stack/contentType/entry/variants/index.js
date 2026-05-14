import cloneDeep from 'lodash/cloneDeep'
import {
  deleteEntity,
  fetch,
  query,
  publishUnpublish
}
  from '../../../../entity'
import error from '../../../../core/contentstackError'
import { bindModuleHeaders } from '../../../../core/moduleHeaderSupport.js'
/**
 * Variants allow you to create variant versions of entries within a content type. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-variants'>Variants</a>.
 * @namespace Variants
 */
export function Variants (http, data) {
  Object.assign(this, cloneDeep(data))
  this.urlPath = `/content_types/${this.content_type_uid}/entries/${this.entry_uid}/variants`
  let variantPathSegment = ''
  if (data?.variants_uid != null && data.variants_uid !== '') {
    if (Array.isArray(data.variants_uid)) {
      variantPathSegment = data.variants_uid
        .filter((uid) => typeof uid === 'string' && uid.length > 0)
        .join(',')
    } else {
      variantPathSegment = String(data.variants_uid)
    }
  }
  if (variantPathSegment) {
    this.urlPath += `/${variantPathSegment}`
    const entryBaseUrlPath = `/content_types/${this.content_type_uid}/entries/${this.entry_uid}`
    /**
         * @description The Update a variant call updates an existing variant for the selected content type.
         * @memberof Variants
         * @func update
         * @param {Object} data - The variant data to update.
         * @param {Object} [params={}] - Optional query parameters.
         * @returns {Promise<Object>} Response Object.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         * const data = {
         *      "entry": {
         *          "title": "example",
         *          "url": "/example",
         *          "_variant": {
         *          "_change_set": [
         *              "title",
         *              "url"
         *              ]
         *          }
         *          }
         *      }
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').variants('uid', 'branch_name').update(data)
         * .then((variants) => console.log(variants))
         */
    this.update = async (data, params = {}) => {
      try {
        const response = await http.put(this.urlPath,
          data,
          {
            headers: {
              ...cloneDeep(this.stackHeaders)
            },
            params: {
              ...cloneDeep(params)
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
         * @description The Delete a variant call is used to delete a specific variant from a content type.
         * @memberof Variants
         * @func delete
         * @returns {Promise<Object>} Response Object.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').variants('uid').delete()
         * .then((response) => console.log(response.notice))
         */
    this.delete = deleteEntity(http)

    /**
         * @description The fetch Variants call fetches Variants details.
         * @memberof Variants
         * @func fetch
         * @returns {Promise<Variants>} Promise for Variants instance
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').variants('uid').fetch()
         * .then((variants) => console.log(variants))
         *
         */
    this.fetch = fetch(http, 'variants')

    /**
         * @description The versions call fetches variant version details.
         * @memberof Variants
         * @func versions
         * @returns {Promise<Object>} Promise for variant versions data
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').variants('uid').versions()
         * .then((variants) => console.log(variants))
         *
         */
    this.versions = async () => {
      try {
        const response = await http.get(`${this.urlPath}/versions`, {
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
         * @description Publishes via the entry publish endpoint (POST .../entries/{entry_uid}/publish). Pass `publishDetails` as the object nested under `entry` (environments, locales, variants, variant_rules, etc.). Optional `headers` and `params` are merged into the HTTP request.
         * @memberof Variants
         * @func publish
         * @param {Object} options
         * @param {Object} options.publishDetails - Payload for the `entry` property (e.g. environments, locales, variants, variant_rules).
         * @param {String|null} [options.locale] - Top-level `locale` on the request body.
         * @param {Number|null} [options.version] - Top-level `version` on the request body.
         * @param {String|null} [options.scheduledAt] - Top-level `scheduled_at` (ISO) on the request body.
         * @param {Object} [options.headers={}] - Extra request headers merged with stack headers.
         * @param {Object} [options.params={}] - Query string parameters for the request.
         * @returns {Promise<Object>} Response data (e.g. notice, job_id).
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         * await client.stack({ api_key: 'api_key' }).contentType('ct').entry('entry_uid').variants('variant_uid').publish({
         *   publishDetails: {
         *     environments: ['production'],
         *     locales: ['en-us'],
         *     variants: [{ uid: 'variant_uid', version: 1 }],
         *     variant_rules: { publish_latest_base: false, publish_latest_base_conditionally: true }
         *   },
         *   locale: 'en-us'
         * })
         */
    this.publish = async ({
      publishDetails,
      locale = null,
      version = null,
      scheduledAt = null,
      headers: extraHeaders = {},
      params = {}
    }) => {
      const url = `${entryBaseUrlPath}/publish`
      const httpBody = {}
      httpBody.entry = cloneDeep(publishDetails)
      const baseHeaders = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      }
      return publishUnpublish(http, url, httpBody, baseHeaders, locale, version, scheduledAt, {
        headers: extraHeaders,
        params
      })
    }

    /**
         * @description Unpublishes via the entry unpublish endpoint (POST .../entries/{entry_uid}/unpublish). Pass `publishDetails` as the object nested under `entry`. Optional `headers` and `params` are merged into the HTTP request.
         * @memberof Variants
         * @func unpublish
         * @param {Object} options
         * @param {Object} options.publishDetails - Payload for the `entry` property (e.g. environments, locales, variants).
         * @param {String|null} [options.locale] - Top-level `locale` on the request body.
         * @param {Number|null} [options.version] - Top-level `version` on the request body.
         * @param {String|null} [options.scheduledAt] - Top-level `scheduled_at` (ISO) on the request body.
         * @param {Object} [options.headers={}] - Extra request headers merged with stack headers.
         * @param {Object} [options.params={}] - Query string parameters for the request.
         * @returns {Promise<Object>} Response data (e.g. notice, job_id).
         */
    this.unpublish = async ({
      publishDetails,
      locale = null,
      version = null,
      scheduledAt = null,
      headers: extraHeaders = {},
      params = {}
    }) => {
      const url = `${entryBaseUrlPath}/unpublish`
      const httpBody = {}
      httpBody.entry = cloneDeep(publishDetails)
      const baseHeaders = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      }
      return publishUnpublish(http, url, httpBody, baseHeaders, locale, version, scheduledAt, {
        headers: extraHeaders,
        params
      })
    }
  } else {
    /**
         * @description The Query on Variants will allow you to fetch details of all or specific Variants.
         * @memberof Variants
         * @func query
         * @param {Object} params - Query parameters
         * @prop {Int} params.locale Enter the code of the language of which the variants need to be included.
         * @prop {Object} params.query Queries that you can use to fetch filtered results.
         * @returns {Object} Query builder object with find(), count(), and findOne() methods.
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack().contentType('content_type_uid').entry('entry_uid').variants().query({ query: { title: 'Variants title' } }).find()
         * .then((variants) => console.log(variants))
         */
    this.query = query({ http: http, wrapperCollection: VariantsCollection })
  }
  bindModuleHeaders(this)
}
export function VariantsCollection (http, data) {
  const obj = cloneDeep(data.entries) || []
  const variantCollection = obj.map((variant) => {
    return new Variants(http, {
      content_type_uid: data.content_type_uid,
      entry_uid: variant.uid,
      variants_uid: variant._variant._uid,
      stackHeaders: data.stackHeaders,
      variants: variant
    })
  })
  return variantCollection
}
