"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Role = Role;
exports.RoleCollection = RoleCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

var _contentstackCollection = require("../../contentstackCollection");

var _contentstackCollection2 = (0, _interopRequireDefault2["default"])(_contentstackCollection);

var _contentstackError = require("../../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

/**
 * A role is a collection of permissions that will be applicable to all the users who are assigned this role. Read more about <a href= 'https://www.contentstack.com/docs/guide/users-and-roles#roles'>Roles</a>.
 * @namespace Role
 */
function Role(http, data) {
  this.urlPath = "/roles";
  this.stackHeaders = data.stackHeaders;

  if (data.role) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.role));
    this.urlPath = "/roles/".concat(this.uid);

    if (this.stackHeaders) {
      /**
      * @description The Update role call lets you modify an existing role of your stack.
      * @memberof Role
      * @func update
      * @returns {Promise<Role.Role>} Promise for Role instance
      * @example
      * import * as contentstack from '@contentstack/management'
      * const client = contentstack.client()
      *
      * client.stack({ api_key: 'api_key'}).role('role_uid').fetch({ include_rules: true, include_permissions: true})
      * .then((role) => {
      *  role.name = 'My New Role'
      *  role.description = 'Role description'
      *  role.rules = [
      * {
      *   module: 'asset',
      *   assets: ['$all'],
      *   acl: {
      *     read: true,
      *     create: true,
      *     update: true,
      *     publish: true,
      *     delete: true
      *   }
      * },
      * {
      *   module: 'environment',
      *   environments: [],
      *   acl: { read: true }
      * },
      * {
      *   module: 'locale',
      *   locales: [Array],
      *   acl: { read: true }
      * }]
      *  return role.update()
      * })
      * .then((role) => console.log(role))
      *
      */
      this.update = (0, _entity.update)(http, 'role');
      /**
       * @description The Delete role call deletes an existing role from your stack.
       * @memberof Role
       * @func delete
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).role('role_uid').delete()
       * .then((response) => console.log(response.notice))
       */

      this["delete"] = (0, _entity.deleteEntity)(http);
      /**
       * @description The Get a single role request returns comprehensive information on a specific role.
       * @memberof Role
       * @func fetch
       * @returns {Promise<Role.Role>} Promise for Role instance
       * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
       * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.stack({ api_key: 'api_key'}).role('role_uid').fetch()
       * .then((role) => console.log(role))
       *
       */

      this.fetch = (0, _entity.fetch)(http, 'role');
    }
  } else {
    /**
     * @description The Create a role call creates a new role in a stack.
     * @memberof Role
     * @func create
     * @returns {Promise<Role.Role>} Promise for Role instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const role =  {
     *   name: 'Role Name',
     *   description: 'From CMA Js',
     *   rules:
     *     [
     *       {
     *         module: 'environment',
     *         environments: [],
     *         acl: { read: true }
     *       },
     *       {
     *         module: 'locale',
     *         locales: [],
     *         acl: { read: true }
     *       }
     *     ],
     *   uid: 'uid'
     * }
     * client.stack().role().create({ role })
     * .then((role) => console.log(role))
     */
    this.create = (0, _entity.create)({
      http: http
    });
    /**
     * @description The ‘Get all roles’ request returns comprehensive information about all roles created in a stack.
     * @memberof Role
     * @func findAll
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().role().findAll()
     * .then((collection) => console.log(collection))
     */

    this.fetchAll = (0, _entity.fetchAll)(http, RoleCollection);
    /**
     * @description The Query on Role will allow to fetch details of all or specific role.
     * @memberof Role
     * @func query
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).role().query({ query: { filename: 'Asset Name' } }).find()
     * .then((role) => console.log(role))
     */

    this.query = (0, _entity.query)({
      http: http,
      wrapperCollection: RoleCollection
    });
  }

  return this;
}

function RoleCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.roles || []);
  var roleCollection = obj.map(function (userdata) {
    return new Role(http, {
      role: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return roleCollection;
}