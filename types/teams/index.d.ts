import { AnyProperty, SystemFields } from "../utility/fields";
import { ContentstackCollection } from '../contentstackCollection'
import { Creatable, SystemFunction } from "../utility/operations";
import { User, Users } from "./teamUsers";
import { StackRoleMapping, StackRoleMappings, StackRoleMappingData } from "./stackRoleMapping";

export interface Team extends TeamData {
    update(data: TeamData, param?: { includeUserDetails?: boolean}): Promise<AnyProperty>
    users(): Users
    users(uid: string): User
    stackRoleMappings(): StackRoleMappings
    stackRoleMappings(uid: string): StackRoleMapping
    fetch(): Promise<Team>
    delete(): Promise<AnyProperty>
}

export interface Teams extends Creatable<Team, TeamData> {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<Teams>>
}

export interface TeamData extends AnyProperty {
    uid?: string,
    name?: string,
    users?: any,
    stackRoleMapping?: StackRoleMappingData[] | [],
    organizationRole?: string
}

