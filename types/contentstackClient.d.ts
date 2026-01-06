import { User } from './user'
import { AxiosRequestConfig, AxiosRequestConfig as AxiosRequest, AxiosResponse, AxiosError } from 'axios'
import { AnyProperty } from './utility/fields'
import { Pagination } from './utility/pagination'
import { Response } from './contentstackCollection'
import { Stack, StackConfig, StackDetails } from './stack'
import { Organization, Organizations } from './organization'
import { Queryable } from './utility/operations'
import OAuthHandler from './oauthHandler'

export interface ProxyConfig {
    host: string
    port: number
    auth?: {
      username: string
      password:string
    };
    protocol?: string
}
export interface RetryDelayOption {
    base?: number
    customBackoff?: (retryCount: number, error: Error) => number
}

/**
 * Plugin interface for intercepting and modifying requests and responses
 * @interface Plugin
 */
export interface Plugin {
    /**
     * Called before each request is sent. Should return the request object (modified or original).
     * @param {AxiosRequestConfig} request - The axios request configuration object
     * @returns {AxiosRequestConfig} The request object to use (return undefined to keep original)
     */
    onRequest: (request: AxiosRequest) => AxiosRequest | undefined
    /**
     * Called after each response is received (both success and error cases).
     * Should return the response/error object (modified or original).
     * @param {AxiosResponse | AxiosError} response - The axios response object (success) or error object (failure)
     * @returns {AxiosResponse | AxiosError} The response/error object to use (return undefined to keep original)
     */
    onResponse: (response: AxiosResponse | AxiosError) => AxiosResponse | AxiosError | undefined
}

export interface ContentstackToken {
    authorization?: string
    authtoken?: string
    early_access?: string[]
}

export interface ContentstackConfig extends AxiosRequestConfig, ContentstackToken {
    proxy?: ProxyConfig | false
    endpoint?: string
    region?: string
    host?: string
    timeout?: number
    maxRequests?: number
    retryOnError?: boolean
    retryLimit?: number
    retryDelay?: number
    retryCondition?: (error: Error) => boolean
    retryDelayOptions?: RetryDelayOption
    refreshToken?: () => Promise<ContentstackToken>
    maxContentLength?: number
    maxBodyLength?: number
    logHandler?: (level: string, data: any) => void
    application?: string
    integration?: string
    delayMs?: number
    /**
     * Array of plugin objects to intercept and modify requests/responses
     * Each plugin must implement onRequest and onResponse methods
     */
    plugins?: Plugin[]
}

export interface LoginDetails {
    email: string,
    password: string,
    tfa_token?: string
    mfaSecret?: string
}

export interface LoginResponse extends Response {
    user: User
}

export interface ContentstackClient {
    login(user: LoginDetails, params?: any): Promise<LoginResponse>
    logout(authtoken?: string): Promise<Response>

    getUser(params?: Pagination & AnyProperty): Promise<User>

    stack(query?: {organization_uid?: string}): Queryable<Stack, StackDetails>
    stack(config: StackConfig): Stack
    
    organization(): Organizations
    organization(uid: string): Organization
    
    oauth(params?: any): OAuthHandler
}

export function client(config?: ContentstackConfig): ContentstackClient