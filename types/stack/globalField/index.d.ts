import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Schema } from "../contentType";

export interface GlobalField extends SystemFields, SystemFunction<GlobalField> {
    
}

export interface GlobalFields extends Queryable<GlobalField, {global_field: GlobalFieldData}> {
    import({global_field: string}): Promise<GlobalField>
}

export interface GlobalFieldData extends AnyProperty {
    title: string
    uid: string
    schema: Array<Schema>
}
