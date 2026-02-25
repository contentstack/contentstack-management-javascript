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
    getJobItems(job_id: string, params?: BulkJobItemsParams): Promise<BulkJobItemsResponse>
}
export interface BulkOperationConfig {
    details: PublishItems
    skip_workflow_stage?: boolean
    approvals?: boolean
    is_nested?: boolean
    api_version?: string
    bulk_version?: string
    publishAllLocalized?: boolean
    unpublishAllLocalized?: boolean
}

export interface PublishItems extends PublishDetails {
    entries?: Array<BulkOperationItem>
    assets?: Array<BulkOperationItem>
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
    api_version?: string;
}

export interface BulkJobItemsParams {
    api_version?: string;
    include_count?: boolean;
    skip?: number;
    limit?: number;
    include_reference?: boolean;
    status?: string;
    type?: string;
    ct?: string | string[];
    [key: string]: unknown;
}

export interface BulkJobItem {
    uid: string;
    locale: string;
    version: number;
    title: string;
    type: "asset" | "entry";
    publish_details: {
        status: string;
        failure_reason?: string;
    };
    publish_locale: string;
    environment: string;
    action: string;
    published_at: string | null;
    scheduled_at: string;
    user: string;
    depth: number;
    content_type?: { uid: string };
}

/**
 * Response structure varies based on query params passed to getJobItems:
 * - items: Always present - array of job items
 * - skip, limit, total_count: Present when include_count=true
 * - Additional fields may be included based on other params (e.g. include_reference)
 */
export interface BulkJobItemsResponse {
    items?: Array<BulkJobItem | AnyProperty>;
    skip?: number;
    limit?: number;
    total_count?: number;
    count?: number;
    notice?: string;
    [key: string]: unknown;
}