import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  update,
  query,
  deleteEntity,
  move,
  parseData
} from '../../../entity'

export function Terms (http, data) {
  this.stackHeaders = data.stackHeaders
  this.taxonomy_uid = data.taxonomy_uid
  this.urlPath = `/taxonomies/${this.taxonomy_uid}/terms`

  if (data && data.term) {
    Object.assign(this, cloneDeep(data.term))
    this.urlPath = `/taxonomies/${this.taxonomy_uid}/terms/${this.uid}`

    /**
     * @description The Update terms call is used to update an existing term.
     * @memberof Terms
     * @func update
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').fetch()
     * .then((terms) => {
     *    terms.name = 'terms name'
     *    return terms.update()
     * })
     * .then((terms) => console.log(terms))
     *
     */
    this.update = update(http, 'term')

    /**
     * @description The Delete terms call is used to delete an existing term.
     * @memberof Terms
     * @func delete
     * @returns {Promise<Terms.Terms>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').delete()
     * .then((response) => console.log(response.notice))
     *
     */
    this.delete = deleteEntity(http)

    /**
     * @description The Fetch terms call is used to fetch an existing term.
     * @memberof Terms
     * @func fetch
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').fetch()
     * .then((terms) => console.log(terms))
     *
     */
    this.fetch = fetch(http, 'term')

    /**
     * @description The ancestors call is used to get all the ancestor terms of an existing term.
     * @memberof Terms
     * @func ancestors
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').ancestors()
     * .then((terms) => console.log(terms))
     *
     */
    this.ancestors = async (params = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) }
        }
        const response = await http.get(`${this.urlPath}/ancestors`, headers)
        return parseData(response, this.stackHeaders)
      } catch (err) {
        console.error(err)
        throw err
      }
    }

    /**
     * @description The move call is used to  existing term.
     * @memberof Terms
     * @func descendants
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').descendants()
     * .then((terms) => console.log(terms))
     *
     */
    this.descendants = async (params = {}) => {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) }
        }
        const response = await http.get(`${this.urlPath}/descendants`, headers)
        return parseData(response, this.stackHeaders)
      } catch (err) {
        console.error(err)
        throw err
      }
    }

    /**
     * @description The move call is used to update the parent uid.
     * @memberof Terms
     * @func anscestors
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const term = {
     *  parent_uid: 'parent_uid',
     *  order: 2
     * }
     * client.stack({ api_key: 'api_key'}).terms('terms_uid').move(term)
     * .then((terms) => console.log(terms))
     *
     */
    this.move = move(http, 'term')
  } else {
    /**
     * @description The Create terms call is used to create a terms.
     * @memberof Terms
     * @func create
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const terms = {
     *    uid: 'terms_testing1',
     *    name: 'terms testing',
     *    description: 'Description for terms testing'
     * }
     * client.stack({ api_key: 'api_key'}).terms().create({terms})
     * .then(terms) => console.log(terms)
     *
     */
    this.create = create({ http })

    /**
     * @description The Query on Terms will allow to fetch details of all Terms.
     * @memberof Terms
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @func query
     * @returns {Array<Terms>} Array of Terms.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().terms().query().find()
     * .then((terms) => console.log(terms)
     */
    this.query = query({ http: http, wrapperCollection: TermsCollection })
  }
  /**
     * @description The Search terms call is used to search a term.
     * @memberof Terms
     * @func search
     * @returns {Promise<Terms.Terms>} Promise for Terms instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const term_string = ''
     * client.stack({ api_key: 'api_key'}).terms().search(term_string)
     * .then(terms) => console.log(terms)
     *
     */
  this.search = async (term = '', params = {}) => {
    try {
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) }
      }
      const response = await http.get(`taxonomies/${this.taxonomy_uid}/terms?term=${term}`, headers)
      return parseData(response, this.stackHeaders)
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
export function TermsCollection (http, data) {
  const obj = cloneDeep(data.terms) || []
  const termsCollection = obj.map((term) => {
    return new Terms(http, { term: term, taxonomy_uid: data.taxonomy_uid, stackHeaders: data.stackHeaders })
  })
  return termsCollection
}
