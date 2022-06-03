import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Publishable } from "../../utility/publish";
import { Unpublishable } from "../../utility/unpublish";


export interface Entry extends Publishable, Unpublishable, SystemFields, SystemFunction<Entry> {
}

export interface Entries extends Queryable<Entry, {entry: EntryData}> {
    import(data: {entry: string, locale?: string, overwrite?: boolean }): Promise<Entry>
}

export interface EntryData extends AnyProperty {
    title: string
    url?: string
}