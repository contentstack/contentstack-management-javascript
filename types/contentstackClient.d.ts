import { User } from './user'
import { AxiosRequestConfig } from 'axios'
import { AnyProperty } from './utility/fields'
import { Pagination } from './utility/pagination'
import { Response } from './contentstackCollection'
import { Stack, StackConfig, StackDetails } from './stack'
import { Organization, Organizations } from './organization'
import { Queryable } from './utility/operations'

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

export interface ContentstackToken {
    authorization?: string
    authtoken?: string
    early_access?: string[]
}

export interface ContentstackConfig extends AxiosRequestConfig, ContentstackToken {
    proxy?: ProxyConfig | false
    endpoint?: string
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
}

export interface LoginDetails {
    email: string,
    password: string,
    token?: string
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
}

export function client(config?: ContentstackConfig): ContentstackClient