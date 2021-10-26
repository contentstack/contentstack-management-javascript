"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("@babel/runtime/helpers/defineProperty");

var _defineProperty3 = (0, _interopRequireDefault2["default"])(_defineProperty2);

var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = (0, _interopRequireDefault2["default"])(_asyncToGenerator2);

exports.BulkOperation = BulkOperation;

var _regenerator = require("@babel/runtime/regenerator");

var _regenerator2 = (0, _interopRequireDefault2["default"])(_regenerator);

var _cloneDeep = require("lodash/cloneDeep");

var _cloneDeep2 = (0, _interopRequireDefault2["default"])(_cloneDeep);

var _entity = require("../../entity");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Bulk operations such as Publish, Unpublish, and Delete on multiple entries or assets.
 * @namespace BulkOperation
 */
function BulkOperation(http) {
  var _this = this;

  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.stackHeaders = data.stackHeaders;
  this.urlPath = "/bulk";
  /**
   * The Publish entries and assets in bulk request allows you to publish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func publish
   * @returns {Promise<Object>} Response Object.
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to publish the entries or assets.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
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
   *     '{{env_uid}}'
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   * @example
   * // Bulk nested publish
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * {
   * environments:["{{env_uid}}","{{env_uid}}"],
   * locales:["en-us"],
   * items:[
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * }
   * ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().publish({ details:  publishDetails, is_nested: true })
   * .then((response) => {  console.log(response.notice) })
   *
   */

  this.publish = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee(_ref) {
      var details, _ref$skip_workflow_st, skip_workflow_stage, _ref$approvals, approvals, _ref$is_nested, is_nested, httpBody, headers;

      return _regenerator2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              details = _ref.details, _ref$skip_workflow_st = _ref.skip_workflow_stage, skip_workflow_stage = _ref$skip_workflow_st === void 0 ? false : _ref$skip_workflow_st, _ref$approvals = _ref.approvals, approvals = _ref$approvals === void 0 ? false : _ref$approvals, _ref$is_nested = _ref.is_nested, is_nested = _ref$is_nested === void 0 ? false : _ref$is_nested;
              httpBody = {};

              if (details) {
                httpBody = (0, _cloneDeep2["default"])(details);
              }

              headers = {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              };

              if (is_nested) {
                headers.params = {
                  nested: true,
                  event_type: 'bulk'
                };
              }

              if (skip_workflow_stage) {
                headers.headers.skip_workflow_stage_check = skip_workflow_stage;
              }

              if (approvals) {
                headers.headers.approvals = approvals;
              }

              return _context.abrupt("return", (0, _entity.publishUnpublish)(http, '/bulk/publish', httpBody, headers));

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * The Unpublish entries and assets in bulk request allows you to unpublish multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func unpublish
   * @returns {Promise<Object>} Response Object.
   * @param {Boolean} params.details - Set this with details containing 'entries', 'assets', 'locales', and 'environments' to which you want to unpublish the entries or assets. If you do not specify a source locale, the entries or assets will be unpublished in the master locale automatically.
   * @param {Boolean} params.skip_workflow_stage_check Set this to 'true' to publish the entries that are at a workflow stage where they satisfy the applied publish rules.
   * @param {Boolean} params.approvals Set this to 'true' to publish the entries that do not require an approval to be published.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
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
   *     '{{env_uid}}'
   *   ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().unpublish({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   * @example
   * // Bulk nested publish
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
   * {
   * environments:["{{env_uid}}","{{env_uid}}"],
   * locales:["en-us"],
   * items:[
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * },
   * {
   *   _content_type_uid: '{{content_type_uid}}',
   *   uid: '{{entry_uid}}'
   * }
   * ]
   * }
   * client.stack({ api_key: 'api_key'}).bulkOperation().unpublish({ details:  publishDetails, is_nested: true })
   * .then((response) => {  console.log(response.notice) })
   */


  this.unpublish = /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee2(_ref3) {
      var details, _ref3$skip_workflow_s, skip_workflow_stage, _ref3$approvals, approvals, _ref3$is_nested, is_nested, httpBody, headers;

      return _regenerator2["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              details = _ref3.details, _ref3$skip_workflow_s = _ref3.skip_workflow_stage, skip_workflow_stage = _ref3$skip_workflow_s === void 0 ? false : _ref3$skip_workflow_s, _ref3$approvals = _ref3.approvals, approvals = _ref3$approvals === void 0 ? false : _ref3$approvals, _ref3$is_nested = _ref3.is_nested, is_nested = _ref3$is_nested === void 0 ? false : _ref3$is_nested;
              httpBody = {};

              if (details) {
                httpBody = (0, _cloneDeep2["default"])(details);
              }

              headers = {
                headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
              };

              if (is_nested) {
                headers.params = {
                  nested: true,
                  event_type: 'bulk'
                };
              }

              if (skip_workflow_stage) {
                headers.headers.skip_workflow_stage_check = skip_workflow_stage;
              }

              if (approvals) {
                headers.headers.approvals = approvals;
              }

              return _context2.abrupt("return", (0, _entity.publishUnpublish)(http, '/bulk/unpublish', httpBody, headers));

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
  /**
   * The Delete entries and assets in bulk request allows you to delete multiple entries and assets at the same time.
   * @memberof BulkOperation
   * @func delete
   * @returns {Promise<String>} Success message
   * @param {Boolean} params.details - Set this with details specifing the content type UIDs, entry UIDs or asset UIDs, and locales of which the entries or assets you want to delete.
   * @example
   * import * as contentstack from '@contentstack/management'
   * const client = contentstack.client()
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
   * client.stack({ api_key: 'api_key'}).bulkOperation().delete({ details:  publishDetails })
   * .then((response) => {  console.log(response.notice) })
   *
   */


  this["delete"] = /*#__PURE__*/(0, _asyncToGenerator3["default"])( /*#__PURE__*/_regenerator2["default"].mark(function _callee3() {
    var params,
        httpBody,
        headers,
        _args3 = arguments;
    return _regenerator2["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
            httpBody = {};

            if (params.details) {
              httpBody = (0, _cloneDeep2["default"])(params.details);
            }

            headers = {
              headers: _objectSpread({}, (0, _cloneDeep2["default"])(_this.stackHeaders))
            };
            return _context3.abrupt("return", (0, _entity.publishUnpublish)(http, '/bulk/delete', httpBody, headers));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}