import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../utility/operations";

export interface User extends SystemFields, SystemFunction<User> { 
}

export interface Users extends Creatable<User, {User: UserData}> {
}

export interface Users extends Queryable<User, {User: UserData}> {
}

export interface UserData extends AnyProperty {
    users: string[]
}
