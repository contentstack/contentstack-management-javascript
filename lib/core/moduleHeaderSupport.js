import cloneDeep from 'lodash/cloneDeep'

const moduleHeadersOwn = Symbol.for('contentstack.management.moduleHeadersOwn')

/**
 * Attaches `addHeader`, `addHeaderDict`, and `removeHeader` to a stack resource instance.
 * Per-module headers merge into request stack headers and override parent keys for that
 * instance only (copy-on-write). Pass `ownsHeadersInline: true` on Stack so the canonical
 * stack header map stays shared across child modules until a child calls addHeader.
 *
 * @param {Object} instance - Resource instance that uses `stackHeaders` for CMA headers.
 * @param {Object} [options]
 * @param {boolean} [options.ownsHeadersInline=false] - Mutate `stackHeaders` in place (stack root).
 * @returns {Object} The same instance for chaining.
 */
export function bindModuleHeaders (instance, { ownsHeadersInline = false } = {}) {
  instance.addHeader = function (key, value) {
    if (key === undefined || key === null) {
      return this
    }
    prepareStackHeaders(this, ownsHeadersInline)
    this.stackHeaders[key] = value
    return this
  }

  instance.addHeaderDict = function (headerDict) {
    if (!headerDict || typeof headerDict !== 'object') {
      return this
    }
    prepareStackHeaders(this, ownsHeadersInline)
    Object.assign(this.stackHeaders, headerDict)
    return this
  }

  instance.removeHeader = function (key) {
    if (key === undefined || key === null) {
      return this
    }
    if (ownsHeadersInline) {
      if (this.stackHeaders && Object.prototype.hasOwnProperty.call(this.stackHeaders, key)) {
        delete this.stackHeaders[key]
      }
      return this
    }
    if (!this[moduleHeadersOwn]) {
      if (!this.stackHeaders || !Object.prototype.hasOwnProperty.call(this.stackHeaders, key)) {
        return this
      }
      prepareStackHeaders(this, ownsHeadersInline)
      delete this.stackHeaders[key]
      return this
    }
    if (this.stackHeaders && Object.prototype.hasOwnProperty.call(this.stackHeaders, key)) {
      delete this.stackHeaders[key]
    }
    return this
  }

  return instance
}

function prepareStackHeaders (instance, ownsHeadersInline) {
  if (ownsHeadersInline) {
    if (!instance.stackHeaders) {
      instance.stackHeaders = {}
    }
    return
  }
  if (!instance[moduleHeadersOwn]) {
    instance.stackHeaders = cloneDeep(instance.stackHeaders || {})
    instance[moduleHeadersOwn] = true
  } else if (!instance.stackHeaders) {
    instance.stackHeaders = {}
  }
}

/**
 * Attaches `addHeader`, `addHeaderDict`, and `removeHeader` for a mutable header map (e.g. query builder).
 *
 * @param {Object} target - Object to receive methods.
 * @param {function(): Object} getHeaderMap - Returns the header key/value object used for requests.
 * @returns {Object} The same target for chaining.
 */
export function bindHeaderTarget (target, getHeaderMap) {
  target.addHeader = function (key, value) {
    if (key === undefined || key === null) {
      return this
    }
    const headers = getHeaderMap()
    if (!headers) {
      return this
    }
    headers[key] = value
    return this
  }

  target.addHeaderDict = function (headerDict) {
    if (!headerDict || typeof headerDict !== 'object') {
      return this
    }
    const headers = getHeaderMap()
    if (!headers) {
      return this
    }
    Object.assign(headers, headerDict)
    return this
  }

  target.removeHeader = function (key) {
    if (key === undefined || key === null) {
      return this
    }
    const headers = getHeaderMap()
    if (!headers) {
      return this
    }
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      delete headers[key]
    }
    return this
  }

  return target
}
