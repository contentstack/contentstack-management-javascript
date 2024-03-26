export interface AnyProperty {
    [propName: string]: any
}

export interface SystemFields extends AnyProperty {
    uid: string
    created_at?: string
    updated_at?: string
}
