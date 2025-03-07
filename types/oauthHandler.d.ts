// Interface to define the structure of the OAuth response
interface OAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  organization_uid: string;
  user_uid: string;
  token_type: string;
  location: string;
  region: string;
  authorization_type: string;
  stack_api_key: string;
}

export default class OAuthHandler {
  /**
   * Generate the authorization URL for OAuth
   * @returns A promise that resolves to the authorization URL
   */
  authorize(): Promise<string>;

  /**
   * Exchange the authorization code for an access token
   * @param code - The authorization code
   * @returns A promise that resolves to the OAuth response
   */
  exchangeCodeForToken(code: string): Promise<OAuthResponse>;

  /**
   * Refresh the access token using the refresh token
   * @param providedRefreshToken - The refresh token to use (optional)
   * @returns A promise that resolves to the OAuth response
   */
  refreshAccessToken(providedRefreshToken?: string): Promise<OAuthResponse>;

  /**
   * Log the user out by revoking the OAuth app authorization
   * @returns A promise that resolves to a success message
   */
  logout(): Promise<string>;

  /**
   * Get the current access token
   * @returns The access token
   */
  getAccessToken(): string;

  /**
   * Get the current refresh token
   * @returns The refresh token
   */
  getRefreshToken(): string;

  /**
   * Get the current organization UID
   * @returns The organization UID
   */
  getOrganizationUID(): string;

  /**
   * Get the current user UID
   * @returns The user UID
   */
  getUserUID(): string;

  /**
   * Get the token expiry time
   * @returns The token expiry time
   */
  getTokenExpiryTime(): string;

  /**
   * Set the access token
   * @param token - The access token
   */
  setAccessToken(token: string): void;

  /**
   * Set the refresh token
   * @param token - The refresh token
   */
  setRefreshToken(token: string): void;

  /**
   * Set organization UID
   * @param organizationUID - The organization UID
   */
  setOrganizationUID(organizationUID: string): void;

  /**
   * Set user UID
   * @param userUID - The user UID
   */
  setUserUID(userUID: string): void;

  /**
   * Set expiry time
   * @param expiryTime - The expiry time
   */
  setTokenExpiryTime(expiryTime: Date): void;

  /**
   * Handle the OAuth redirect URL and exchange the authorization code for a token
   * @param url - The redirect URL containing the authorization code
   * @returns A promise that resolves when the OAuth code is exchanged for a token
   */
  handleRedirect(url: string): Promise<void>;

  /**
   * Get the OAuth app authorization for the current user
   * @returns A promise that resolves to the authorization UID
   */
  getOauthAppAuthorization(): Promise<string>;

  /**
   * Revoke the OAuth app authorization
   * @param authorizationId - The authorization ID to revoke
   * @returns A promise that resolves to the response from the API
   */
  revokeOauthAppAuthorization(authorizationId: string): Promise<any>;
}
