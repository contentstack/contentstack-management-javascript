/**
 * Content type mock for unit tests (singlepageCT).
 * Mirrors test/typescript/mock/contentType.ts for test/unit/mock/objects.js.
 */
export const singlepageCT = {
  content_type: {
    options: {
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
        field_metadata: { _default: true }
      },
      {
        display_name: 'URL',
        uid: 'url',
        data_type: 'text',
        mandatory: true,
        field_metadata: { _default: true, instruction: '' }
      }
    ]
  },
  prevcreate: true
}
