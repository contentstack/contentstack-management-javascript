const createDeliveryToken = {
  token: {
    name: 'development test',
    description: 'This is a demo token.',
    scope: [
      {
        module: 'environment',
        environments: [
          'development'
        ],
        acl: {
          read: true
        }
      },
      {
        module: 'branch',
        branches: [
          'main',
          'staging1'
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
    ]
  }
}
const createDeliveryToken2 = {
  token: {
    name: 'production test',
    description: 'This is a demo token.',
    scope: [
      {
        module: 'environment',
        environments: [
          'production'
        ],
        acl: {
          read: true
        }
      },
      {
        module: 'branch',
        branches: [
          'main',
          'staging1'
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
    ]
  }
}
const createDeliveryToken3 = {
  token: {
    name: 'preview token test',
    description: 'This is a demo token.',
    scope: [
      {
        module: 'environment',
        environments: [
          'development'
        ],
        acl: {
          read: true
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
      }
    ]
  }
}

export { createDeliveryToken, createDeliveryToken2, createDeliveryToken3 }
