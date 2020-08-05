import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { create, update, deleteEntity, fetch, query } from '../../entity';
import ContentstackCollection from '../../contentstackCollection';
import error from '../../core/contentstackError';
/**
 * A role is a collection of permissions that will be applicable to all the users who are assigned this role. Read more about <a href= 'https://www.contentstack.com/docs/guide/users-and-roles#roles'>Roles</a>.
 * @namespace Role
 */

export function Role(http, data) {
  var _this = this;

  this.urlPath = "/roles";
  this.stackHeaders = data.stackHeaders;

  if (data.role) {
    Object.assign(this, cloneDeep(data.role));
    this.urlPath = "/roles/".concat(this.uid);

    if (this.stackHeaders) {
      /**
      * @description The Update role call lets you modify an existing role of your stack.
      * @memberof Role
      * @func update
      * @returns {Promise<Role.Role>} Promise for Role instance
      * @example
      * import * as contentstack from 'contentstack'
      * const client = contentstack.client({})
      *
      * client.stack('api_key').role('role_uid').fetch({ include_rules: true, include_permissions: true})
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
      this.update = update(http, 'role');
      /**
       * @description The Delete role call deletes an existing role from your stack.
       * @memberof Role
       * @func delete
       * @returns {String} Success message.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').role('role_uid').delete()
       * .then((notice) => console.log(notice))
       */

      this["delete"] = deleteEntity(http);
      /**
       * @description The Get a single role request returns comprehensive information on a specific role.
       * @memberof Role
       * @func fetch
       * @returns {Promise<Role.Role>} Promise for Role instance
       * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
       * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
       * @example
       * import * as contentstack from 'contentstack'
       * const client = contentstack.client({})
       *
       * client.stack('api_key').role('role_uid').fetch()
       * .then((role) => console.log(role))
       *
       */

      this.fetch = fetch(http, 'role');
    }
  } else {
    /**
     * @description The Create a role call creates a new role in a stack.
     * @memberof Role
     * @func create
     * @returns {Promise<Role.Role>} Promise for Role instance
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().role().create({name: 'My New role'})
     * .then((role) => console.log(role))
     */
    this.create = create({
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
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack().role().findAll()
     * .then((collection) => console.log(collection))
     */

    this.fetchAll = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var params,
          headers,
          response,
          _args = arguments;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              headers = {
                params: _objectSpread({}, cloneDeep(params)),
                headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
              } || {};
              _context.prev = 2;
              _context.next = 5;
              return http.get(_this.urlPath, headers);

            case 5:
              response = _context.sent;

              if (!response.data) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", new ContentstackCollection(response, http, _this.stackHeaders, RoleCollection));

            case 10:
              throw error(response);

            case 11:
              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](2);
              throw error(_context.t0);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 13]]);
    }));
    /**
     * @description The Query on Role will allow to fetch details of all or specific role.
     * @memberof Role
     * @func query
     * @param {Boolean} include_permissions Set this parameter to 'true' to include the details of the permissions assigned to a particular role.
     * @param {Boolean} include_rules Set this to ‘true’ to include the details of the rules assigned to a role.
     * @returns {ContentstackCollection} Instance of ContentstackCollection.
     *
     * @example
     * import * as contentstack from 'contentstack'
     * const client = contentstack.client({})
     *
     * client.stack('api_key').role().query({ query: { filename: 'Asset Name' } }).find()
     * .then((role) => console.log(role))
     */

    this.query = query({
      http: http,
      wrapperCollection: RoleCollection
    });
  }

  return this;
}
export function RoleCollection(http, data) {
  var obj = cloneDeep(data.roles);
  var roleCollection = obj.map(function (userdata) {
    return new Role(http, {
      role: userdata,
      stackHeaders: data.stackHeaders
    });
  });
  return roleCollection;
}