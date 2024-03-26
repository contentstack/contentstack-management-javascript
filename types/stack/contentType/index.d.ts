import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Entries, Entry } from "./entry";

export interface ContentType extends SystemFields, SystemFunction<ContentType> {
    entry(): Entries
    entry(uid: string): Entry
}

export interface ContentTypes extends Queryable<ContentType, {content_type: ContentTypeData}> {
    import(data: {content_type: string}, params?: any): Promise<ContentType>
    generateUid(name: string): string
}

export interface ContentTypeData extends AnyProperty {
    title: string
    uid: string
    schema: Array<Schema>
    options: ContentTypeOptions
}

export interface ContentTypeOptions {
    is_page: boolean
    singleton: boolean
    title: string 
    sub_title: Array<any>
    url_pattern?: string
}

export interface Schema extends AnyProperty {
    display_name: string 
    uid: string
    data_type: string
    mandatory?: boolean
    unique?: boolean
    field_metadata?: AnyProperty
}