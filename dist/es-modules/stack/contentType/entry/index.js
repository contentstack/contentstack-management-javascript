import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, query, publish, unpublish } from '../../../entity';
/**
 * An entry is the actual piece of content created using one of the defined content types. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Entries</a>.
 * @namespace Entry
 */

export function Entry(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.content_type_uid = data.content_type_uid;
  this.urlPath = "content_types/".concat(this.content_type_uid, "/entries");

  if (data && data.entry) {
    Object.assign(this, cloneDeep(data.entry));
    this.urlPath = "content_types/".concat(this.content_type_uid, "/entries/").concat(this.uid);
    /**
     * @description The Create an entry call creates a new entry for the selected content type.
     * @memberof Entry
     * @func update
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => {
     *  entry.title = 'My New Entry'
     *  entry.description = 'Entry description'
     *  return Entry.update()
     * })
     * .then((entry) => console.log(entry))
     *
     */

    this.update = update(http, 'entry');
    /**
     * @description The Delete an entry call is used to delete a specific entry from a content type.
     * @memberof Entry
     * @func delete
     * @returns {String} Success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').contentType('content_type_uid').entry('uid').delete()
     * .then((notice) => console.log(notice))
     */

    this["delete"] = deleteEntity(http);
    /**
     * @description The fetch Entry call fetches Entry details.
     * @memberof Entry
     * @func fetch
     * @param {Int} version Enter the version number of the entry that you want to retrieve. However, to retrieve a specific version of an entry, you need to keep the environment parameter blank.
     * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
     * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
     * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').contentType('content_type_uid').entry('uid').fetch()
     * .then((entry) => console.log(entry))
     *
     */

    this.fetch = fetch(http, 'entry');
    /**
     * @description The Publish an asset call is used to publish a specific version of an asset on the desired environment either immediately or at a later date/time.
     * @memberof Asset
     * @func publish
     * @returns {Promise<String>} Notice for success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack('api_key').contentType('content_type_uid').entry('uid').publish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((notice) => console.log(notice))
     *
     */

    this.publish = publish(http, 'entry');
    /**
     * @description The Replace asset call will replace an existing asset with another file on the stack.
     * @memberof Entry
     * @func unpublish
     * @returns {Promise<String>} Notice for success message.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const entry = {
     *  "locales": [
     *              "en-us"
     *              ],
     *   "environments": [
     *                "development"
     *               ]
     * }
     *
     * client.stack('api_key').contentType('content_type_uid').entry('uid').unpublish({ publishDetails: entry, locale: "en-us", version: 1, scheduledAt: "2019-02-08T18:30:00.000Z"})
     * .then((notice) => console.log(notice))
     *
     */

    this.unpublish = unpublish(http, 'entry');
  } else {
    /**
     * @description The Create an entry call creates a new entry for the selected content type.
     * @memberof Entry
     * @func create
     * @returns {Promise<Entry.Entry>} Promise for Entry instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().contentType('content_type_uid').entry().create({name: 'My New contentType'})
     * .then((entry) => console.log(entry))
     */
    this.create = create({
      http: http
    });
    /**
    * @description The Query on Entry will allow to fetch details of all or specific Entry
    * @memberof Entry
    * @func query
    * @param {Int} locale Enter the code of the language of which the entries need to be included. Only the entries published in this locale will be displayed.
    * @param {Int} include_workflow Enter 'true' to include the workflow details of the entry.
    * @param {Int} include_publish_details Enter 'true' to include the publish details of the entry.
    * @param {Object} query Queries that you can use to fetch filtered results.
    * @returns {Array<Entry>} Array of Entry.
    *
    * @example
    * import * as contentstack from 'contentstack'
    * const client = contentstack.client({})
    *
    * client.stack().contentType().entry().query({ query: { title: 'Entry title' } }).find()
    * .then((entries) => console.log(entries))
    */

    this.query = query({
      http: http,
      wrapperCollection: EntryCollection
    });
  }

  return this;
}
export function EntryCollection(http, data) {
  var obj = cloneDeep(data.entries);
  var entryCollection = obj.map(function (entry) {
    return new Entry(http, {
      entry: entry,
      content_type_uid: 'uid',
      stackHeaders: data.stackHeaders
    });
  });
  return entryCollection;
}