/* eslint-disable camelcase */
import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  query,
  update,
  deleteEntity,
  upload,
  parseData
} from '../../entity'
import { Terms, TermsCollection } from './terms'
import FormData from 'form-data'
import { createReadStream } from 'fs'
import error from '../../core/contentstackError'

export function Taxonomy (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/taxonomies`

  if (data.taxonomy) {
    Object.assign(this, cloneDeep(data.taxonomy))
    if (data.taxonomy.terms) {
      this.terms = new TermsCollection(http, { terms: data.taxonomy.terms, stackHeaders: data.stackHeaders }, this.uid)
    }
    this.urlPath = `/taxonomies/${this.uid}`

    /**
     * @description The Update taxonomy call is used to update an existing taxonomy.
     * @memberof Taxonomy
     * @func update
     * @returns {Promise<Taxonomy.Taxonomy>} Promise for Taxonomy instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).taxonomy('taxonomyUid').fetch()
     * .then((taxonomy) => {
     *    taxonomy.name = 'taxonomy name'
     *    return taxonomy.update()
     * })
     * .then((taxonomy) => console.log(taxonomy))
     *
     */
    this.update = update(http, 'taxonomy')

    /**
     * @description The Delete taxonomy call is used to delete an existing taxonomy.
     * @memberof Taxonomy
     * @func delete
     * @returns {Promise<Taxonomy.Taxonomy>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).taxonomy('taxonomyUid').delete()
     * .then((response) => console.log(response.notice))
     *
     */
    this.delete = deleteEntity(http)

    /**
     * @description The Fetch taxonomy call is used to fetch an existing taxonomy.
     * @memberof Taxonomy
     * @func fetch
     * @returns {Promise<Taxonomy.Taxonomy>} Promise for Taxonomy instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).taxonomy('taxonomyUid').fetch()
     * .then((taxonomy) => console.log(taxonomy))
     *
     */
    this.fetch = fetch(http, 'taxonomy')

    /**
     * @description The Export taxonomy call is used to export an existing taxonomy.
     * @memberof Taxonomy
     * @func export
     * @returns {Promise<Taxonomy.Taxonomy>} Promise for Taxonomy instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).taxonomy('taxonomyUid').export()
     * .then((taxonomy) => console.log(taxonomy))
     *
     */
    this.export = async () => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) }
        }
        const response = await http.get(`${this.urlPath}/export`, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }


    this.terms = (uid = '') => {
      const data = { stackHeaders: this.stackHeaders }
      data.taxonomy_uid = this.uid
      if (uid) {
        data.term = { uid: uid }
      }
      return new Terms(http, data)
    }
  } else {
    /**
     * @description The Create taxonomy call is used to create a taxonomy.
     * @memberof Taxonomy
     * @func create
     * @returns {Promise<Taxonomy.Taxonomy>} Promise for Taxonomy instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const taxonomy = {
     *    uid: 'taxonomy_testing1',
     *    name: 'taxonomy testing',
     *    description: 'Description for Taxonomy testing'
     * }
     * client.stack({ api_key: 'api_key'}).taxonomy().create({taxonomy})
     * .then(taxonomy) => console.log(taxonomy)
     *
     */
    this.create = create({ http })

    /**
     * @description The Query on Taxonomy will allow to fetch details of all Taxonomies.
     * @memberof Taxonomy
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @func query
     * @returns {Array<Taxonomy>} Array of Taxonomy.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().taxonomy().query().find()
     * .then((taxonomies) => console.log(taxonomies)
     */
    this.query = query({ http: http, wrapperCollection: TaxonomyCollection })

    /**
     * @description The 'Import taxonomy' import a single entry by uploading JSON or CSV files.
     * @memberof Taxonomy
     * @func import
     * @param {String} data.taxonomy path to file
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const data = {
     *  taxonomy: 'path/to/file.json',
     * }
     * // Import a Taxonomy
     * client.stack({ api_key: 'api_key'}).taxonomy().import(data)
     * .then((taxonomy) => console.log(taxonomy))
     */
    this.import = async function (data, params = {}) {
      try {
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
}
export function TaxonomyCollection (http, data) {
  const obj = cloneDeep(data.taxonomies) || []
  const taxonomyCollection = obj.map((userdata) => {
    return new Taxonomy(http, { taxonomy: userdata, stackHeaders: data.stackHeaders })
  })
  return taxonomyCollection
}

export function createFormData (data) {
  return () => {
    const formData = new FormData()
    const uploadStream = createReadStream(data.taxonomy)
    formData.append('taxonomy', uploadStream)
    return formData
  }
}