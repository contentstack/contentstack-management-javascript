import cloneDeep from 'lodash/cloneDeep'
import {
  update,
  deleteEntity,
  fetch,
  upload,
  query,
  parseData
}
  from '../../../../entity'
import FormData from 'form-data'
import {
  createReadStream
} from 'fs'
import error from '../../../../core/contentstackError'
/**
 * An variants is the actual piece of content created using one of the defined content types. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Entries</a>.
 * @namespace Variants
 */
export function Variants (http, data) {
  Object.assign(this, cloneDeep(data))
  this.urlPath = `/content_types/${this.content_type_uid}/entries/${this.entry_uid}/variants`
  if (data && data.variants_uid) {
    this.urlPath += `/${this.variants_uid}`
    /**
         * @description The Create an variants call creates a new variants for the selected content type.
         * @memberof Variants
         * @func update
         * @returns {Promise<Variants.Variants>} Promise for Variants instance
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
         * @description The Delete an variants call is used to delete a specific variants from a content type.
         * @memberof Variants
         * @func delete
         * @returns {Object} Response Object.
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
         * @returns {Promise<Variants.Variants>} Promise for Variants instance
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
         * @description The version Variants call fetches Variants version details.
         * @memberof Variants
         * @func versions
         * @returns {Promise<Variants.Variants>} Promise for Variants instance
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
         * @description The Query on Variants will allow to fetch details of all or specific Variants
         * @memberof Variants
         * @func query
         * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
         * @param {Object} query Queries that you can use to fetch filtered results.
         * @returns {Array<Variants>} Array of Variants.
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack().contentType('content_type_uid').entry('entry_uid').variants().query({ query: { title: 'Variants title' } }).find()
         * .then((entries) => console.log(entries))
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
