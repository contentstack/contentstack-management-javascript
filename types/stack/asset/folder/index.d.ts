import { SystemFields } from "../../../utility/fields";
import { Creatable, SystemFunction } from "../../../utility/operations";

export interface Folder extends SystemFields, SystemFunction<Folder> {
    
}
export interface Folders extends Creatable<Folder, {asset: FolderData}> {
    
}

export interface FolderData {
    name: string
    parent_uid?: string
}
