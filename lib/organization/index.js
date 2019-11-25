import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'
import { query, fetch } from '../query/index'
import ContentstackCollection from '../contentstackCollection'
import { RoleCollection } from '../stack/roles/index'
import { StackCollection, Stack } from '../stack/index'
/**
 * Organization is the top-level entity in the hierarchy of Contentstack, consisting of stacks and stack resources, and users. Organization allows easy management of projects as well as users within the Organization. Read more about <a href='https://www.contentstack.com/docs/guide/organization'>Organizations.</a>.
 * @namespace Organization
 */
export function Organization (http, data) {
  this.urlPath = '/organizations'

  if (data.organization) {
    Object.assign(this, cloneDeep(data.stack))
    this.urlPath = `/organizations/${this.uid}`

    /**
     * @description The fetch Organization call fetches Organization details.
     * @memberof Organization
     * @func fetch
     * @param {Int} include_plan The include_plan parameter includes the details of the plan that the organization has subscribed to.
     * @returns {Promise<Organization.Organization>} Promise for Organization instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('organization_uid).fetch()
     * .then((organization) => console.log(organization))
     *
     */
    this.fetch = fetch(http, 'organization')

    /**
     * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
     * @memberof Organization
     * @func stacks
     * @param {Int} limit The limit parameter will return a specific number of roles in the output.
     * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
     * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
     * @param {Boolean} include_count To retrieve the count of stack.
     * @param {String} typeahead The type head contains value to be included in search.
     * @returns {Array<Role>} Array of Role instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('organization_uid).stacks()
     * .then((stacks) => console.log(stacks))
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
     * @description Get Stack instance. A stack is a space that stores the content of a project.
     * @memberof Organization
     * @func stack
     * @param {String} api_key - Stack API Key
     * @returns {Stack} Instance of Stack
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('org_uid').stack().create({name: 'My New Stack'})
     * .then((stack) => console.log(stack))
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.organization('org_uid').stack('api_key').fetch()
     * .then((stack) => console.log(stack))
     *
     */
    this.stack = (apiKey) => {
      return new Stack(http, apiKey !== null ? { stack: { api_key: apiKey } } : { organization: { uid: this.uid } })
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
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
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
  } else {
  /**
   * @description The Query on Organization will allow to fetch details of all or specific Organization.
   * @memberof Organization
   * @func query
   * @returns {Array<Organization>} Array of Organization.
   *
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack().query({name: 'My New Stack'})
   * .then((stack) => console.log(stack))
   */
    this.query = query({ http: http, wrapperCollection: OrganizationCollection })
  }
}

export function OrganizationCollection (http, data) {
  const obj = cloneDeep(data.stacks)
  const organizationCollection = obj.map((userdata) => {
    return new Organization(http, { stack: userdata })
  })
  return organizationCollection
}
