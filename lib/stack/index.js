import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { UserCollection } from '../user/index'
import { Role } from './roles/index'
import { create, query, update, fetch, deleteEntity } from '../entity'
import { ContentType } from './contentType/index'
import { GlobalField } from './globalField/index'
import { DeliveryToken } from './deliveryToken/index'
import { Environment } from './environment'
import { Asset } from './asset'
import { Locale } from './locale'
import { Extension } from './extension'
import { Webhook } from './webhook'
import { Workflow } from './workflow'
import { Release } from './release'
import { BulkOperation } from './bulkOperation'
import { Label } from './label'
import { Branch } from './branch'
import { BranchAlias } from './branchAlias'
import { AuditLog } from './auditlog'
import { Taxonomy } from './taxonomy'
import { ManagementToken } from './managementToken'
import { Variants } from './variants'
import { VariantGroup } from './variantGroup'

/**
 * A stack is a space that stores the content of a project (a web or mobile property). Within a stack, you can create content structures, content entries, users, etc. related to the project. Read more about <a href='https://www.contentstack.com/docs/guide/stack'>Stacks</a>.
 * @namespace Stack
 */
export function Stack (http, data) {
  this.urlPath = '/stacks'
  if (data) {
    if (data.stack) {
      Object.assign(this, cloneDeep(data.stack))
    } else if (data.organization_uid) {
      this.organization_uid = data.organization_uid
    }
  }
  if (data && data.stack && data.stack.api_key) {
    this.stackHeaders = { api_key: this.api_key }
    if (this.management_token && this.management_token !== undefined) {
      http.defaults.headers.authorization = this.management_token
      delete this.management_token
    }

    if (this.branch_uid) {
      this.stackHeaders.branch = this.branch_uid
    }
    /**
     * @description The Update stack call lets you update the name and description of an existing stack.
     * @memberof Stack
     * @func update
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).fetch()
     * .then((stack) => {
     *  stack.name = 'My New Stack'
     *  stack.description = 'My new test stack'
     *  return stack.update()
     * })
     * .then((stack) => console.log(stack))
     *
     */
    this.update = update(http, 'stack')

    /**
     * @description The fetch stack call fetches stack details.
     * @memberof Stack
     * @func fetch
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).fetch()
     * .then((stack) => console.log(stack))
     *
     */
    this.fetch = fetch(http, 'stack')

    /**
     * @description Content type defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the ContentType you want to get details.
     * @returns {ContentType} Instance of ContentType.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).contentType().create()
     * .then((contentType) => console.log(contentType))
     *
     * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').fetch()
     * .then((contentType) => console.log(contentType))
     */
    this.contentType = (contentTypeUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (contentTypeUid) {
        data.content_type = { uid: contentTypeUid }
      }
      return new ContentType(http, data)
    }

    /**
     * @description Locale allows you to create and publish entries in any language.
     * @param {String} uid The UID of the Locale you want to get details.
     * @returns {Locale} Instance of Locale.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).locale().create()
     * .then((locale) => console.log(locale))
     *
     * client.stack({ api_key: 'api_key'}).locale('locale_code').fetch()
     * .then((locale) => console.log(locale))
     */
    this.locale = (code = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (code) {
        data.locale = { code: code }
      }
      return new Locale(http, data)
    }

    /**
     * @description Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
     * @param {String} uid The UID of the Asset you want to get details.
     * @returns {Asset} Instance of Asset.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().create()
     * .then((asset) => console.log(asset))
     *
     * client.stack({ api_key: 'api_key'}).asset('asset_uid').fetch()
     * .then((asset) => console.log(asset))
     */
    this.asset = (assetUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (assetUid) {
        data.asset = { uid: assetUid }
      }
      return new Asset(http, data)
    }
    /**
     * @description Global field defines the structure or schema of a page or a section of your web or mobile property.
     * @param {String} uid The UID of the Global field you want to get details.
     * @returns {GlobalField} Instance of Global field.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).globalField().create()
     * .then((globalField) => console.log(globalField))
     *
     * client.stack({ api_key: 'api_key'}).globalField('globalField_uid').fetch()
     * .then((globalField) => console.log(globalField))
     */
    this.globalField = (globalFieldUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (globalFieldUid) {
        data.global_field = { uid: globalFieldUid }
      }
      return new GlobalField(http, data)
    }

    /**
     * @description Environment corresponds to one or more deployment servers or a content delivery destination where the entries need to be published.
     * @param {String} uid The UID of the Environment you want to get details.
     * @returns {Environment} Instance of Environment.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).environment().create()
     * .then((environment) => console.log(environment))
     *
     * client.stack({ api_key: 'api_key'}).environment('environment_uid').fetch()
     * .then((environment) => console.log(environment))
     */
    this.environment = (environmentUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (environmentUid) {
        data.environment = { name: environmentUid }
      }
      return new Environment(http, data)
    }

    /**
     * @description Branch corresponds to Stack branch.
     * @param {String}
     * @returns {Branch}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branch().create()
     * .then((branch) => console.log(branch))
     *
     * client.stack({ api_key: 'api_key' }).branch('branch_uid').fetch()
     * .then((branch) => console.log(branch))
     *
     */
    this.branch = (branchUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (branchUid) {
        data.branch = { uid: branchUid }
      }
      return new Branch(http, data)
    }

    /**
     * @description Branch corresponds to Stack branch.
     * @param {String}
     * @returns {BranchAlias}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias().create()
     * .then((branch) => console.log(branch))
     *
     * client.stack({ api_key: 'api_key' }).branchAlias('branch_alias_uid').fetch()
     * .then((branch) => console.log(branch))
     *
     */
    this.branchAlias = (branchUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (branchUid) {
        data.branch_alias = { uid: branchUid }
      }
      return new BranchAlias(http, data)
    }

    /**
     * @description Delivery Tokens provide read-only access to the associated environments.
     * @param {String} deliveryTokenUid The UID of the Delivery Token field you want to get details.
     * @returns {DeliveryToken} Instance of DeliveryToken.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken().create()
     * .then((deliveryToken) => console.log(deliveryToken))
     *
     * client.stack({ api_key: 'api_key'}).deliveryToken('deliveryToken_uid').fetch()
     * .then((deliveryToken) => console.log(deliveryToken))
     */
    this.deliveryToken = (deliveryTokenUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (deliveryTokenUid) {
        data.token = { uid: deliveryTokenUid }
      }
      return new DeliveryToken(http, data)
    }

    /**
     * @description Management Tokens are tokens that provide you with read-write access to the content of your stack.
     * @param {String} managementTokenUid The UID of the Management Token field you want to get details.
     * @returns {ManagementToken} Instance of ManagementToken.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).managementToken().create()
     * .then((managementToken) => console.log(managementToken))
     *
     * client.stack({ api_key: 'api_key'}).managementToken('managementToken_uid').fetch()
     * .then((managementToken) => console.log(managementToken))
     */
    this.managementToken = (managementTokenUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (managementTokenUid) {
        data.token = { uid: managementTokenUid }
      }
      return new ManagementToken(http, data)
    }

    /**
     * @description Extensions let you create custom fields and custom widgets that lets you customize Contentstack's default UI and behavior.
     * @param {String} extensionUid The UID of the Extension you want to get details.
     * @returns {Extension} Instance of Extension.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).extension().create()
     * .then((extension) => console.log(extension))
     *
     * client.stack({ api_key: 'api_key'}).extension('extension_uid').fetch()
     * .then((extension) => console.log(extension))
     */
    this.extension = (extensionUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (extensionUid) {
        data.extension = { uid: extensionUid }
      }
      return new Extension(http, data)
    }

    /**
     * @description  Workflow is a tool that allows you to streamline the process of content creation and publishing, and lets you manage the content lifecycle of your project smoothly.
     * @param {String} workflowUid The UID of the Workflow you want to get details.
     * @returns {Workflow} Instance of Workflow.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).workflow().create()
     * .then((workflow) => console.log(workflow))
     *
     * client.stack({ api_key: 'api_key'}).workflow('workflow_uid').fetch()
     * .then((workflow) => console.log(workflow))
     */
    this.workflow = (workflowUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (workflowUid) {
        data.workflow = { uid: workflowUid }
      }
      return new Workflow(http, data)
    }

    /**
     * @description  Webhooks allow you to specify a URL to which you would like Contentstack to post data when an event happens.
     * @param {String} webhookUid The UID of the Webhook you want to get details.
     * @returns {Webhook} Instance of Webhook.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).webhook().create()
     * .then((webhook) => console.log(webhook))
     *
     * client.stack({ api_key: 'api_key'}).webhook('webhook_uid').fetch()
     * .then((webhook) => console.log(webhook))
     */
    this.webhook = (webhookUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (webhookUid) {
        data.webhook = { uid: webhookUid }
      }
      return new Webhook(http, data)
    }

    /**
     * @description Labels allow you to group a collection of content within a stack. Using labels you can group content types that need to work together
     * @param {String} uid The UID of the Label you want to get details.
     * @returns {Label} Instance of Label.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).label().create()
     * .then((label) => console.log(label))
     *
     * client.stack({ api_key: 'api_key'}).label('label_uid').fetch()
     * .then((label) => console.log(label))
     */
    this.label = (labelUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (labelUid) {
        data.label = { uid: labelUid }
      }
      return new Label(http, data)
    }

    /**
     * @description For creating ungrouped variants.
     * @param {String} uid The UID of the variants you want to get details.
     * @returns {Variants} Instance of variants.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).variants().create()
     * .then((variants) => console.log(variants))
     *
     * client.stack({ api_key: 'api_key'}).variants('variants_uid').fetch()
     * .then((variants) => console.log(variants))
     */
    this.variants = (variantsUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (variantsUid) {
        data.variants = { uid: variantsUid }
      }
      return new Variants(http, data)
    }


    /**
     * @description You can pin a set of entries and assets (along with the deploy action, i.e., publish/unpublish) to a ‘release’, and then deploy this release to an environment.
     * @param {String} releaseUid The UID of the Releases you want to get details.
     * @returns {Release} Instance of Release.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).release().create()
     * .then((release) => console.log(release))
     *
     * client.stack({ api_key: 'api_key'}).release('release_uid').fetch()
     * .then((release) => console.log(release))
     */
    this.release = (releaseUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (releaseUid) {
        data.release = { uid: releaseUid }
      }
      return new Release(http, data)
    }

    /**
     * Bulk operations such as Publish, Unpublish, and Delete on multiple entries or assets.
     * @returns {BulkOperation} Instance of BulkOperation.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * const publishDetails = {
     *   entries: [
     *     {
     *       uid: '{{entry_uid}}',
     *       content_type: '{{content_type_uid}}',
     *       version: '{{version}}',
     *       locale: '{{entry_locale}}'
     *     }
     *   ],
     *   assets: [{
     *     uid: '{{uid}}'
     *   }],
     *   locales: [
     *     'en'
     *   ],
     *   environments: [
     *     '{{env_name}}/env_uid}}'
     *   ]
     * }
     * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails })
     * .then((response) => {  console.log(response.notice) })
     *
     */
    this.bulkOperation = () => {
      const data = { stackHeaders: this.stackHeaders }
      return new BulkOperation(http, data)
    }

    /**
     * @description The Get all users of a stack call fetches the list of all users of a particular stack
     * @memberof Stack
     * @func users
     * @returns {Array<User>} Array of User's including owner of Stack
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).users()
     * .then((users) => console.log(users))
     *
     */
    this.users = async () => {
      try {
        const response = await http.get(this.urlPath, {
          params: {
            include_collaborators: true
          },
          headers: {
            ...cloneDeep(this.stackHeaders)
          }
        })
        if (response.data) {
          return UserCollection(http, response.data.stack)
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Update User Role API Request updates the roles of an existing user account.
     * This API Request will override the existing roles assigned to a user
     * @memberof Stack
     * @func updateUsersRoles
     * @param {*} users object containing userId and array of roles to assign user.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const users = {
     *  user_uid: ['role_uid_1', 'role_uid_2' ]
     * }
     *
     * client.stack({ api_key: 'api_key'}).updateUsersRoles(users)
     * .then((response) => console.log(response.notice))
     *
     */
    this.updateUsersRoles = async (data) => {
      try {
        const response = await http.post(`${this.urlPath}/users/roles`,
          { users: data },
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
     * @description The Transfer stack ownership to other users call sends the specified user an email invitation for accepting the ownership of a particular stack.
     * @memberof Stack
     * @func transferOwnership
     * @param {String} email The email address of the user to whom you wish to transfer the ownership of the stack.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).transferOwnership('emailId')
     * .then((response) => console.log(response.notice))
     *
     */

    this.transferOwnership = async (email) => {
      try {
        const response = await http.post(`${this.urlPath}/transfer_ownership`,
          { transfer_to: email },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
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
     * @description The Get stack settings call retrieves the configuration settings of an existing stack.
     * @memberof Stack
     * @func settings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).settings()
     * .then((settings) => console.log(settings))
     *
     */
    this.settings = async () => {
      try {
        const response = await http.get(`${this.urlPath}/settings`,
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Reset stack settings call resets your stack to default settings, and additionally, lets you add parameters to or modify the settings of an existing stack.
     * @memberof Stack
     * @func resetSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).resetSettings()
     * .then((settings) => console.log(settings))
     *
     */
    this.resetSettings = async () => {
      try {
        const response = await http.post(`${this.urlPath}/settings`, { stack_settings: { discrete_variables: {}, stack_variables: {} } },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Add stack settings call lets you add settings for an existing stack.
     * @memberof Stack
     * @func addSettings
     * @returns {Object} Configuration settings of stack.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).addSettings({ key: 'value' })
     * .then((settings) => console.log(settings))
     *
     */
    this.addSettings = async (stackVariables = {}) => {
      try {
        const response = await http.post(`${this.urlPath}/settings`, { stack_settings: { stack_variables: stackVariables } },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
        if (response.data) {
          return response.data.stack_settings
        } else {
          return error(response)
        }
      } catch (err) {
        return error(err)
      }
    }

    /**
     * @description The Share a stack call shares a stack with the specified user to collaborate on the stack.
     * @memberof Stack
     * @func share
     * @param {Array<String>} emails - Email ID of the user with whom you wish to share the stack
     * @param {Array<String>} roles - The role uid that you wish to assign the user.
     * @returns {Object} Response Object.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).share([ "manager@example.com" ], { "manager@example.com": [ "abcdefhgi1234567890" ] })
     * .then((response) => console.log(response.notice))
     *
     */
    this.share = async (emails = [], roles = {}) => {
      try {
        const response = await http.post(`${this.urlPath}/share`, { emails: emails, roles: roles },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
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
     * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
     * @memberof Stack
     * @func unShare
     * @param {String} email The email ID of the user from whom you wish to unshare the stack.
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).unShare('email@id.com')
     * .then((response) => console.log(response.notice))
     *
     */
    this.unShare = async (email) => {
      try {
        const response = await http.post(`${this.urlPath}/unshare`, { email: email },
          { headers: {
            ...cloneDeep(this.stackHeaders)
          } })
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
     * @description Variant Group allows you to create a variant groups.
     * @param {String} uid The UID of the variant group you want to get details.
     * @returns {VariantGroup} Instance of VariantGroup.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).variantGroup().create()
     * .then((variant_group) => console.log(variant_group))
     *
     * client.stack({ api_key: 'api_key'}).variantGroup('variant_group_uid').fetch()
     * .then((variant_group) => console.log(variant_group))
     */
    this.variantGroup = (variantGroupUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (variantGroupUid) {
        data.variant_group = { uid: variantGroupUid }
      }
      return new VariantGroup(http, data)
    }

    /**
     * @description A role is a collection of permissions that will be applicable to all the users who are assigned this role.
     * @memberof Stack
     * @func role
     * @param {String=} uid The UID of the role you want to get details.
     * @returns {Role} Instance of Role.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).role().create({
     * "role":
     *       {
     *        "name":"testRole",
     *        "description":"",
     *        "rules":[...],
     *       }
     * })
     * .then((role) => console.log(role))
     *
     * client.stack({ api_key: 'api_key'}).role('role_uid').fetch())
     * .then((role) => console.log(role))
     *
     */
    this.role = (uid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (uid) {
        data.role = { uid: uid }
      }
      return new Role(http, data)
    }

    /**
     * @description Taxonomies allow you to group a collection of content within a stack. Using taxonomies you can group content types that need to work together
     * @param {String} uid The UID of the Taxonomy you want to get details.
     * @returns {Taxonomy} Instance of Taxonomy.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).taxonomy().create()
     * .then((taxonomy) => console.log(taxonomy))
     *
     * client.stack({ api_key: 'api_key'}).taxonomy('taxonomy_uid').fetch()
     * .then((taxonomy) => console.log(taxonomy))
     */
    this.taxonomy = (taxonomyUid = '') => {
      const data = { stackHeaders: this.stackHeaders }
      if (taxonomyUid) {
        data.taxonomy = { uid: taxonomyUid }
      }
      return new Taxonomy(http, data)
    }

    /**
     * @description The delete stack call lets you delete the stack.
     * @memberof Stack
     * @func delete
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).delete()
     * .then((stack) => console.log(stack))
     *
     */
    this.delete = deleteEntity(http)
  } else {
    /**
     * @description The Create stack call creates a new stack in your Contentstack account.
     * @memberof Stack
     * @func create
     * @returns {Promise<Stack.Stack>} Promise for Stack instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().create({name: 'My New Stack'}, { organization_uid: 'org_uid' })
     * .then((stack) => console.log(stack))
     */
    this.create = create({ http: http, params: this.organization_uid ? { organization_uid: this.organization_uid } : null })

    /**
     * @description The Query on Stack will allow to fetch details of all or specific Stack.
     * @memberof Stack
     * @func query
     * @param {Boolean} include_collaborators Set this parameter to 'true' to include the details of the stack collaborators.
     * @param {Boolean} include_stack_variablesSet this to 'true' to display the stack variables. Stack variables are extra information about the stack, such as the description, format of date, format of time, and so on. Users can include or exclude stack variables in the response.
     * @param {Boolean} include_discrete_variables Set this to 'true' to view the access token of your stack.
     * @param {Boolean} include_count Set this to 'true' to include in the response the total count of the stacks owned by or shared with a user account.
     * @param {Object} query Queries that you can use to fetch filtered results.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().query({ query: { name: 'Stack Name' } }).find()
     * .then((stack) => console.log(stack))
     */
    this.query = query({ http: http, wrapperCollection: StackCollection })

    /**
     * @description Audit log displays a record of all the activities performed in a stack and helps you keep a track of all published items, updates, deletes, and current status of the existing content.
     * @param {String}
     * @returns {AuditLog}
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).auditLog().fetchAll()
     * .then((logs) => console.log(logs))
     *
     * client.stack({ api_key: 'api_key' }).auditLog('log_item_uid').fetch()
     * .then((log) => console.log(log))
     *
     */
    this.auditLog = (logItemUid = null) => {
      const data = { stackHeaders: this.stackHeaders }
      if (logItemUid) {
        data.logs = { uid: logItemUid }
      }
      return new AuditLog(http, data)
    }
  }
  return this
}

export function StackCollection (http, data) {
  const stacks = data.stacks || []
  const obj = cloneDeep(stacks)
  const stackCollection = obj.map((userdata) => {
    return new Stack(http, { stack: userdata })
  })
  return stackCollection
}
