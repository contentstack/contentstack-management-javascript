import { ContentstackCollection, Response } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, Queryable, SystemFunction } from "../../utility/operations";

// Represents a Release with various operations
export interface Release extends SystemFields, SystemFunction<Release> {
    item(): ReleaseItem;
    deploy(detail: ReleaseDeploy): Promise<Response>;
    clone(param: { name: string; description: string }): Promise<Release>;
}

// Represents a collection of Releases with query capabilities
export interface Releases extends Queryable<Release, { release: ReleaseData }> {}

// Data structure for Release properties
export interface ReleaseData extends AnyProperty {
    name: string;
    description: string;
    locked: boolean;
    archived: boolean;
}

// Data structure for deploying a Release
export interface ReleaseDeploy extends AnyProperty {
    environments: Array<string>;
    locales: Array<string>;
    scheduledAt: string;
    action: 'publish' | 'unpublish';
}

// Represents a Release item with various operations
export interface ReleaseItem extends SystemFields, Creatable<Release, { item?: ReleaseItemData; items?: Array<ReleaseItemData> }> {
    delete(param?: { item?: ReleaseItemData; items?: Array<ReleaseItemData>; release_version?: string }): Promise<any>; // Changed return type to Promise<void>
    findAll(param?: AnyProperty): Promise<ContentstackCollection<ReleaseItemData>>;
    move(param: { param: MoveReleaseItems, release_version?: string }): Promise<any>;
    create(param: { item?: ReleaseItemData; items?: Array<ReleaseItemData>; release_version?: string }): Promise<Release>;
}

// Data structure for Release item properties
export interface ReleaseItemData extends AnyProperty {
    uid: string;
    version: number;
    locale: string;
    content_type_uid: string;
    action: 'publish' | 'unpublish';
}

export interface MoveReleaseItems extends AnyProperty {
    release_uid: string;
    items: Array<ReleaseItemData>;
}

export interface MoveItemData extends AnyProperty {
    uid: string;
    locale: string;
    variant_id?: string;
}
