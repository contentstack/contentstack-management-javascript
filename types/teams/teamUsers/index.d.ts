import { AnyProperty } from "../../utility/fields";

export interface Users extends UserData {
    add(data:UserData): Promise<UserData>
    fetchAll(params?: { includeUserDetails: boolean, include_count: boolean}): Promise<AnyProperty>
}

export interface User {
    remove(): Promise<AnyProperty>
}

export interface UserData extends AnyProperty {
    emails?: string[]
    users?: string[]
}
