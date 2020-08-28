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

export { ContentstackCollection as default };