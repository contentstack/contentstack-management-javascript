import { Response } from '../../contentstackCollection';
import { AnyProperty } from '../../utility/fields';
import { Pagination } from '../../utility/pagination';

export interface Compare {
    all(params: Pagination & AnyProperty): Promise<AnyProperty>
    contentTypes(params: Params) : Promise<Response>
    globalFields(params: Params) : Promise<Response>
}

export type Params = {
    uid: string
}  | Pagination & AnyProperty