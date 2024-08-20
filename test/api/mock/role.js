const role = {
  role:
    {
      name: 'test',
      description: 'Test from CMA Js',
      rules:
        [
          {
            module: 'environment',
            environments: [],
            acl: { read: true }
          },
          {
            module: 'locale',
            locales: [],
            acl: { read: true }
          },
          {
            module: "taxonomy",
            taxonomies: ["taxonomy_testing1"],
            terms: ["taxonomy_testing1.term_test1"],
            content_types: [
              {
                uid: "$all",
                acl: {
                  read: true,
                  sub_acl: {
                    read: true,
                    create: true,
                    update: true,
                    delete: true,
                    publish: true
                  }
                }
              }
            ],
            acl: {
              read: true,
              sub_acl: {
                read: true,
                create: true,
                update: true,
                delete: true,
                publish: true
              }
            }
          }
        ],
      uid: 'role_uid'
    }
}

export default role
