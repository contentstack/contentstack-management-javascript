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
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').locale('locale_code').fetch()
       * .then((locale) => {
       *  locale.title = 'My New Content Type'
       *  locale.description = 'Content Type description'
       *  return locale.update()
       * })
       * .then((locale) => console.log(locale))
       *
       */
    this.update = update(http, 'locale')

    /**
       * @description The Delete Locale call is used to delete an existing Locale permanently from your Stack.
       * @memberof Locale
       * @func delete
       * @returns {String} Success message.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').locale('locale_code').delete()
       * .then((notice) => console.log(notice))
       */
    this.delete = deleteEntity(http)

    /**
       * @description The fetch Locale call fetches Locale details.
       * @memberof Locale
       * @func fetch
       * @returns {Promise<Locale.Locale>} Promise for Locale instance
       * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').locale('locale_code').fetch()
       * .then((locale) => console.log(locale))
       *
       */
    this.fetch = fetch(http, 'locale')
  } else {
    /**
     * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
     * @memberof Locale
     * @func create
     * @returns {Promise<Locale.Locale>} Promise for Locale instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().locale().create({name: 'My New locale'})
     * .then((locale) => console.log(locale))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on Content Type will allow to fetch details of all or specific Content Type
     * @memberof Locale
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Array<Locale>} Array of ContentTyoe.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().locale().query({name: 'My New Stack'})
     * .then((locales) => console.log(locales))
     */
    this.query = query({ http: http, wrapperCollection: LocaleCollection })
  }
  return this
}

export function LocaleCollection (http, data) {
  const obj = cloneDeep(data.locales)
  const localeCollection = obj.map((userdata) => {
    return new Locale(http, { locale: userdata, stackHeaders: data.stackHeaders })
  })
  return localeCollection
}
