import error from './core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import Query from './query/index'

export function entity ({ http, urlPath, stackHeaders = null, wrapper, wrapperCollection }) {
  function create (data, param) {
    const headers = { headers: {
      ...cloneDeep(param),
      ...cloneDeep(stackHeaders)
    } } || {}
    return http.post(urlPath, data, headers)
      .then((response) => {
        return parse(http, response, stackHeaders, wrapper)
      }, error)
  }

  function query (param = {}) {
    return Query(http, urlPath, param, stackHeaders, wrapperCollection)
  }

  return {
    create: create,
    query: query
  }
}

export function update (http, urlPath, data, stackHeaders, wrapper) {
  return http.put(urlPath, data, stackHeaders).then((response) => {
    return parse(http, response, stackHeaders, wrapper)
  }, error)
}

export function deleteEntity (http, urlPath, stackHeaders) {
  return http.delete(urlPath, stackHeaders).then((response) => {
    return response.data.notice
  }, error)
}

export function fetch (http, urlPath, stackHeaders, wrapper) {
  return http.get(urlPath, stackHeaders).then((response) => {
    return parse(http, response, stackHeaders, wrapper)
  }, error)
}

function parse (http, response, stackHeaders, wrapper) {
  const data = response.data || {}
  if (stackHeaders) {
    data.stackHeaders = stackHeaders
  }
  return wrapper(http, data)
}
