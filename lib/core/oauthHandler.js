import errorFormatter from './contentstackError';

/**
 * @description OAuthHandler class to handle OAuth authorization and token management
 * @class OAuthHandler
 * @param {any} axiosInstance
 * @param {any} appId
 * @param {any} clientId
 * @param {any} redirectUri
 * @param {any} responseType='code'
 * @param {any} clientSecret
 * @param {any} scope=[]
 * @returns {OAuthHandler} OAuthHandler instance
 * @example
 * import * as contentstack from '@contentstack/management'
 * const client = contentstack.client();
 * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
 */
export default class OAuthHandler {
  constructor(axiosInstance, appId, clientId, redirectUri, clientSecret, responseType = 'code', scope = []) {
    this.appId = appId;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.responseType = responseType;
    this.scope = scope.join(' ');
    this.clientSecret = clientSecret; // Optional, if provided, PKCE will be skipped
    this.OAuthBaseURL = axiosInstance.defaults.uiBaseUrl;
    this.axiosInstance = axiosInstance;
    this.axiosInstance.oauth = axiosInstance?.oauth || {};
    this.axiosInstance.oauth.redirectUri = redirectUri;
    this.axiosInstance.oauth.clientId = clientId;
    this.axiosInstance.oauth.appId = appId;
    this.developerHubBaseUrl = axiosInstance.defaults.developerHubBaseUrl;

    // Only generate PKCE codeVerifier and codeChallenge if clientSecret is not provided
    if (!this.clientSecret) {
      this.codeVerifier = this.generateCodeVerifier();
      this.codeChallenge = null;
    }
  }

