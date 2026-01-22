/**
 * Entry Mock Data
 * 
 * Based on CDA Test Stack export - adapted for comprehensive CMA SDK testing.
 * Contains entry data for all content types with various field types populated.
 */

// ============================================================================
// SIMPLE ENTRIES
// ============================================================================

export const simpleEntry = {
  entry: {
    title: 'Simple Test Entry',
    description: 'This is a simple test entry for basic CRUD operations.'
  }
}

export const simpleEntryUpdate = {
  entry: {
    title: 'Updated Simple Entry',
    description: 'This entry has been updated with new content.'
  }
}

// ============================================================================
// MEDIUM COMPLEXITY ENTRIES - All basic field types
// ============================================================================

export const mediumEntry = {
  entry: {
    title: 'Medium Complexity Entry',
    url: '/test/medium-entry',
    summary: 'This is a multi-line summary that spans multiple lines.\n\nIt contains paragraph breaks and detailed information about the content.',
    view_count: 1250,
    is_featured: true,
    publish_date: '2024-01-15T00:00:00.000Z',
    external_link: {
      title: 'Learn More',
      href: 'https://example.com/learn-more'
    },
    status: 'published',
    categories: ['technology', 'business'],
    content_tags: ['sdk', 'testing', 'api', 'javascript']
  }
}

export const mediumEntryUpdate = {
  entry: {
    title: 'Updated Medium Entry',
    view_count: 2500,
    is_featured: false,
    status: 'archived',
    content_tags: ['sdk', 'testing', 'api', 'javascript', 'updated']
  }
}

// ============================================================================
// COMPLEX ENTRIES - Nested groups and modular blocks
// ============================================================================

