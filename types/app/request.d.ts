import { AnyProperty } from '../utility/fields';

export interface Request {
    create(targetUid: string): Promise<AnyProperty>
    fetch(): Promise<AnyProperty>
    delete(requestUid: string): Promise<AnyProperty>
}

export interface Requests {
    delete(requestUid: string): Promise<AnyProperty>
    findAll(param?: AnyProperty): Promise<AnyProperty>
}