import { AnyProperty } from "../utility/fields";
import { ContentstackCollection } from '../contentstackCollection'
import { Creatable } from "../utility/operations";
import { TeamUser, TeamUsers, TeamUserData } from "./teamUsers";
import { StackRoleMapping, StackRoleMappings, StackRoleMappingData } from "./stackRoleMappings";

export interface Team extends TeamData {
    update(data: TeamData, param?: { includeUserDetails?: boolean}): Promise<AnyProperty>
    teamUsers(): TeamUsers
    teamUsers(uid: string): TeamUser
    stackRoleMappings(): StackRoleMappings
    stackRoleMappings(stackApiKey: string): StackRoleMapping
    fetch(): Promise<Team>
    delete(): Promise<AnyProperty>
}

export interface Teams extends Creatable<Team, TeamData> {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<Team>>
}

export interface TeamData extends AnyProperty {
    uid?: string,
    name?: string,
    users?: TeamUserData | string[] | [],
    stackRoleMapping?: StackRoleMappingData[] | [],
    organizationRole?: string
}

