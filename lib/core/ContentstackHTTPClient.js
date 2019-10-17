import clonedeep from 'lodash/cloneDeep'
// import axiosRetry from 'axios-retry'
import contentstackRetry from './contentstack-retry'
const HOST_REGEX = /^(?!\w+:\/\/)([^\s:]+\.[^\s:]+)(?::(\d+))?(?!:)$/

export default function ContentstackHttpClient (axios, options) {
  const defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: (level, data) => {
      if (level === 'error' && data) {
        const title = [data.name, data.message].filter((a) => a).join(' - ')
        console.error(`[error] ${title}`)
        console.error(data)
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
    // Contentstack
    logHandler: config.logHandler,
    responseLogger: config.responseLogger,
    requestLogger: config.requestLogger,
    retryOnError: config.retryOnError
  }
  const instance = axios.create(axiosOptions)
  instance.httpClientParams = options
  // axiosRetry(instance, { retries: config.retryLimit,
  //   retryDelay: (retryCount) => {
  //     return retryCount * 10
  //   }
  // })
  contentstackRetry(instance, axiosOptions, config.retyLimit, config.retryDelay)

  return instance
}
