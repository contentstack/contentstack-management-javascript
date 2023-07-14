import { ContentstackCollection } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, SystemFunction } from "../../utility/operations";
import { Authorization } from '../authorization';
import { Hosting } from './hosting';
import { Installation } from "../installation";
import { Oauth } from "./oath";

export interface App extends SystemFields, SystemFunction<App> {
    
    update(param?: AnyProperty): Promise<App>
    fetch(param?: AnyProperty): Promise<App>
    delete(param?: AnyProperty): Promise<App>
    oauth(): Oauth
    hosting(): Hosting
    install(data: {targetUid: string, targetType: AppTarget}): Promise<Installation>
    authorize(param: { 
        responseType: string, 
        clientId: string, 
        redirectUri: string, 
        scope: string, 
        state: string }): Promise<AnyProperty>
    authorization(): Authorization
    listInstallations(): Promise<ContentstackCollection<App>>
}

export interface Apps extends Creatable<App, AppData> {
    create(): Promise<App>
}

export interface AppData extends AnyProperty {
    name: string
    description?: string
    icon?: string
    target_type: AppTarget
    ui_location?: UILocation 
    webhook?: AppWebhook | AppWebhookChannel
    oauth?: AppOAuth
}

export interface AppOAuth extends AnyProperty {
    redirect_uri?: string
    app_token_config?: TokenConfig
    user_token_config?: UserTokenConfig
}

export interface TokenConfig extends AnyProperty {
    enabled: boolean
    scopes: string[]
}

export interface UserTokenConfig extends TokenConfig {
    allow_pkce: boolean
}

export interface AppWebhookChannel extends AppWebhook {
    target_url: string
    channels: string[]
}

export interface AppWebhook extends AnyProperty {
    signed: boolean
    name: string
    enabled?: boolean
    app_lifecycle_enabled?: boolean
    retry_policy?: string
}

export interface UILocation extends AnyProperty {
    signed: boolean
    base_url?: string
    locations: Location[]
}

export interface Location extends AnyProperty {
    type: string
    meta: LocationMeta[]
}

export interface LocationMeta extends AnyProperty {
    signed: boolean
    path: string
    name: string
    data_type?: string
}

export type AppTarget =
  | 'stack'
  | 'organization'