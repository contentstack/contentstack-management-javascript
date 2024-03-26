import { AnyProperty } from '../utility/fields';

export interface AppRequest {
    create(params: {appUid: string, targetUid: string}): Promise<AnyProperty>
    delete(requestUid: string): Promise<AnyProperty>
    findAll(param?: AnyProperty): Promise<AnyProperty>
}