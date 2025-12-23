/**
 * Centralized error messages for the Contentstack Management SDK.
 * All user-facing error messages should be defined here for consistency and maintainability.
 */

export const ERROR_MESSAGES = {
  // Asset errors
  ASSET_URL_REQUIRED: 'Asset URL is required. Provide a valid asset URL and try again.',
  INVALID_UPLOAD_FORMAT: 'Invalid upload format. Provide a valid file path or Buffer and try again.',

  // OAuth errors
  OAUTH_BASE_URL_NOT_SET: 'OAuth base URL is not configured. Set the OAuth base URL and try again.',
  NO_REFRESH_TOKEN: 'No refresh token available. Authenticate first and try again.',
  ACCESS_TOKEN_REQUIRED: 'Access token is required. Provide a valid access token and try again.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required. Provide a valid refresh token and try again.',
  ORGANIZATION_UID_REQUIRED: 'Organization UID is required. Provide a valid organization UID and try again.',
  USER_UID_REQUIRED: 'User UID is required. Provide a valid user UID and try again.',
  TOKEN_EXPIRY_REQUIRED: 'Token expiry time is required. Provide a valid expiry time and try again.',
  AUTH_CODE_NOT_FOUND: 'Authorization code not found in redirect URL. Verify the redirect URL and try again.',
  NO_USER_AUTHORIZATIONS: 'No authorizations found for the current user. Verify user permissions and try again.',
  NO_APP_AUTHORIZATIONS: 'No authorizations found for the app. Verify app configuration and try again.',

  // Concurrency queue errors
  AXIOS_INSTANCE_MISSING: 'Axios instance is not present. Initialize the HTTP client and try again.',
  MIN_CONCURRENT_REQUESTS: 'Concurrency Manager Error: Minimum concurrent requests must be at least 1.',
  MIN_RETRY_LIMIT: 'Retry Policy Error: Minimum retry limit must be at least 1.',
  MIN_RETRY_DELAY: 'Retry Policy Error: Minimum retry delay must be at least 300ms.',
  MIN_NETWORK_RETRY_DELAY: 'Network Retry Policy Error: Minimum network retry delay must be at least 50ms.',

  // Request configuration errors
  INVALID_URL_CONFIG: 'Invalid request configuration: URL is missing or invalid. Provide a valid URL and try again.',

  // General errors
  ERROR_WITH_TITLE: (title) => `An error occurred due to ${title}. Review the details and try again.`,

  // Content type errors
  PARAMETER_NAME_REQUIRED: 'Parameter name is required. Provide a valid parameter name and try again.'
}

export default ERROR_MESSAGES
