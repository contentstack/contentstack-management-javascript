import { AssetResponseType } from "../../contentstackCollection";
import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";
import { Publishable } from "../../utility/publish";
import { Unpublishable } from "../../utility/unpublish";
import { Folder, Folders } from "./folder";

export interface Asset extends Publishable, Unpublishable, SystemFields, SystemFunction<Asset> {
    replace(param: AssetData): Promise<Asset>
    download(data: {responseType: AssetResponseType, param?: AnyProperty}): Promise<any>
}

export interface Assets extends Queryable<Asset, AssetData> {
    folder(): Folders
    folder(uid: string): Folder
    download(data: {url: string, responseType: AssetResponseType, param?: AnyProperty}): Promise<any>
}

export interface AssetData extends AnyProperty {
    upload: string
    title?: string
    description?: string
    parent_uid?: string
    tags?: string[] | string
}