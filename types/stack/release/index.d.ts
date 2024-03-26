import { ContentstackCollection, Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../utility/operations";

export interface Release extends SystemFields, SystemFunction<Release> {
    item(): ReleaseItem
    deploy(detail: ReleaseDeploy): Promise<Response>
    clone(param: {name: string, description: string}): Promise<Release>
}
    
export interface Releases extends Queryable<Release, {locale: ReleaseData}> {
}

export interface ReleaseData extends AnyProperty {
    name: string
    description: string
    locked: boolean
    archived: boolean
}

export interface ReleaseDeploy extends AnyProperty {
    environments: Array<string>
    locales: Array<string>
    scheduledAt: string
    action: 'publish' | 'unpublish'
}

export interface ReleaseItem extends SystemFields, Creatable<Release, {item?: ReleaseItemData, items?: Array<ReleaseItemData>}> {
    delete(param?: {items: Array<ReleaseItemData>}): Promise<Release>
    findAll(param?: AnyProperty): Promise<ContentstackCollection<ReleaseItemData>>
}

export interface ReleaseItemData extends AnyProperty {
    uid: string
    version: number
    locale: string
    content_type_uid: string
    action: 'publish' | 'unpublish'
}