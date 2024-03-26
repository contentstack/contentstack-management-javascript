const environmentCreate = {
    name: 'development',
    servers: [
    {
        name: 'default'
    }
    ],
    urls: [
    {
        locale: 'en-us',
        url: 'http://example.com/'
    }
    ],
    deploy_content: true

}
const environmentProdCreate = {
    name: 'production',
    servers: [],
    urls: [
    {
        locale: 'en-us',
        url: 'http://example.com/'
    }
    ],
    deploy_content: true
}


export { environmentCreate, environmentProdCreate }
  