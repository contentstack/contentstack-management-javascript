import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'

/**
 * Contentstack has a sophisticated multilingual capability. It allows you to create and publish entries in any language. This feature allows you to set up multilingual websites and cater to a wide variety of audience by serving content in their local language(s). Read more about <a href='https://www.contentstack.com/docs/developers/multi-language-content'>Locales</a>.
 * @namespace Locale
 */

export function Locale (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/locales`

  if (data.locale) {
    Object.assign(this, cloneDeep(data.locale))
    this.urlPath = `/locales/${this.code}`
    /**
       * @description The Update Locale call lets you update the name and description of an existing Locale.
       * @memberof Locale
       * @func update
       * @returns {Promise<Locale.Locale>} Promise for Locale instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).locale('locale_code').fetch()
       * .then((locale) => {
       *   locale.fallback_locale = 'en-at'
       *   return locale.update()
       * })
       * .then((locale) => console.log(locale))
       *
       */
    this.update = update(http, 'locale')

    /**
       * @description The Delete Locale call is used to delete an existing Locale permanently from your Stack.
       * @memberof Locale
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).locale('locale_code').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)

    /**
       * @description The fetch Locale call fetches Locale details.
       * @memberof Locale
       * @func fetch
       * @returns {Promise<Locale.Locale>} Promise for Locale instance
       * @param {Object=} param - Query parameters
       * @prop {Int} param.version - Enter the version number of the locale you want to retrieve.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).locale('locale_code').fetch()
       * .then((locale) => console.log(locale))
       *
       */
    this.fetch = fetch(http, 'locale')
  } else {
    /**
     * @description The Create a Locale call creates a new locale in a particular stack of your Contentstack account.
     * @memberof Locale
     * @func create
     * @returns {Promise<Locale.Locale>} Promise for Locale instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().locale().create({ locale: { code: 'en-at' } })
     * .then((locale) => console.log(locale))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on Locale will allow you to fetch details of all or specific Locales.
     * @memberof Locale
     * @func query
     * @param {Object} params - Query parameters
     * @prop {Boolean} params.include_count - Set this to 'true' to include in response the total count of locales available in your stack.
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key' }).locale().query({ query: { code: 'locale-code' } }).find()
     * .then((locales) => console.log(locales))
     */
    this.query = query({ http: http, wrapperCollection: LocaleCollection })
  }
  return this
}

export function LocaleCollection (http, data) {
  const obj = cloneDeep(data.locales) || []
  const localeCollection = obj.map((userdata) => {
    return new Locale(http, { locale: userdata, stackHeaders: data.stackHeaders })
  })
  return localeCollection
}
