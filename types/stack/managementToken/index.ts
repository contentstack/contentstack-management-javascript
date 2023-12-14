import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface ManagementToken extends SystemFields, SystemFunction<ManagementToken> {
}
    
export interface ManagementTokens extends Queryable<ManagementToken, {token: ManagementTokenData}> {
}

export interface ManagementTokenData extends AnyProperty {
    name: string
    description: string
    scope: Array<Scope>
}

export interface Scope {
    module: string
    environments?: Array<string>
    locales?: Array<string>
    acl: ACL
}
export interface ACL extends AnyProperty {
    read?: boolean
    write?: boolean
    create?: boolean
    update?: boolean
}