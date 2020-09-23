import cloneDeep from 'lodash/cloneDeep'
import {
  update,
  deleteEntity,
  fetch,
  create
} from '../../../entity'

/**
 * Folders refer to Asset Folders.
 * @namespace Folder
 */

export function Folder (http, data = {}) {
  if (data.stackHeaders) {
    this.stackHeaders = data.stackHeaders
  }
  this.urlPath = `/assets/folders`

  if (data.asset) {
    Object.assign(this, cloneDeep(data.asset))
    this.urlPath = `/assets/folders/${this.uid}`

    /**
     * @description The Update Folder call lets you update the name and description of an existing Folder.
     * @memberof Folder
     * @func update
     * @returns {Promise<Folder.Folder>} Promise for Folder instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').fetch()
     * .then((folder) => {
     *  folder.name = 'My New folder'
     *  return folder.update()
     * })
     * .then((folder) => console.log(folder))
     *
     */
    this.update = update(http, 'asset')

    /**
     * @description The Delete folder call will delete an existing folder from the stack.
     * @memberof Folder
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch an asset call returns comprehensive information about a specific version of an asset of a stack.
     * @memberof Folder
     * @func fetch
     * @returns {Promise<Folder.Folder>} Promise for Folder instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).asset().folder('uid').fetch()
     * .then((folder) => console.log(folder))
     *
     */
    this.fetch = fetch(http, 'asset')
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

export function FolderCollection (http, data) {
  const obj = cloneDeep(data.assets) || []
  const assetCollection = obj.map((userdata) => {
    return new Folder(http, { asset: userdata, stackHeaders: data.stackHeaders })
  })
  return assetCollection
}
