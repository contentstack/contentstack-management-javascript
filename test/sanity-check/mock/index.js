/**
 * Mock Data Index
 *
 * Central export for all mock data used in API tests.
 * Based on CDA Test Stack export - adapted for comprehensive CMA SDK testing.
 */

// Content Types
// Re-export defaults for convenience
import contentTypes from './content-types/index.js'
import globalFields from './global-fields.js'
import taxonomy from './taxonomy.js'
import entries from './entries/index.js'
import configurations from './configurations.js'

export * from './content-types/index.js'

// Global Fields
export * from './global-fields.js'

// Taxonomy
export * from './taxonomy.js'

// Entries
export * from './entries/index.js'

// Configurations (environments, locales, workflows, webhooks, roles, tokens, etc.)
export * from './configurations.js'

export default {
  contentTypes,
  globalFields,
  taxonomy,
  entries,
  configurations
}
