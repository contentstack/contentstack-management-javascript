import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Compare } from './compare';

export interface Branch extends SystemFields, SystemFunction<Branch> {
    compare(compareBranchUid: string): Compare
}
    
export interface Branches extends Queryable<Branch, {branch: BranchData}> {
}

export interface BranchData extends AnyProperty {
    uid: string
    source: string
}