export interface Response {
    notice: string
}

export interface ContentstackCollection<T> extends Response {
    items: [T]
    count: number
}

export interface EntryCollection<T> extends ContentstackCollection<T> {
    schema?: object
    content_Type?: object
}
