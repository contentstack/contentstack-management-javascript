export default function error(errorResponse) {
  var config = errorResponse.config;
  var response = errorResponse.response;

  if (!config || !response) {
    throw errorResponse;
  }

  var data = response.data;
  var errorDetails = {
    status: response.status,
    statusText: response.statusText
  };

  if (config.headers && config.headers.authtoken) {
    var token = "...".concat(config.headers.authtoken.substr(-5));
    config.headers.authtoken = token;
  }

  if (config.headers && config.headers.authorization) {
    var _token = "...".concat(config.headers.authorization.substr(-5));

    config.headers.authorization = _token;
  }

  errorDetails.request = {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  };

  if (data) {
    errorDetails.errorMessage = data.error_message || '';
    errorDetails.errorCode = data.error_code || 0;
    errorDetails.errors = data.errors || {};
  }

  var error = new Error();
  Object.assign(error, errorDetails);
  error.message = JSON.stringify(errorDetails);
  throw error;
}