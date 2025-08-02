import { platform, release } from 'os'
const HOST_REGEX = /^(?!(?:(?:https?|ftp):\/\/|internal|localhost|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))(?:[\w-]+\.contentstack\.(?:io|com)(?::[^\/\s:]+)?|[\w-]+(?:\.[\w-]+)*(?::[^\/\s:]+)?)(?![\/?#])$/  // eslint-disable-line

export function isHost (host) {
  if (!host) return false
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
    // Reject obviously malicious patterns early
    if (url.includes('@') || url.includes('file://') || url.includes('ftp://')) {
      return false
    }

    // Allow relative URLs (they are safe as they use the same origin)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true
    }

    // Only validate absolute URLs for SSRF protection
    const parsedURL = new URL(url)

    // Reject non-HTTP(S) protocols
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return false
    }

    const officialDomains = [
      'api.contentstack.io',
      'eu-api.contentstack.com',
      'azure-na-api.contentstack.com',
      'azure-eu-api.contentstack.com',
      'gcp-na-api.contentstack.com',
      'gcp-eu-api.contentstack.com'
    ]
    const isContentstackDomain = officialDomains.some(domain =>
      parsedURL.hostname === domain || parsedURL.hostname.endsWith('.' + domain)
    )
    if (isContentstackDomain && parsedURL.protocol !== 'https:') {
      return false
    }

    // Prevent IP addresses in URLs to avoid internal network access
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^\[?([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\]?$/
    if (ipv4Regex.test(parsedURL.hostname) || ipv6Regex.test(parsedURL.hostname)) {
      // Only allow localhost IPs in development
      const isDevelopment = process.env.NODE_ENV === 'development' ||
                           process.env.NODE_ENV === 'test' ||
                           !process.env.NODE_ENV
      const localhostIPs = ['127.0.0.1', '0.0.0.0', '::1', 'localhost']
      if (!isDevelopment || !localhostIPs.includes(parsedURL.hostname)) {
        return false
      }
    }

    return isAllowedHost(parsedURL.hostname)
  } catch {
    // If URL parsing fails, it might be a relative URL without protocol
    // Allow it if it doesn't contain protocol indicators or suspicious patterns
    return !url?.includes('://') && !url?.includes('\\') && !url?.includes('@')
  }
}

const isAllowedHost = (hostname) => {
  // Define allowed domains for Contentstack API
  // Official Contentstack domains
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

  // Only allow localhost in development environments to prevent SSRF in production
  const isDevelopment = process.env.NODE_ENV === 'development' ||
                       process.env.NODE_ENV === 'test' ||
                       !process.env.NODE_ENV // Default to allowing in non-production if NODE_ENV is not set

  if (isDevelopment && localhostPatterns.includes(hostname)) {
    return true
  }

  // Check if hostname is in allowed domains or is a subdomain of allowed domains
  const isContentstackDomain = allowedDomains.some(domain => {
    return hostname === domain || hostname.endsWith('.' + domain)
  })

  // If it's not a Contentstack domain, validate custom hostname
  if (!isContentstackDomain) {
    // Prevent internal/reserved IP ranges and localhost variants
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (hostname?.match(ipv4Regex)) {
      const parts = hostname.split('.')
      const firstOctet = parseInt(parts[0])
      // Only block private IP ranges
      if (firstOctet === 10 || firstOctet === 192 || firstOctet === 127) {
        return false
      }
    }
    // Allow custom domains that don't match dangerous patterns
    return !hostname.includes('file://') &&
           !hostname.includes('\\') &&
           !hostname.includes('@') &&
           hostname !== 'localhost'
  }

  return isContentstackDomain
}

export const validateAndSanitizeConfig = (config) => {
  if (!config?.url || typeof config?.url !== 'string') {
    throw new Error('Invalid request configuration: missing or invalid URL')
  }

  // Validate the URL to prevent SSRF attacks
  if (!isValidURL(config.url)) {
    throw new Error(`SSRF Prevention: URL "${config.url}" is not allowed`)
  }

  // Additional validation for baseURL if present
  if (config.baseURL && typeof config.baseURL === 'string' && !isValidURL(config.baseURL)) {
    throw new Error(`SSRF Prevention: Base URL "${config.baseURL}" is not allowed`)
  }

  return {
    ...config,
    url: config.url.trim() // Sanitize URL by removing whitespace
  }
}
