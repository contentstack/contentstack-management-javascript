import { Query } from "../query";
import { AnyProperty } from "./fields";
import { Pagination } from "./pagination";

export interface Creatable<T, D> {
    create(data: D, param?: AnyProperty): Promise<T>
}

export interface Searchable<T, D> {
    search(string: D, param?: AnyProperty): Promise<T>
}

export interface SystemFunction<T> {
    update(param?: AnyProperty): Promise<T>
    fetch(param?: AnyProperty): Promise<T>
    delete(param?: AnyProperty): Promise<T>
}

export interface Queryable<T, D> extends Creatable<T, D> {
    query(param?: Pagination & AnyProperty): Query<T>
}
