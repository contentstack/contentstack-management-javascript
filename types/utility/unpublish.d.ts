import { PublishConfig } from "./publish";
import { Response } from "../contentstackCollection";

export interface Unpublishable {
    unpublish(config: PublishConfig): Promise<Response>
}