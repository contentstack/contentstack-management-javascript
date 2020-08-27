import cloneDeep from 'lodash/cloneDeep'
import { create } from '../../../entity'

/**
 * Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded in your Contentstack repository for future use.
 * These files can be attached and used in multiple entries. Read more about <a href='https://www.contentstack.com/docs/guide/content-management'>Assets</a>.
 * @namespace Asset
 */

export function Folder (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/assets/folders`

  if (data.asset) {
    Object.assign(this, cloneDeep(data.asset))
  } else {
    /**
   * @description The Create a folder into the assets.
   * @memberof Folder
   * @func create
   * @returns {Promise<Folder.Folder>} Promise for Folder instance
   *
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * const asset = {name: 'My New contentType'}
   * client.stack().asset().folders().create({ asset })
   * .then((folder) => console.log(folder))
   */
    this.create = create({ http: http })
  }
}
