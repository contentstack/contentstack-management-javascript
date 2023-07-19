import { ContentstackCollection } from "../contentstackCollection";
import { AnyProperty, SystemFields } from "../utility/fields";

export interface Installation extends SystemFields {
    update(param?: AnyProperty): Promise<Installation>
    fetch(param?: AnyProperty): Promise<Installation>
    uninstall(param?: AnyProperty): Promise<AnyProperty>
    configuration(param?: AnyProperty): Promise<AnyProperty>
    setConfiguration(config: AnyProperty): Promise<AnyProperty>
    getConfigLocation(): Promise<AnyProperty>
    serverConfig(param?: AnyProperty): Promise<AnyProperty>
    setServerConfig(config: AnyProperty): Promise<AnyProperty>
    installationData(): Promise<AnyProperty>
    webhooks(webhookUid: string): WebHooks
}

export interface Installations {
    fetchAll(param?: AnyProperty): Promise<ContentstackCollection<Installation>>
    getInstalledApps(): Promise<AnyProperty>
    getInstalledUsers(): Promise<AnyProperty>
    getInstalledStacks(): Promise<AnyProperty>
}