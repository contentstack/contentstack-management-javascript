import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Compare } from './compare';

export interface Branch extends SystemFields, SystemFunction<Branch> {
    compare(compareBranchUid: string): Compare
}
    
export interface Branches extends Queryable<Branch, {branch: BranchData}> {
    merge(mergeObj: MergePayload): Promise<AnyProperty>
}

export interface BranchData extends AnyProperty {
    uid: string
    source: string
}

export interface MergePayload extends AnyProperty {
    base_branch: string
    compare_branch: string
    default_merge_strategy: MergeStrategy
    item_merge_strategies?: ItemMergeStrategy[]
    merge_comment: string
    no_revert?: boolean
}

export interface ItemMergeStrategy extends AnyProperty {
    uid: string
    type: string
    merge_strategy: MergeStrategy     
}

export type MergeStrategy = "merge_prefer_base" | "merge_prefer_compare" | "overwrite_with_compare" | "merge_new_only" | "merge_modified_only_prefer_base" | "merge_modified_only_prefer_compare" | "ignore"
