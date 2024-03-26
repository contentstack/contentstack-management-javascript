import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface DeliveryToken extends SystemFields, SystemFunction<DeliveryToken> {
}
    
export interface DeliveryTokens extends Queryable<DeliveryToken, {token: DeliveryTokenData}> {
}

export interface DeliveryTokenData extends AnyProperty {
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