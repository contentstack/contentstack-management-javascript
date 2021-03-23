import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import error from '../core/contentstackError';
import { fetch } from '../entity';
import ContentstackCollection from '../contentstackCollection';
import { RoleCollection } from '../stack/roles';
import { StackCollection } from '../stack';
import { UserCollection } from '../user';
/**
 * Organization is the top-level entity in the hierarchy of Contentstack, consisting of stacks and stack resources, and users. Organization allows easy management of projects as well as users within the Organization. Read more about <a href='https://www.contentstack.com/docs/guide/organization'>Organizations.</a>.
 * @namespace Organization
 */

export function Organization(http, data) {
  var _this = this;

  this.urlPath = '/organizations';

  if (data && data.organization) {
    Object.assign(this, cloneDeep(data.organization));
    this.urlPath = "/organizations/".concat(this.uid);
    /**
     * @description The fetch Organization call fetches Organization details.
     * @memberof Organization
     * @func fetch
     * @param {Int} include_plan The include_plan parameter includes the details of the plan that the organization has subscribed to.
     * @returns {Promise<Organization.Organization>} Promise for Organization instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization('organization_uid').fetch()
     * .then((organization) => console.log(organization))
     *
     */

    this.fetch = fetch(http, 'organization');

    if (this.org_roles && this.org_roles.filter(function (role) {
      return role.admin === true;
    }).length > 0 || this.owner && this.owner === true || this.is_owner && this.is_owner === true) {
      /**
       * @description The Get all stacks in an organization call fetches the list of all stacks in an Organization.
       * @memberof Organization
       * @func stacks
       * @param {Int} limit The limit parameter will return a specific number of stacks in the output.
       * @param {Int} skip The skip parameter will skip a specific number of stacks in the output.
       * @param {String} asc When fetching stacks, you can sort them in the ascending order with respect to the value of a specific field in the response body.
       * @param {String} desc When fetching stacks, you can sort them in the decending order with respect to the value of a specific field in the response body.
       * @param {Boolean} include_count To retrieve the count of stack.
       * @param {String} typeahead The type head contains value to be included in search.
       * @returns {ContentstackCollection} Instance of ContentstackCollection.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').stacks({ include_count: true })
       * .then((collection) => console.log(collection))
       *
       */
      this.stacks = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(param) {
          var response;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return http.get("".concat(_this.urlPath, "/stacks"), {
                    params: param
                  });

                case 3:
                  response = _context.sent;

                  if (!response.data) {
                    _context.next = 8;
                    break;
                  }

                  return _context.abrupt("return", new ContentstackCollection(response, http, null, StackCollection));

                case 8:
                  return _context.abrupt("return", error(response));

                case 9:
                  _context.next = 14;
                  break;

                case 11:
                  _context.prev = 11;
                  _context.t0 = _context["catch"](0);
                  return _context.abrupt("return", error(_context.t0));

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 11]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
      /**
       * @description The Transfer organization ownership call transfers the ownership of an Organization to another user.
       * @memberof Organization
       * @func transferOwnership
       * @param {String} email The email address of the user to whom you wish to transfer the ownership of the organization.
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').transferOwnership('emailId')
       * .then((response) => console.log(response.notice))
       *
       */


      this.transferOwnership = /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(email) {
          var response;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return http.post("".concat(_this.urlPath, "/transfer_ownership"), {
                    transfer_to: email
                  });

                case 3:
                  response = _context2.sent;

                  if (!response.data) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt("return", response.data);

                case 8:
                  return _context2.abrupt("return", error(response));

                case 9:
                  _context2.next = 14;
                  break;

                case 11:
                  _context2.prev = 11;
                  _context2.t0 = _context2["catch"](0);
                  return _context2.abrupt("return", error(_context2.t0));

                case 14:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 11]]);
        }));

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }();
      /**
       * @description The Add users to organization call allows you to send invitations to add users to your organization. Only the owner or the admin of the organization can add users.
       * @memberof Organization
       * @func addUser
       * @returns {ContentstackCollection} ContentstackCollection of instance.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').addUser({ users: { 'abc@test.com': ['org_uid1', 'org_uid2' ]}, stacks: { 'abc@test.com': { 'api_key1': [ 'stack_role_id' ] } } })
       * .then((response) => console.log(response))
       *
       */


      this.addUser = /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(data) {
          var response;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _context3.next = 3;
                  return http.post("".concat(_this.urlPath, "/share"), {
                    share: _objectSpread({}, data)
                  });

                case 3:
                  response = _context3.sent;

                  if (!response.data) {
                    _context3.next = 8;
                    break;
                  }

                  return _context3.abrupt("return", new ContentstackCollection(response, http, null, UserCollection));

                case 8:
                  return _context3.abrupt("return", error(response));

                case 9:
                  _context3.next = 14;
                  break;

                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](0);
                  return _context3.abrupt("return", error(_context3.t0));

                case 14:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[0, 11]]);
        }));

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }();
      /**
       * @description The Get all organization invitations call gives you a list of all the Organization invitations.
       * @memberof Organization
       * @func getInvitations
       * @returns {String} Success message of invitation send.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').getInvitations()
       * .then((response) => console.log(response.notice))
       *
       */


      this.getInvitations = /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(param) {
          var response;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;
                  _context4.next = 3;
                  return http.get("".concat(_this.urlPath, "/share"), {
                    params: param
                  });

                case 3:
                  response = _context4.sent;

                  if (!response.data) {
                    _context4.next = 8;
                    break;
                  }

                  return _context4.abrupt("return", new ContentstackCollection(response, http, null, UserCollection));

                case 8:
                  return _context4.abrupt("return", error(response));

                case 9:
                  _context4.next = 14;
                  break;

                case 11:
                  _context4.prev = 11;
                  _context4.t0 = _context4["catch"](0);
                  return _context4.abrupt("return", error(_context4.t0));

                case 14:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, null, [[0, 11]]);
        }));

        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      }();
      /**
       * @description The Resend pending organization invitation call allows you to resend Organization invitations to users who have not yet accepted the earlier invitation.
       * @memberof Organization
       * @func resendInvitition
       * @returns {Object} Response Object.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').resendInvitition('invitation_uid')
       * .then((response) => console.log(response.notice))
       *
       */


      this.resendInvitation = /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(invitationUid) {
          var response;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;
                  _context5.next = 3;
                  return http.get("".concat(_this.urlPath, "/").concat(invitationUid, "/resend_invitation"));

                case 3:
                  response = _context5.sent;

                  if (!response.data) {
                    _context5.next = 8;
                    break;
                  }

                  return _context5.abrupt("return", response.data);

                case 8:
                  return _context5.abrupt("return", error(response));

                case 9:
                  _context5.next = 14;
                  break;

                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](0);
                  return _context5.abrupt("return", error(_context5.t0));

                case 14:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[0, 11]]);
        }));

        return function (_x5) {
          return _ref5.apply(this, arguments);
        };
      }();
      /**
       * @description A role is a collection of permissions that will be applicable to all the users who are assigned this role.
       * @memberof Organization
       * @func roles
       * @param {Int} limit The limit parameter will return a specific number of roles in the output.
       * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
       * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
       * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
       * @param {Boolean}include_count To retrieve the count of roles.
       * @param {Boolean} include_stack_roles The Include stack roles will return stack details in roles.
       * @returns {Array<Role>} Array of Role instance
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client()
       *
       * client.organization('organization_uid').roles()
       * .then((roles) => console.log(roles))
       *
       */


      this.roles = /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(param) {
          var response;
          return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.prev = 0;
                  _context6.next = 3;
                  return http.get("".concat(_this.urlPath, "/roles"), {
                    params: param
                  });

                case 3:
                  response = _context6.sent;

                  if (!response.data) {
                    _context6.next = 8;
                    break;
                  }

                  return _context6.abrupt("return", new ContentstackCollection(response, http, null, RoleCollection));

                case 8:
                  return _context6.abrupt("return", error(response));

                case 9:
                  _context6.next = 14;
                  break;

                case 11:
                  _context6.prev = 11;
                  _context6.t0 = _context6["catch"](0);
                  return _context6.abrupt("return", error(_context6.t0));

                case 14:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, null, [[0, 11]]);
        }));

        return function (_x6) {
          return _ref6.apply(this, arguments);
        };
      }();
    }
  } else {
    /**
     * @description The Get all organizations call lists all organizations related to the system user in the order that they were created.
     * @memberof Organization
     * @func fetchAll
     * @param {Int} limit TThe ‘limit’ parameter will return a specific number of organizations in the output.
     * @param {Int} skip The ‘skip’ parameter will skip a specific number of organizations in the output.
     * @param {String} asc The ‘asc’ parameter allows you to sort the list of organizations in the ascending order with respect to the value of a specific field.
     * @param {String} desc The ‘desc’ parameter allows you to sort the list of Organizations in the descending order with respect to the value of a specific field.
     * @param {Boolean}include_count The ‘include_count’ parameter returns the total number of organizations related to the user. 
     * @param {String} typeahead The typeahead parameter is a type of filter that allows you to perform a name-based search on all organizations based on the value provided.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.organization().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(parmas) {
        var response;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return http.get(_this.urlPath, {
                  params: parmas
                });

              case 3:
                response = _context7.sent;

                if (!response.data) {
                  _context7.next = 8;
                  break;
                }

                return _context7.abrupt("return", new ContentstackCollection(response, http, null, OrganizationCollection));

              case 8:
                throw error(response);

              case 9:
                _context7.next = 14;
                break;

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                throw error(_context7.t0);

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 11]]);
      }));

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }();
  }
}
export function OrganizationCollection(http, data) {
  var obj = cloneDeep(data.organizations || []);
  var organizationCollection = obj.map(function (userdata) {
    return new Organization(http, {
      organization: userdata
    });
  });
  return organizationCollection;
}