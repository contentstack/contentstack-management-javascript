import { AnyProperty } from "../../utility/fields"

export interface MergeQueue {
  fetch():Promise<AnyProperty>
}

export interface MergeQueues {
  find(params?: object): Promise<AnyProperty>
}