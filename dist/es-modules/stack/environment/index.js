import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, query } from '../../entity';
export function Environment(http) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/environments";

  if (data.environment) {
    Object.assign(this, cloneDeep(data.environment));
    this.urlPath = "/environments/".concat(this.name);
    /**
       * @description The Update Environment call lets you update the name and description of an existing Environment.
       * @memberof Environment
       * @func update
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').environment('uid').fetch()
       * .then((environment) => {
       *  environment.title = 'My New Content Type'
       *  environment.description = 'Content Type description'
       *  return environment.update()
       * })
       * .then((environment) => console.log(environment))
       *
       */

    this.update = update(http, 'environment');
    /**
       * @description The Delete Environment call is used to delete an existing Environment permanently from your Stack.
       * @memberof Environment
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').environment('uid').delete()
       * .then((notice) => console.log(notice))
       */

    this["delete"] = deleteEntity(http);
    /**
       * @description The fetch Environment call fetches Environment details.
       * @memberof Environment
       * @func fetch
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').environment('uid').fetch()
       * .then((environment) => console.log(environment))
       *
       */

    this.fetch = fetch(http, 'environment');
  } else {
    /**
       * @description The Create a Environment call creates a new environment in a particular stack of your Contentstack account.
       * @memberof Environment
       * @func create
       * @returns {Promise<Environment.Environment>} Promise for Environment instance
       *
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').environment().create({name: 'My New environment'})
       * .then((environment) => console.log(environment))
       */
    this.create = create({
      http: http
    });
    /**
     * @description The Query on GlobalField will allow to fetch details of all or specific GlobalField
     * @memberof GlobalField
     * @func query
     * @returns {Array<GlobalField>} Array of GlobalField.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').environment().query({ query: { name: 'Environment Name' } }).find()
     * .then((globalFields) => console.log(globalFields))
     */

    this.query = query({
      http: http,
      wrapperCollection: EnvironmentCollection
    });
  }
}
export function EnvironmentCollection(http, data) {
  var obj = cloneDeep(data.environments);
  var environmentCollection = obj.map(function (userdata) {
    return new Environment(http, {
      environment: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return environmentCollection;
}