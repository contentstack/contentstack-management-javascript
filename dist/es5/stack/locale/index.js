"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Locale = Locale;
exports.LocaleCollection = LocaleCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

/**
 * Contentstack has a sophisticated multilingual capability. It allows you to create and publish entries in any language. This feature allows you to set up multilingual websites and cater to a wide variety of audience by serving content in their local language(s). Read more about <a href='https://www.contentstack.com/docs/developers/multi-language-content'>Locales</a>.
 * @namespace Locale
 */
function Locale(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/locales";

  if (data.locale) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.locale));
    this.urlPath = "/locales/".concat(this.code);
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
       *  locale.title = 'My New Content Type'
       *  locale.description = 'Content Type description'
       *  return locale.update()
       * })
       * .then((locale) => console.log(locale))
       *
       */

    this.update = (0, _entity.update)(http, 'locale');
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

    this["delete"] = (0, _entity.deleteEntity)(http);
    /**
       * @description The fetch Locale call fetches Locale details.
       * @memberof Locale
       * @func fetch
       * @returns {Promise<Locale.Locale>} Promise for Locale instance
       * @param {Int} version Enter the unique ID of the content type of which you want to retrieve the details. The UID is generated based on the title of the content type. The unique ID of a content type is unique across a stack.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).locale('locale_code').fetch()
       * .then((locale) => console.log(locale))
       *
       */

    this.fetch = (0, _entity.fetch)(http, 'locale');
  } else {
    /**
     * @description The Create a content type call creates a new content type in a particular stack of your Contentstack account.
     * @memberof Locale
     * @func create
     * @returns {Promise<Locale.Locale>} Promise for Locale instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().locale().create({ locale: { code: 'en-at' } )
     * .then((locale) => console.log(locale))
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The Query on Content Type will allow to fetch details of all or specific Content Type
     * @memberof Locale
     * @func query
     * @param {Boolean} include_count Set this to 'true' to include in response the total count of content types available in your stack.
     * @returns {Array<Locale>} Array of ContentTyoe.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack(api_key).locale().query({ query: { code: 'locale-code' } }).find()
     * .then((locales) => console.log(locales))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: LocaleCollection
    });
  }

  return this;
}

function LocaleCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.locales) || [];
  var localeCollection = obj.map(function (userdata) {
    return new Locale(http, {
      locale: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return localeCollection;
}