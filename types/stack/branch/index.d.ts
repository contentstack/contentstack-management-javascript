import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Compare } from "./compare";
import { MergeQueue, MergeQueues } from "./merge-queue";

export interface Branch extends SystemFields, SystemFunction<Branch> {
    compare(compareBranchUid: string): Compare
}
    
export interface Branches extends Queryable<Branch, {branch: BranchData}> {
    mergeQueue(): MergeQueues
    mergeQueue(mergeJobUid: string): MergeQueue
    merge(mergeObj: IMergeObj, params: IMergeParams): Promise<AnyProperty>
}

export interface BranchData extends AnyProperty {
    uid: string
    source: string
}

export interface IMergeObj {
    item_merge_strategies?: IMergeStrategy[]
}

export interface IMergeStrategy {
    uid: string
    type: string
    merge_strategy: MergeStrategy
}

export type MergeStrategy = "merge_prefer_base" | "merge_prefer_compare" | "overwrite_with_compare" | "merge_new_only" | "merge_modified_only_prefer_base" | "merge_modified_only_prefer_compare" | "ignore"

export interface IMergeParams {
    base_branch: string
    compare_branch: string
    default_merge_strategy: MergeStrategy
    merge_comment: string
    no_revert?: boolean
}