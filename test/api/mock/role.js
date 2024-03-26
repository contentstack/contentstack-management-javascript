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
          }
        ],
      uid: 'role_uid'
    }
}

export default role
