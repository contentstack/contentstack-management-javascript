import { AnyProperty } from "../../utility/fields";

export interface TeamUsers extends TeamUserData {
    add(data:TeamUserData): Promise<TeamUserData>;
    fetchAll(params?: { includeUserDetails: boolean, include_count: boolean}): Promise<AnyProperty>;
}

export interface TeamUser {
    userId: string;
    remove(): Promise<AnyProperty>;
}

export interface TeamUserData extends AnyProperty {
    emails?: string[];
    users?: string[];
}
