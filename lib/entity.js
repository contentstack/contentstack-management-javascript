import error from './core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import Query from './query/index'
import ContentstackCollection from './contentstackCollection'

export const publish = (http, type) => {
  return async function ({ publishDetails, locale = null, version = null, scheduledAt = null }) {
    const url = this.urlPath + '/publish'
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    } || {}
    const httpBody = {}
    httpBody[type] = cloneDeep(publishDetails)
    return publishUnpublish(http, url, httpBody, headers, locale, version, scheduledAt)
  }
}

export const unpublish = (http, type) => {
  return async function ({ publishDetails, locale = null, version = null, scheduledAt = null }) {
    const url = this.urlPath + '/unpublish'
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    } || {}
    const httpBody = {}
    httpBody[type] = cloneDeep(publishDetails)
    return publishUnpublish(http, url, httpBody, headers, locale, version, scheduledAt)
  }
}

export const publishUnpublish = async (http, url, httpBody, headers, locale = null, version = null, scheduledAt = null) => {
  if (locale !== null) {
    httpBody.locale = locale
  }
  if (version !== null) {
    httpBody.version = version
  }
  if (scheduledAt !== null) {
    httpBody.scheduled_at = scheduledAt
  }
  try {
    const response = await http.post(url, httpBody, headers)
    if (response.data) {
      return response.data
    } else {
      throw error(response)
    }
  } catch (err) {
    throw error(err)
  }
}

export const upload = async ({ http, urlPath, stackHeaders, formData, params, method = 'POST' }) => {
  const headers = {
    headers: {
      ...params,
      ...cloneDeep(stackHeaders)
    }
  } || {}

  if (method === 'POST') {
    return http.post(urlPath, formData, headers)
  } else {
    return http.put(urlPath, formData, headers)
  }
}

export const create = ({ http, params }) => {
  return async function (data, param) {
    const headers = {
      headers: {
        ...cloneDeep(params),
        ...cloneDeep(this.stackHeaders)
      },
      params: {
        ...cloneDeep(param)
      }
    } || {}

    try {
      const response = await http.post(this.urlPath, data, headers)
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const query = ({ http, wrapperCollection }) => {
  return function (params = {}) {
    const headers = {
      ...cloneDeep(this.stackHeaders)
    }
    if (this.organization_uid) {
      headers.organization_uid = this.organization_uid
      if (!params.query) {
        params.query = {}
      }
      params.query['org_uid'] = this.organization_uid
    }

    if (this.content_type_uid) {
      params.content_type_uid = this.content_type_uid
    }
    return Query(http, this.urlPath, params, headers, wrapperCollection)
  }
}

export const update = (http, type, params = {}) => {
  return async function (param = {}) {
    let updateData = {}
    const json = cloneDeep(this)
    delete json.stackHeaders
    delete json.urlPath
    delete json.uid
    delete json.org_uid
    delete json.api_key
    delete json.created_at
    delete json.created_by
    delete json.deleted_at
    delete json.updated_at
    delete json.updated_by
    delete json.updated_at
    if (type) {
      updateData[type] = json
    } else {
      updateData = json
    }
    try {
      const response = await http.put(this.urlPath, updateData, { headers: {
        ...cloneDeep(this.stackHeaders),
        ...cloneDeep(params)
      },
      params: {
        ...cloneDeep(param)
      }
      })
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const deleteEntity = (http, force = false, params = {}) => {
  return async function (param = {}) {
    try {
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) },
        params: { ...cloneDeep(param) }
      } || {}
      if (force === true) {
        headers.params.force = true
      }
      const response = await http.delete(this.urlPath, headers)
      if (response.data) {
        return response.data
      } else {
        if (response.status >= 200 && response.status < 300) {
          return {
            status: response.status,
            statusText: response.statusText
          }
        } else {
          throw error(response)
        }
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const fetch = (http, type, params = {}) => {
  return async function (param = {}) {
    try {
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) },
        params: {
          ...cloneDeep(param)
        }
      } || {}
      if (this.organization_uid) {
        headers.headers.organization_uid = this.organization_uid
      }

      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        if (type === 'entry') {
          response.data[type]['content_type'] = response.data['content_type']
          response.data[type]['schema'] = response.data['schema']
        }
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}
export const fetchAll = (http, wrapperCollection, params = {}) => {
  return async function (param = {}) {
    const headers = {
      headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) },
      params: {
        ...cloneDeep(param)
      }
    } || {}

    try {
      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        return new ContentstackCollection(response, http, this.stackHeaders, wrapperCollection)
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export function parseData (response, stackHeaders, contentTypeUID) {
  const data = response.data || {}
  if (stackHeaders) {
    data.stackHeaders = stackHeaders
  }
  if (contentTypeUID) {
    data.content_type_uid = contentTypeUID
  }
  return data
}

export async function get (http, url, params, data) {
  const headers = {
    params: {
      ...cloneDeep(data.branches),
      ...cloneDeep(params)
    },
    headers: {
      ...cloneDeep(data.stackHeaders)
    }
  } || {}
  try {
    const response = await http.get(url, headers)
    if (response.data) {
      return response.data
    } else {
      throw error(response)
    }
  } catch (err) {
    throw error(err)
  }
}
