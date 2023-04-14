import { AnyProperty } from '../../utility/fields';
import { Pagination } from '../../utility/pagination';

export interface Compare {
    all(params: Pagination & AnyProperty): Promise<AnyProperty>
    contentTypes(params: Params) : Promise<AnyProperty>
    globalFields(params: Params) : Promise<AnyProperty>
}

export type Params = {
    uid: string
}  | Pagination & AnyProperty