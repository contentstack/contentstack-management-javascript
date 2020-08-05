import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  fetch,
  update,
  deleteEntity,
  query
} from '../../entity'
import error from '../../core/contentstackError'
import { ReleaseItem, ReleaseItemCollection } from './items'
/**
 * @description You can pin a set of entries and assets (along with the deploy action, i.e., publish/unpublish) to a ‘release’, and then deploy this release to an environment.
 * This will publish/unpublish all the the items of the release to the specified environment. Read more about <a href='https://www.contentstack.com/docs/developers/create-releases'>Releases</a>.
 * @namespace Release
 */

export function Release (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/releases`

  if (data.release) {
    Object.assign(this, cloneDeep(data.release))
    if (data.release.items) {
      this.items = new ReleaseItemCollection(http, data.release, this.uid)
    }
    this.urlPath = `/releases/${this.uid}`
    /**
     * @description The Update Release call lets you update the name and description of an existing Release.
     * @memberof Release
     * @func update
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * const relase = {
     *     name: "Release Name",
     *     description: "2018-12-12",
     *     locked: false,
     *     archived: false
     * }
     *
     * var release = client.stack('api_key').release('release_uid')
     * Object.assign(release, cloneDeep(release))
     *
     * release.update()
     * .then((release) => {
     *  release.title = 'My New release'
     *  release.description = 'Release description'
     *  return release.update()
     * })
     * .then((release) => console.log(release))
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     *
     * client.stack('api_key').release('release_uid').fetch()
     * .then((release) => {
     *  release.title = 'My New release'
     *  release.description = 'Release description'
     *  return release.update()
     * })
     * .then((release) => console.log(release))
     *
     */
    this.update = update(http, 'release')

    /**
     * @description The fetch Release call fetches Release details.
     * @memberof Release
     * @func fetch
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release('release_uid').fetch()
     * .then((release) => console.log(release))
     *
     */
    this.fetch = fetch(http, 'release')

    /**
     * @description The Delete Release call is used to delete an existing Release permanently from your Stack.
     * @memberof Release
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release('release_uid').delete()
     * .then((notice) => console.log(notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description A ReleaseItem is a set of entries and assets that needs to be deployed (published or unpublished) all at once to a particular environment.
     * @memberof Release
     * @func item
     * @returns {ReleaseItem} Instance of ReleaseItem.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release('release_uid').item().fetchAll()
     * .then((items) => console.log(items))
     */
    this.item = () => {
      return new ReleaseItem(http, { releaseUid: this.uid })
    }
    /**
     * @description The Deploy a Release request deploys a specific Release to specific environment(s) and locale(s).
     * @memberof Release
     * @func deploy
     * @returns {Object} Response Object.
     * @param {Array} environments - environment(s) on which the Release should be deployed.
     * @param {Array} locales -  locale(s) on which the Release should be deployed.
     * @param {String} action -  action on which the Release should be deployed.
     * @param {String} scheduledAt - scheudle time for the Release to deploy.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release('release_uid').deploy({
     *      environments: [
     *                      "production",
     *                      "uat"
     *                      ],
     *      locales: [
     *                  "en-us",
     *                  "ja-jp"
     *               ],
     *      scheduledAt: '2018-12-12T13:13:13:122Z',
     *      action: 'publish',
     *
     * })
     * .then((notice) => console.log(notice))
     */
    this.deploy = async ({ environments, locales, scheduledAt, action }) => {
      var release = {}
      if (environments) {
        release.environments = environments
      }
      if (locales) {
        release.locales = locales
      }
      if (scheduledAt) {
        release.scheduled_at = scheduledAt
      }
      if (action) {
        release.action = action
      }
      const headers = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      } || {}

      try {
        const response = await http.post(`${this.urlPath}/deploy`, { release }, headers)
        if (response.data) {
          return response.data
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
    /**
     * @description The Clone a Release request allows you to clone (make a copy of) a specific Release in a stack.
     * @memberof Release
     * @func fetch
     * @returns {Promise<Release.Release>} Promise for Release instance
     * @param {String} name - name of the cloned Release.
     * @param {String} description - description of the cloned Release.
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release('release_uid').clone({ name: 'New Name', description: 'New Description'})
     * .then((release) => console.log(release))
     *
     */
    this.clone = async ({ name, description }) => {
      var release = {}
      if (name) {
        release.name = name
      }
      if (description) {
        release.description = description
      }
      const headers = {
        headers: {
          ...cloneDeep(this.stackHeaders)
        }
      } || {}

      try {
        const response = await http.post(`${this.urlPath}/clone`, { release }, headers)
        if (response.data) {
          return new Release(http, response.data)
        } else {
          throw error(response)
        }
      } catch (err) {
        throw error(err)
      }
    }
  } else {
    /**
     * @description The Create a Release request allows you to create a new Release in your stack. To add entries/assets to a Release, you need to provide the UIDs of the entries/assets in ‘items’ in the request body.
     * @memberof Release
     * @func create
     * @param {Object} param.release Release details.
     * @returns {Promise<Release.Release>} Promise for Release instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     * const relase = {
     *    release: {
     *        name: "Release Name",
     *        description: "2018-12-12",
     *        locked: false,
     *        archived: false
     *      }
     * }
     * client.stack('api_key').release().create(relase)
     * .then((release) => console.log(release))
     */
    this.create = create({ http: http })

    /**
     * @description The Query on release will allow to fetch details of all or specific Releases.
     * @memberof Release
     * @func query
     * @param {Boolean} param.include_countThe ‘include_count’ parameter includes the count of total number of releases in your stack, along with the details of each release.
     * @param {Boolean} param.include_items_count The ‘include_items_count’ parameter returns the total number of items in a specific release.
     * @param {Int} param.limit The ‘limit’ parameter will return a specific number of releases in the output.
     * @param {Int} param.skip The ‘skip’ parameter will skip a specific number of releases in the response.
     * @returns {Array<Release>} Array of Release.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').release().query().find()
     * .then((release) => console.log(release))
     */
    this.query = query({ http: http, wrapperCollection: ReleaseCollection })
  }
  return this
}

export function ReleaseCollection (http, data) {
  const obj = cloneDeep(data.releases)
  const releaseCollection = obj.map((userdata) => {
    return new Release(http, { release: userdata, stackHeaders: data.stackHeaders })
  })
  return releaseCollection
}
