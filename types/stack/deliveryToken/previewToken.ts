import { AnyProperty, SystemFields } from "../../utility/fields";
import { Creatable, SystemFunction } from "../../utility/operations";

// Main preview token interface
export interface PreviewToken
  extends SystemFields,
    Creatable<PreviewToken, PreviewToken>,
    SystemFunction<PreviewToken> {
  name: string;
  description: string;
  scope: Scope[];
  uid: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  token: string;
  type: string;
  preview_token: string;
}

// API response shape for creating a preview token
export interface PreviewTokenResponse {
  notice: string;
  token: PreviewTokenData;
}

// Data inside the response `token`
export interface PreviewTokenData extends AnyProperty {
  name: string;
  description: string;
  scope: Scope[];
  uid: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  token: string;
  type: string;
  preview_token: string;
}

export interface Scope {
  module: string;
  environments?: Environment[];
  branches?: string[];
  locales?: string[];
  acl: ACL;
  _metadata?: {
    uid: string;
  };
}

export interface Environment extends AnyProperty {
  name: string;
  uid: string;
  urls?: UrlLocale[];
  _version?: number;
  app_user_object_uid?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  ACL?: unknown[];
  tags?: string[];
}

export interface UrlLocale {
  url: string;
  locale: string;
}

export interface ACL extends AnyProperty {
  read?: boolean;
  write?: boolean;
  create?: boolean;
  update?: boolean;
}
