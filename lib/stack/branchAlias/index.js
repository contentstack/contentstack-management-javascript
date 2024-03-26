import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'
import { deleteEntity, fetchAll, parseData } from '../../entity'
import { Branch, BranchCollection } from '../branch'

/**
 *
 * @namespace BranchAlias
 */
export function BranchAlias (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/stacks/branch_aliases`
  if (data.branch_alias) {
    Object.assign(this, cloneDeep(data.branch_alias))
    this.urlPath = `/stacks/branch_aliases/${this.uid}`

    /**
     * @description The Update BranchAlias call lets you update the name of an existing BranchAlias.
     * @memberof BranchAlias
     * @func update
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').createOrUpdate('branch_uid')
     * .then((branch) => {
     *  branch.name = 'new_branch_name'
     *  return branch.update()
     * })
     * .then((branch) => console.log(branch))
     *
     */
    this.createOrUpdate = async (targetBranch) => {
      try {
        const response = await http.put(this.urlPath, { branch_alias: { target_branch: targetBranch } }, { headers: {
          ...cloneDeep(this.stackHeaders)
        }
        })
        if (response.data) {
          return new Branch(http, parseData(response, this.stackHeaders))
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
    /**
     * @description The Delete BranchAlias call is used to delete an existing BranchAlias permanently from your Stack.
     * @memberof BranchAlias
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http, true)

    /**
     * @description The fetch BranchAlias call fetches BranchAlias details.
     * @memberof BranchAlias
     * @func fetch
     * @returns {Promise<Branch.Branch>} Promise for Branch instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').fetch()
     * .then((branch) => console.log(branch))
     *
     */
    this.fetch = async function (param = {}) {
      try {
        const headers = {
          headers: { ...cloneDeep(this.stackHeaders) },
          params: {
            ...cloneDeep(param)
          }
        } || {}
        const response = await http.get(this.urlPath, headers)
        if (response.data) {
          return new Branch(http, parseData(response, this.stackHeaders))
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  } else {
    /**
     * @description The Get all BranchAlias request retrieves the details of all the Branch of a stack.
     * @memberof BranchAlias
     * @func fetchAll
     * @param {Int} limit The limit parameter will return a specific number of Branch in the output.
     * @param {Int} skip The skip parameter will skip a specific number of Branch in the output.
     * @param {Boolean}include_count To retrieve the count of Branch.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = fetchAll(http, BranchCollection)
  }
  return this
}
