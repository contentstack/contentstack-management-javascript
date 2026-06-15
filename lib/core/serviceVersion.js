export const DEFAULT_API_VERSION = '3.0'

export const SERVICE_VERSIONS = {
  bulk_publish: '3.2',
  bulk_unpublish: '3.2',
  bulk_job_status: '3.2',
  bulk_job_items: '3.2',
  global_field: '3.2',
  release: '3.2'
}

export function getServiceVersion (serviceKey) {
  return SERVICE_VERSIONS[serviceKey] ?? DEFAULT_API_VERSION
}
