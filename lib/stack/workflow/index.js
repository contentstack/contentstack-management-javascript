import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  update,
  deleteEntity,
  fetch,
  fetchAll
} from '../../entity'
import error from '../../core/contentstackError'
import ContentstackCollection from '../../contentstackCollection'
import { PublishRules, PublishRulesCollection } from './publishRules'

/**
 * Workflow is a tool that allows you to streamline the process of content creation and publishing, and lets you manage the content lifecycle of your project smoothly. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-workflows-and-publish-rules'>Workflows and Publish Rules</a>.
 * @namespace Workflow
 */

export function Workflow (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/workflows`

  if (data.workflow) {
    Object.assign(this, cloneDeep(data.workflow))
    this.urlPath = `/workflows/${this.uid}`

    /**
     * @description The Update Workflow request allows you to add a workflow stage or update the details of the existing stages of a workflow.
     * @memberof Workflow
     * @func update
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').fetch()
     * .then((workflow) => {
     *  workflow.name = 'My New Workflow'
     *  workflow.description = 'Workflow description'
     *  return workflow.update()
     * })
     * .then((workflow) => console.log(workflow))
     *
     */
    this.update = update(http, 'workflow')

    /**
     * @description The Disable Workflow request allows you to disable a workflow.
     * @memberof Workflow
     * @func disable
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').disable()
     * .then((workflow) => console.log(workflow))
     *
     */
    this.disable = async function () {
      try {
        const response = await http.get(`/workflows/${this.uid}/disable`, {
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        })
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The Enable Workflow request allows you to enable a workflow.
     * @memberof Workflow
     * @func enable
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').enable()
     * .then((workflow) => console.log(workflow))
     *
     */
    this.enable = async function () {
      try {
        const response = await http.get(`/workflows/${this.uid}/enable`, {
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        })
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }

    /**
     * @description The Delete Workflow call is used to delete an existing Workflow permanently from your Stack.
     * @memberof Workflow
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch workflow retrieves the comprehensive details of a specific Workflow of a stack.
     * @memberof Workflow
     * @func fetch
     * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').fetch()
     * .then((workflow) => console.log(workflow))
     *
     */
    this.fetch = fetch(http, 'workflow')
  } else {
    this.contentType = (contentTypeUID) => {
      if (contentTypeUID) {
        /**
             * @description The Delete Workflow call is used to delete an existing Workflow permanently from your Stack.
             * @memberof Workflow
             * @func getPublishRules
             * @returns {Object} Returns Object.
             * @param {string} action Enter the action that has been set in the Publishing Rule. Example:publish/unpublish
             * @param {string} locale Enter the code of the locale where your Publishing Rule will be applicable.
             * @param {string} environment Enter the UID of the environment where your Publishing Rule will be applicable.
             * @returns {ContentstackCollection} Result collection of content of PublishRules.
             * @example
             * import * as contentstack from '@contentstack/management'
             * const client = contentstack.client()
             *
             * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').contentType('contentType_uid').getPublishRules()
             * .then((collection) => console.log(collection))
             */
        async function getPublishRules (params) {
          const headers = {}
          if (this.stackHeaders) {
            headers.headers = this.stackHeaders
          }
          if (params) {
            headers.params = {
              ...cloneDeep(params)
            }
          }
          try {
            const response = await http.get(`/workflows/content_type/${contentTypeUID}`, headers)
            if (response.data) {
              return new ContentstackCollection(response, http, this.stackHeaders, PublishRulesCollection)
            } else {
              throw error(response)
            }
          } catch (err) {
            throw error(err)
          }
        }
        return {
          getPublishRules,
          stackHeaders: { ...this.stackHeaders }
        }
      }
    }
    /**
         * @description The Create a Workflow request allows you to create a Workflow.
         * @memberof Workflow
         * @func create
         * @returns {Promise<Workflow.Workflow>} Promise for Workflow instance
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * const workflow = {
         *	"workflow_stages": [
         *      {
         *			"color": "#2196f3",
         *			"SYS_ACL": {
         *				"roles": {
         *					"uids": []
         *				},
         *				"users": {
         *					"uids": [
         *						"$all"
         *					]
         *				},
         * 				"others": {}
         *			},
         *			"next_available_stages": [
         *				"$all"
         *			],
         *			"allStages": true,
         *			"allUsers": true,
         *			"specificStages": false,
         *			"specificUsers": false,
         *			"entry_lock": "$none", //assign any one of the assign any one of the ($none/$others/$all)
         *			"name": "Review"
         *		},
         *		{
         *			"color": "#74ba76",
         *			"SYS_ACL": {
         *				"roles": {
         *					"uids": []
         *				},
         *				"users": {
         *					"uids": [
         *						"$all"
         *					]
         *				},
         *				"others": {}
         *			},
         *			"allStages": true,
         *				"allUsers": true,
         *				"specificStages": false,
         *				"specificUsers": false,
         *				"next_available_stages": [
         *					"$all"
         *				],
         *				"entry_lock": "$none",
         *				"name": "Complete"
         *			}
         *		],
         *		"admin_users": {
         *			"users": []
         *		},
         *  		"name": "Workflow Name",
         *		"enabled": true,
         *		"content_types": [
         *			"$all"
         *		]
         *	}
         *  client.stack().workflow().create({ workflow })
         * .then((workflow) => console.log(workflow))
         */
    this.create = create({ http: http })

    /**
         * @description The Get all Workflows request retrieves the details of all the Workflows of a stack.
         * @memberof Workflow
         * @func fetchAll
         * @param {Int} limit The limit parameter will return a specific number of Workflows in the output.
         * @param {Int} skip The skip parameter will skip a specific number of Workflows in the output.
         * @param {Boolean}include_count To retrieve the count of Workflows.
         * @returns {ContentstackCollection} Result collection of content of specified module.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).workflow().fetchAll()
         * .then((collection) => console.log(collection))
         *
         */
    this.fetchAll = fetchAll(http, WorkflowCollection)

    /**
         * @description The Publish rule allow you to create, fetch, delete, update the publish rules.
         * @memberof Workflow
         * @func publishRule
         * @param {Int} ruleUid The UID of the Publish rules you want to get details.
         * @returns {PublishRules} Instace of PublishRules.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).workflow().publishRule().fetchAll()
         * .then((collection) => console.log(collection))
         *
         * client.stack({ api_key: 'api_key'}).workflow().publishRule('rule_uid').fetch()
         * .then((publishrule) => console.log(publishrule))
         *
         */
    this.publishRule = (ruleUid = null) => {
      const publishInfo = { stackHeaders: this.stackHeaders }
      if (ruleUid) {
        publishInfo.publishing_rule = { uid: ruleUid }
      }
      return new PublishRules(http, publishInfo)
    }
  }
}

export function WorkflowCollection (http, data) {
  const obj = cloneDeep(data.workflows) || []
  const workflowCollection = obj.map((userdata) => {
    return new Workflow(http, { workflow: userdata, stackHeaders: data.stackHeaders })
  })
  return workflowCollection
}
