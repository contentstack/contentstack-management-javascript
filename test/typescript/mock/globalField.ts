const globalFieldContent = {
    global_field: {
      title: 'First',
      uid: 'first',
      schema: [{
        display_name: 'Name',
        uid: 'name',
        data_type: 'text'
      }, {
        data_type: 'text',
        display_name: 'Rich text editor',
        uid: 'description',
        field_metadata: {
          allow_rich_text: true,
          description: '',
          multiline: false,
          rich_text_type: 'advanced',
          options: [] as String[],
          version: 3
        },
        multiple: false,
        mandatory: false,
        unique: false
      }]
    }
  }
  
  export { globalFieldContent }
  