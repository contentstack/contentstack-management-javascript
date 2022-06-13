import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { PublishDetails } from "../../utility/publish";

export interface BulkOperation extends SystemFields {
    publish(config: BulkOperationConfig): Promise<Response>
    unpublish(config: BulkOperationConfig): Promise<Response>
    delete(config: BulkDeleteConfig): Promise<Response>
}

export interface BulkOperationConfig {
    details: PublishItems
    skip_workflow_stage?: boolean
    approvals?: boolean
    is_nested?: boolean
}

export interface PublishItems extends PublishDetails {
    items: Array<BulkOperationItem>
}

export interface BulkOperationItem {
    _content_type_uid?: string
    uid: string
}

export interface BulkDeleteConfig {
    entries: Array<BulkDeleteEntry>
    assets: Array<BulkDeleteAsset>
}

export interface BulkDeleteEntry {
    uid: string 
    content_type: string
    locale: string
}

export interface BulkDeleteAsset {
    uid: string
}

export interface BranchData extends AnyProperty {
    name: string
    source: string
}