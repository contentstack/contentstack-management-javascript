const role = {
  role: {
    name: 'testRole',
    description: 'This is a test role.',
    rules: [
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
      },
      {
        module: 'content_type',
        content_types: [
          '$all'
        ],
        acl: {
          read: true,
          sub_acl: {
            read: true
          }
        }
      },
      {
        module: 'asset',
        assets: [
          '$all'
        ],
        acl: {
          read: true,
          update: true,
          publish: true,
          delete: true
        }
      },
      {
        module: 'folder',
        folders: [
          '$all'
        ],
        acl: {
          read: true,
          sub_acl: {
            read: true
          }
        }
      },
      {
        module: 'environment',
        environments: [
          '$all'
        ],
        acl: {
          read: true
        }
      },
      {
        module: 'locale',
        locales: [
          'en-us'
        ],
        acl: {
          read: true
        }
      }
      // {
      //   module: "taxonomy",
      //   taxonomies: ["taxonomy_testing1"],
      //   terms: ["taxonomy_testing1.term_test1"],
      //   content_types: [
      //     {
      //       uid: "$all",
      //       acl: {
      //         read: true,
      //         sub_acl: {
      //           read: true,
      //           create: true,
      //           update: true,
      //           delete: true,
      //           publish: true
      //         }
      //       }
      //     }
      //   ],
      //   acl: {
      //     read: true,
      //     sub_acl: {
      //       read: true,
      //       create: true,
      //       update: true,
      //       delete: true,
      //       publish: true
      //     }
      //   }
      // }
    ]
  }
}

export default role
