import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Branch extends SystemFields, SystemFunction<Branch> {
}
    
export interface Branches extends Queryable<Branch, {branch: BranchData}> {
}

export interface BranchData extends AnyProperty {
    uid: string
    source: string
}