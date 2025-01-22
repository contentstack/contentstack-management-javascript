import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Publishable } from "../../utility/publish";
import { Unpublishable } from "../../utility/unpublish";
import { Variants, Variant } from "./variants";


export interface Entry extends Publishable, Unpublishable, SystemFields, SystemFunction<Entry> {
    variants(): Variants
    variants(uid: string): Variant
    setWorkflowStage(data: { workflow_stage: WorkflowStage, locale?:string}): Promise<Response>
    locales(): Promise<Locales>
    references(param: object): Promise<References>
}

export interface Entries extends Queryable<Entry, {entry: EntryData}> {
    import(data: {entry: string, locale?: string, overwrite?: boolean }): Promise<Entry>
}

export interface EntryData extends AnyProperty {
    title: string
    url?: string
}

export interface WorkflowStage extends AnyProperty {
    uid: string
    comment: string
    due_date?: string
    notify?: boolean
    assign_to?: Array<any>
    assigned_by_roles?: Array<any>
}

export interface Locales {
    locales: Code[];
}

export interface Code extends AnyProperty {
    code: string;
    localized: boolean;
}

export interface References {
    references: EntryReferences[];
}

export interface EntryReferences extends AnyProperty {
    title: string;
    entry_uid: string;
    locale: string;
    content_type_uid: string;
    content_type_title: string;
}