import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Publishable } from "../../utility/publish";
import { Unpublishable } from "../../utility/unpublish";

export interface MetaData extends Publishable, Unpublishable, SystemFields, SystemFunction<MetaData> {
    
}

export interface MetaDataData extends AnyProperty {
    uid: string
    type: string
    entity_uid?: string
    _content_type_uid?: string
    extension_uid?: string
}
