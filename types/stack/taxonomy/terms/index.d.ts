import { AnyProperty, SystemFields } from "../../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../../utility/operations";

export interface Term extends SystemFields, SystemFunction<Term> {
    ancestors(data: { include_children_count?: boolean, include_referenced_entries_count?: boolean, include_count?: boolean, skip?: number, limit?: number}): Promise<Response>
    descendants(data: { include_children_count?: boolean, include_referenced_entries_count?: boolean, include_count?: boolean, skip?: number, limit?: number}): Promise<Response>
    move(data: { term: { parent_uid?: string, order: number } }, force?: boolean): Promise<Response>
}

export interface Term extends Creatable<Term, {term: TermData}> {
}

export interface Terms extends Queryable<Term, {term: TermData}> {
}

export interface TermData extends AnyProperty {
    name: string
    term_uid: string
    parent_uid?: string
    order: number
}
