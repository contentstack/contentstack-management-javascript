import { AnyProperty } from "../../utility/fields";
import { SystemFunction } from "../../utility/operations";

export interface AuditLog extends SystemFunction<AuditLog> {
  fetch(param: any): Promise<AuditLog>;
  fetchAll(): Promise<any>;
}

export interface AuditLog extends AnyProperty {
  uid: string;
  stack: string;
  created_at: string;
  created_by: string;
  module?: string;
  event_type?: string;
  request_id?: string;
  metadata?: any;
  remote_addr?: string;
  request?: any;
  response?: any;
}