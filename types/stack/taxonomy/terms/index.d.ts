import { AnyProperty, SystemFields } from "../../../utility/fields";
import { Creatable, Queryable, Searchable, SystemFunction } from "../../../utility/operations";

export interface Term extends SystemFields, SystemFunction<Term> {
    ancestors(data?: { include_children_count?: boolean, include_referenced_entries_count?: boolean, include_count?: boolean, skip?: number, limit?: number}): Promise<Term>
    descendants(data?: { include_children_count?: boolean, include_referenced_entries_count?: boolean, include_count?: boolean, skip?: number, limit?: number}): Promise<Term>
    move(data: { term: { parent_uid?: string, order: number } }, force?: boolean): Promise<Term>
}

export interface Terms extends Creatable<Term, {term: TermData}> {
}

export interface Terms extends Searchable<Term, string> {
}

export interface Terms extends Queryable<Term, {term: TermData}> {
}

export interface TermData extends AnyProperty {
    name: string
    uid: string
    parent_uid?: string
    order: number
}
