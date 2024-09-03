// const http = require('http');
// const url = require('url');
const crypto = require('crypto');
// const debugOauth = require('debug')('oauth');

export class Oauth {

  constructor(http, config) {
    this.http = http;
    this.codeVerifier = crypto.randomBytes(32).toString('hex');
    this.OAuthAppId = config.appID || '***REMOVED***';
    this.OAuthClientId = config.clientId || 'Ie0FEfTzlfAHL4xM';
    this.OAuthRedirectURL = config.redirectUrl || 'http://localhost:8184';
    this.OAuthScope = '';
    this.OAuthResponseType = 'code';
    this.authTokenKeyName = 'authtoken';
    this.authEmailKeyName = 'email';
    this.authorisationTypeOAUTHValue = 'OAUTH';
    this.authorisationTypeAUTHValue = 'BASIC';
  }

  // set ui host using a pattern, inferred from api host
  // set redirectURl and host using config object in the constructor
  // refresh token method could be set private

  // config parameters
  // client id, client secret, redirectUrl
  // 

  getOAuthURL = function (redirectUrl, oauthScope) {
    const digest = crypto.createHash('sha256').update(this.codeVerifier).digest();
    const codeChallenge = digest.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    let url = `https://app.contentstack.com/#!/apps/${this.OAuthAppId}/authorize?response_type=${this.OAuthResponseType}&client_id=${this.OAuthClientId}&redirect_uri=${redirectUrl}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    if (oauthScope) {
      url += `&scope=${encodeURIComponent(oauthScope)}`;
    }
    return url;
  }

  // modify this to make calls like the sdk
  getAccessToken = function (host, redirectUrl, code) {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const payload = {
        grant_type: 'authorization_code',
        client_id: this.OAuthClientId,
        code_verifier: this.codeVerifier,
        redirect_uri: redirectUrl,
        code: code,
      };
      
      http
        .post(`${host}/apps-api/apps/token`, payload)
        .then(({data}) => {
          if (data['access_token'] && data['refresh_token']) {
            return data;
          } else {
            // throw error
          }
        })
        .then(resolve)
        .catch((error) => {
          // handle error
          // console.error('An error occoured while fetching the access token, run the command - csdx auth:login --oauth');
          // console.error(error);
          // reject(error);
        });
    });
  }

  refreshToken = function(host, redirectUrl, refreshToken) {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const payload = {
        grant_type: 'refresh_token',
        client_id: this.OAuthClientId,
        redirect_uri: redirectUrl,
        refresh_token: refreshToken,
      };
      http
        .post(`${host}/apps-api/apps/token`, payload)
        .then(({ data }) => {
          if (data.error || (data.statusCode != 200 && data.message)) {
            let errorMessage = '';
            if (data.message) {
              if (data.message[0]) {
                errorMessage = data.message[0];
              } else {
                errorMessage = data.message;
              }
            } else {
              errorMessage = data.error;
            }
            reject(errorMessage);
          } else {
            if (data['access_token'] && data['refresh_token']) {
              return data;
            } else {
              reject('Invalid request');
            }
          }
        })
        .then(resolve)
        .catch((error) => {
          console.error('An error occoured while refreshing the token');
          console.error(error);
          reject(error);
        });
    });
  }

  oauthLogout = async function () {
    const authorization = await this.getOauthAppAuthorization() || "";
    const response = await this.revokeOauthAppAuthorization(authorization)
    return response || {}
  }

  /**
   * Fetches all authorizations for the Oauth App, returns authorizationUid for current user.
   * @returns authorizationUid for the current user
   */
  getOauthAppAuthorization = async function () {
    const headers = {
      authorization: `Bearer ${configHandler.get(this.oauthAccessTokenKeyName)}`,
      organization_uid: configHandler.get(this.oauthOrgUidKeyName),
      'Content-type': 'application/json'
    }
    const httpClient = new HttpClient().headers(headers)
    await this.setOAuthBaseURL();
    return httpClient
      .get(`${this.OAuthBaseURL}/apps-api/manifests/${this.OAuthAppId}/authorizations`)
      .then(({data}) => {
        if (data?.data?.length > 0) {
          const userUid = configHandler.get(this.oauthUserUidKeyName)
          const currentUserAuthorization = data?.data?.filter(element => element.user.uid === userUid) || [];
          if (currentUserAuthorization.length === 0) {
            throw new Error(messageHandler.parse("CLI_AUTH_LOGOUT_NO_AUTHORIZATIONS_USER"))
          }
          return currentUserAuthorization[0].authorization_uid  // filter authorizations by current logged in user
        } else {
          throw new Error(messageHandler.parse("CLI_AUTH_LOGOUT_NO_AUTHORIZATIONS"))
        }
      })
  }

  revokeOauthAppAuthorization = async function (authorizationId) {
    if (authorizationId.length > 1) {
      const headers = {
        authorization: `Bearer ${configHandler.get(this.oauthAccessTokenKeyName)}`,
        organization_uid: configHandler.get(this.oauthOrgUidKeyName),
        'Content-type': 'application/json'
      }
      const httpClient = new HttpClient().headers(headers)
      await this.setOAuthBaseURL();
      return httpClient
        .delete(`${this.OAuthBaseURL}/apps-api/manifests/${this.OAuthAppId}/authorizations/${authorizationId}`)
        .then(({data}) => {
          return data
        })
    }
  }

  checkExpiryAndRefresh = (force = false) => this.compareOAuthExpiry(force);

  // check expiry
  compareOAuthExpiry = async function (force = false) {
    const oauthDateTime = configHandler.get(this.oauthDateTimeKeyName);
    const authorisationType = configHandler.get(this.authorisationTypeKeyName);
    if (oauthDateTime && authorisationType === this.authorisationTypeOAUTHValue) {
      const now = new Date();
      const oauthDate = new Date(oauthDateTime);
      const oauthValidUpto = new Date();
      oauthValidUpto.setTime(oauthDate.getTime() + 59 * 60 * 1000);
      if (force) {
        console.log('Force refreshing the token');
        return this.refreshToken();
      } else {
        if (oauthValidUpto > now) {
          return Promise.resolve();
        } else {
          console.log('Token expired, refreshing the token');
          return this.refreshToken();
        }
      }
    } else {
      console.log('No OAuth set');
      return this.unsetConfigData();
    }
  }
}