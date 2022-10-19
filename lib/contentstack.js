/**
 * The Content Management API (CMA) is used to manage the content of your Contentstack account. This includes creating, updating, deleting, and fetching content of your account.
 * @namespace Contentstack
 */
import packages from '../package.json'
import clonedeep from 'lodash/cloneDeep'
import getUserAgent from './core/Util.js'
import contentstackClient from './contentstackClient.js'
import httpClient from './core/contentstackHTTPClient.js'

/**
 * Create client instance
 * @name client
 * @memberof Contentstack
 *
 * @example
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client()
 *
 * @param {object} params - Client initialization parameters
 * @param {Object=} param.proxy -
 * @prop {string=} params.endpoint - API endpoint that a service will talk to
 * @example //Set the `endpoint` to 'https://api.contentstack.io:{port}/{version}'
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ endpoint: 'https://api.contentstack.io:{port}/{version}' })
 *
 * @prop {string=} params.host - API host (default: api.contentstack.io)
 * @example //Set the `host` to 'api.contentstack.io'
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ host: 'api.contentstack.io' })
 *
 * @prop {object=} params.headers - Optional additional headers
 * @example //Set the `headers` to { 'headerkey': 'value'}
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ headers: { 'headerkey': 'value'} })
 *
 * @prop {string=} params.authtoken - Optional Authtoken is a read-write token used to make authorized CMA requests, but it is a user-specific token.
 * @example //Set the `authtoken`
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ authtoken: 'value' })
 *
 * @prop {string=} params.authorization - Optional authorization token is a read-write token used to make authorized CMA requests, but it is a user-specific token.
 * @example //Set the `authorization`
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ authorization: 'Bearer <token_value>' })
 *
 * @prop {number=} params.timeout - Optional number of milliseconds before the request times out. Default is 30000ms
 * @example //Set the `timeout` to 50000ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ timeout: 50000 })
 *
 * @prop {number=} params.maxRequests - Optional maximum number of requests SDK should send concurrently. Default is 5 concurrent request.
 * @example //Set the `maxRequests` to 5
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxRequests: 5 })
 *
 * @prop {boolean=} params.retryOnError - Optional boolean for retry on failure. Default is true
 * @example //Set the `retryOnError` to false
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryOnError: false })
 *
 * @prop {number=} params.retryLimit - Optional number of retries before failure. Default is 5
 * @example //Set the `retryLimit` to 2
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryLimit: 2 })
 *
 * @prop {number=} params.retryDelay - The number of milliseconds to use for operation retries. Default is 300ms
 * @example //Set the `retryDelay` to 500ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryDelay: 500 })
 *
 * @prop {Function=} params.retryCondition - A function to determine if the error can be retried. Default retry is on status 429.
 * @example //Set the `retryCondition` on error status 429
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ retryCondition: (error) => {
 *      if (error.response && error.response.status === 429) {
 *        return true
 *      }
 *      return false
 *    }
 *  })
 *
 * @prop {number=} params.retryDelayOptions.base - The base number of milliseconds to use in the exponential backoff for operation retries.
 * @example Set  base retry delay for all services to 300 ms
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({retryDelayOptions: {base: 300}})
 *
 * @prop {Function=} params.retryDelayOptions.customBackoff - A custom function that accepts a retry count and error and returns the amount of time to delay in milliseconds. (if you want not to retry for specific condition return -1)
 * @example Set a custom backoff function to provide delay of 500 ms on retryCount < 3 and -1 for retryCount >= 3values on retries
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({retryDelayOptions: {customBackoff: function(retryCount, err) {
 *        if (retryCount < 3) {
 *          return 500
 *        } else {
 *          return -1 //returning -1 will hold next retry for request
 *        }
 *     }}}
 * )
 *
 * @prop {number=} params.maxContentLength - Optional maximum content length in bytes (default: 1073741824 i.e. 1 GB)
 * @example //Set the `maxContentLength` to 1024 ** 3
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxContentLength: 1024 ** 3 })
 *
 * @prop {number=} params.maxBodyLength - Optional maximum body length in bytes (default: 10 MB)
 * @example //Set the `maxBodyLength` to 1024 ** 2 * 10 // 10 MB
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ maxBodyLength: 1024 ** 2 * 10 })
 *
 * @prop {function=} params.logHandler - A log handler function to process given log messages & errors.
 * @example //Set the `logHandler`
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ logHandler: (level, data) => {
      if (level === 'error' && data) {
        const title = [data.name, data.message].filter((a) => a).join(' - ')
        console.error(`[error] ${title}`)
        return
      }
      console.log(`[${level}] ${data}`)
    } })
 *
 * @prop {function=} params.refreshToken - Optional function used to refresh token.
 * @example // OAuth example
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({
    refreshToken: () => {
      return new Promise((resolve, reject) => {
        return issueToken().then((res) => {
          resolve({
              authorization: res.authorization
            })
        }).catch((error) => {
          reject(error)
        })
      })
    }
  })
 * @example // Auth Token example
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({
    refreshToken: () => {
      return new Promise((resolve, reject) => {
        return issueToken().then((res) => {
          resolve({
              authtoken: res.authtoken
            })
        }).catch((error) => {
          reject(error)
        })
      })
    }
  })
 *
 * @prop {string=} params.application - Application name and version e.g myApp/version
 * @prop {string=} params.integration - Integration name and version e.g react/version
 * @returns Contentstack.Client
 */
export function client (params = {}) {
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
  if (params.authorization) {
    requiredHeaders.authorization = params.authorization
  }
  params = {
    ...defaultParameter,
    ...clonedeep(params)
  }

  params.headers = {
    ...params.headers,
    ...requiredHeaders
  }
  const http = httpClient(params)
  return contentstackClient({
    http: http
  })
}
