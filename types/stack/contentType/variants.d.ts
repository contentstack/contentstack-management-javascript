import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Variant extends SystemFields, SystemFunction<Variant> {
}
export interface Variants extends Queryable<Variants, {Variants: VariantData}> {
}

export interface VariantData extends AnyProperty {
    title: string
    url?: string
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