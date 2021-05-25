import cloneDeep from 'lodash/cloneDeep'
import error from '../../core/contentstackError'
import { deleteEntity, parseData } from '../../entity'
import { Branch } from '../branch'

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
     * @returns {Promise<BranchAlias.BranchAlias>} Promise for BranchAlias instance
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
     * @returns {Promise<BranchAlias.BranchAlias>} Promise for BranchAlias instance
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
          headers: { ...cloneDeep(this.stackHeaders) }
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
  }
  return this
}

export function BranchAliasCollection (http, data) {
  const obj = cloneDeep(data.branch_aliases) || []
  return obj.map((branchAlias) => {
    return new BranchAlias(http, { branch_alias: branchAlias, stackHeaders: data.stackHeaders })
  })
}
