const role = {
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
}
  
  export default role