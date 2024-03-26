import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Label extends SystemFields, SystemFunction<Label> {
}
    
export interface Labels extends Queryable<Label, {label: LabelData}> {
}

export interface LabelData extends AnyProperty {
    name: string
    content_types: Array<string>
    parent?: Array<string>
}
