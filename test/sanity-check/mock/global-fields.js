/**
 * Global Field Mock Schemas
 * 
 * Based on CDA Test Stack export - adapted for comprehensive CMA SDK testing.
 * Global fields are reusable field schemas that can be embedded in content types.
 */

// ============================================================================
// SIMPLE GLOBAL FIELD - Basic reusable component
// ============================================================================
export const seoGlobalField = {
  global_field: {
    title: 'SEO',
    uid: 'seo',
    description: 'SEO metadata for pages',
    schema: [
      {
        display_name: 'Meta Title',
        uid: 'meta_title',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Page title for search engines', default_value: '', version: 3 },
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
        field_metadata: { description: 'Page description for search engines', default_value: '', multiline: true, version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Keywords',
        uid: 'keywords',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: true,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Social Image',
        uid: 'social_image',
        data_type: 'file',
        mandatory: false,
        field_metadata: { description: 'Image for social sharing', rich_text_type: 'standard', image: true },
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
        field_metadata: { description: 'Canonical URL for duplicate content', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'No Index',
        uid: 'no_index',
        data_type: 'boolean',
        mandatory: false,
        field_metadata: { description: 'Prevent search engine indexing', default_value: false },
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// MEDIUM GLOBAL FIELD - With nested groups
// ============================================================================
export const contentBlockGlobalField = {
  global_field: {
    title: 'Content Block',
    uid: 'content_block',
    description: 'Reusable content block with rich content',
    schema: [
      {
        display_name: 'Title',
        uid: 'title',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', placeholder: 'Block Title', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Block ID',
        uid: 'block_id',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Unique ID for anchor links', default_value: '', version: 3 },
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
        display_name: 'Links',
        uid: 'links',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: '', instruction: '' },
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
            display_name: 'Style',
            uid: 'style',
            data_type: 'text',
            display_type: 'dropdown',
            enum: {
              advanced: true,
              choices: [
                { value: 'default', key: 'Default' },
                { value: 'primary', key: 'Primary Button' },
                { value: 'secondary', key: 'Secondary Button' },
                { value: 'link', key: 'Text Link' }
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
      {
        display_name: 'Max Width',
        uid: 'max_width',
        data_type: 'number',
        mandatory: false,
        field_metadata: { description: 'Maximum width in pixels', default_value: '' },
        multiple: false,
        non_localizable: false,
        unique: false,
        min: 0
      }
    ]
  }
}

// ============================================================================
// COMPLEX GLOBAL FIELD - Hero Banner with multiple nested fields
// ============================================================================
export const heroBannerGlobalField = {
  global_field: {
    title: 'Hero Banner',
    uid: 'hero_banner',
    description: 'Hero section with background, text, and CTAs',
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
        display_name: 'Preheader',
        uid: 'preheader',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: 'Small text above the title', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Description',
        uid: 'description',
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
        display_name: 'Background Video',
        uid: 'background_video',
        data_type: 'file',
        extensions: ['mp4', 'webm'],
        mandatory: false,
        field_metadata: { description: 'Optional background video', rich_text_type: 'standard' },
        multiple: true,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Text Color',
        uid: 'text_color',
        data_type: 'text',
        display_type: 'radio',
        enum: {
          advanced: false,
          choices: [
            { value: 'light' },
            { value: 'dark' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: 'light', version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Size',
        uid: 'size',
        data_type: 'text',
        display_type: 'dropdown',
        enum: {
          advanced: true,
          choices: [
            { value: 'small', key: 'Small' },
            { value: 'medium', key: 'Medium' },
            { value: 'large', key: 'Large' },
            { value: 'full', key: 'Full Screen' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: 'medium', default_key: 'Medium', version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Alignment',
        uid: 'alignment',
        data_type: 'text',
        display_type: 'dropdown',
        enum: {
          advanced: true,
          choices: [
            { value: 'left', key: 'Left' },
            { value: 'center', key: 'Center' },
            { value: 'right', key: 'Right' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: 'center', default_key: 'Center', version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Primary CTA',
        uid: 'primary_cta',
        data_type: 'link',
        mandatory: false,
        field_metadata: { description: 'Main call-to-action button', default_value: { title: '', url: '' } },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Secondary CTA',
        uid: 'secondary_cta',
        data_type: 'link',
        mandatory: false,
        field_metadata: { description: 'Secondary call-to-action', default_value: { title: '', url: '' } },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Modal Settings',
        uid: 'modal',
        data_type: 'group',
        mandatory: false,
        field_metadata: { description: 'Optional modal settings', instruction: '' },
        schema: [
          {
            display_name: 'Enable Modal',
            uid: 'enabled',
            data_type: 'boolean',
            mandatory: false,
            field_metadata: { description: '', default_value: false },
            multiple: false,
            non_localizable: false,
            unique: false
          },
          {
            display_name: 'Button Text',
            uid: 'button_text',
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
            display_name: 'Video ID',
            uid: 'video_id',
            data_type: 'text',
            mandatory: false,
            field_metadata: { description: 'YouTube or Vimeo video ID', default_value: '', version: 3 },
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
      }
    ]
  }
}

// ============================================================================
// NESTED GLOBAL FIELD - For testing global field nesting
// ============================================================================
export const cardGlobalField = {
  global_field: {
    title: 'Card',
    uid: 'card',
    description: 'Reusable card component',
    schema: [
      {
        display_name: 'Title',
        uid: 'title',
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
        display_name: 'Description',
        uid: 'description',
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
        display_name: 'Link',
        uid: 'link',
        data_type: 'link',
        mandatory: false,
        field_metadata: { description: '', default_value: { title: '', url: '' } },
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        display_name: 'Card Type',
        uid: 'card_type',
        data_type: 'text',
        display_type: 'dropdown',
        enum: {
          advanced: true,
          choices: [
            { value: 'default', key: 'Default' },
            { value: 'featured', key: 'Featured' },
            { value: 'compact', key: 'Compact' }
          ]
        },
        mandatory: false,
        field_metadata: { description: '', default_value: 'default', default_key: 'Default', version: 3 },
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// UPDATE MOCKS - For global field modification testing
// ============================================================================
export const globalFieldUpdate = {
  global_field: {
    description: 'Updated description for global field',
    schema: [
      {
        display_name: 'Updated Title',
        uid: 'title',
        data_type: 'text',
        mandatory: true,
        field_metadata: { description: 'Updated title field', default_value: '', version: 3 },
        format: '',
        error_messages: { format: '' },
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ]
  }
}

// ============================================================================
// NESTED GLOBAL FIELDS (require api_version: '3.2')
// ============================================================================

/**
 * Base global field that will be referenced by nested global field
 * Must be created first before the nested one
 */
export const baseGlobalFieldForNesting = {
  global_field: {
    title: 'Base GF for Nesting',
    uid: 'base_gf_for_nesting',
    description: 'Simple global field used as reference in nested global fields',
    schema: [
      {
        display_name: 'Label',
        uid: 'label',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        multiple: false,
        unique: false
      },
      {
        display_name: 'Value',
        uid: 'value',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', default_value: '', version: 3 },
        multiple: false,
        unique: false
      }
    ]
  }
}

/**
 * Nested Global Field - References another global field inside its schema
 * This requires api_version: '3.2' when creating/fetching
 */
export const nestedGlobalField = {
  global_field: {
    title: 'Nested Global Field Parent',
    uid: 'ngf_parent',
    description: 'Global field that contains another global field (nested)',
    schema: [
      {
        display_name: 'Parent Title',
        uid: 'parent_title',
        data_type: 'text',
        mandatory: true,
        field_metadata: { description: 'Title for the parent', default_value: '', version: 3 },
        multiple: false,
        unique: false
      },
      {
        display_name: 'Nested Base GF',
        uid: 'nested_base_gf',
        data_type: 'global_field',
        reference_to: 'base_gf_for_nesting',
        field_metadata: { description: 'Embedded global field' },
        multiple: false,
        mandatory: false,
        unique: false
      },
      {
        display_name: 'Additional Notes',
        uid: 'notes',
        data_type: 'text',
        mandatory: false,
        field_metadata: { description: '', multiline: true, default_value: '', version: 3 },
        multiple: false,
        unique: false
      }
    ]
  }
}

/**
 * Deeply nested global field - Multiple levels of nesting
 * Parent -> Child -> Base
 */
export const deeplyNestedGlobalField = {
  global_field: {
    title: 'Deeply Nested GF',
    uid: 'ngf_deep',
    description: 'Global field with multiple nesting levels',
    schema: [
      {
        display_name: 'Deep Title',
        uid: 'deep_title',
        data_type: 'text',
        mandatory: true,
        field_metadata: { description: '', default_value: '', version: 3 },
        multiple: false,
        unique: false
      },
      {
        display_name: 'Nested Parent GF',
        uid: 'nested_parent',
        data_type: 'global_field',
        reference_to: 'ngf_parent',
        field_metadata: { description: 'References the nested parent global field' },
        multiple: false,
        mandatory: false,
        unique: false
      }
    ]
  }
}

// Export all global fields
export default {
  seoGlobalField,
  contentBlockGlobalField,
  heroBannerGlobalField,
  cardGlobalField,
  globalFieldUpdate,
  // Nested global fields
  baseGlobalFieldForNesting,
  nestedGlobalField,
  deeplyNestedGlobalField
}
