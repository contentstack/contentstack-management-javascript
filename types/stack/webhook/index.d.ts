import { ContentstackCollection, Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, SystemFunction } from "../../utility/operations";

export interface Webhook extends SystemFields, SystemFunction<Webhook> {
    executions(params: any): Promise<WebhookExecutionResponse>
    retry(executionUid: string): Promise<Response>
}
    
export interface Webhooks extends Creatable<Webhook, {webhook: WebhookData}> {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<WebhookData>>
}

export interface WebhookData extends AnyProperty {
    name: string
    destinations: Array<WebhookDestination>
    channels?: Array<string>
    retry_policy: string
    disabled: boolean
}

export interface WebhookDestination extends AnyProperty {
    target_url?: string
    http_basic_auth?: string
    http_basic_password?: string
    custom_header: Array<AnyProperty>
}

export interface WebhookExecutionResponse {
    webhooks: Array<WebhookExecution>
}

export interface WebhookExecution extends AnyProperty {
    uid: string
    channel: Array<string>
    event_data?: EventData
    event_headers?: AnyProperty
    org_uid?: string
    request_details?: Array<AnyProperty> 
    retry_count?: number
    status: number
    webhooks?: Array<string>
    destination?: AnyProperty 
}
export interface EventData extends AnyProperty {
    module?: string
    api_key?: string
    event?: string
    data?: AnyProperty
}