import { AnyProperty, SystemFields } from "../../utility/fields";
import { Queryable, SystemFunction } from "../../utility/operations";

export interface Locale extends SystemFields, SystemFunction<Locale> {
}
    
export interface Locales extends Queryable<Locale, {locale: LocaleData}> {
}

export interface LocaleData extends AnyProperty {
    code: string
    name?: string
    fallback_locale? :string
}
