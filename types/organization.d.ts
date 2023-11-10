import { User } from './user'
import { Stack } from './stack'
import { Role } from './stack/role'
import { Sorting } from './utility/sorting'
import { Pagination } from './utility/pagination'
import { AnyProperty, SystemFields } from './utility/fields'
import { ContentstackCollection, Response } from './contentstackCollection'
import { App, Apps } from './app'
import { AppRequest } from './app/request'
import { Team, Teams } from './teams'

export interface Organizations {
    fetchAll(params?: AnyProperty): Promise<ContentstackCollection<Organization>>
}

export interface Organization extends SystemFields {
    name?: string
    fetch(param?: AnyProperty): Promise<Organization>
    stacks(param?: Pagination & Sorting): Promise<ContentstackCollection<Stack>>
    transferOwnership(email: string): Promise<Response>
    addUser(data: OrganizationInvite): Promise<ContentstackCollection<User>>
    removeUsers(data: string[]): Promise<Response>
    getInvitations(param?: Pagination & AnyProperty): Promise<ContentstackCollection<User>>
    resendInvitation(invitationUid: string): Promise<Response>
    roles(param?: Pagination & AnyProperty): Promise<ContentstackCollection<Role>>
    app(): Apps
    app(uid: string): App
    appRequest(): AppRequest
    teams(): Teams
    teams(uid: string): Team
}

export interface OrganizationInvite {
    users?: {
        [propName: string]: string[]
    }
    stacks?: {
        [propName: string]: {
            [propName: string]: string[]
        }
    }
}
