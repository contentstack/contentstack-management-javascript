import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../utility/operations";
import { Term, Terms } from "../taxonomy/terms"

export interface Taxonomy extends SystemFields, SystemFunction<Taxonomy> {
    terms(): Terms
    terms(uid: string): Term
    export(params?: any): Promise<AnyProperty>
}

export interface Taxonomies extends Creatable<Taxonomy, {taxonomy: TaxonomyData}>, Queryable<Taxonomy, {taxonomy: TaxonomyData}> {
    import(data: TaxonomyData, params?: any): Promise<Taxonomy>
    publish(data: TaxonomyPublishData, api_version?: string): Promise<TaxonomyPublishResponse>
}

export interface TaxonomyData extends AnyProperty {
    name: string
    uid: string
    description: string
}

export interface TaxonomyPublishData {
    locales: Array<string>
    environments: Array<string>
    items: Array<TaxonomyPublishItem>    
}

export interface TaxonomyPublishItem {
    uid: string
    term_uid: string
}

export interface TaxonomyPublishResponse extends AnyProperty {
    notice?: string
    job_id?: string
}
