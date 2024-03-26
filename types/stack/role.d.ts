import { ContentstackCollection } from "../contentstackCollection";
import { AnyProperty, SystemFields } from "../utility/fields";
import { Queryable, SystemFunction } from "../utility/operations";
import { Pagination } from "../utility/pagination";
import { Scope } from "./deliveryToken";

export interface Role extends SystemFields, SystemFunction<Role>  {
    
}

export interface Roles extends Queryable<Role, {role: RoleData}>  {
    fetchAll(param?: (Pagination & AnyProperty)): Promise<ContentstackCollection<Role>>
}

export interface RoleData extends AnyProperty {
    name: string 
    description: string
    rules: Array<Scope>
}
