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
      uid: 'blt0d635749484855ae'
    }
}

export default role
