import axios from 'axios'
import clonedeep from 'lodash/cloneDeep'
import Qs from 'qs'
import { ConcurrencyQueue } from './concurrency-queue'
import { isHost, normalizePlugins } from './Util'
import { ERROR_MESSAGES } from './errorMessages'

export default function contentstackHttpClient (options) {
  const defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: (level, data) => {
      if (level === 'error' && data) {
        const title = [data.name, data.message].filter((a) => a).join(' - ')
        console.error(ERROR_MESSAGES.ERROR_WITH_TITLE(title))
        return
      }
      console.log(`[${level}] ${data}`)
    },
    retryCondition: (error) => {
      if (error.response && error.response.status === 429) {
        return true
      }
      return false
    },
    headers: {},
    basePath: '',
    proxy: false,
    httpAgent: false,
    httpsAgent: false,
    adapter: false,
    timeout: 30000
  }

  const config = {
    ...defaultConfig,
    ...clonedeep(options)
  }

  if (config.apiKey) {
    config.headers['apiKey'] = config.apiKey
  }

  if (config.accessToken) {
    config.headers['accessToken'] = config.accessToken
  }

  if (config.early_access) {
    config.headers['x-header-ea'] = config.early_access
  }

  const protocol = config.insecure ? 'http' : 'https'
  let hostname = config.defaultHostName
  let port = config.port || 443
  const version = config.version || 'v3'

  if (config.region) {
    config.host = config.defaultHostName // set region on priority
  }
  if (isHost(config.host)) {
    const parsed = config.host.split(':')
    if (parsed.length === 2) {
      [hostname, port] = parsed
    } else {
      hostname = parsed[0]
    }
  }
  if (config.basePath) {
    config.basePath = `/${config.basePath.split('/').filter(Boolean).join('/')}`
  }
  const baseURL = config.endpoint || `${protocol}://${hostname}:${port}${config.basePath}/{api-version}`
  let uiHostName = hostname
  let developerHubBaseUrl = hostname

  if (uiHostName?.endsWith('io')) {
    uiHostName = uiHostName.replace('io', 'com')
  }

  if (uiHostName) {
    uiHostName = uiHostName.replace('api', 'app')
  }

  const uiBaseUrl = config.endpoint || `${protocol}://${uiHostName}`
  developerHubBaseUrl = developerHubBaseUrl
    ?.replace('api', 'developerhub-api')
    .replace(/^dev\d+/, 'dev') // Replaces any 'dev1', 'dev2', etc. with 'dev'
    .replace('io', 'com')
    .replace(/^http/, '') // Removing `http` if already present
    .replace(/^/, 'https://') // Adds 'https://' at the start if not already there

  // set ui host name
  const axiosOptions = {
    // Axios
    baseURL,
    uiBaseUrl,
    developerHubBaseUrl,
    ...config,
    paramsSerializer: function (params) {
      var query = params.query
      delete params.query
      var qs = Qs.stringify(params, { arrayFormat: 'brackets' })
      if (query) {
        qs = qs + `&query=${encodeURIComponent(JSON.stringify(query))}`
      }
      params.query = query
      return qs
    },
    versioningStrategy: 'path'
  }
  const instance = axios.create(axiosOptions)
  instance.httpClientParams = options

  // Normalize and store plugins before ConcurrencyQueue so plugin interceptors
  // run after the queue's (plugin sees responses/errors before they reach the queue).
  // Use options.plugins so hooks run against the same plugin references (spies work in tests).
  const plugins = normalizePlugins(options.plugins || config.plugins)

  // Request interceptor for versioning strategy (must run first)
  instance.interceptors.request.use((request) => {
    if (request.versioningStrategy && request.versioningStrategy === 'path') {
      request.baseURL = request.baseURL.replace('{api-version}', version)
    } else {
      request.baseURL = request.baseURL.replace('/{api-version}', '')
    }
    return request
  })

  // Request interceptor for plugins (runs after versioning)
  if (plugins.length > 0) {
    instance.interceptors.request.use(
      (request) => {
        // Run all onRequest hooks sequentially, using return values
        let currentRequest = request
        for (const plugin of plugins) {
          try {
            if (typeof plugin.onRequest === 'function') {
              const result = plugin.onRequest(currentRequest)
              // Use returned value if provided, otherwise use current request
              if (result !== undefined) {
                currentRequest = result
              }
            }
          } catch (error) {
            // Log error and continue with next plugin
            if (config.logHandler) {
              config.logHandler('error', {
                name: 'PluginError',
                message: `Error in plugin onRequest: ${error.message}`,
                error: error
              })
            }
          }
        }
        return currentRequest
      },
      (error) => {
        // Handle request errors - run plugins even on error
        let currentConfig = error.config
        for (const plugin of plugins) {
          try {
            if (typeof plugin.onRequest === 'function' && currentConfig) {
              const result = plugin.onRequest(currentConfig)
              // Use returned value if provided, otherwise use current config
              if (result !== undefined) {
                currentConfig = result
                error.config = currentConfig
              }
            }
          } catch (pluginError) {
            if (config.logHandler) {
              config.logHandler('error', {
                name: 'PluginError',
                message: `Error in plugin onRequest (error handler): ${pluginError.message}`,
                error: pluginError
              })
            }
          }
        }
        return Promise.reject(error)
      }
    )

    // Response interceptor for plugins
    instance.interceptors.response.use(
      (response) => {
        // Run all onResponse hooks sequentially for successful responses
        // Use return values from plugins
        let currentResponse = response
        for (const plugin of plugins) {
          try {
            if (typeof plugin.onResponse === 'function') {
              const result = plugin.onResponse(currentResponse)
              // Use returned value if provided, otherwise use current response
              if (result !== undefined) {
                currentResponse = result
              }
            }
          } catch (error) {
            // Log error and continue with next plugin
            if (config.logHandler) {
              config.logHandler('error', {
                name: 'PluginError',
                message: `Error in plugin onResponse: ${error.message}`,
                error: error
              })
            }
          }
        }
        return currentResponse
      },
      (error) => {
        // Handle response errors - run plugins even on error
        // Pass the error object (which may contain error.response if server responded)
        let currentError = error
        for (const plugin of plugins) {
          try {
            if (typeof plugin.onResponse === 'function') {
              const result = plugin.onResponse(currentError)
              // Use returned value if provided, otherwise use current error
              if (result !== undefined) {
                currentError = result
              }
            }
          } catch (pluginError) {
            if (config.logHandler) {
              config.logHandler('error', {
                name: 'PluginError',
                message: `Error in plugin onResponse (error handler): ${pluginError.message}`,
                error: pluginError
              })
            }
          }
        }
        return Promise.reject(currentError)
      }
    )
  }

  instance.concurrencyQueue = new ConcurrencyQueue({ axios: instance, config, plugins })

  return instance
}
