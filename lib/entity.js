import error from './core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import Query from './query/index'

export const create = ({ http, params }) => {
  return async function (data, param) {
    const headers = {
      headers: {
        ...cloneDeep(params),
        ...cloneDeep(param),
        ...cloneDeep(this.stackHeaders)
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
  return function (params = {}, query = {}) {
    if (query) {
      params.query = query
      if (this.organization_uid) {
        params.query['org_uid'] = this.organization_uid
      }
    }
    return Query(http, this.urlPath, params, this.stackHeaders, wrapperCollection)
  }
}

export const update = (http, type) => {
  return async function () {
    const updateData = {}
    updateData[type] = cloneDeep(this)
    try {
      const response = await http.put(this.urlPath, updateData, { headers: {
        ...cloneDeep(this.stackHeaders)
      }
      })
      if (response.data) {
        return Object.assign(this, cloneDeep(response.data[type]))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

export const deleteEntity = (http) => {
  return async function () {
    try {
      const response = await http.delete(this.urlPath, { headers: {
        ...cloneDeep(this.stackHeaders)
      }
      })
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
        return Object.assign(this, cloneDeep(response.data[type]))
      } else {
        throw error(response)
      }
    } catch (err) {
      throw error(err)
    }
  }
}

function parseData (response, stackHeaders) {
  const data = response.data || {}
  if (stackHeaders) {
    data.stackHeaders = stackHeaders
  }
  return data
}
