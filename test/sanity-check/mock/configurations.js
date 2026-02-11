/**
 * Configuration Mock Data
 *
 * Contains mock data for:
 * - Environments
 * - Locales
 * - Workflows
 * - Webhooks
 * - Roles
 * - Tokens (Delivery, Management, Preview)
 * - Releases
 * - Extensions
 * - Labels
 * - Branches
 */

// ============================================================================
// ENVIRONMENTS
// ============================================================================

export const developmentEnvironment = {
  environment: {
    name: 'development',
    urls: [
      {
        locale: 'en-us',
        url: 'https://dev.example.com'
      }
    ]
  }
}

export const stagingEnvironment = {
  environment: {
    name: 'staging',
    urls: [
      {
        locale: 'en-us',
        url: 'https://staging.example.com'
      },
      {
        locale: 'fr-fr',
        url: 'https://staging.example.com/fr'
      }
    ]
  }
}

export const productionEnvironment = {
  environment: {
    name: 'production',
    urls: [
      {
        locale: 'en-us',
        url: 'https://www.example.com'
      },
      {
        locale: 'fr-fr',
        url: 'https://www.example.com/fr'
      }
    ]
  }
}

export const environmentUpdate = {
  environment: {
    name: 'development-updated',
    urls: [
      {
        locale: 'en-us',
        url: 'https://dev-updated.example.com'
      }
    ]
  }
}

// ============================================================================
// LOCALES
// ============================================================================

export const masterLocale = {
  locale: {
    name: 'English - United States',
    code: 'en-us'
  }
}

export const frenchLocale = {
  locale: {
    name: 'French - France',
    code: 'fr-fr',
    fallback_locale: 'en-us'
  }
}

export const germanLocale = {
  locale: {
    name: 'German - Germany',
    code: 'de-de',
    fallback_locale: 'en-us'
  }
}

export const spanishLocale = {
  locale: {
    name: 'Spanish - Spain',
    code: 'es-es',
    fallback_locale: 'en-us'
  }
}

export const localeUpdate = {
  locale: {
    name: 'French - France (Updated)',
    fallback_locale: 'en-us'
  }
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export const simpleWorkflow = {
  workflow: {
    name: 'Simple Review Workflow',
    description: 'Basic workflow with draft, review, and publish stages',
    content_types: ['$all'],
    branches: ['main'],
    enabled: true,
    workflow_stages: [
      {
        name: 'Draft',
        color: '#2196f3',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Review',
        color: '#ff9800',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Approved',
        color: '#4caf50',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      }
    ],
    admin_users: { users: [] }
  }
}

export const complexWorkflow = {
  workflow: {
    name: 'Complex Editorial Workflow',
    description: 'Multi-stage workflow with role-based permissions',
    content_types: ['article', 'complex_page'],
    branches: ['main', 'development'],
    enabled: true,
    workflow_stages: [
      {
        name: 'Draft',
        color: '#9e9e9e',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: false,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Technical Review',
        color: '#2196f3',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Editorial Review',
        color: '#ff9800',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Legal Review',
        color: '#f44336',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      },
      {
        name: 'Ready to Publish',
        color: '#4caf50',
        SYS_ACL: { roles: { uids: [] }, users: { uids: ['$all'] }, others: {} },
        next_available_stages: ['$all'],
        allStages: true,
        allUsers: true,
        entry_lock: '$none'
      }
    ],
    admin_users: { users: [] }
  }
}

export const workflowUpdate = {
  workflow: {
    name: 'Updated Workflow',
    enabled: false
  }
}

// Publish Rules
export const publishRule = {
  publishing_rule: {
    workflow: 'workflow_uid',
    actions: ['publish'],
    content_types: ['article'],
    locales: ['en-us'],
    environment: 'development',
    approvers: { users: [], roles: [] }
  }
}

// ============================================================================
// WEBHOOKS
// ============================================================================

export const basicWebhook = {
  webhook: {
    name: 'Basic Webhook',
    destinations: [
      {
        target_url: 'https://webhook.example.com/basic',
        http_basic_auth: null,
        http_basic_password: null,
        custom_header: []
      }
    ],
    channels: ['content_types.entries.create', 'content_types.entries.update'],
    branches: ['main'],
    retry_policy: 'manual',
    disabled: false,
    concise_payload: true
  }
}

export const advancedWebhook = {
  webhook: {
    name: 'Advanced Webhook',
    destinations: [
      {
        target_url: 'https://webhook.example.com/advanced',
        http_basic_auth: 'user',
        http_basic_password: 'password',
        custom_header: [
          { header_name: 'X-Custom-Header', value: 'custom-value' },
          { header_name: 'X-API-Key', value: 'api-key-123' }
        ]
      }
    ],
    channels: [
      'content_types.entries.create',
      'content_types.entries.update',
      'content_types.entries.delete',
      'content_types.entries.publish',
      'content_types.entries.unpublish',
      'assets.create',
      'assets.update',
      'assets.delete',
      'assets.publish',
      'assets.unpublish'
    ],
    branches: ['main', 'development'],
    retry_policy: 'automatic',
    disabled: false,
    concise_payload: false
  }
}

export const webhookUpdate = {
  webhook: {
    name: 'Updated Webhook',
    disabled: true
  }
}

// ============================================================================
// ROLES
// ============================================================================

export const basicRole = {
  role: {
    name: 'Content Editor',
    description: 'Can create and edit content but cannot publish',
    rules: [
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      },
      {
        module: 'content_type',
        content_types: ['$all'],
        acl: {
          read: true,
          sub_acl: { read: true, create: true, update: true, delete: false, publish: false }
        }
      },
      {
        module: 'asset',
        assets: ['$all'],
        acl: { read: true, update: true, publish: false, delete: false }
      },
      {
        module: 'environment',
        environments: ['$all'],
        acl: { read: true }
      },
      {
        module: 'locale',
        locales: ['en-us'],
        acl: { read: true }
      }
    ]
  }
}

