import { ContentstackCollection } from "./contentstackCollection";

export class Query<T> {
    find(): Promise<ContentstackCollection<T>>
    count(): Promise<Response>
    findOne(): Promise<ContentstackCollection<T>>
}