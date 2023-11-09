import { AnyProperty, SystemFields } from "../../utility/fields";
import { ContentstackCollection } from '../../contentstackCollection'
import { SystemFunction } from "../../utility/operations";

export interface StackRoleMapping extends StackRoleMappingData {
    update(data:StackRoleMappingData): Promise<{StackRoleMappingData: StackRoleMappingData}>
}

export interface StackRoleMappings extends StackRoleMappingData {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<StackRoleMappings>>
    add(data: StackRoleMappingData): Promise<StackRoleMappings>
}

export interface StackRoleMappingData extends AnyProperty {
    stackApiKey?: string,
    roles: string[]
}

