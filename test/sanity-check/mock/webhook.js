const webhook = {
  webhook: {
    name: 'Test',
    destinations: [{
      target_url: 'http://example.com',
      http_basic_auth: 'basic',
      http_basic_password: 'test',
      custom_header: [{
        header_name: 'Custom',
        value: 'testing'
      }]
    }],
    channels: [
      'assets.create'
    ],
    retry_policy: 'manual',
    disabled: false
  }
}

const updateWebhook = {
  webhook: {
    name: 'Updated webhook',
    destinations: [{
      target_url: 'http://example.com',
      http_basic_auth: 'basic',
      http_basic_password: 'test',
      custom_header: [{
        header_name: 'Custom',
        value: 'testing'
      }]
    }],
    channels: [
      'assets.create'
    ],
    retry_policy: 'manual',
    disabled: true
  }
}
export { webhook, updateWebhook }
