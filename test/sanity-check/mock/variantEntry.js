const variantEntryFirst = {
  entry: {
    title: 'First page variant',
    url: '/first-page-variant',
    _variant: {
      _change_set: ['title', 'url']
    }
  }
}

var publishVariantEntryFirst = {
  entry: {
    environments: ['development'],
    locales: ['en-us', 'en-at'],
    variants: [
      {
        uid: '',
        version: 1
      }
    ],
    variant_rules: {
      publish_latest_base: false,
      publish_latest_base_conditionally: true
    }
  },
  locale: 'en-us',
  version: 1
}

const unpublishVariantEntryFirst = {
  entry: {
    environments: ['development'],
    locales: ['en-at'],
    variants: [
      {
        uid: '',
        version: 1
      }
    ],
    variant_rules: {
      publish_latest_base: false,
      publish_latest_base_conditionally: true
    }
  },
  locale: 'en-us',
  version: 1
}

export { variantEntryFirst, publishVariantEntryFirst, unpublishVariantEntryFirst }
