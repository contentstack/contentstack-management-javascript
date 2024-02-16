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
}

export interface TaxonomyData extends AnyProperty {
    name: string
    uid: string
    description: string
}
