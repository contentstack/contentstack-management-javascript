import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { PublishDetails } from "../../utility/publish";

export interface BulkOperation extends SystemFields {
    publish(config: BulkOperationConfig): Promise<Response>
    unpublish(config: BulkOperationConfig): Promise<Response>
    delete(config: BulkDeleteConfig): Promise<Response>
    addItems(config: BulkAddItemsConfig): Promise<Response>
    updateItems(config: BulkAddItemsConfig): Promise<Response>
    jobStatus(config: BulkJobStatus): Promise<Response>
}
export interface BulkOperationConfig {
    details: PublishItems
    skip_workflow_stage?: boolean
    approvals?: boolean
    is_nested?: boolean
    api_version?: string
    bulk_version?: string
}

export interface PublishItems extends PublishDetails {
    entries: Array<BulkOperationItem>
}

export interface BulkOperationItem {
    _content_type_uid?: string
    uid: string
}

export interface BulkDeleteConfig {
    entries?: Array<BulkDeleteEntry>
    assets?: Array<BulkDeleteAsset>
    details?: PublishDetails
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

export interface BulkAddItemsConfig {
    data: AnyProperty;
    bulk_version?: string;
}

export interface BulkJobStatus {
    job_id: AnyProperty;
    bulk_version?: string;
}