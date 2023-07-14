import { ContentstackCollection } from "../contentstackCollection";
import { AnyProperty, SystemFields } from "../utility/fields";
import { SystemFunction } from "../utility/operations";
import { Installation, Installations } from "./installation";
import { App, Apps } from "./app";
import { AppRequest } from "./apprequest";

export interface Marketplace extends SystemFields, SystemFunction<Marketplace> {
    
    app(): Apps
    app(uid: string): App
    installation(): Installations
    installation(uid: string): Installation
    appRequests(): AppRequest
    findAllApps(param?: AnyProperty): Promise<ContentstackCollection<App>> 
    findAllAuthorizedApps(param?: AnyProperty): Promise<AnyProperty>
}
