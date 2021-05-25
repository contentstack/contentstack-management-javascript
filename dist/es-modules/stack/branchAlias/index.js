import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import error from '../../core/contentstackError';
import { deleteEntity, fetchAll, parseData } from '../../entity';
import { Branch, BranchCollection } from '../branch';
/**
 *
 * @namespace BranchAlias
 */

export function BranchAlias(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/stacks/branch_aliases";

  if (data.branch_alias) {
    Object.assign(this, cloneDeep(data.branch_alias));
    this.urlPath = "/stacks/branch_aliases/".concat(this.uid);
    /**
     * @description The Update BranchAlias call lets you update the name of an existing BranchAlias.
     * @memberof BranchAlias
     * @func update
     * @returns {Promise<BranchAlias.BranchAlias>} Promise for BranchAlias instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').createOrUpdate('branch_uid')
     * .then((branch) => {
     *  branch.name = 'new_branch_name'
     *  return branch.update()
     * })
     * .then((branch) => console.log(branch))
     *
     */

    this.createOrUpdate = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(targetBranch) {
        var response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return http.put(_this.urlPath, {
                  branch_alias: {
                    target_branch: targetBranch
                  }
                }, {
                  headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
                });

              case 3:
                response = _context.sent;

                if (!response.data) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", new Branch(http, parseData(response, _this.stackHeaders)));

              case 8:
                throw error(response);

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                throw error(_context.t0);

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
     * @description The Delete BranchAlias call is used to delete an existing BranchAlias permanently from your Stack.
     * @memberof BranchAlias
     * @func delete
     * @returns {Object} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').delete()
     * .then((response) => console.log(response.notice))
     */


    this["delete"] = deleteEntity(http, true);
    /**
     * @description The fetch BranchAlias call fetches BranchAlias details.
     * @memberof BranchAlias
     * @func fetch
     * @returns {Promise<BranchAlias.BranchAlias>} Promise for BranchAlias instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).branchAlias('branch_alias_id').fetch()
     * .then((branch) => console.log(branch))
     *
     */

    this.fetch = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var param,
          headers,
          response,
          _args2 = arguments;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              param = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              _context2.prev = 1;
              headers = {
                headers: _objectSpread({}, cloneDeep(this.stackHeaders))
              } || {};
              _context2.next = 5;
              return http.get(this.urlPath, headers);

            case 5:
              response = _context2.sent;

              if (!response.data) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return", new Branch(http, parseData(response, this.stackHeaders)));

            case 10:
              throw error(response);

            case 11:
              _context2.next = 16;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](1);
              throw error(_context2.t0);

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 13]]);
    }));
  } else {
    this.fetchAll = fetchAll(http, BranchCollection);
  }

  return this;
}