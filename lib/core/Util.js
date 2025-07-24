import { platform, release } from 'os'
const HOST_REGEX = /^(?!\w+:\/\/)([\w-:]+\.)+([\w-:]+)(?::(\d+))?(?!:)$/

export function isHost (host) {
  return HOST_REGEX.test(host)
}

export function isNode () {
  return typeof process !== 'undefined' && !process.browser
}

export function getNodeVersion () {
  return process.versions.node ? `v${process.versions.node}` : process.version
}

function isReactNative () {
  return typeof window !== 'undefined' && 'navigator' in window && 'product' in window.navigator && window.navigator.product === 'ReactNative'
}

function getBrowserOS () {
  if (!window) {
    return null
  }
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'macOS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (/Linux/.test(platform)) {
    os = 'Linux'
  }
  return os
}

function getNodeOS () {
  const os = platform() || 'linux'
  const version = release() || '0.0.0'
  const osMap = {
    android: 'Android',
    aix: 'Linux',
    darwin: 'macOS',
    freebsd: 'Linux',
    linux: 'Linux',
    openbsd: 'Linux',
    sunos: 'Linux',
    win32: 'Windows'
  }
  if (os in osMap) {
    return `${osMap[os] || 'Linux'}/${version}`
  }
  return null
}

export default function getUserAgent (sdk, application, integration, feature) {
  const headerParts = []

  if (application) {
    headerParts.push(`app ${application}`)
  }

  if (integration) {
    headerParts.push(`integration ${integration}`)
  }

  if (feature) {
    headerParts.push('feature ' + feature)
  }

  headerParts.push(`sdk ${sdk}`)

  let os = null
  try {
    if (isReactNative()) {
      os = getBrowserOS()
      headerParts.push('platform ReactNative')
    } else if (isNode()) {
      os = getNodeOS()
      headerParts.push(`platform node.js/${getNodeVersion()}`)
    } else {
      os = getBrowserOS()
      headerParts.push(`platform browser`)
    }
  } catch (e) {
    os = null
  }

  if (os) {
    headerParts.push(`os ${os}`)
  }

  return `${headerParts.filter((item) => item !== '').join('; ')};`
}

// URL validation functions to prevent SSRF attacks
const isValidURL = (url) => {
  try {
    // Allow relative URLs (they are safe as they use the same origin)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true
    }

    // Only validate absolute URLs for SSRF protection
    const parsedURL = new URL(url)
    return isAllowedHost(parsedURL.hostname)
  } catch (error) {
    // If URL parsing fails, it might be a relative URL without protocol
    // Allow it if it doesn't contain protocol indicators
    return !url.includes('://') && !url.includes('\\')
  }
}

const isAllowedHost = (hostname) => {
  // Define allowed domains for Contentstack API
  const allowedDomains = [
    'api.contentstack.io',
    'eu-api.contentstack.com',
    'azure-na-api.contentstack.com',
    'azure-eu-api.contentstack.com',
    'gcp-na-api.contentstack.com',
    'gcp-eu-api.contentstack.com'
  ]

  // Check for localhost/development environments
  const localhostPatterns = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ]

  // Allow localhost for development
  if (localhostPatterns.includes(hostname)) {
    return true
  }

  // Check if hostname is in allowed domains or is a subdomain of allowed domains
  return allowedDomains.some(domain => {
    return hostname === domain || hostname.endsWith('.' + domain)
  })
}

export const validateAndSanitizeConfig = (config) => {
  if (!config || !config.url) {
    throw new Error('Invalid request configuration: missing URL')
  }

  // Validate the URL to prevent SSRF attacks
  if (!isValidURL(config.url)) {
    throw new Error(`SSRF Prevention: URL "${config.url}" is not allowed`)
  }

  return config
}
