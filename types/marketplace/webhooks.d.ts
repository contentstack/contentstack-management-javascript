import { AnyProperty } from "../utility/fields";

export interface WebHooks {
  listExecutionLogs(): Promise<AnyProperty>
  getExecutionLog(executionUid: string): Promise<AnyProperty>
  retryExecution(executionUid: string): Promise<AnyProperty>
}