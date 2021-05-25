import cloneDeep from 'lodash/cloneDeep'
import { create, query, fetch, deleteEntity } from '../../entity'

/**
 *
 * @namespace Branch
 */
export function Branch (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/branches`

  data.branch = data.branch || data.branch_alias
  delete data.branch_alias

  if (data.branch) {
    Object.assign(this, cloneDeep(data.branch))
    this.urlPath = `/stacks/branches/${this.uid}`

    /**
     * @description The Delete Branch call is used to delete an existing Branch permanently from your Stack.
     * @memberof Branch
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Branch call fetches Branch details.
     * @memberof Branch
     * @func fetch
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').fetch()
     * .then((branch) => console.log(branch))
     *
     */
    this.fetch = fetch(http, 'branch')

  } else {
    /**
     * @description The Create a Branch call creates a new branch in a particular stack of your Contentstack account.
     * @memberof Branch
     * @func create
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const branch = {
     *      name: 'branch_name',
     *      source: 'master'
     * }
     * client.stack({ api_key: 'api_key'}).branch().create({ branch })
     * .then((branch) => { console.log(branch) })
     */
    this.create = create({ http: http })

    /**
     * @description The 'Get all Branch' request returns comprehensive information about branch created in a Stack.
     * @memberof Branch
     * @func query
     * @returns {Promise<ContentstackCollection.ContentstackCollection>} Promise for ContentstackCollection instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().query().find()
     * .then((collection) => { console.log(collection) })
     */
    this.query = query({ http, wrapperCollection: BranchCollection })
  }
  return this
}

export function BranchCollection (http, data) {
  const obj = cloneDeep(data.branches) || data.branch_aliases || []
  return obj.map((branchData) => {
    return new Branch(http, { branch: branchData, stackHeaders: data.stackHeaders })
  })
}
