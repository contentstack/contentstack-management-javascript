import { Response } from "../../contentstackCollection"

export interface MergeQueue {
  fetch():Promise<Response>
  find():Promise<Response>
}