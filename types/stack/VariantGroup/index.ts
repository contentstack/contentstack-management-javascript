import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { VariantGroupVariants, VariantGroupVariant } from "./variants";

export interface VariantGroup extends SystemFields, SystemFunction<VariantGroup> {
    variants(): VariantGroupVariants
    variants(variant: string): VariantGroupVariant
}
    
export interface VariantGroups extends Queryable<VariantGroup, {uid: VariantGroupData}> {
}

export interface VariantGroupData extends AnyProperty {
    name: string
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