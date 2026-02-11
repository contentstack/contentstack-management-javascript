/**
 * Content Type Mock Schemas
 *
 * Based on CDA Test Stack export - adapted for comprehensive CMA SDK testing.
 * These schemas cover all field types and complex nesting patterns.
 */

// ============================================================================
// SIMPLE CONTENT TYPE - For basic CRUD testing
// ============================================================================
export const simpleContentType = {
  content_type: {
    title: 'Simple Test',
    uid: 'simple_test',
    description: 'Simple content type for basic CRUD operations',
    options: {
      is_page: false,
      singleton: false,
      title: 'title',
      sub_title: []
    },
    schema: [
      {
        display_name: 'Title',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      {
        display_name: 'Description',
        uid: 'description',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// MEDIUM CONTENT TYPE - For field type testing
// ============================================================================
export const mediumContentType = {
  content_type: {
    title: 'Medium Complexity',
    uid: 'medium_complexity',
    description: 'Medium complexity content type for field type testing',
    options: {
      is_page: true,
      singleton: false,
      title: 'title',
      sub_title: [],
      url_pattern: '/:title',
      url_prefix: '/test/'
    },
    schema: [
      // Text field (basic)
      {
        display_name: 'Title',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      // Text field (URL)
      {
        display_name: 'URL',
        uid: 'url',
        data_type: 'text',
        mandatory: false,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Text field (multiline)
      {
        display_name: 'Summary',
        uid: 'summary',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Number field
      {
        display_name: 'View Count',
        uid: 'view_count',
        data_type: 'number',
        mandatory: false,
        field_metadata: { description: 'Number of views', default_value: 0 },
        multiple: false,
        non_localizable: false,
        unique: false,
        min: 0
      },
      // Boolean field
      {
        display_name: 'Is Featured',
        uid: 'is_featured',
        data_type: 'boolean',
        mandatory: false,
        field_metadata: { description: 'Mark as featured content', default_value: false },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Date field
      {
        display_name: 'Publish Date',
        uid: 'publish_date',
        data_type: 'isodate',
        startDate: null,
        endDate: null,
        mandatory: false,
        field_metadata: { description: '', default_value: { custom: false, date: '', time: '' } },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // File/Image field
      {
        display_name: 'Hero Image',
        uid: 'hero_image',
        data_type: 'file',
        mandatory: false,
        field_metadata: { description: 'Main hero image', rich_text_type: 'standard', image: true },
        multiple: false,
        non_localizable: false,
        unique: false,
        dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
      },
      // Link field
      {
        display_name: 'External Link',
        uid: 'external_link',
        data_type: 'link',
        mandatory: false,
        field_metadata: { description: '', default_value: { title: '', url: '' } },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Select field (dropdown)
      {
        display_name: 'Status',
        uid: 'status',
        data_type: 'text',
        display_type: 'dropdown',
        enum: {
          advanced: true,
          choices: [
            { value: 'draft', key: 'Draft' },
            { value: 'review', key: 'In Review' },
            { value: 'published', key: 'Published' },
            { value: 'archived', key: 'Archived' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: 'draft', default_key: 'Draft', version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Select field (checkbox - multiple)
      {
        display_name: 'Categories',
        uid: 'categories',
        data_type: 'text',
        display_type: 'checkbox',
        enum: {
          advanced: true,
          choices: [
            { value: 'technology', key: 'Technology' },
            { value: 'business', key: 'Business' },
            { value: 'lifestyle', key: 'Lifestyle' },
            { value: 'science', key: 'Science' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: '', default_key: '', version: 3 },
        multiple: true,
        non_localizable: false,
        unique: false
      },
      // Tags (multiple text) - 'tags' is reserved, using 'content_tags'
      {
        display_name: 'Tags',
        uid: 'content_tags',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Content tags', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: true,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// COMPLEX CONTENT TYPE - Page Builder style with nested blocks
// ============================================================================
export const complexContentType = {
  content_type: {
    title: 'Complex Page',
    uid: 'complex_page',
    description: 'Complex page builder content type with deep nesting',
    options: {
      is_page: true,
      singleton: false,
      title: 'title',
      sub_title: [],
      url_pattern: '/:title',
      url_prefix: '/'
    },
    schema: [
      // Basic text fields
      {
        display_name: 'Title',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      {
        display_name: 'URL',
        uid: 'url',
        data_type: 'text',
        mandatory: false,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Rich Text HTML
      {
        display_name: 'Body HTML',
        uid: 'body_html',
        data_type: 'text',
        mandatory: false,
        field_metadata: {
          allow_rich_text: true,
          description: '',
          multiline: false,
          rich_text_type: 'advanced',
          options: [],
          embed_entry: true,
          version: 3
        },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // JSON RTE
      {
        display_name: 'Content',
        uid: 'content_json_rte',
        data_type: 'json',
        mandatory: false,
        field_metadata: {
          allow_json_rte: true,
          embed_entry: true,
          description: '',
          default_value: '',
          multiline: false,
          rich_text_type: 'advanced',
          options: []
        },
        format: '',
        error_messages: { format: '' },
        reference_to: ['sys_assets'],
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Group field (nested)
      {
        display_name: 'SEO',
        uid: 'seo',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: 'SEO metadata', instruction: '' },
        schema: [
          {
            display_name: 'Meta Title',
            uid: 'meta_title',
            data_type: 'text',
            mandatory: false,
            field_metadata: { description: '', default_value: '', version: 3 },
            format: '',
            error_messages: { format: '' },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Meta Description',
            uid: 'meta_description',
            data_type: 'text',
            mandatory: false,
            field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
            format: '',
            error_messages: { format: '' },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Social Image',
            uid: 'social_image',
            data_type: 'file',
            mandatory: false,
            field_metadata: { description: '', rich_text_type: 'standard', image: true },
            multiple: false,
            non_localizable: false,
            unique: false,
            dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
          },
          {
            display_name: 'Canonical URL',
            uid: 'canonical',
            data_type: 'text',
            mandatory: false,
            field_metadata: { description: '', default_value: '', version: 3 },
            format: '',
            error_messages: { format: '' },
            multiple: false,
            non_localizable: false,
            unique: false
          }
        ],
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Group field (multiple - repeatable)
      {
        display_name: 'Links',
        uid: 'links',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: 'Page links', instruction: '' },
        schema: [
          {
            display_name: 'Link',
            uid: 'link',
            data_type: 'link',
            mandatory: false,
            field_metadata: { description: '', default_value: { title: '', url: '' }, isTitle: true },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Appearance',
            uid: 'appearance',
            data_type: 'text',
            display_type: 'dropdown',
            enum: {
              advanced: true,
              choices: [
                { value: 'default', key: 'Default' },
                { value: 'primary', key: 'Primary' },
                { value: 'secondary', key: 'Secondary' }
              ]
            },
            mandatory: false,
            field_metadata: { description: '', default_value: 'default', default_key: 'Default', version: 3 },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Open in New Tab',
            uid: 'new_tab',
            data_type: 'boolean',
            mandatory: false,
            field_metadata: { description: '', default_value: false },
            multiple: false,
            non_localizable: false,
            unique: false
          }
        ],
        multiple: true,
        non_localizable: false,
        unique: false
      },
      // Modular Blocks (sections)
      {
        display_name: 'Sections',
        uid: 'sections',
        data_type: 'blocks',
        mandatory: false,
        field_metadata: { instruction: '', description: 'Page sections' },
        multiple: true,
        non_localizable: false,
        unique: false,
        blocks: [
          // Hero Block
          {
            title: 'Hero Section',
            uid: 'hero_section',
            schema: [
              {
                display_name: 'Headline',
                uid: 'headline',
                data_type: 'text',
                mandatory: true,
                field_metadata: { description: '', default_value: '', version: 3 },
                format: '',
                error_messages: { format: '' },
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Subheadline',
                uid: 'subheadline',
                data_type: 'text',
                mandatory: false,
                field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
                format: '',
                error_messages: { format: '' },
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Background Image',
                uid: 'background_image',
                data_type: 'file',
                mandatory: false,
                field_metadata: { description: '', rich_text_type: 'standard', image: true },
                multiple: false,
                non_localizable: false,
                unique: false,
                dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
              },
              {
                display_name: 'CTA Link',
                uid: 'cta_link',
                data_type: 'link',
                mandatory: false,
                field_metadata: { description: '', default_value: { title: '', url: '' } },
                multiple: false,
                non_localizable: false,
                unique: false
              }
            ]
          },
          // Content Block
          {
            title: 'Content Block',
            uid: 'content_block',
            schema: [
              {
                display_name: 'Title',
                uid: 'title',
                data_type: 'text',
                mandatory: false,
                field_metadata: { description: '', default_value: '', version: 3 },
                format: '',
                error_messages: { format: '' },
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Content',
                uid: 'content',
                data_type: 'json',
                mandatory: false,
                field_metadata: {
                  allow_json_rte: true,
                  embed_entry: false,
                  description: '',
                  default_value: '',
                  multiline: false,
                  rich_text_type: 'advanced',
                  options: []
                },
                format: '',
                error_messages: { format: '' },
                reference_to: ['sys_assets'],
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Image',
                uid: 'image',
                data_type: 'file',
                mandatory: false,
                field_metadata: { description: '', rich_text_type: 'standard', image: true },
                multiple: false,
                non_localizable: false,
                unique: false,
                dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
              },
              {
                display_name: 'Layout',
                uid: 'layout',
                data_type: 'text',
                display_type: 'dropdown',
                enum: {
                  advanced: true,
                  choices: [
                    { value: 'full_width', key: 'Full Width' },
                    { value: 'two_column', key: 'Two Column' },
                    { value: 'sidebar_left', key: 'Sidebar Left' },
                    { value: 'sidebar_right', key: 'Sidebar Right' }
                  ]
                },
                mandatory: false,
                field_metadata: { description: '', default_value: 'full_width', default_key: 'Full Width', version: 3 },
                multiple: false,
                non_localizable: false,
                unique: false
              }
            ]
          },
          // Card Grid Block (nested blocks)
          {
            title: 'Card Grid',
            uid: 'card_grid',
            schema: [
              {
                display_name: 'Grid Title',
                uid: 'grid_title',
                data_type: 'text',
                mandatory: false,
                field_metadata: { description: '', default_value: '', version: 3 },
                format: '',
                error_messages: { format: '' },
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Columns',
                uid: 'columns',
                data_type: 'text',
                display_type: 'dropdown',
                enum: {
                  advanced: false,
                  choices: [
                    { value: '2' },
                    { value: '3' },
                    { value: '4' }
                  ]
                },
                mandatory: false,
                field_metadata: { description: '', default_value: '3', version: 3 },
                multiple: false,
                non_localizable: false,
                unique: false
              },
              {
                display_name: 'Cards',
                uid: 'cards',
                data_type: 'group',
                mandatory: false,
                field_metadata: { description: '', instruction: '' },
                schema: [
                  {
                    display_name: 'Card Title',
                    uid: 'card_title',
                    data_type: 'text',
                    mandatory: true,
                    field_metadata: { description: '', default_value: '', isTitle: true, version: 3 },
                    format: '',
                    error_messages: { format: '' },
                    multiple: false,
                    non_localizable: false,
                    unique: false
                  },
                  {
                    display_name: 'Card Image',
                    uid: 'card_image',
                    data_type: 'file',
                    mandatory: false,
                    field_metadata: { description: '', rich_text_type: 'standard', image: true },
                    multiple: false,
                    non_localizable: false,
                    unique: false,
                    dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
                  },
                  {
                    display_name: 'Card Link',
                    uid: 'card_link',
                    data_type: 'link',
                    mandatory: false,
                    field_metadata: { description: '', default_value: { title: '', url: '' } },
                    multiple: false,
                    non_localizable: false,
                    unique: false
                  },
                  {
                    display_name: 'Card Description',
                    uid: 'card_description',
                    data_type: 'text',
                    mandatory: false,
                    field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
                    format: '',
                    error_messages: { format: '' },
                    multiple: false,
                    non_localizable: false,
                    unique: false
                  }
                ],
                multiple: true,
                non_localizable: false,
                unique: false
              }
            ]
          },
          // Accordion Block
          {
            title: 'Accordion',
            uid: 'accordion',
            schema: [
              {
                display_name: 'Accordion Items',
                uid: 'items',
                data_type: 'group',
                mandatory: false,
                field_metadata: { description: '', instruction: '' },
                schema: [
                  {
                    display_name: 'Question',
                    uid: 'question',
                    data_type: 'text',
                    mandatory: true,
                    field_metadata: { description: '', default_value: '', isTitle: true, version: 3 },
                    format: '',
                    error_messages: { format: '' },
                    multiple: false,
                    non_localizable: false,
                    unique: false
                  },
                  {
                    display_name: 'Answer',
                    uid: 'answer',
                    data_type: 'json',
                    mandatory: false,
                    field_metadata: {
                      allow_json_rte: true,
                      embed_entry: false,
                      description: '',
                      default_value: '',
                      multiline: false,
                      rich_text_type: 'advanced',
                      options: []
                    },
                    format: '',
                    error_messages: { format: '' },
                    reference_to: ['sys_assets'],
                    multiple: false,
                    non_localizable: false,
                    unique: false
                  }
                ],
                multiple: true,
                non_localizable: false,
                unique: false
              }
            ]
          }
        ]
      }
    ]
  }
}

// ============================================================================
// CONTENT TYPE WITH REFERENCES - For reference testing
// ============================================================================
export const authorContentType = {
  content_type: {
    title: 'Author',
    uid: 'author',
    description: 'Author profile for reference testing',
    options: {
      is_page: true,
      singleton: false,
      title: 'title',
      sub_title: [],
      url_pattern: '/:title',
      url_prefix: '/authors/'
    },
    schema: [
      {
        display_name: 'Name',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      {
        display_name: 'URL',
        uid: 'url',
        data_type: 'text',
        mandatory: false,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Email',
        uid: 'email',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: true
      },
      {
        display_name: 'Job Title',
        uid: 'job_title',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Bio',
        uid: 'bio',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Profile Image',
        uid: 'profile_image',
        data_type: 'file',
        mandatory: false,
        field_metadata: { description: '', rich_text_type: 'standard', image: true },
        multiple: false,
        non_localizable: false,
        unique: false,
        dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
      },
      {
        display_name: 'Social Links',
        uid: 'social_links',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: '', instruction: '' },
        schema: [
          {
            display_name: 'Platform',
            uid: 'platform',
            data_type: 'text',
            display_type: 'dropdown',
            enum: {
              advanced: true,
              choices: [
                { value: 'twitter', key: 'Twitter' },
                { value: 'linkedin', key: 'LinkedIn' },
                { value: 'github', key: 'GitHub' }
              ]
            },
            mandatory: false,
            field_metadata: { description: '', default_value: '', default_key: '', version: 3 },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Profile URL',
            uid: 'profile_url',
            data_type: 'link',
            mandatory: false,
            field_metadata: { description: '', default_value: { title: '', url: '' } },
            multiple: false,
            non_localizable: false,
            unique: false
          }
        ],
        multiple: true,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// CONTENT TYPE WITH MULTI-CT REFERENCES - For complex reference testing
// ============================================================================
export const articleContentType = {
  content_type: {
    title: 'Article',
    uid: 'article',
    description: 'Article content type with references and taxonomy',
    options: {
      is_page: true,
      singleton: false,
      title: 'title',
      sub_title: [],
      url_pattern: '/:title',
      url_prefix: '/articles/'
    },
    schema: [
      {
        display_name: 'Title',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      {
        display_name: 'URL',
        uid: 'url',
        data_type: 'text',
        mandatory: false,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Publish Date',
        uid: 'publish_date',
        data_type: 'isodate',
        startDate: null,
        endDate: null,
        mandatory: false,
        field_metadata: { description: '', default_value: { custom: false, date: '', time: '' }, hide_time: true },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Excerpt',
        uid: 'excerpt',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Content',
        uid: 'content',
        data_type: 'json',
        mandatory: false,
        field_metadata: {
          allow_json_rte: true,
          embed_entry: true,
          description: '',
          default_value: '',
          multiline: false,
          rich_text_type: 'advanced',
          options: []
        },
        format: '',
        error_messages: { format: '' },
        reference_to: ['sys_assets'],
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Featured Image',
        uid: 'featured_image',
        data_type: 'file',
        mandatory: false,
        field_metadata: { description: '', rich_text_type: 'standard', image: true },
        multiple: false,
        non_localizable: false,
        unique: false,
        dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
      },
      // Single reference
      {
        display_name: 'Author',
        uid: 'author',
        data_type: 'reference',
        reference_to: ['author'],
        mandatory: false,
        field_metadata: { ref_multiple: false, ref_multiple_content_types: false },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Multiple entries, single CT reference
      {
        display_name: 'Related Articles',
        uid: 'related_articles',
        data_type: 'reference',
        reference_to: ['article'],
        mandatory: false,
        field_metadata: { ref_multiple: true, ref_multiple_content_types: false },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      // Taxonomy field - commented out as it references specific taxonomy UIDs
      // that may not exist in a fresh stack. Taxonomy functionality is tested
      // separately in taxonomy-test.js
      // {
      //   display_name: 'Taxonomy',
      //   uid: 'taxonomies',
      //   data_type: 'taxonomy',
      //   taxonomies: [
      //     { taxonomy_uid: 'categories', max_terms: 5, mandatory: false, multiple: true, non_localizable: false },
      //     { taxonomy_uid: 'regions', max_terms: 3, mandatory: false, multiple: true, non_localizable: false }
      //   ],
      //   mandatory: false,
      //   field_metadata: { description: '', default_value: '' },
      //   format: '',
      //   error_messages: { format: '' },
      //   multiple: true,
      //   non_localizable: false,
      //   unique: false
      // },
      // Boolean flags
      {
        display_name: 'Is Featured',
        uid: 'is_featured',
        data_type: 'boolean',
        mandatory: false,
        field_metadata: { description: '', default_value: false },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Is Published',
        uid: 'is_published',
        data_type: 'boolean',
        mandatory: false,
        field_metadata: { description: '', default_value: false },
        multiple: false,
        non_localizable: true,
        unique: false
      },
      // Tags - 'tags' is reserved, using 'content_tags'
      {
        display_name: 'Tags',
        uid: 'content_tags',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: true,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// SINGLETON CONTENT TYPE - For singleton testing
// ============================================================================
export const singletonContentType = {
  content_type: {
    title: 'Site Settings',
    uid: 'site_settings',
    description: 'Global site settings (singleton)',
    options: {
      is_page: false,
      singleton: true,
      title: 'title',
      sub_title: []
    },
    schema: [
      {
        display_name: 'Site Name',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        unique: true,
        field_metadata: { _default: true, version: 3 },
        multiple: false,
        non_localizable: false
      },
      {
        display_name: 'Site Logo',
        uid: 'site_logo',
        data_type: 'file',
        mandatory: false,
        field_metadata: { description: '', rich_text_type: 'standard', image: true },
        multiple: false,
        non_localizable: false,
        unique: false,
        dimension: { width: { min: null, max: null }, height: { min: null, max: null } }
      },
      {
        display_name: 'Footer Text',
        uid: 'footer_text',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', multiline: true, version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Analytics ID',
        uid: 'analytics_id',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: true,
        unique: false
      }
    ]
  }
}

// ============================================================================
// SCHEMA UPDATE MOCKS - For schema modification testing
// ============================================================================
export const schemaUpdateAdd = {
  content_type: {
    schema: [
      {
        display_name: 'New Field',
        uid: 'new_field',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Newly added field', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// Export all content types
export default {
  simpleContentType,
  mediumContentType,
  complexContentType,
  authorContentType,
  articleContentType,
  singletonContentType,
  schemaUpdateAdd
}
