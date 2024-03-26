import cloneDeep from 'lodash/cloneDeep'
import { create, update, deleteEntity, fetch, query } from '../../entity'

/**
 * A publishing environment corresponds to one or more deployment servers or a content delivery destination where the entries need to be published. Read more about <a href='https://www.contentstack.com/docs/developers/set-up-environments'>Environment</a>.
 * @namespace Environment
 *  */

export function Environment (http, data = {}) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/environments`
  if (data.environment) {
    Object.assign(this, cloneDeep(data.environment))
    this.urlPath = `/environments/${this.name}`
    /**
       * @description The Update Environment call lets you update the name and description of an existing Environment.
       * @memberof Environment
       * @func update
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).environment('uid').fetch()
       * .then((environment) => {
       *  environment.title = 'My New Content Type'
       *  environment.description = 'Content Type description'
       *  return environment.update()
       * })
       * .then((environment) => console.log(environment))
       *
       */
    this.update = update(http, 'environment')

    /**
       * @description The Delete Environment call is used to delete an existing Environment permanently from your Stack.
       * @memberof Environment
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).environment('uid').delete()
       * .then((response) => console.log(response.notice))
       */
    this.delete = deleteEntity(http)

    /**
       * @description The fetch Environment call fetches Environment details.
       * @memberof Environment
       * @func fetch
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).environment('uid').fetch()
       * .then((environment) => console.log(environment))
       *
       */
    this.fetch = fetch(http, 'environment')
  } else {
    /**
       * @description The Create a Environment call creates a new environment in a particular stack of your Contentstack account.
       * @memberof Environment
       * @func create
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       *
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       * const environment = {
       *      name: 'development',
       *      servers: [
       *                {
       *                  name: 'default'
       *                }
       *                ],
       *      urls: [
       *              {
       *                  locale: 'en-us',
       *                  url: 'http://example.com/'
       *              }
       *            ],
       *      deploy_content: true
       * }
       * client.stack({ api_key: 'api_key'}).environment().create({ environment })
       * .then((environment) => console.log(environment))
       */
    this.create = create({ http: http })

    /**
     * @description The Query on GlobalField will allow to fetch details of all or specific GlobalField
     * @memberof Environment
     * @func query
     * @returns {Array<Environment>} Array of GlobalField.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).environment().query({ query: { name: 'Environment Name' } }).find()
     * .then((globalFields) => console.log(globalFields))
     */
    this.query = query({ http: http, wrapperCollection: EnvironmentCollection })
  }
}

export function EnvironmentCollection (http, data) {
  const obj = cloneDeep(data.environments) || []
  const environmentCollection = obj.map((userdata) => {
    return new Environment(http, { environment: userdata, stackHeaders: data.stackHeaders })
  })
  return environmentCollection
}
