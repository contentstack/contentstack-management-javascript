import { AnyProperty } from '../utility/fields';

export interface Authorization {
    findAll(param?: AnyProperty): Promise<AnyProperty>
    revokeAll(): Promise<AnyProperty>
    revoke(authorizationUid: string): Promise<AnyProperty>
}