import { AnyProperty, SystemFields } from "../utility/fields";
import { ContentstackCollection } from '../contentstackCollection'
import { Creatable, SystemFunction } from "../utility/operations";
import { User, Users } from "./teamUsers";
import { StackRoleMapping, StackRoleMappings } from "./stackRoleMapping";

export interface Team extends SystemFields, SystemFunction<Team> {
    update(data?:TeamData, param?: { includeUserDetails?: boolean}): Promise<Team>
    user(): User
    users(uid: string): Users
    stackRoleMappings(): StackRoleMappings
    stackRoleMappings(uid: string): StackRoleMapping
}

export interface Teams extends Creatable<Team, TeamData> {
}

export interface Teams {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<Teams>>
}

export interface TeamData extends AnyProperty {
    name: string,
    users: any,
    stackRoleMapping: any,
    organizationRole: string
}

