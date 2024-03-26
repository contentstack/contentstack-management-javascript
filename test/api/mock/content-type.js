const singlepageCT = {
  content_type:
    {
      options:
        {
          is_page: true,
          singleton: true,
          title: 'title',
          sub_title: []
        },
      title: 'Single Page',
      uid: 'single_page',
      schema: [
        {
          display_name: 'Title',
          uid: 'title',
          data_type: 'text',
          mandatory: true,
          unique: true,
          field_metadata:
                {
                  _default: true
                }
        },
        {
          display_name: 'URL',
          uid: 'url',
          data_type: 'text',
          mandatory: true,
          field_metadata: {
            _default: true,
            instruction: ''
          }
        }
      ]
    },
  prevcreate: true
}

const multiPageCT = {
  content_type:
    {
      options:
        {
          is_page: true,
          singleton: false,
          title: 'title',
          sub_title: [],
          url_pattern: '/:title'
        },
      title: 'Multi page',
      uid: 'multi_page',
      schema:
        [
          {
            display_name: 'Title',
            uid: 'title',
            data_type: 'text',
            mandatory: true,
            unique: true,
            field_metadata:
                {
                  _default: true
                }
          },
          {
            display_name: 'URL',
            uid: 'url',
            data_type: 'text',
            mandatory: false,
            field_metadata:
                {
                  _default: true
                }
          }
        ]
    },
  prevcreate: true
}

const schema = [
  {
    display_name: 'Title',
    uid: 'title',
    data_type: 'text',
    mandatory: true,
    unique: true,
    field_metadata:
    {
      _default: true,
      version: 3
    },
    non_localizable: false,
    multiple: false,
    fldUid: 'title'
  },
  {
    display_name: 'URL',
    uid: 'url',
    data_type: 'text',
    mandatory: true,
    field_metadata:
    {
      _default: true,
      version: 3
    },
    non_localizable: false,
    multiple: false,
    unique: false,
    fldUid: 'url'
  },
  {
    data_type: 'text',
    display_name: 'Single line textbox',
    abstract: 'Name, title, email address, any short text',
    uid: 'single_line',
    field_metadata:
    {
      description: '',
      default_value: ''
    },
    class: 'high-lighter',
    format: '',
    error_messages: { format: '' },
    fldUid: 'single_line'
  },
  {
    data_type: 'text',
    display_name: 'Multi line textbox',
    abstract: 'Descriptions, paragraphs, long text',
    uid: 'multi_line',
    field_metadata:
    {
      description: '',
      default_value: '',
      multiline: true
    },
    class: 'high-lighter',
    format: '',
    error_messages:
    {
      format: ''
    },
    fldUid: 'multi_line'
  },
  {
    data_type: 'text',
    display_name: 'Markdown',
    abstract: 'Input text in markdown language',
    uid: 'markdown',
    field_metadata:
    {
      description: '',
      markdown: true
    },
    class: 'high-lighter',
    fldUid: 'markdown'
  },
  {
    data_type: 'blocks',
    display_name: 'Modular Blocks',
    abstract: 'Create content dynamically',
    blocks:
    [
      {
        title: 'Block1',
        uid: 'block1',
        blockType: 'custom',
        autoEdit: true,
        schema:
        [
          { data_type: 'file', display_name: 'File', abstract: 'Upload images, videos, docs, etc.', uid: 'file', icon_class: 'icon-file-text-alt', class: 'high-lighter', size: { min: '', max: '' }, extensions: '', field_metadata: { description: '', rich_text_type: 'standard' }, fldUid: 'modular_blocks > block1 > file' }, { data_type: 'link', display_name: 'Link', abstract: 'Add links to text', uid: 'link', icon_class: 'icon-link', class: 'high-lighter', field_metadata: { description: '', default_value: { title: '', url: '' } }, fldUid: 'modular_blocks > block1 > link' }] }],
    multiple: true,
    uid: 'modular_blocks',
    field_metadata: {},
    class: 'high-lighter',
    fldUid: 'modular_blocks' }]

export { singlepageCT, multiPageCT, schema }
