const customFieldURL = {
  extension: {
    tags: [
      'tag1',
      'tag2'
    ],
    data_type: 'text',
    title: 'New Custom Field URL',
    src: 'https://www.sample.com',
    multiple: false,
    config: '{}',
    type: 'field'
  }
}
const customFieldSRC = {
  extension: {
    tags: [
      'tag1',
      'tag2'
    ],
    data_type: 'text',
    title: 'New Custom Field source code',
    srcdoc: 'Source code of the extension',
    multiple: false,
    config: '{}',
    type: 'field'
  }
}

const customWidgetURL = {
  extension: {
    tags: [
      'tag1',
      'tag2'
    ],
    data_type: 'text',
    title: 'New Widget URL',
    src: 'https://www.sample.com',
    config: '{}',
    type: 'widget',
    scope: {
      content_types: ['single_page']
    }
  }
}

const customWidgetSRC = {
  extension: {
    tags: [
      'tag1',
      'tag2'
    ],
    title: 'New Widget SRC',
    srcdoc: 'Source code of the widget',
    config: '{}',
    type: 'widget',
    scope: {
      content_types: ['$all']
    }
  }
}

const customDashboardURL = {
  extension: {
    tags: [
      'tag'
    ],
    title: 'New Dashboard Widget URL',
    src: 'https://www.sample.com',
    config: '{}',
    type: 'dashboard',
    enable: true,
    default_width: 'half'
  }
}

const customDashboardSRC = {
  extension: {
    tags: [
      'tag1',
      'tag2'
    ],
    type: 'dashboard',
    title: 'New Dashboard Widget SRC',
    srcdoc: 'xyz',
    config: '{}',
    enable: true,
    default_width: 'half'
  }
}
export { customFieldURL, customFieldSRC, customWidgetURL, customWidgetSRC, customDashboardURL, customDashboardSRC }
