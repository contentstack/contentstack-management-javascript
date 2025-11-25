import cloneDeep from 'lodash/cloneDeep'
import {
  deleteEntity,
  fetch,
  query
}
  from '../../../../entity'
import error from '../../../../core/contentstackError'
/**
 * Variants allow you to create variant versions of entries within a content type. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-variants'>Variants</a>.
 * @namespace Variants
 */
export function Variants (http, data) {
  Object.assign(this, cloneDeep(data))
  this.urlPath = `/content_types/${this.content_type_uid}/entries/${this.entry_uid}/variants`
  if (data && data.variants_uid) {
    this.urlPath += `/${this.variants_uid}`
    /**
         * @description The Update a variant call updates an existing variant for the selected content type.
         * @memberof Variants
         * @func update
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
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('entry_uid').variants('uid').update(data)
         * .then((variants) => console.log(variants))
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
