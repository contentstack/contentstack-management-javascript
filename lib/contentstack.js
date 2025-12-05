/**
 * The Content Management API (CMA) is used to manage the content of your Contentstack account. This includes creating, updating, deleting, and fetching content of your account.
 * @namespace Contentstack
 */
import packages from '../package.json'
import clonedeep from 'lodash/cloneDeep'
import getUserAgent, { getRegionEndpoint } from './core/Util.js'
import contentstackClient from './contentstackClient.js'
import httpClient from './core/contentstackHTTPClient.js'
const regionHostMap = {
  NA: 'api.contentstack.io',
  EU: 'eu-api.contentstack.com',
  AU: 'au-api.contentstack.com',
  AZURE_NA: 'azure-na-api.contentstack.com',
  AZURE_EU: 'azure-eu-api.contentstack.com',
  GCP_NA: 'gcp-na-api.contentstack.com',
  GCP_EU: 'gcp-eu-api.contentstack.com'
}

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
 * @param {Object=} params.proxy - Proxy configuration object for HTTP requests
 * @param {string=} params.region - Region for API endpoint (NA, EU, AU, AZURE_NA, AZURE_EU, GCP_NA, GCP_EU)
 * @param {string=} params.feature - Feature identifier for user agent
 * @param {string=} params.refreshToken - Refresh token for OAuth authentication
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
 * @prop {Array<string>=} params.early_access - Optional array of early access tokens used for early access of new features in CMA requests.
 * @example //Set the `early_access`
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ early_access: ['ea1', 'ea2'] })
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
 * @prop {string=} params.region - API region. Valid values: 'na', 'eu', 'au', 'azure_na', 'azure_eu', 'gcp_na', 'gcp_eu' (default: 'na')
 * @example //Set the `region` to 'eu'
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client({ region: 'eu' })
 *
 * @prop {string=} params.feature - Feature identifier for user agent header
 * @returns {ContentstackClient} Instance of ContentstackClient
 */
export function client (params = {}) {
  let defaultHostName

  if (params.region) {
    const region = params.region.toLowerCase()
    if (!regionHostMap[region]) {
      throw new Error(`Invalid region '${params.region}' provided. Allowed regions are: ${Object.keys(regionHostMap).join(', ')}`)
    }
    defaultHostName = regionHostMap[region]
  } else if (params.host) {
    defaultHostName = params.host
  } else {
    defaultHostName = regionHostMap['NA']
  }

  const defaultParameter = {
    defaultHostName: defaultHostName
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
  if (params.early_access) {
    requiredHeaders.early_access = params.early_access.join(',')
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