  // Helper function for setting common headers for API requests
  _getHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  // Generate a random string (code_verifier)
  generateCodeVerifier(length = 128) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  }

  async generateCodeChallenge(codeVerifier) {
    // Check if in a browser environment or Node.js
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Use the native Web Crypto API in the browser
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const base64String = btoa(String.fromCharCode(...hashArray));
      return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // URL-safe Base64
    } else {
      // In Node.js: Use the native `crypto` module for hashing
      const crypto = require('crypto');

      const hash = crypto.createHash('sha256');
      hash.update(codeVerifier);
      const hashBuffer = hash.digest();

      // Convert to Base64 and URL-safe Base64
      let base64String = hashBuffer.toString('base64');
      return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // URL-safe Base64
    }
  }

  /**
   * @description Authorize the user by redirecting to the OAuth provider's authorization page
   * @memberof OAuthHandler
   * @func authorize
   * @returns {any} Authorization URL
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const authUrl = await oauthHandler.authorize();
   */
  async authorize() {
    try {
      if (!this.OAuthBaseURL) {
        throw new Error('OAuthBaseURL is not set');
      }
      const baseUrl = `${this.OAuthBaseURL}/#!/apps/${this.appId}/authorize`;
      const authUrl = new URL(baseUrl);
      authUrl.searchParams.set('response_type', 'code'); // Using set() to avoid duplicate parameters
      authUrl.searchParams.set('client_id', this.clientId);
      if (this.clientSecret) {
        return authUrl.toString();
      } else {
        // PKCE flow: add code_challenge to the authorization URL
        this.codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
        authUrl.searchParams.set('code_challenge', this.codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');
        return authUrl.toString();
      }
    } catch (error) {
      errorFormatter(error);
    }
  }

  /**
   * @description Exchange the authorization code for an access token
   * @memberof OAuthHandler
   * @func exchangeCodeForToken
   * @param {any} code - Authorization code received from the OAuth provider
   * @returns {any} Token data
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const tokenData = await oauthHandler.exchangeCodeForToken('authorization_code');
   */
  async exchangeCodeForToken(code) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      ...(this.clientSecret ? { client_secret: this.clientSecret } : { code_verifier: this.codeVerifier }), // Choose between client_secret and code_verifier
    });

    this.axiosInstance.defaults.headers = this._getHeaders();
    try {
      const response = await this.axiosInstance.post(`${this.OAuthBaseURL}/apps-api/apps/token`, body);

      this._saveTokens(response.data);
      return response.data;
    } catch (error) {
      errorFormatter(error);
    }
  }

  // Save tokens and token expiry details
  _saveTokens(data) {
    this.axiosInstance.oauth.accessToken = data.access_token;
    this.axiosInstance.oauth.refreshToken = data.refresh_token || this.axiosInstance.oauth.refreshToken;
    this.axiosInstance.oauth.organizationUID = data.organization_uid;
    this.axiosInstance.oauth.userUID = data.user_uid;
    this.axiosInstance.oauth.tokenExpiryTime = Date.now() + (data.expires_in - 60) * 1000; // Store expiry time
  }

  /**
   * @description Refreshes the access token using the provided refresh token or the one stored in the axios instance.
   * @memberof OAuthHandler
   * @func refreshAccessToken
   * @param {string|null} [providedRefreshToken=null] - The refresh token to use for refreshing the access token. If not provided, the stored refresh token will be used.
   * @returns {Promise<Object>} - A promise that resolves to the response data containing the new access token, refresh token, and expiry time.
   * @throws {Error} - Throws an error if no refresh token is available or if the token refresh request fails.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const tokenData = await oauthHandler.refreshAccessToken();
   */
  async refreshAccessToken(providedRefreshToken = null) {
    const refreshToken = providedRefreshToken || this.axiosInstance.oauth.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available. Please authenticate first.');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.axiosInstance.oauth.clientId,
      redirect_uri: this.axiosInstance.oauth.redirectUri,
    });

    this.axiosInstance.defaults.headers = this._getHeaders();
    try {
      const response = await this.axiosInstance.post(`${this.developerHubBaseUrl}/apps/token`, body);

      const data = response.data;
      this.axiosInstance.oauth.accessToken = data.access_token;
      this.axiosInstance.oauth.refreshToken = data.refresh_token || this.axiosInstance.oauth.refreshToken; // Optionally update refresh token
      this.axiosInstance.oauth.tokenExpiryTime = Date.now() + (data.expires_in - 60) * 1000; // Update expiry time
      return data;
    } catch (error) {
      errorFormatter(error);
    }
  }

  /**
   * @description Logs out the user by revoking the OAuth app authorization
   * @memberof OAuthHandler
   * @func logout
   * @returns {Promise<string>} - A promise that resolves to a success message if the logout was successful.
   * @throws {Error} - Throws an error if the logout request fails.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const resp = await oauthHandler.logout();
   */
  async logout() {
    try {
      const authorizationId = await this.getOauthAppAuthorization();
      await this.revokeOauthAppAuthorization(authorizationId);
      this.axiosInstance.oauth = {}; // Clear OAuth data
      return 'Logged out successfully';
    } catch (error) {
      errorFormatter(error);
    }
  }

  /**
   * @description Get the current access token
   * @memberof OAuthHandler
   * @func getAccessToken
   * @returns {any}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const accessToken = oauthHandler.getAccessToken();
   */
  getAccessToken() {
    return this.axiosInstance.oauth.accessToken;
  }

  /**
   * @description Get the refresh token from the axios instance
   * @memberof OAuthHandler
   * @func getRefreshToken
   * @returns {string|null}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const refreshToken = oauthHandler.getRefreshToken();
   */
  getRefreshToken() {
    return this.axiosInstance.oauth.refreshToken || null;
  }

  /**
   * @description Get the organization UID from the axios instance
   * @memberof OAuthHandler
   * @func getOrganizationUID
   * @returns {string|null}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const orgUID = oauthHandler.getOrganizationUID();
   */
  getOrganizationUID() {
    return this.axiosInstance.oauth.organizationUID || null;
  }

  /**
   * @description Get the user UID from the axios instance
   * @memberof OAuthHandler
   * @func getUserUID
   * @returns {string|null}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const userId = oauthHandler.getUserUID();
   */
  getUserUID() {
    return this.axiosInstance.oauth.userUID || null;
  }

  /**
   * @description Get the token expiry time from the axios instance
   * @memberof OAuthHandler
   * @func getTokenExpiryTime
   * @returns {number|null}
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * const expiryTime = oauthHandler.getTokenExpiryTime();
   */
  getTokenExpiryTime() {
    return this.axiosInstance.oauth.tokenExpiryTime || null;
  }

  /**
   * @description Set the access token in the axios instance
   * @memberof OAuthHandler
   * @func setAccessToken
   * @param {*} token
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * oauthHandler.setAccessToken('accessToken');
   */
  setAccessToken(token) {
    if (!token) {
      throw new Error('Access token is required');
    }
    this.axiosInstance.oauth.accessToken = token;
  }

  /**
   * @description Set the refresh token in the axios instance
   * @memberof OAuthHandler
   * @func setRefreshToken
   * @param {*} token
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * oauthHandler.setRefreshToken('refreshToken');
   */
  setRefreshToken(token) {
    if (!token) {
      throw new Error('Refresh token is required');
    }
    this.axiosInstance.oauth.refreshToken = token;
  }

  /**
   * @description Set the organization UID in the axios instance
   * @memberof OAuthHandler
   * @func setOrganizationUID
   * @param {*} organizationUID
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * oauthHandler.setOrganizationUID('organizationUID');
   */
  setOrganizationUID(organizationUID) {
    if (!organizationUID) {
      throw new Error('Organization UID is required');
    }
    this.axiosInstance.oauth.organizationUID = organizationUID;
  }

  /**
   * @description Set the user UID in the axios instance
   * @memberof OAuthHandler
   * @func setUserUID
   * @param {*} userUID
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * oauthHandler.setUserUID('userID');
   */
  setUserUID(userUID) {
    if (!userUID) {
      throw new Error('User UID is required');
    }
    this.axiosInstance.oauth.userUID = userUID;
  }

  /**
   * @description Set the token expiry time in the axios instance
   * @memberof OAuthHandler
   * @func setTokenExpiryTime
   * @param {*} expiryTime
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * oauthHandler.setTokenExpiryTime('expiryTime'); // date format
   */
  setTokenExpiryTime(expiryTime) {
    if (!expiryTime) {
      throw new Error('Token expiry time is required');
    }
    this.axiosInstance.oauth.tokenExpiryTime = expiryTime;
  }

  /**
   * @description Handles the redirect URL after OAuth authorization
   * @memberof OAuthHandler
   * @func handleRedirect
   * @async
   * @param {string} url - The URL to handle after the OAuth authorization
   * @returns {Promise<void>} - A promise that resolves if the redirect URL is successfully handled
   * @throws {Error} - Throws an error if the authorization code is not found in the redirect URL
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client();
   * const oauthHandler = client.oauth({ appId: 'appId', clientId: 'clientId', redirectUri: 'http://localhost:8184' });
   * await oauthHandler.handleRedirect('http://localhost:8184?code=authorization_code');
   */
  async handleRedirect(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    const code = urlParams.get('code');

    if (code) {
      try {
        await this.exchangeCodeForToken(code);
      } catch (error) {
        errorFormatter(error);
      }
    } else {
      throw new Error('Authorization code not found in redirect URL.');
    }
  }

  /**
   * @description Get the OAuth app authorization for the current user
   * @memberof OAuthHandler
   * @func getOauthAppAuthorization
   * @returns {any}
   */
  async getOauthAppAuthorization() {
    const headers = {
      authorization: `Bearer ${this.axiosInstance.oauth.accessToken}`,
      organization_uid: this.axiosInstance.oauth.organizationUID,
      'Content-type': 'application/json',
    };

    this.axiosInstance.defaults.headers = headers;
    try {
      const res = await this.axiosInstance.get(
        `${this.developerHubBaseUrl}/manifests/${this.axiosInstance.oauth.appId}/authorizations`,
      );

      const data = res.data;
      if (data?.data?.length > 0) {
        const userUid = this.axiosInstance.oauth.userUID;
        const currentUserAuthorization = data?.data?.filter((element) => element.user.uid === userUid) || [];
        if (currentUserAuthorization.length === 0) {
          throw new Error('No authorizations found for current user!');
        }
        return currentUserAuthorization[0].authorization_uid; // filter authorizations by current logged in user
      } else {
        throw new Error('No authorizations found for the app!');
      }
    } catch (error) {
      errorFormatter(error);
    }
  }

  /**
   * @description Revoke the OAuth app authorization for the current user
   * @memberof OAuthHandler
   * @func revokeOauthAppAuthorization
   * @param {any} authorizationId
   * @returns {any}
   */
  async revokeOauthAppAuthorization(authorizationId) {
    if (authorizationId?.length > 1) {
      const headers = {
        authorization: `Bearer ${this.axiosInstance.oauth.accessToken}`,
        organization_uid: this.axiosInstance.oauth.organizationUID,
        'Content-type': 'application/json',
      };

      this.axiosInstance.defaults.headers = headers;
      try {
        const res = await this.axiosInstance.delete(
          `${this.developerHubBaseUrl}/manifests/${this.axiosInstance.oauth.appId}/authorizations/${authorizationId}`,
        );

        return res.data;
      } catch (error) {
        errorFormatter(error);
      }
    }
  }
}
