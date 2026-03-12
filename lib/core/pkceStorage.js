/**
 * PKCE code_verifier persistence in sessionStorage for browser SPAs.
 * Survives OAuth redirects; not used in Node. RFC 7636 / OAuth 2.0 for Browser-Based Apps.
 */

const PKCE_STORAGE_KEY_PREFIX = 'contentstack_oauth_pkce'
const PKCE_STORAGE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

function isBrowser () {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function getStorageKey (appId, clientId, redirectUri) {
  return `${PKCE_STORAGE_KEY_PREFIX}_${appId}_${clientId}_${redirectUri}`
}

/**
 * @param {string} appId
 * @param {string} clientId
 * @param {string} redirectUri
 * @returns {string|null} code_verifier if valid and not expired, otherwise null
 */
export function getStoredCodeVerifier (appId, clientId, redirectUri) {
  if (!isBrowser()) return null
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(appId, clientId, redirectUri))
    if (!raw) return null
    const { codeVerifier, expiresAt } = JSON.parse(raw)
    if (!codeVerifier || !expiresAt || Date.now() > expiresAt) return null
    return codeVerifier
  } catch {
    return null
  }
}

/**
 * @param {string} appId
 * @param {string} clientId
 * @param {string} redirectUri
 * @param {string} codeVerifier
 */
export function storeCodeVerifier (appId, clientId, redirectUri, codeVerifier) {
  if (!isBrowser()) return
  try {
    const key = getStorageKey(appId, clientId, redirectUri)
    const value = JSON.stringify({
      codeVerifier,
      expiresAt: Date.now() + PKCE_STORAGE_EXPIRY_MS
    })
    window.sessionStorage.setItem(key, value)
  } catch {
    // Ignore storage errors (e.g. private mode); fall back to memory-only
  }
}

/**
 * @param {string} appId
 * @param {string} clientId
 * @param {string} redirectUri
 */
export function clearStoredCodeVerifier (appId, clientId, redirectUri) {
  if (!isBrowser()) return
  try {
    window.sessionStorage.removeItem(getStorageKey(appId, clientId, redirectUri))
  } catch {
    // Ignore
  }
}
