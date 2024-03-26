import { ContentstackCollection } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { SystemFunction } from "../../utility/operations";
import { Branch } from "../branch";

export interface BranchAlias extends SystemFields {
    createOrUpdate(targetBranch: string): Promise<Branch>
    fetch(param?: AnyProperty): Promise<Branch>
    delete(param?: AnyProperty): Promise<Branch>
}
    
export interface BranchAliases {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<Branch>>
}
