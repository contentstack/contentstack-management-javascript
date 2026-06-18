import { expect } from 'chai'
import { describe, it } from 'mocha'
import { getServiceVersion, DEFAULT_API_VERSION, SERVICE_VERSIONS } from '../../lib/core/serviceVersion'

describe('serviceVersion', () => {
  it('DEFAULT_API_VERSION should be 3.0', () => {
    expect(DEFAULT_API_VERSION).to.equal('3.0')
  })

  it('SERVICE_VERSIONS contains all 6 expected service keys', () => {
    const expectedKeys = [
      'bulk_publish',
      'bulk_unpublish',
      'bulk_job_status',
      'bulk_job_items',
      'global_field',
      'release'
    ]
    expectedKeys.forEach(key => {
      expect(SERVICE_VERSIONS).to.have.property(key)
    })
  })

  it('getServiceVersion returns 3.2 for bulk_publish', () => {
    expect(getServiceVersion('bulk_publish')).to.equal('3.2')
  })

  it('getServiceVersion returns 3.2 for bulk_unpublish', () => {
    expect(getServiceVersion('bulk_unpublish')).to.equal('3.2')
  })

  it('getServiceVersion returns 3.2 for bulk_job_status', () => {
    expect(getServiceVersion('bulk_job_status')).to.equal('3.2')
  })

  it('getServiceVersion returns 3.2 for bulk_job_items', () => {
    expect(getServiceVersion('bulk_job_items')).to.equal('3.2')
  })

  it('getServiceVersion returns 3.2 for global_field', () => {
    expect(getServiceVersion('global_field')).to.equal('3.2')
  })

  it('getServiceVersion returns 3.2 for release', () => {
    expect(getServiceVersion('release')).to.equal('3.2')
  })

  it('getServiceVersion falls back to DEFAULT_API_VERSION for an unknown key', () => {
    expect(getServiceVersion('unknown_service')).to.equal(DEFAULT_API_VERSION)
  })

  it('getServiceVersion falls back to DEFAULT_API_VERSION for empty string', () => {
    expect(getServiceVersion('')).to.equal(DEFAULT_API_VERSION)
  })
})
