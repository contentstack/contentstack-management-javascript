import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { fetch } from '../entity'
import ContentstackCollection from '../contentstackCollection'
import { RoleCollection } from '../stack/roles/index'
import { StackCollection } from '../stack/index'
import { UserCollection } from '../user'
/**
 * Organization is the top-level entity in the hierarchy of Contentstack, consisting of stacks and stack resources, and users. Organization allows easy management of projects as well as users within the Organization. Read more about <a href='https://www.contentstack.com/docs/guide/organization'>Organizations.</a>.
 * @namespace Organization
 */
export function Organization (http, data) {
  this.urlPath = '/organizations'

  if (data && data.organization) {
    Object.assign(this, cloneDeep(data.organization))
    this.urlPath = `/organizations/${this.uid}`

    /**
     * @description The fetch Organization call fetches Organization details.
     * @memberof Organization
     * @func fetch
     * @param {Int} include_plan The include_plan parameter includes the details of the plan that the organization has subscribed to.
     * @returns {Promise<Organization.Organization>} Promise for Organization instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organization_uid).fetch()
     * .then((organization) => console.log(organization))
     *
     */
    this.fetch = fetch(http, 'organization')

    if (this.org_roles && (this.org_roles.filter(function (role) { return role.admin === true }).length > 0)) {
      /**
       * @description The Get all stacks in an organization call fetches the list of all stacks in an Organization.
       * @memberof Organization
       * @func stacks
       * @param {Int} limit The limit parameter will return a specific number of roles in the output.
       * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
       * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
       * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
       * @param {Boolean} include_count To retrieve the count of stack.
       * @param {String} typeahead The type head contains value to be included in search.
       * @returns {ContentstackCollection} Instance of ContentstackCollection.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid).stacks({ include_count: true })
       * .then((organization) => console.log(organization))
       *
       */
      this.stacks = async (param) => {
        try {
          const response = await http.get(`${this.urlPath}/stacks`, { params: param })
          if (response.data) {
            return new ContentstackCollection(response, http, null, StackCollection)
          } else {
            return error(response)
          }
        } catch (err) {
          return error(err)
        }
      }

      /**
       * @description The Transfer organization ownership call transfers the ownership of an Organization to another user.
       * @memberof Organization
       * @func transferOwnership
       * @param {String} email The email address of the user to whom you wish to transfer the ownership of the organization.
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack('api_key').transferOwnership('emailId')
       * .then((notice) => console.log(notice))
       *
       */
      this.transferOwnership = async (email) => {
        try {
          const response = await http.post(`${this.urlPath}/transfer_ownership`, { transfer_to: email })
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
       * @memberof Organization
       * @func addUser
       * @returns {ContentstackCollection} ContentstackCollection of instance.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid).addUser({ users: { 'abc@test.com': ['org_uid1', 'org_uid2' ]}, stacks: { 'abc@test.com': { 'api_key1': [ 'stack_role_id' ] } } })
       * .then((response) => console.log(response))
       *
       */
      this.addUser = async (data) => {
        try {
          const response = await http.post(`${this.urlPath}/share`, { share: { data } })
          if (response.data) {
            return new ContentstackCollection(response, http, null, UserCollection)
          } else {
            return error(response)
          }
        } catch (err) {
          return error(err)
        }
      }

      /**
       * @description The Get all organization invitations call gives you a list of all the Organization invitations.
       * @memberof Organization
       * @func getInvitations
       * @returns {String} Success message of invitation send.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid).getInvitations()
       * .then((notice) => console.log(notice))
       *
       */
      this.getInvitations = async (param) => {
        try {
          const response = await http.get(`${this.urlPath}/share`, { params: param })
          if (response.data) {
            return new ContentstackCollection(response, http, null, UserCollection)
          } else {
            return error(response)
          }
        } catch (err) {
          return error(err)
        }
      }

      /**
       * @description The Resend pending organization invitation call allows you to resend Organization invitations to users who have not yet accepted the earlier invitation.
       * @memberof Organization
       * @func resendInvitition
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid).resendInvitition('invitation_uid')
       * .then((notice) => console.log(notice))
       *
       */
      this.resendInvitation = async (invitationUid) => {
        try {
          const response = await http.get(`${this.urlPath}/${invitationUid}/resend_invitation`)
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
       * @memberof Organization
       * @func roles
       * @param {Int} limit The limit parameter will return a specific number of roles in the output.
       * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
       * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
       * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
       * @param {Boolean}include_count To retrieve the count of roles.
       * @param {Boolean} include_stack_roles The Include stack roles will return stack details in roles.
       * @returns {Array<Role>} Array of Role instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid).roles()
       * .then((roles) => console.log(roles))
       *
       */
      this.roles = async (param) => {
        try {
          const response = await http.get(`${this.urlPath}/roles`, { params: param })
          if (response.data) {
            return new ContentstackCollection(response, http, null, RoleCollection)
          } else {
            return error(response)
          }
        } catch (err) {
          return error(err)
        }
      }
    }
  } else {
    /**
     * @description The Get all organizations call lists all organizations related to the system user in the order that they were created.
     * @memberof Organization
     * @func fetchAll
     * @param {Int} limit The limit parameter will return a specific number of roles in the output.
     * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
     * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
     * @param {Boolean}include_count To retrieve the count of roles.
     * @param {String} typeahead The type head contains value to be included in search.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = async (parmas) => {
      try {
        const response = await http.get(this.urlPath, { params: parmas })
        if (response.data) {
          return new ContentstackCollection(response, http, null, OrganizationCollection)
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  }
}

export function OrganizationCollection (http, data) {
  const obj = cloneDeep(data.organizations)
  const organizationCollection = obj.map((userdata) => {
    return new Organization(http, { organization: userdata })
  })
  return organizationCollection
}
