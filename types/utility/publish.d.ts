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
}

export interface Publishable {
    publish(config: PublishConfig): Promise<Response>
}