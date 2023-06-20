

import { AnyProperty } from '../utility/fields';

export interface Oauth {
  fetchOAuth(param?: AnyProperty): Promise<AppOAuth>
  updateOAuth(data: { config: AppOAuth, param?: AnyProperty }): Promise<AppOAuth>
}