import { AnyProperty } from '../utility/fields';

export interface Hosting {
    isEnable(): Promise<AnyProperty>
    enable(): Promise<AnyProperty>
    disable(): Promise<AnyProperty>
    createUploadUrl(): Promise<AnyProperty>
    // createUploadUrl(data: { 
    //     uploadUid: string, 
    //     fileType: string,
    //     params?: AnyProperty
    //  }): Promise<AnyProperty>
}