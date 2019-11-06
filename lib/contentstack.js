/**
 * The Content Management API (CMA) is used to manage the content of your Contentstack account. This includes creating, updating, deleting, and fetching content of your account.
 * @namespace Contentstack
 */
import httpClient from './core/contentstackHTTPClient.js'
import clonedeep from 'lodash/cloneDeep'
import getUserAgent from './core/Util.js'
import contentstackClient from './contentstackClient.js'
import packages from '../package.json'

/**
 * Create client instance
 * @name client
 * @memberof Contentstack
 * @param {Object} axios - Axios Object
 * @param {object} params - Client initialization parameters
 * @prop {string} params.host - API host (default: api.contentstack.com)
 * @prop {object} params.headers - Optional additional headers
 * @prop {number} params.timeout - Optional number of milliseconds before the request times out. Default is 30000
 * @prop {number} params.retryLimit - Optional number of retries before failure. Default is 5
 * @prop {number} params.maxContentLength - Optional maximum content length in bytes (default: 1073741824 i.e. 1GB)
 * @prop {string} params.application - Application name and version e.g myApp/version
 * @prop {string} params.integration - Integration name and version e.g react/version
 * @returns Contentstack.Client
 * @example
 * import * as contentstack from 'contentstack'
 * const client = contentstack.client({
 *
 * })
 */
export function client (axios, params) {
  const defaultParameter = {
    defaultHostName: 'api.contentstack.io'
  }

  const sdkAgent = `contentstack-management-javascript/${packages.version}`
  const userAgentHeader = getUserAgent(sdkAgent,
    params.application,
    params.integration,
    params.feature
  )
  const requiredHeaders = {
    'X-User-Agent': sdkAgent,
    'User-Agent': userAgentHeader
  }

  if (params.authtoken) {
    requiredHeaders.authtoken = params.authtoken
  }
  params = {
    ...defaultParameter,
    ...clonedeep(params)
  }

  params.headers = {
    ...params.headers,
    ...requiredHeaders
  }
  const http = httpClient(axios, params)
  const api = contentstackClient({
    http: http
  })
  return api
}
