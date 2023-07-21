import { AnyProperty, SystemFields } from '../utility/fields';
import { ContentstackCollection } from '../contentstackCollection'
export interface Hosting {
    isEnable(): Promise<AnyProperty>
    enable(): Promise<AnyProperty>
    disable(): Promise<AnyProperty>
    createUploadUrl(): Promise<UploadDetails>
    deployment(): Deployments
    deployment(uid: string): Deployment
    latestLiveDeployment(): Promise<Deployment>
}

export interface UploadDetails {
    upload_uid: string
    form_fields: AnyProperty[]
    upload_url: string
    expires_in: number
}

export interface Deployments {
    create(data: { uploadUid: string , fileType: string, withAdvancedOptions?: boolean}): Promise<Deployment>   
    findAll(param?: AnyProperty): Promise<ContentstackCollection<Deployment>>
}

export interface Deployment extends SystemFields {
    fetch(): Promise<Deployment>
    logs(): Promise<DeploymentLog[]>
    signedDownloadUrl(): Promise<DownloadDetails>
}

export interface DownloadDetails {
    download_url: string
    expires_in: number
}
export interface DeploymentLog{
    message: string
    stage: string
    timestamp: string
}