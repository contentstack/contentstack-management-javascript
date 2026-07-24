import { Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

/** Options for {@link Variant.publish} and {@link Variant.unpublish} (entry publish/unpublish APIs with variant payload). */
export interface VariantPublishUnpublishOptions {
    publishDetails: AnyProperty
    locale?: string | null
    version?: number | null
    scheduledAt?: string | null
    /** Merged with stack headers on the request */
    headers?: Record<string, string>
    /** Query string parameters */
    params?: Record<string, unknown>
}

export interface Variant extends SystemFields, SystemFunction<Variant> {
    publish(options: VariantPublishUnpublishOptions): Promise<Response>
    unpublish(options: VariantPublishUnpublishOptions): Promise<Response>
}
export interface Variants extends Queryable<Variants, {Variants: VariantData}> {
}

export interface VariantData extends AnyProperty {
    title: string
    url?: string
}
export interface Scope {
    module: string
    environments?: Array<string>
    locales?: Array<string>
    acl: ACL
}
export interface ACL extends AnyProperty {
    read?: boolean
    write?: boolean
    create?: boolean
    update?: boolean
}