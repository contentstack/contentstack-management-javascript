import { Response } from "../contentstackCollection";


export interface PublishDetails {
    locales: Array<string>
    environments: Array<string>
}

export interface PublishConfig {
    publishDetails: PublishDetails
    locale?: string
    version?: number
    scheduledAt?: string
    /** Extra HTTP headers merged with stack headers (publish / unpublish). */
    headers?: Record<string, string>
    /** Query string parameters (publish / unpublish). */
    params?: Record<string, unknown>
}

export interface Publishable {
    publish(config: PublishConfig): Promise<Response>
}