export const advancedRole = {
  role: {
    name: 'Senior Editor',
    description: 'Can create, edit, and publish content',
    rules: [
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      },
      {
        module: 'content_type',
        content_types: ['$all'],
        acl: {
          read: true,
          sub_acl: { read: true, create: true, update: true, delete: true, publish: true }
        }
      },
      {
        module: 'asset',
        assets: ['$all'],
        acl: { read: true, update: true, publish: true, delete: true }
      },
      {
        module: 'folder',
        folders: ['$all'],
        acl: { read: true, sub_acl: { read: true, create: true, update: true, delete: true } }
      },
      {
        module: 'environment',
        environments: [],
        acl: { read: true }
      },
      {
        module: 'locale',
        locales: ['en-us'],
        acl: { read: true }
      }
    ]
  }
}

export const roleUpdate = {
  role: {
    name: 'Content Editor (Updated)',
    description: 'Updated role description'
  }
}

// ============================================================================
// DELIVERY TOKEN
// ============================================================================

// Note: Delivery Token scope requires at least one environment
// The test file dynamically fetches an existing environment
export const deliveryToken = {
  token: {
    name: 'Development Delivery Token',
    description: 'Token for development environment',
    scope: [
      {
        module: 'environment',
        environments: ['development'], // Placeholder - test uses actual environment
        acl: { read: true }
      },
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      }
    ]
  }
}

export const deliveryTokenUpdate = {
  token: {
    name: 'Updated Delivery Token',
    description: 'Updated token description'
  }
}

// ============================================================================
// MANAGEMENT TOKEN
// ============================================================================

export const managementToken = {
  token: {
    name: 'API Management Token',
    description: 'Token for API integrations',
    scope: [
      {
        module: 'content_type',
        acl: { read: true, write: true }
      },
      {
        module: 'entry',
        acl: { read: true, write: true }
      },
      {
        module: 'asset',
        acl: { read: true, write: true }
      },
      {
        module: 'branch',
        branches: ['main'],
        acl: { read: true }
      }
    ],
    expires_on: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
  }
}

export const managementTokenUpdate = {
  token: {
    name: 'Updated Management Token',
    description: 'Updated token description'
  }
}

// ============================================================================
// PREVIEW TOKEN
// ============================================================================

export const previewToken = {
  token: {
    name: 'Preview Token',
    description: 'Token for content preview'
  }
}

// ============================================================================
// RELEASES
// ============================================================================

export const simpleRelease = {
  release: {
    name: 'Q1 2024 Release',
    description: 'First quarter content release'
  }
}

export const releaseWithItems = {
  release: {
    name: 'Feature Release',
    description: 'Release containing new feature content'
  }
}

export const releaseUpdate = {
  release: {
    name: 'Q1 2024 Release (Updated)',
    description: 'Updated release description'
  }
}

