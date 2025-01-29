import { AnyProperty, SystemFields } from "../../../utility/fields";
import { Queryable, SystemFunction } from "../../../utility/operations";

export interface VariantGroupVariant extends SystemFields, SystemFunction<VariantGroupVariants> {
    
}
    
export interface VariantGroupVariants extends Queryable<VariantGroupVariants, {variant: VariantData}> {

}

export interface VariantData extends AnyProperty {
    name: string
    uid: string
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