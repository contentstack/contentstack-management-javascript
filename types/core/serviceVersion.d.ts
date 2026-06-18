/** Union of all registered service keys with known API version overrides */
export type ServiceVersionKey =
  | 'bulk_publish'
  | 'bulk_unpublish'
  | 'bulk_job_status'
  | 'bulk_job_items'
  | 'global_field'
  | 'release';

/** Maps each registered service key to its API version string */
export declare const SERVICE_VERSIONS: Record<ServiceVersionKey, string>;

/** Default API version returned when a service key is not registered */
export declare const DEFAULT_API_VERSION: string;

/**
 * Returns the registered API version for the given service key.
 * Falls back to DEFAULT_API_VERSION ('3.0') if the key is not found.
 *
 * @param serviceKey - The service identifier (e.g. 'bulk_publish', 'release')
 * @returns The API version string for the service, or the default
 */
export declare function getServiceVersion(serviceKey: string): string;
