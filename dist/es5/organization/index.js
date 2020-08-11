"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.Organization = Organization;
exports.OrganizationCollection = OrganizationCollection;

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _contentstackError = require("../core/contentstackError");

var _contentstackError2 = (0, _interopRequireDefault2["default"])(_contentstackError);

var _entity = require("../entity");

var _contentstackCollection = require("../contentstackCollection");

var _contentstackCollection2 = (0, _interopRequireDefault2["default"])(_contentstackCollection);

var _index = require("../stack/roles/index");

var _index2 = require("../stack/index");

var _user = require("../user");

/**
 * Organization is the top-level entity in the hierarchy of Contentstack, consisting of stacks and stack resources, and users. Organization allows easy management of projects as well as users within the Organization. Read more about <a href='https://www.contentstack.com/docs/guide/organization'>Organizations.</a>.
 * @namespace Organization
 */
function Organization(http, data) {
  var _this = this;

  this.urlPath = '/organizations';

  if (data && data.organization) {
    Object.assign(this, (0, _cloneDeep2["default"])(data.organization));
    this.urlPath = "/organizations/".concat(this.uid);
    /**
     * @description The fetch Organization call fetches Organization details.
     * @memberof Organization
     * @func fetch
     * @param {Int} include_plan The include_plan parameter includes the details of the plan that the organization has subscribed to.
     * @returns {Promise<Organization.Organization>} Promise for Organization instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * client.organization('organization_uid).fetch()
     * .then((organization) => console.log(organization))
     *
     */

    this.fetch = (0, _entity.fetch)(http, 'organization');

    if (this.org_roles && this.org_roles.filter(function (role) {
      return role.admin === true;
    }).length > 0) {
      /**
       * @description The Get all stacks in an organization call fetches the list of all stacks in an Organization.
       * @memberof Organization
       * @func stacks
       * @param {Int} limit The limit parameter will return a specific number of roles in the output.
       * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
       * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
       * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
       * @param {Boolean} include_count To retrieve the count of stack.
       * @param {String} typeahead The type head contains value to be included in search.
       * @returns {ContentstackCollection} Instance of ContentstackCollection.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({})
       *
       * client.organization('organization_uid).stacks({ include_count: true })
       * .then((organization) => console.log(organization))
       *
       */
      this.stacks = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(param) {
          var response;
          return _regenerator2["default"].wrap(function _callee$(_context) {
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

                  return _context.abrupt("return", new _contentstackCollection2["default"](response, http, null, _index2.StackCollection));

                case 8:
                  return _context.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context.next = 14;
                  break;

                case 11:
                  _context.prev = 11;
                  _context.t0 = _context["catch"](0);
                  return _context.abrupt("return", (0, _contentstackError2["default"])(_context.t0));

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
       * const client = contentstack.client({})
       *
       * client.stack('api_key').transferOwnership('emailId')
       * .then((notice) => console.log(notice))
       *
       */


      this.transferOwnership = /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(email) {
          var response;
          return _regenerator2["default"].wrap(function _callee2$(_context2) {
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
                  return _context2.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context2.next = 14;
                  break;

                case 11:
                  _context2.prev = 11;
                  _context2.t0 = _context2["catch"](0);
                  return _context2.abrupt("return", (0, _contentstackError2["default"])(_context2.t0));

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
       * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
       * @memberof Organization
       * @func addUser
       * @returns {ContentstackCollection} ContentstackCollection of instance.
       * @example
       * import * as contentstack from '@contentstack/management'
       * const client = contentstack.client({})
       *
       * client.organization('organization_uid).addUser({ users: { 'abc@test.com': ['org_uid1', 'org_uid2' ]}, stacks: { 'abc@test.com': { 'api_key1': [ 'stack_role_id' ] } } })
       * .then((response) => console.log(response))
       *
       */


      this.addUser = /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3(data) {
          var response;
          return _regenerator2["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _context3.next = 3;
                  return http.post("".concat(_this.urlPath, "/share"), {
                    share: {
                      data: data
                    }
                  });

                case 3:
                  response = _context3.sent;

                  if (!response.data) {
                    _context3.next = 8;
                    break;
                  }

                  return _context3.abrupt("return", new _contentstackCollection2["default"](response, http, null, _user.UserCollection));

                case 8:
                  return _context3.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context3.next = 14;
                  break;

                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](0);
                  return _context3.abrupt("return", (0, _contentstackError2["default"])(_context3.t0));

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
       * const client = contentstack.client({})
       *
       * client.organization('organization_uid).getInvitations()
       * .then((notice) => console.log(notice))
       *
       */


      this.getInvitations = /*#__PURE__*/function () {
        var _ref4 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee4(param) {
          var response;
          return _regenerator2["default"].wrap(function _callee4$(_context4) {
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

                  return _context4.abrupt("return", new _contentstackCollection2["default"](response, http, null, _user.UserCollection));

                case 8:
                  return _context4.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context4.next = 14;
                  break;

                case 11:
                  _context4.prev = 11;
                  _context4.t0 = _context4["catch"](0);
                  return _context4.abrupt("return", (0, _contentstackError2["default"])(_context4.t0));

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
       * const client = contentstack.client({})
       *
       * client.organization('organization_uid).resendInvitition('invitation_uid')
       * .then((notice) => console.log(notice))
       *
       */


      this.resendInvitation = /*#__PURE__*/function () {
        var _ref5 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee5(invitationUid) {
          var response;
          return _regenerator2["default"].wrap(function _callee5$(_context5) {
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
                  return _context5.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context5.next = 14;
                  break;

                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](0);
                  return _context5.abrupt("return", (0, _contentstackError2["default"])(_context5.t0));

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
       * @description The Unshare a stack call unshares a stack with a user and removes the user account from the list of collaborators.
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
       * const client = contentstack.client({})
       *
       * client.organization('organization_uid).roles()
       * .then((roles) => console.log(roles))
       *
       */


      this.roles = /*#__PURE__*/function () {
        var _ref6 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee6(param) {
          var response;
          return _regenerator2["default"].wrap(function _callee6$(_context6) {
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

                  return _context6.abrupt("return", new _contentstackCollection2["default"](response, http, null, _index.RoleCollection));

                case 8:
                  return _context6.abrupt("return", (0, _contentstackError2["default"])(response));

                case 9:
                  _context6.next = 14;
                  break;

                case 11:
                  _context6.prev = 11;
                  _context6.t0 = _context6["catch"](0);
                  return _context6.abrupt("return", (0, _contentstackError2["default"])(_context6.t0));

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
     * @param {Int} limit The limit parameter will return a specific number of roles in the output.
     * @param {Int} skip The skip parameter will skip a specific number of roles in the output.
     * @param {String} asc When fetching roles, you can sort them in the ascending order with respect to the value of a specific field in the response body.
     * @param {String} desc When fetching roles, you can sort them in the decending order with respect to the value of a specific field in the response body.
     * @param {Boolean}include_count To retrieve the count of roles.
     * @param {String} typeahead The type head contains value to be included in search.
     * @returns {ContentstackCollection} Result collection of content of specified module.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client({})
     *
     * client.organization().fetchAll()
     * .then((collection) => console.log(collection))
     *
     */
    this.fetchAll = /*#__PURE__*/function () {
      var _ref7 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee7(parmas) {
        var response;
        return _regenerator2["default"].wrap(function _callee7$(_context7) {
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

                return _context7.abrupt("return", new _contentstackCollection2["default"](response, http, null, OrganizationCollection));

              case 8:
                throw (0, _contentstackError2["default"])(response);

              case 9:
                _context7.next = 14;
                break;

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                throw (0, _contentstackError2["default"])(_context7.t0);

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

function OrganizationCollection(http, data) {
  var obj = (0, _cloneDeep2["default"])(data.organizations);
  var organizationCollection = obj.map(function (userdata) {
    return new Organization(http, {
      organization: userdata
    });
  });
  return organizationCollection;
}