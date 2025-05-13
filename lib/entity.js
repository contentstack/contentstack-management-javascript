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
      const data = response.data || {}
      if (http?.httpClientParams?.headers?.api_version) {
        delete http.httpClientParams.headers.api_version
      }
      if (headers?.api_version) {
        delete headers.api_version
      }
      if (headers) {
        data.stackHeaders = headers
      }
      if (http?.httpClientParams?.headers?.includeResHeaders === true) {
        data.stackHeaders = {
          ...data.stackHeaders,
          responseHeaders: response.headers
        }
      }
      return data
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
      ...cloneDeep(stackHeaders)
    },
    params: {
      ...cloneDeep(params)
    }
  } || {}
  if (method === 'POST') {
    return http.post(urlPath, formData, headers)
  } else {
    return http.put(urlPath, formData, headers)
  }
}

// eslint-disable-next-line camelcase
export const create = ({ http, params = {}, create_with_preview_token = false }) => {
  return async function (data, param) {
    this.stackHeaders = {
      ...this.stackHeaders
    }
    const queryParams = {
      // eslint-disable-next-line camelcase
      ...(create_with_preview_token ? { create_with_preview_token: true } : {}),
      ...cloneDeep(param) // user param can override default
    }
    const headers = {
      headers: {
        ...cloneDeep(params),
        ...cloneDeep(this.stackHeaders)
      },
      params: queryParams
    } || {}

    try {
      const response = await http.post(this.urlPath, data, headers)
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid, this.taxonomy_uid, http))
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

export const query = ({ http, wrapperCollection, apiVersion }) => {
  return function (params = {}) {
    const headers = {
      ...cloneDeep(this.stackHeaders),
      ...(apiVersion != null ? { api_version: apiVersion } : {})
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

    // If param has data for this entity type, merge it with the json object
    if (param && param[type]) {
      Object.assign(json, param[type])
    }

    if (type) {
      updateData[type] = json
      if (type === 'entry') updateData[type] = cleanAssets(updateData[type])
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
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid, this.taxonomy_uid, http))
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
        params: {
          ...cloneDeep(param)
        }
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
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid, this.taxonomy_uid, http))
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

export function parseData (response, stackHeaders, contentTypeUID, taxonomyUid, http) {
  const data = response.data || {}
  if (stackHeaders && 'api_version' in stackHeaders) {
    delete stackHeaders.api_version
  }
  if (stackHeaders) {
    data.stackHeaders = stackHeaders
  }
  if (contentTypeUID) {
    data.content_type_uid = contentTypeUID
  }
  if (taxonomyUid) {
    data.taxonomy_uid = taxonomyUid
  }
  if (http?.httpClientParams?.headers?.includeResHeaders === true) {
    data.stackHeaders = {
      ...data.stackHeaders,
      responseHeaders: response.headers
    }
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

export const move = (http, type, force = false, params = {}) => {
  return async function (param = {}) {
    try {
      let updateData = {}
      const json = cloneDeep(this)
      delete json.parent_uid
      if (type) {
        updateData[type] = json
      } else {
        updateData = json
      }
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders), ...cloneDeep(params) },
        params: {
          ...cloneDeep(param)
        }
      } || {}
      if (force === true) {
        headers.params.force = true
      }
      const response = await http.put(`${this.urlPath}/move`, updateData, headers)
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders, this.content_type_uid, this.taxonomy_uid, http))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

function isAsset (data) {
  const element = (Array.isArray(data) && data.length > 0) ? data[0] : data
  return (!!element.file_size || !!element.content_type) && !!element.uid
}

export function cleanAssets (data) {
  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    for (const key of keys) {
      if (data[key] !== null && data[key] !== undefined && typeof data[key] === 'object') {
        if (isAsset(data[key])) {
          data[key] = (Array.isArray(data[key])) ? data[key].map(element => element.uid) : data[key].uid
        } else {
          cleanAssets(data[key])
        }
      }
    }
  }
  return data
}
