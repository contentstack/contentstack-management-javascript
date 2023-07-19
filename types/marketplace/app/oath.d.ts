import { AnyProperty } from '../../utility/fields';
import { AppOAuth } from '.';

export interface Oauth {
  fetch(param?: AnyProperty): Promise<AppOAuth>
  update(data: { config: AppOAuth, param?: AnyProperty }): Promise<AppOAuth>
  getScopes(): Promise<AnyProperty>
}