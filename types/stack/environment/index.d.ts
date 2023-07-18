import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Environment extends SystemFields, SystemFunction<Environment> {
}
    
export interface Environments extends Queryable<Environment, {environment: EnvironmentData}> {
}

export interface EnvironmentData extends AnyProperty {
    name: string
    servers: Array<Server>
    urls: Array<ServerDetail>
    deploy_content: boolean
}

export interface Server extends AnyProperty {
    name: string
}
export interface ServerDetail extends AnyProperty {
    locale: string
    url: string
}