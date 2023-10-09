import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../utility/operations";
import { Term, Terms } from "../taxonomy/terms"

export interface Taxonomy extends SystemFields, SystemFunction<Taxonomy> {
    term(): Terms
    term(uid: string): Term
}
    
export interface Taxonomies extends Queryable<Taxonomy, {taxonomy: TaxonomyData}> {
}

export interface Taxonomies extends Creatable<Taxonomy, {taxonomy: TaxonomyData}> {
}

export interface TaxonomyData extends AnyProperty {
    name: string
    taxonomy_uid: string
    description: string
}
