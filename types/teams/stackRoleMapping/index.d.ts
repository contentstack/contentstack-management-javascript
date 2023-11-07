import { AnyProperty, SystemFields } from "../../utility/fields";
import { ContentstackCollection } from '../../contentstackCollection'
import { SystemFunction } from "../../utility/operations";

export interface StackRoleMapping extends SystemFields, SystemFunction<StackRoleMapping> {
    update(data: { stackRoleMapping: StackRoleMappingData }): Promise<StackRoleMapping>
}

export interface StackRoleMappings {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<StackRoleMappings>>
    add(data: { stackRoleMapping: StackRoleMappingData }): Promise<StackRoleMapping>
}

export interface StackRoleMappingData extends AnyProperty {
    stackApiKey?: string,
    roles: string[]
}
