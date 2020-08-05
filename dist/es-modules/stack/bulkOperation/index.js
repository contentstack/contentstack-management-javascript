import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import cloneDeep from 'lodash/cloneDeep';
import { publishUnpublish } from '../../entity';
/**
 * Bulk operations such as Publish, Unpublish, and Delete on multiple entries or assets.
 */

export function BulkOperation(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/bulk";
  /**
   * The Publish entries and assets in bulk request allows you to publish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func publish
   * @returns {Promise<String>} Success message
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to publish the entries or assets.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       version: '{{version}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }],
   *   locales: [
   *     'en'
   *   ],
   *   environments: [
   *     '{{env_name}}/env_uid}}'
   *   ]
   * }
   * client.stack('api_key').publish({ details:  publishDetails })
   * .then((notice) => {  console.log(notice) })
   *
   */

  this.publish = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var params,
        httpBody,
        headers,
        _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            httpBody = {};

            if (params.details) {
              httpBody = cloneDeep(params.details);
            }

            headers = {
              headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
            };

            if (params.skip_workflow_stage_check) {
              headers.headers.skip_workflow_stage_check = params.skip_workflow_stage_check;
            }

            if (params.approvals) {
              headers.headers.approvals = params.approvals;
            }

            return _context.abrupt("return", publishUnpublish(http, '/bulk/publish', httpBody, headers));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  /**
   * The Unpublish entries and assets in bulk request allows you to unpublish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func unpublish
   * @returns {Promise<String>} Success message
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to unpublish the entries or assets. If you do not specify a source locale, the entries or assets will be unpublished in the master locale automatically.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       version: '{{version}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }],
   *   locales: [
   *     'en'
   *   ],
   *   environments: [
   *     '{{env_name}}/env_uid}}'
   *   ]
   * }
   * client.stack('api_key').unpublish({ details:  publishDetails })
   * .then((notice) => {  console.log(notice) })
   *
   */

  this.unpublish = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var params,
        httpBody,
        headers,
        _args2 = arguments;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            httpBody = {};

            if (params.details) {
              httpBody = cloneDeep(params.details);
            }

            headers = {
              headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
            };

            if (params.skip_workflow_stage_check) {
              headers.headers.skip_workflow_stage_check = params.skip_workflow_stage_check;
            }

            if (params.approvals) {
              headers.headers.approvals = params.approvals;
            }

            return _context2.abrupt("return", publishUnpublish(http, '/bulk/unpublish', httpBody, headers));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  /**
   * The Delete entries and assets in bulk request allows you to delete multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func delete
   * @returns {Promise<String>} Success message
   * @param {Boolean} params.details - Set this with details specifing the content type UIDs, entry UIDs or asset UIDs, and locales of which the entries or assets you want to delete.
   * @example
   * import * as contentstack from 'contentstack'
   * const client = contentstack.client({})
   *
   * const publishDetails = {
   *   entries: [
   *     {
   *       uid: '{{entry_uid}}',
   *       content_type: '{{content_type_uid}}',
   *       locale: '{{entry_locale}}'
   *     }
   *   ],
   *   assets: [{
   *     uid: '{{uid}}'
   *   }]
   * }
   * client.stack('api_key').delete({ details:  publishDetails })
   * .then((notice) => {  console.log(notice) })
   *
   */

  this["delete"] = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var params,
        httpBody,
        headers,
        _args3 = arguments;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
            httpBody = {};

            if (params.details) {
              httpBody = cloneDeep(params.details);
            }

            headers = {
              headers: _objectSpread({}, cloneDeep(_this.stackHeaders))
            };
            return _context3.abrupt("return", publishUnpublish(http, '/bulk/delete', httpBody, headers));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}