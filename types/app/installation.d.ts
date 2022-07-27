import { ContentstackCollection } from "../contentstackCollection";
import { SystemFields } from "../utility/fields";

export interface Installation extends SystemFields{
    update(param?: AnyProperty): Promise<T>
    fetch(param?: AnyProperty): Promise<T>
    uninstall(param?: AnyProperty): Promise<T>
}

export interface Installations {
    findAll(param: AnyProperty): Promise<ContentstackCollection<Installation>>
}