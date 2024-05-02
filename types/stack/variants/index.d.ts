import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Variant extends SystemFields, SystemFunction<Variant> {
}
    
export interface Variants extends Queryable<Variant, {variants: VariantData}> {
    fetchByUIDs(data: Array<string>): Promise<Response>
}

export interface VariantData extends AnyProperty {
    name: string
    parent?: Array<string>
}
