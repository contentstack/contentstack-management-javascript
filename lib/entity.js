import error from './core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import Query from './query/index'

export const publish = (http, type) => {
  return async function ({ publishDetails, locale = null, version = null, scheduledAt = null }) {
    const url = this.urlPath + '/publish'
    const headers = {
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    } || {}
    return publishUnpublish(http, url, type, headers, publishDetails, locale, version, scheduledAt)
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
    return publishUnpublish(http, url, type, headers, publishDetails, locale, version, scheduledAt)
  }
}

const publishUnpublish = async (http, url, type, headers, publishDetails, locale = null, version = null, scheduledAt = null) => {
  const httpBody = {}
  httpBody[type] = cloneDeep(publishDetails)
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
      ...formData.getHeaders(),
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
        return new this.constructor(http, parseData(response, this.stackHeaders))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const exportObject = ({ http }) => {
  return async function (param) {
    const headers = {
      params: {
        ...cloneDeep(param)
      },
      headers: {
        ...cloneDeep(this.stackHeaders)
      }
    } || {}
    try {
      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders))
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
    if (this.organization_uid) {
      params.query['org_uid'] = this.organization_uid
    }
    return Query(http, this.urlPath, params, this.stackHeaders, wrapperCollection)
  }
}

export const update = (http, type) => {
  return async function (param = {}) {
    const updateData = {}
    updateData[type] = cloneDeep(this)
    try {
      const response = await http.put(this.urlPath, updateData, { headers: {
        ...cloneDeep(this.stackHeaders)
      },
      params: {
        ...cloneDeep(param)
      }
      })
      if (response.data) {
        return new this.constructor(http, parseData(response, this.stackHeaders, this.contentType_uid))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const deleteEntity = (http) => {
  return async function (param = {}) {
    try {
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders) },
        params: {
          ...cloneDeep(param)
        }
      } || {}

      const response = await http.delete(this.urlPath, headers)
      if (response.data) {
        return response.data.notice
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const fetch = (http, type) => {
  return async function (param = {}) {
    try {
      const headers = {
        headers: { ...cloneDeep(this.stackHeaders) },
        params: {
          ...cloneDeep(param)
        }
      } || {}

      const response = await http.get(this.urlPath, headers)
      if (response.data) {
        if (type === 'entry') {
          response.data[type]['content_type'] = response.data['content_type']
          response.data[type]['schema'] = response.data['schema']
        }
        return Object.assign(this, cloneDeep(response.data[type]))
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
    data.content_type = contentTypeUID
  }
  return data
}
