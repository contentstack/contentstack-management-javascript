const createManagementToken = {
  token: {
    name: 'Dev Token',
    description: 'This is a sample management token.',
    scope: [
      {
        module: 'content_type',
        acl: {
          read: true,
          write: true
        }
      },
      {
        module: 'branch',
        branches: [
          'main'
        ],
        acl: {
          read: true
        }
      },
      {
        module: 'branch_alias',
        branch_aliases: [
          'staging1_alias'
        ],
        acl: {
          read: true
        }
      }
    ],
    expires_on: '2024-12-10',
    is_email_notification_enabled: true
  }
}
const createManagementToken2 = {
  token: {
    name: 'Prod Token',
    description: 'This is a sample management token.',
    scope: [
      {
        module: 'content_type',
        acl: {
          read: true,
          write: true
        }
      },
      {
        module: 'branch',
        branches: [
          'main'
        ],
        acl: {
          read: true
        }
      },
      {
        module: 'branch_alias',
        branch_aliases: [
          'staging1_alias'
        ],
        acl: {
          read: true
        }
      }
    ],
    expires_on: '2025-12-10',
    is_email_notification_enabled: true
  }
}

export { createManagementToken, createManagementToken2 }
