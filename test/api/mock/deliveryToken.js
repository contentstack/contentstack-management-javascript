const createDeliveryToken = {
  token: {
    name: 'Test',
    description: 'This is a demo token.',
    scope: [{
      module: 'environment',
      environments: ['development'],
      acl: {
        read: true
      }
    }]
  }
}
const createDeliveryToken2 = {
  token: {
    name: 'Test production token',
    description: 'This is a demo token.',
    scope: [{
      module: 'environment',
      environments: ['production'],
      acl: {
        read: true
      }
    }]
  }
}

export { createDeliveryToken, createDeliveryToken2 }