export const complexEntry = {
  entry: {
    title: 'Complex Page Entry',
    url: '/complex-page-entry',
    body_html: '<h2>Welcome</h2><p>This is HTML rich text content with <strong>bold</strong> and <em>italic</em> formatting.</p>',
    content_json_rte: {
      type: 'doc',
      uid: 'doc_uid',
      attrs: {},
      children: [
        {
          type: 'p',
          attrs: {},
          uid: 'p_uid_1',
          children: [
            { text: 'This is JSON RTE content with proper structure.' }
          ]
        },
        {
          type: 'h2',
          attrs: {},
          uid: 'h2_uid',
          children: [
            { text: 'Heading Level 2' }
          ]
        },
        {
          type: 'p',
          attrs: {},
          uid: 'p_uid_2',
          children: [
            { text: 'More paragraph content with ' },
            { text: 'bold text', bold: true },
            { text: ' and ' },
            { text: 'italic text', italic: true },
            { text: '.' }
          ]
        }
      ]
    },
    seo: {
      meta_title: 'Complex Page - SEO Title',
      meta_description: 'This is the meta description for the complex page entry. It should be between 150-160 characters for optimal SEO.',
      canonical: 'https://example.com/complex-page-entry'
    },
    links: [
      {
        link: { title: 'Primary Link', href: '/primary' },
        appearance: 'primary',
        new_tab: false
      },
      {
        link: { title: 'Secondary Link', href: '/secondary' },
        appearance: 'secondary',
        new_tab: true
      },
      {
        link: { title: 'External Link', href: 'https://external.com' },
        appearance: 'default',
        new_tab: true
      }
    ],
    sections: [
      {
        hero_section: {
          headline: 'Welcome to Our Platform',
          subheadline: 'Discover amazing features and capabilities that will transform your workflow.',
          cta_link: { title: 'Get Started', href: '/get-started' }
        }
      },
      {
        content_block: {
          title: 'Our Features',
          content: {
            type: 'doc',
            uid: 'feature_doc',
            attrs: {},
            children: [
              {
                type: 'p',
                attrs: {},
                uid: 'feature_p',
                children: [
                  { text: 'Explore our comprehensive set of features designed for modern teams.' }
                ]
              }
            ]
          },
          layout: 'two_column'
        }
      },
      {
        card_grid: {
          grid_title: 'Featured Products',
          columns: '3',
          cards: [
            {
              card_title: 'Product One',
              card_description: 'Description for product one with key features.',
              card_link: { title: 'Learn More', href: '/products/one' }
            },
            {
              card_title: 'Product Two',
              card_description: 'Description for product two with benefits.',
              card_link: { title: 'Learn More', href: '/products/two' }
            },
            {
              card_title: 'Product Three',
              card_description: 'Description for product three with details.',
              card_link: { title: 'Learn More', href: '/products/three' }
            }
          ]
        }
      },
      {
        accordion: {
          items: [
            {
              question: 'What is this platform?',
              answer: {
                type: 'doc',
                uid: 'faq_1',
                attrs: {},
                children: [
                  {
                    type: 'p',
                    attrs: {},
                    uid: 'faq_1_p',
                    children: [
                      { text: 'This platform is a comprehensive solution for content management.' }
                    ]
                  }
                ]
              }
            },
            {
              question: 'How do I get started?',
              answer: {
                type: 'doc',
                uid: 'faq_2',
                attrs: {},
                children: [
                  {
                    type: 'p',
                    attrs: {},
                    uid: 'faq_2_p',
                    children: [
                      { text: 'Sign up for an account and follow our quick start guide.' }
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}

// ============================================================================
// AUTHOR ENTRIES - For reference testing
// ============================================================================

export const authorEntry = {
  entry: {
    title: 'John Doe',
    url: '/authors/john-doe',
    email: 'john.doe@example.com',
    job_title: 'Senior Developer',
    bio: 'John is a seasoned developer with over 10 years of experience in building scalable applications. He specializes in JavaScript, TypeScript, and cloud technologies.',
    social_links: [
      {
        platform: 'twitter',
        profile_url: { title: '@johndoe', href: 'https://twitter.com/johndoe' }
      },
      {
        platform: 'linkedin',
        profile_url: { title: 'John Doe', href: 'https://linkedin.com/in/johndoe' }
      },
      {
        platform: 'github',
        profile_url: { title: 'johndoe', href: 'https://github.com/johndoe' }
      }
    ]
  }
}

export const authorEntrySecond = {
  entry: {
    title: 'Jane Smith',
    url: '/authors/jane-smith',
    email: 'jane.smith@example.com',
    job_title: 'Technical Writer',
    bio: 'Jane is a technical writer who excels at making complex topics accessible to all readers.',
    social_links: [
      {
        platform: 'linkedin',
        profile_url: { title: 'Jane Smith', href: 'https://linkedin.com/in/janesmith' }
      }
    ]
  }
}

// ============================================================================
// ARTICLE ENTRIES - With references and taxonomy
// ============================================================================

export const articleEntry = {
  entry: {
    title: 'Getting Started with the SDK',
    url: '/articles/getting-started-sdk',
    publish_date: '2024-01-20T00:00:00.000Z',
    excerpt: 'Learn how to integrate our SDK into your application with this comprehensive guide covering installation, configuration, and basic usage patterns.',
    content: {
      type: 'doc',
      uid: 'article_content',
      attrs: {},
      children: [
        {
          type: 'h2',
          attrs: {},
          uid: 'intro_h2',
          children: [{ text: 'Introduction' }]
        },
        {
          type: 'p',
          attrs: {},
          uid: 'intro_p',
          children: [{ text: 'Welcome to our comprehensive SDK guide. In this article, we will cover everything you need to know to get started.' }]
        },
        {
          type: 'h2',
          attrs: {},
          uid: 'install_h2',
          children: [{ text: 'Installation' }]
        },
        {
          type: 'p',
          attrs: {},
          uid: 'install_p',
          children: [
            { text: 'Install the SDK using npm: ' },
            { text: 'npm install @contentstack/management', code: true }
          ]
        }
      ]
    },
    is_featured: true,
    is_published: true,
    content_tags: ['sdk', 'tutorial', 'getting-started', 'javascript']
  }
}

export const articleEntryWithReferences = {
  entry: {
    title: 'Advanced SDK Patterns',
    url: '/articles/advanced-sdk-patterns',
    publish_date: '2024-02-15T00:00:00.000Z',
    excerpt: 'Deep dive into advanced patterns and best practices for SDK integration.',
    content: {
      type: 'doc',
      uid: 'advanced_content',
      attrs: {},
      children: [
        {
          type: 'p',
          attrs: {},
          uid: 'advanced_p',
          children: [{ text: 'This article covers advanced patterns for experienced developers.' }]
        }
      ]
    },
    // Reference will be set dynamically in tests
    // author: [{ uid: 'author_uid', _content_type_uid: 'author' }],
    // related_articles: [{ uid: 'article_uid', _content_type_uid: 'article' }],
    is_featured: false,
    is_published: true,
    content_tags: ['sdk', 'advanced', 'patterns']
  }
}

// ============================================================================
// SINGLETON ENTRY
// ============================================================================

export const siteSettingsEntry = {
  entry: {
    title: 'My Test Site',
    footer_text: '© 2024 My Test Site. All rights reserved.\n\nBuilt with Contentstack.',
    analytics_id: 'GA-123456789'
  }
}

// ============================================================================
// ATOMIC OPERATION ENTRIES
// ============================================================================

export const atomicPushEntry = {
  entry: {
    content_tags: {
      PUSH: {
        data: ['new-tag-1', 'new-tag-2']
      }
    }
  }
}

export const atomicPullEntry = {
  entry: {
    content_tags: {
      PULL: {
        data: ['tag-to-remove']
      }
    }
  }
}

export const atomicUpdateEntry = {
  entry: {
    content_tags: {
      UPDATE: {
        index: 0,
        data: 'replaced-tag'
      }
    }
  }
}

export const atomicAddSubtract = {
  entry: {
    view_count: {
      ADD: 100
    }
  }
}

// ============================================================================
// LOCALIZED ENTRIES
// ============================================================================

export const localizedEntryEnUs = {
  entry: {
    title: 'Localized Entry - English',
    description: 'This is the English version of the content.'
  }
}

export const localizedEntryFrFr = {
  entry: {
    title: 'Entrée localisée - Français',
    description: 'Ceci est la version française du contenu.'
  }
}

// ============================================================================
// PUBLISH/UNPUBLISH CONFIGURATIONS
// ============================================================================

export const publishConfig = {
  entry: {
    environments: ['development', 'staging'],
    locales: ['en-us']
  }
}

export const publishConfigMultiLocale = {
  entry: {
    environments: ['development'],
    locales: ['en-us', 'fr-fr']
  }
}

export const unpublishConfig = {
  entry: {
    environments: ['development'],
    locales: ['en-us']
  }
}

export const schedulePublishConfig = {
  entry: {
    environments: ['production'],
    locales: ['en-us'],
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  }
}

// ============================================================================
// VERSION OPERATIONS
// ============================================================================

export const versionNameConfig = {
  _version_name: 'Production Release v1.0'
}

// Export all
export default {
  // Simple
  simpleEntry,
  simpleEntryUpdate,
  // Medium
  mediumEntry,
  mediumEntryUpdate,
  // Complex
  complexEntry,
  // Author
  authorEntry,
  authorEntrySecond,
  // Article
  articleEntry,
  articleEntryWithReferences,
  // Singleton
  siteSettingsEntry,
  // Atomic
  atomicPushEntry,
  atomicPullEntry,
  atomicUpdateEntry,
  atomicAddSubtract,
  // Localized
  localizedEntryEnUs,
  localizedEntryFrFr,
  // Publish
  publishConfig,
  publishConfigMultiLocale,
  unpublishConfig,
  schedulePublishConfig,
  // Version
  versionNameConfig
}
