import error from './core/contentstackError'
import cloneDeep from 'lodash/cloneDeep'
import Query from './query/index'
import ContentstackCollection from './contentstackCollection'

/**
 * Creates a publish function for the specified entity type.
 * @param {Object} http - HTTP client instance.
 * @param {string} type - Entity type (e.g., 'entry', 'asset').
 * @returns {Function} Async function that publishes an entity.
 * @example
 * const publishFn = publish(http, 'entry')
 * await publishFn.call(entryInstance, { publishDetails: {...}, locale: 'en-us' })
 */
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

/**
 * Creates an unpublish function for the specified entity type.
 * @param {Object} http - HTTP client instance.
 * @param {string} type - Entity type (e.g., 'entry', 'asset').
 * @returns {Function} Async function that unpublishes an entity.
 * @example
 * const unpublishFn = unpublish(http, 'entry')
 * await unpublishFn.call(entryInstance, { publishDetails: {...}, locale: 'en-us' })
 */
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

/**
 * Internal helper function to handle publish/unpublish operations.
 * @param {Object} http - HTTP client instance.
 * @param {string} url - API endpoint URL.
 * @param {Object} httpBody - Request body object.
 * @param {Object} headers - Request headers.
 * @param {string|null} locale - Locale code.
 * @param {number|null} version - Version number.
 * @param {string|null} scheduledAt - Scheduled date/time in ISO format.
 * @returns {Promise<Object>} Promise that resolves to response data.
 * @async
 * @private
 */
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

/**
 * Uploads a file using form data.
 * @param {Object} options - Upload options.
 * @param {Object} options.http - HTTP client instance.
 * @param {string} options.urlPath - API endpoint path.
 * @param {Object} options.stackHeaders - Stack headers.
 * @param {Function} options.formData - Function that returns FormData instance.
 * @param {Object=} options.params - Optional query parameters.
 * @param {string=} options.method - HTTP method ('POST' or 'PUT'), defaults to 'POST'.
 * @returns {Promise<Object>} Promise that resolves to response data.
 * @async
 */
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

/**
 * Creates a create function for entity instances.
 * @param {Object} options - Create options.
 * @param {Object} options.http - HTTP client instance.
 * @param {Object=} options.params - Optional default parameters.
 * @returns {Function} Async function that creates an entity.
 * @example
 * const createFn = create({ http })
 * await createFn.call(entityInstance, { entity: {...} })
 */
export const create = ({ http, params }) => {
  return async function (data, param) {
    this.stackHeaders = {
      ...this.stackHeaders
    }

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

/**
 * Creates a query function for entity instances.
 * @param {Object} options - Query options.
 * @param {Object} options.http - HTTP client instance.
 * @param {Function=} options.wrapperCollection - Collection wrapper function.
 * @param {string=} options.apiVersion - API version to use.
 * @returns {Function} Function that returns a query builder object.
 * @example
 * const queryFn = query({ http, wrapperCollection: EntityCollection })
 * const queryBuilder = queryFn.call(entityInstance, { query: {...} })
 */
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

/**
 * Creates an update function for entity instances.
 * @param {Object} http - HTTP client instance.
 * @param {string} type - Entity type (e.g., 'entry', 'asset').
 * @param {Object=} params - Optional default parameters.
 * @returns {Function} Async function that updates an entity.
 * @example
 * const updateFn = update(http, 'entry')
 * await updateFn.call(entryInstance, { locale: 'en-us' })
 */
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

/**
 * Creates a delete function for entity instances.
 * @param {Object} http - HTTP client instance.
 * @param {boolean=} force - Whether to force delete, defaults to false.
 * @param {Object=} params - Optional default parameters.
 * @returns {Function} Async function that deletes an entity.
 * @example
 * const deleteFn = deleteEntity(http, false)
 * await deleteFn.call(entityInstance, {})
 */
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

/**
 * Creates a fetch function for entity instances.
 * @param {Object} http - HTTP client instance.
 * @param {string} type - Entity type (e.g., 'entry', 'asset').
 * @param {Object=} params - Optional default parameters.
 * @returns {Function} Async function that fetches an entity.
 * @example
 * const fetchFn = fetch(http, 'entry')
 * await fetchFn.call(entryInstance, { version: 1 })
 */
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

/**
 * Creates a fetchAll function for entity instances.
 * @param {Object} http - HTTP client instance.
 * @param {Function=} wrapperCollection - Collection wrapper function.
 * @param {Object=} params - Optional default parameters.
 * @returns {Function} Async function that fetches all entities.
 * @example
 * const fetchAllFn = fetchAll(http, EntityCollection)
 * await fetchAllFn.call(entityInstance, { limit: 10 })
 */
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

/**
 * Parses response data and adds stack headers and metadata.
 * @param {Object} response - HTTP response object.
 * @param {Object} stackHeaders - Stack headers to add to data.
 * @param {string=} contentTypeUID - Content type UID.
 * @param {string=} taxonomyUid - Taxonomy UID.
 * @param {Object} http - HTTP client instance.
 * @returns {Object} Parsed data object with stack headers.
 */
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

/**
 * Performs a GET request with branch and stack header data.
 * @param {Object} http - HTTP client instance.
 * @param {string} url - API endpoint URL.
 * @param {Object} params - Query parameters.
 * @param {Object} data - Data object containing branches and stackHeaders.
 * @returns {Promise<Object>} Promise that resolves to response data.
 * @async
 */
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

/**
 * Creates a move function for entity instances.
 * @param {Object} http - HTTP client instance.
 * @param {string} type - Entity type (e.g., 'entry', 'asset').
 * @param {boolean=} force - Whether to force move, defaults to false.
 * @param {Object=} params - Optional default parameters.
 * @returns {Function} Async function that moves an entity.
 * @example
 * const moveFn = move(http, 'entry', false)
 * await moveFn.call(entryInstance, { parent_uid: 'new_parent' })
 */
export const move = (http, type, force = false, params = {}) => {
  return async function (param = {}) {
    try {
      let updateData = {}
      const json = cloneDeep(this)
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
      const response = await http.put(`${this.urlPath}/move`, param, headers)
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

/**
 * Recursively cleans asset objects in data, replacing full asset objects with their UIDs.
 * @param {Object|Array} data - Data object or array containing asset references.
 * @returns {Object|Array} Data with asset objects replaced by UIDs.
 */
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
