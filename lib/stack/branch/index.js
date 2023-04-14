import cloneDeep from 'lodash/cloneDeep'
import { create, query, fetch, deleteEntity } from '../../entity'
import { Compare } from './compare'
import { MergeQueue } from './mergeQueue'
import error from '../../core/contentstackError'

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
    this.delete = deleteEntity(http, true)

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

    /**
     * @description Compare allows you compare any or specific ContentType or GlobalFields.
     * @memberof Branch
     * @func compare
     * @returns {Compare} Instance of Compare.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch('branch_uid').compare('compare_uid')
     *
     */
    this.compare = (compareBranchUid) => {
      const compareData = { stackHeaders: this.stackHeaders }
      if (compareBranchUid) {
        compareData.branches = {
          base_branch: this.uid,
          compare_branch: compareBranchUid
        }
      }
      return new Compare(http, compareData)
    }
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
     * const branch =   {
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

    /**
     * @description Merge allows user to merge branches in a Stack.
     * @memberof Branch
     * @func merge
     * @returns {Object} Response Object
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * 
     * const params = {
     *   base_branch: "main",
     *   compare_branch: "dev",
     *   default_merge_strategy: "merge_prefer_base",
     *   merge_comment: "Merging dev into main", 
     *   no_revert: true,
     * }
     * const mergeObj = {
     *   item_merge_strategies: [ 
     *     {
     *       uid: "global_field_uid", 
     *       type: "global_field", 
     *       merge_strategy: "merge_prefer_base"
     *     }
     *   ],
     * }
     *
     * client.stack({ api_key: 'api_key'}).branch().merge(mergeObj, params)
     */
    this.merge = async (mergeObj, params) => {
      const url = '/merge';
      const header = { 
        headers: { ...cloneDeep(this.stackHeaders)},
        params: params
      }
      try {
        const response = await http.post(url, mergeObj, header);
        if (response.data) return response.data;
        else throw error(response)
      } catch (e) {
        throw error(e);
      }
    }

    /**
     * @description Merge Queue provides list of all recent merge jobs in a Stack.
     * @memberof Branch
     * @func mergeQueue
     * @returns {MergeQueue} Instance of MergeQueue 
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().mergeQueue()
     *    
     */
    this.mergeQueue = (uid) => {
      const mergeData = { stackHeaders: this.stackHeaders, uid }
      return new MergeQueue(http, mergeData)
    }
  }
  return this
}

export function BranchCollection (http, data) {
  const obj = cloneDeep(data.branches) || data.branch_aliases || []
  return obj.map((branchData) => {
    return new Branch(http, { branch: branchData, stackHeaders: data.stackHeaders })
  })
}