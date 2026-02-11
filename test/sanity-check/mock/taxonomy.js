/**
 * Taxonomy Mock Data
 *
 * Based on CDA Test Stack export - adapted for comprehensive CMA SDK testing.
 * Includes taxonomy definitions and terms.
 */

// ============================================================================
// TAXONOMY DEFINITIONS
// ============================================================================

export const categoryTaxonomy = {
  taxonomy: {
    name: 'Categories',
    uid: 'categories',
    description: 'Content categories for articles and pages'
  }
}

export const regionTaxonomy = {
  taxonomy: {
    name: 'Regions',
    uid: 'regions',
    description: 'Geographic regions for content targeting'
  }
}

export const topicTaxonomy = {
  taxonomy: {
    name: 'Topics',
    uid: 'topics',
    description: 'Topic tags for content classification'
  }
}

// ============================================================================
// TAXONOMY TERMS - Categories
// ============================================================================

export const categoryTerms = {
  technology: {
    term: {
      name: 'Technology',
      uid: 'technology'
    }
  },
  technology_software: {
    term: {
      name: 'Software',
      uid: 'software',
      parent_uid: 'technology'
    }
  },
  technology_hardware: {
    term: {
      name: 'Hardware',
      uid: 'hardware',
      parent_uid: 'technology'
    }
  },
  technology_ai: {
    term: {
      name: 'Artificial Intelligence',
      uid: 'ai',
      parent_uid: 'technology'
    }
  },
  business: {
    term: {
      name: 'Business',
      uid: 'business'
    }
  },
  business_startup: {
    term: {
      name: 'Startups',
      uid: 'startup',
      parent_uid: 'business'
    }
  },
  business_enterprise: {
    term: {
      name: 'Enterprise',
      uid: 'enterprise',
      parent_uid: 'business'
    }
  },
  lifestyle: {
    term: {
      name: 'Lifestyle',
      uid: 'lifestyle'
    }
  },
  science: {
    term: {
      name: 'Science',
      uid: 'science'
    }
  }
}

// ============================================================================
// TAXONOMY TERMS - Regions
// ============================================================================

export const regionTerms = {
  north_america: {
    term: {
      name: 'North America',
      uid: 'north_america'
    }
  },
  north_america_usa: {
    term: {
      name: 'United States',
      uid: 'usa',
      parent_uid: 'north_america'
    }
  },
  north_america_canada: {
    term: {
      name: 'Canada',
      uid: 'canada',
      parent_uid: 'north_america'
    }
  },
  europe: {
    term: {
      name: 'Europe',
      uid: 'europe'
    }
  },
  europe_uk: {
    term: {
      name: 'United Kingdom',
      uid: 'uk',
      parent_uid: 'europe'
    }
  },
  europe_germany: {
    term: {
      name: 'Germany',
      uid: 'germany',
      parent_uid: 'europe'
    }
  },
  europe_france: {
    term: {
      name: 'France',
      uid: 'france',
      parent_uid: 'europe'
    }
  },
  asia_pacific: {
    term: {
      name: 'Asia Pacific',
      uid: 'asia_pacific'
    }
  },
  asia_pacific_india: {
    term: {
      name: 'India',
      uid: 'india',
      parent_uid: 'asia_pacific'
    }
  },
  asia_pacific_japan: {
    term: {
      name: 'Japan',
      uid: 'japan',
      parent_uid: 'asia_pacific'
    }
  },
  asia_pacific_australia: {
    term: {
      name: 'Australia',
      uid: 'australia',
      parent_uid: 'asia_pacific'
    }
  }
}

// ============================================================================
// TAXONOMY TERMS - Topics
// ============================================================================

export const topicTerms = {
  security: {
    term: {
      name: 'Security',
      uid: 'security'
    }
  },
  cloud: {
    term: {
      name: 'Cloud Computing',
      uid: 'cloud'
    }
  },
  devops: {
    term: {
      name: 'DevOps',
      uid: 'devops'
    }
  },
  api: {
    term: {
      name: 'APIs',
      uid: 'api'
    }
  },
  mobile: {
    term: {
      name: 'Mobile',
      uid: 'mobile'
    }
  }
}

// ============================================================================
// TERM UPDATE MOCKS
// ============================================================================

export const termUpdate = {
  term: {
    name: 'Updated Term Name'
  }
}

export const termMove = {
  term: {
    parent_uid: 'new_parent_uid',
    order: 1
  }
}

// ============================================================================
// BULK TERM OPERATIONS
// ============================================================================

export const bulkTerms = [
  { name: 'Bulk Term 1', uid: 'bulk_term_1' },
  { name: 'Bulk Term 2', uid: 'bulk_term_2' },
  { name: 'Bulk Term 3', uid: 'bulk_term_3' }
]

// ============================================================================
// ANCESTRY QUERY MOCKS
// ============================================================================

export const ancestryQuery = {
  depth: 3,
  include_count: true,
  include_children_count: true
}

// Export all
export default {
  // Taxonomies
  categoryTaxonomy,
  regionTaxonomy,
  topicTaxonomy,
  // Category Terms
  categoryTerms,
  // Region Terms
  regionTerms,
  // Topic Terms
  topicTerms,
  // Updates
  termUpdate,
  termMove,
  bulkTerms,
  ancestryQuery
}
