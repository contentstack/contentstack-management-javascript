/* eslint-disable camelcase */
import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  query,
  update,
  deleteEntity
} from '../../entity'
import { Terms, TermsCollection } from './terms'

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
  }
}
export function TaxonomyCollection (http, data) {
  const obj = cloneDeep(data.taxonomies) || []
  const taxonomyCollection = obj.map((userdata) => {
    return new Taxonomy(http, { taxonomy: userdata, stackHeaders: data.stackHeaders })
  })
  return taxonomyCollection
}
