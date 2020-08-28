"use strict";

var _interopRequireDefault3 = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireDefault2 = _interopRequireDefault3(require("@babel/runtime/helpers/interopRequireDefault"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = undefined;

var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");

var _classCallCheck3 = (0, _interopRequireDefault2["default"])(_classCallCheck2);

var ContentstackCollection = function ContentstackCollection(response, http) {
  var stackHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var wrapperCollection = arguments.length > 3 ? arguments[3] : undefined;
  (0, _classCallCheck3["default"])(this, ContentstackCollection);
  var data = response.data || {};

  if (stackHeaders) {
    data.stackHeaders = stackHeaders;
  }

  this.items = wrapperCollection(http, data);

  if (data.schema !== undefined) {
    this.schema = data.schema;
  }

  if (data.content_type !== undefined) {
    this.content_type = data.content_type;
  }

  if (data.count !== undefined) {
    this.count = data.count;
  }

  if (data.notice !== undefined) {
    this.notice = data.notice;
  }
};

exports["default"] = ContentstackCollection;
module.exports = exports.default;