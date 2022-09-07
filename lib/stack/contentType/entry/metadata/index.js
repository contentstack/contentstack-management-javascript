import cloneDeep from 'lodash/cloneDeep'

/**
 * Metadata is a piece of information that lets you describe or classify an asset/entry.
 * You can manage your digital entities effectively and facilitate enhanced accessibility with additional metadata.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/developers/apis/content-management-api/#metadata-for-entries-and-assets'>Metadata for Entries and Assets</a>.
 * @namespace MetaData
 */

export function MetaData(http, data = {}) {

    this._content_type_uid = data.content_type_uid
    this.type = data.type
    this.uid = data.entity_uid

    this.stackHeaders = data.stackHeaders
    this.urlPath = `/metadata`

    if (data.metadata) {
        Object.assign(this, cloneDeep(data.metadata))
        this.urlPath = `/metadata/${this.uid}`
        /**
         * @description The Update an metadata call updates a existed metadata for the selected content type entry.
         * @memberof MetaData
         * @func update
         * @returns {Promise<MetaData.MetaData>} Promise for MetaData instance
         * 
         * @example        
        * // To update a metadata with string meta value
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client()
        *
        * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').metadata('metadata_uid').fetch()
        * .then((metadata) => {
        *  metadata.type = 'entry'
        *  metadata.meta_key = "meta_value"
        *  metadata.locale = 'en_us'
        *  return metadata.update()
        * })
        * .then((metadata) => console.log(metadata))
        * 
        *  @example
        * // To update a metadata with object meta value
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client()
        *
        * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').metadata('metadata_uid').fetch()
        * .then((metadata) => {
        *  metadata.type = 'entry'
        *  metadata.meta_key =  {  property1: "meta_value1", property2: { key: "value"  } }
        *  return metadata.update()
        * })
        */
        this.update = update(http, 'metadata')

        /**
         * @description The Delete an metadata call is used to delete a specific metadata from a content type.
         * @memberof MetaData
         * @func delete
         * @returns {Object} Response Object.
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack({ api_key: 'api_key'}).contentType('content_type_uid').entry('uid').metadata('uid).delete()
         * .then((response) => console.log(response.notice))
         */
        this.delete = deleteEntity(http)

        /**
         * @description The Fetch on MetaData will allow to fetch details of all or specific MetaData
         * @memberof MetaData
         * @func fetch
         * @param {Object} fetch Queries that you can use to fetch filtered results.
         * @returns {MetaData} MetaData Object.
         *
         * @example
         * import * as contentstack from '@contentstack/management'
         * const client = contentstack.client()
         *
         * client.stack().contentType('content_type_uid').entry('uid').metadata('metadata_uid').fetch()
         * .then((metadata) => console.log(metadata))
         */
        this.fetch = fetch(http, 'metadata')

    } else {
        /**
        * @description The Create an metadata call creates a new metada for the selected content type entry.
        * @memberof MetaData
        * @func create
        * @returns {Promise<MetaData.MetaData>} Promise for MetaData instance
        *
        * @example
        * import * as contentstack from '@contentstack/management'
        * const client = contentstack.client()
        * const metadata  = {
        *       "metadata": {          
        *           "extension_uid": "blt8c723a09fdd0b25e",
        *           "metadata_key": {
        *              "name": "Test1",
        *              "value": {
        *              }
        *          }
        *      }
        *  }
        * client.stack().contentType('content_type_uid').entry('uid').metadata().create({ metadata })
        * .then((metadata) => console.log(metadata))
        */
        this.create = create({ http: http })

    }

    return this
}


export function MetaDataCollection(http, data) {
    const obj = cloneDeep(data.entries) || []
    const metaDataCollection = obj.map((metaData) => {
        return new MetaData(http, { metadata: metaData, type: data.type, entry_uid: data.entity_uid, content_type_uid: data.content_type_uid, stackHeaders: data.stackHeaders })
    })
    return metaDataCollection
}