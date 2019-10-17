import error from './core/contentstackError'

export default function entity ({ http, urlPath, wrapper }) {
  function create (data, param) {
    return http.post(urlPath, data, { headers: param || {} })
      .then((response) => {
        const data = response.data.stack || response.data.content_type || response.data.entry || response.data.asset || {}
        return wrapper(http, data)
      }, error)
  }

  return {
    create: create
  }
}
