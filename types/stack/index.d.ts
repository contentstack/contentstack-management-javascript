import { Response } from "../contentstackCollection";
import { Query } from "../query";
import { User } from "../user";
import { AnyProperty, SystemFields } from "../utility/fields";
import { Pagination } from "../utility/pagination";
import { Asset, Assets } from "./asset";
import { Branch, Branches } from "./branch";
import { BranchAlias, BranchAliases } from "./branchAlias";
import { BulkOperation } from "./bulkOperation";
import { ContentType, ContentTypes } from "./contentType";
import { DeliveryToken, DeliveryTokens } from "./deliveryToken";
import { Environment, Environments } from "./environment";
import { Extension, Extensions } from "./extension";
import { GlobalField, GlobalFields } from "./globalField";
import { Label, Labels } from "./label";
import { Locale, Locales } from "./locale";
import { Release, Releases } from "./release";
import { Role, Roles } from "./role";
import { Webhook, Webhooks } from "./webhook";
import { Workflow, Workflows } from "./workflow";
import { Taxonomy, Taxonomies } from "./taxonomy";
import { ManagementToken, ManagementTokens } from "./managementToken";

export interface StackConfig {
    api_key:string
    management_token?: string
    branch_uid?: string
}

export interface StackDetails {
    stack: {
        name: string
        description: string
        master_locale: string
    }
}

export interface Stack extends SystemFields {
    api_key: string
    name: string
    
    fetch(param?: AnyProperty): Promise<Stack>
    query(param?: Pagination & AnyProperty): Query<Stack>
    update(param?: AnyProperty): Promise<Stack>

    locale(): Locales
    locale(code: string): Locale

    environment(): Environments
    environment(uid: string): Environment

    branch(): Branches
    branch(uid: string): Branch

    branchAlias(): BranchAliases
    branchAlias(uid: string): BranchAlias

    contentType(): ContentTypes
    contentType(uid: string): ContentType

    globalField(): GlobalFields
    globalField(uid: string): GlobalField

    asset(): Assets
    asset(uid: string): Asset

    deliveryToken(): DeliveryTokens
    deliveryToken(uid: string): DeliveryToken

    extension(): Extensions
    extension(uid: string): Extension

    workflow(): Workflows
    workflow(uid: string): Workflow

    webhook(): Webhooks
    webhook(uid: string): Webhook

    label(): Labels
    label(uid: string): Label

    release(): Releases
    release(uid: string): Release

    bulkOperation(): BulkOperation

    users(): Promise<Array<User>>
    updateUsersRoles(users: AnyProperty): Promise<any>
    transferOwnership(email: string): Promise<Response>
    settings(): Promise<any>
    resetSettings(): Promise<any>
    addSettings(stackVariables: AnyProperty): Promise<any>
    share(emails: Array<string>, roles: AnyProperty): Promise<Response>
    unShare(email: string): Promise<Response>
    role(): Roles
    role(uid: string): Role

    taxonomy(): Taxonomies
    taxonomy(uid: string): Taxonomy

    managementToken(): ManagementTokens
    managementToken(uid: string): ManagementToken
}
