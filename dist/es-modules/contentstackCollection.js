import _classCallCheck from "@babel/runtime/helpers/classCallCheck";

var ContentstackCollection = function ContentstackCollection(response, http) {
  var stackHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var wrapperCollection = arguments.length > 3 ? arguments[3] : undefined;

  _classCallCheck(this, ContentstackCollection);

  var data = response.data || {};

  if (stackHeaders) {
    data.stackHeaders = stackHeaders;
  }

  this.items = wrapperCollection(http, data);

  if (response.data.schema !== undefined) {
    this.schema = response.data.schema;
  }

  if (response.data.content_type !== undefined) {
    this.content_type = response.data.content_type;
  }

  if (response.data.count !== undefined) {
    this.count = response.data.count;
  }

  if (response.data.notice !== undefined) {
    this.notice = response.data.notice;
  }
};

export { ContentstackCollection as default };