export const releaseItemEntry = {
  item: {
    version: 1,
    action: 'publish',
    content_type_uid: 'article'
  }
}

export const releaseItemAsset = {
  item: {
    version: 1,
    action: 'publish'
  }
}

export const releaseDeployConfig = {
  release: {
    environments: ['development']
  }
}

// ============================================================================
// EXTENSIONS
// ============================================================================

export const customFieldExtension = {
  extension: {
    title: 'Color Picker',
    type: 'field',
    data_type: 'text',
    src: 'https://example.com/color-picker.html',
    config: {},
    tags: ['ui', 'color']
  }
}

export const widgetExtension = {
  extension: {
    title: 'Analytics Widget',
    type: 'widget',
    src: 'https://example.com/analytics-widget.html',
    config: {
      api_key: 'analytics-key'
    },
    tags: ['analytics', 'dashboard']
  }
}

export const extensionUpdate = {
  extension: {
    title: 'Color Picker (Updated)',
    config: { theme: 'dark' }
  }
}

// ============================================================================
// LABELS
// ============================================================================

export const urgentLabel = {
  label: {
    name: 'Urgent',
    content_types: [] // Empty array - will be populated dynamically if needed
  }
}

export const featuredLabel = {
  label: {
    name: 'Featured',
    content_types: [] // Empty array - $all is not valid when no content types exist
  }
}

export const labelUpdate = {
  label: {
    name: 'High Priority'
  }
}

// ============================================================================
// BRANCHES
// ============================================================================

export const developmentBranch = {
  branch: {
    uid: 'development',
    source: 'main'
  }
}

export const featureBranch = {
  branch: {
    uid: 'feature-new-design',
    source: 'development'
  }
}

export const branchCompare = {
  base_branch: 'main',
  compare_branch: 'development'
}

export const branchMerge = {
  base_branch: 'main',
  compare_branch: 'development',
  default_merge_strategy: 'merge_prefer_base',
  merge_comment: 'Merging development into main'
}

// ============================================================================
// BRANCH ALIAS
// ============================================================================

export const branchAlias = {
  branch_alias: {
    uid: 'staging-alias',
    target_branch: 'development'
  }
}

export const branchAliasUpdate = {
  branch_alias: {
    target_branch: 'main'
  }
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export const bulkPublish = {
  entries: [
    {
      uid: 'entry_uid_1',
      content_type: 'article',
      locale: 'en-us'
    },
    {
      uid: 'entry_uid_2',
      content_type: 'article',
      locale: 'en-us'
    }
  ],
  assets: [
    { uid: 'asset_uid_1' },
    { uid: 'asset_uid_2' }
  ],
  locales: ['en-us'],
  environments: ['development']
}

export const bulkUnpublish = {
  entries: [
    {
      uid: 'entry_uid_1',
      content_type: 'article',
      locale: 'en-us'
    }
  ],
  assets: [],
  locales: ['en-us'],
  environments: ['development']
}

export const bulkDelete = {
  entries: [
    {
      uid: 'entry_uid_to_delete',
      content_type: 'article',
      locale: 'en-us'
    }
  ]
}

// Export all
export default {
  // Environments
  developmentEnvironment,
  stagingEnvironment,
  productionEnvironment,
  environmentUpdate,
  // Locales
  masterLocale,
  frenchLocale,
  germanLocale,
  spanishLocale,
  localeUpdate,
  // Workflows
  simpleWorkflow,
  complexWorkflow,
  workflowUpdate,
  publishRule,
  // Webhooks
  basicWebhook,
  advancedWebhook,
  webhookUpdate,
  // Roles
  basicRole,
  advancedRole,
  roleUpdate,
  // Tokens
  deliveryToken,
  deliveryTokenUpdate,
  managementToken,
  managementTokenUpdate,
  previewToken,
  // Releases
  simpleRelease,
  releaseWithItems,
  releaseUpdate,
  releaseItemEntry,
  releaseItemAsset,
  releaseDeployConfig,
  // Extensions
  customFieldExtension,
  widgetExtension,
  extensionUpdate,
  // Labels
  urgentLabel,
  featuredLabel,
  labelUpdate,
  // Branches
  developmentBranch,
  featureBranch,
  branchCompare,
  branchMerge,
  branchAlias,
  branchAliasUpdate,
  // Bulk
  bulkPublish,
  bulkUnpublish,
  bulkDelete
}
