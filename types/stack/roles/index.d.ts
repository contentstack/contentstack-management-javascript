import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Role extends SystemFields, SystemFunction<Role> {
}
    
export interface Roles extends Queryable<Role, {role: RoleData}> {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<RoleData>>
}

export interface RoleData extends AnyProperty {
    name: string
    description: string
    rules: Array<Rule>
}

export interface Rule extends AnyProperty {
    module: string
    environments: Array<string>
    locales: Array<string>
    acl: ACL
}

export interface ACL extends AnyProperty {
    read?: boolean
    write?: boolean
    create?: boolean
    update?: boolean
}