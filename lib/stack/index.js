import cloneDeep from 'lodash/cloneDeep'
import error from '../core/contentstackError'

export default function Stack (http, data) {
  const stack = cloneDeep(data)
  const urlPath = '/stacks'
  const stackHeaders = { headers: { api_key: stack.api_key } }
  /**
   * The Update stack call lets you update the name and description of an existing stack.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').fetch()
   * .then((stack) => {
   *  stack.name = 'My New Stack'
   *  stack.description = 'My new test stack'
   *  return stack.update
   * })
   * .then((stack) => console.log(stack))
   *
   */
  stack.update = function () {
    const data = cloneDeep(this)
    const updateData = {
      stack: data
    }
    return http.put(urlPath, updateData, stackHeaders).then((response) => {
      return Stack(http, response.data.stack)
    }, error)
  }

  /**
   * The Delete stack call is used to delete an existing stack permanently from your Contentstack account.
   * @returns {String} Success message.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').delete()
   * .then((notice) => console.log(notice))
   */
  stack.delete = function () {
    return http.delete(urlPath, stackHeaders).then((response) => {
      return response.data.notice
    }, error)
  }

  /**
   * The fetch stack call fetches stack details.
   * @returns {Promise<Stack.Stack>} Promise for Stack instance
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * client.stack('api_key').fetch()
   * .then((stack) => console.log(stack))
   *
   */
  stack.fetch = function () {
    return http.get(urlPath, stackHeaders).then((response) => {
      return Stack(http, response.data.stack)
    }, error)
  }

  return stack
}

// export function Stack ({ http }) {
// export function create (data, organizationID) {
//   return http.post(urlPath, data, { organization_uid: organizationID })
//     .then((response) => {
//       console.log(response)
//     })
// }
// }
