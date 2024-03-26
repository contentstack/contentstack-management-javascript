import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Extension extends SystemFields, SystemFunction<Extension> {
}
    
export interface Extensions extends Queryable<Extension, {extension: ExtensionData}> {
    upload(extension: UploadExtensionData): Promise<Extension>
}

export interface UploadExtensionData extends ExtensionData {
    upload: string
}
export interface ExtensionData extends AnyProperty {
    title: string
    data_type?: string
    type: 'field' | 'widget' | 'dashboard' | string
    src?: string
    srcdoc?: string
    tags?: Array<string>
    multiple?: boolean
    config?: string
    enable?: boolean
    scope?: ExtensionScope
    default_width?: string
}

export interface ExtensionScope extends AnyProperty {
    content_types: Array<string>
}
