import clonedeep from 'lodash/cloneDeep'
import Qs from 'qs'
import axios from 'axios'
import contentstackRetry from './contentstack-retry'
const HOST_REGEX = /^(?!\w+:\/\/)([^\s:]+\.[^\s:]+)(?::(\d+))?(?!:)$/

export default function contentstackHttpClient (options) {
  const defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: (level, data) => {
      if (level === 'error' && data) {
        const title = [data.name, data.message].filter((a) => a).join(' - ')
        console.error(`[error] ${title}`)
        return
      }
      console.log(`[${level}] ${data}`)
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

  const protocol = 'https'
  let hostname = config.defaultHostName
  let port = 443
  const version = 'v3'

  if (HOST_REGEX.test(config.host)) {
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
  const baseURL = `${protocol}://${hostname}:${port}${config.basePath}/${version}`
  const axiosOptions = {
    // Axios
    baseURL,
    headers: config.headers,
    httpAgent: config.httpAgent,
    httpsAgent: config.httpsAgent,
    proxy: config.proxy,
    timeout: config.timeout,
    adapter: config.adapter,
    maxContentLength: config.maxContentLength,
    maxBodyLength: config.maxBodyLength,
    // Contentstack
    logHandler: config.logHandler,
    responseLogger: config.responseLogger,
    requestLogger: config.requestLogger,
    retryOnError: config.retryOnError,
    paramsSerializer: function (params) {
      var query = params.query
      delete params.query
      var qs = Qs.stringify(params, { arrayFormat: 'brackets' })
      if (query) {
        qs = qs + `&query=${encodeURI(JSON.stringify(query))}`
      }
      return qs
    }
  }
  const instance = axios.create(axiosOptions)
  instance.httpClientParams = options
  contentstackRetry(instance, axiosOptions, config.retyLimit, config.retryDelay)
  return instance
}
