import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Publishable } from "../../utility/publish";
import { Unpublishable } from "../../utility/unpublish";
import { MetaData } from './metadata';


export interface Entry extends Publishable, Unpublishable, SystemFields, SystemFunction<Entry> {
    setWorkflowStage(data: { workflow_stage: WorkflowStage, locale?:string}): Promise<Response>
    metadata(uid: string): MetaData
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