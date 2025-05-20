import cloneDeep from 'lodash/cloneDeep'
import { singlepageCT } from '../../sanity-check/mock/content-type'
import { expect } from 'chai'

const errorMock = {
  config: {
    url: 'requesturl',
    headers: {}
  },
  data: {},
  response: {
    status: 404,
    statusText: 'Not Found'
  }
}

const stackHeadersMock = {
  api_key: 'api_key'
}

const variantBaseEntryMock = {
  api_key: 'api_key',
  'x-cs-variant-uid': 'test_uid'
}

const noticeMock = {
  notice: 'Notice'
}

const systemUidMock = {
  uid: 'UID'
}

const systemFieldsMock = {
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  ...systemUidMock
}

const systemFieldsUserMock = {
  created_by: 'created_by_date',
  updated_by: 'updated_by_date'
}

const stackMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'Stack',
  description: 'stack',
  org_uid: 'orgUID',
  api_key: 'stack_api_key',
  master_locale: 'en-us',
  is_asset_download_public: true,
  owner_uid: 'ownerUID',
  user_uids: [],
  collaborators: [
    {
      ...cloneDeep(systemFieldsMock),
      email: 'EMAIL',
      plan_id: [
        'cms_plan'
      ],
      org_uid: [
        'orgUID'
      ],
      roles: [
        {}
      ]
    }
  ],
  SYS_ACL: {
    roles: [
      {
        uid: 'uid',
        sub_acl: {},
        invite: true
      }
    ],
    others: {
      sub_acl: {
        delete: false,
        update: false,
        read: false,
        create: false
      },
      invite: false
    }
  },
  stack_variables: {
    description: 'stack'
  }
}

const orgOwnerMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'name',
  plan_id: 'plan_id',
  owner_uid: 'owner_uid',
  expires_on: 'expires_on',
  enabled: true,
  is_over_usage_allowed: true,
  owner: true
}

const orgISOwnerMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'name',
  plan_id: 'plan_id',
  owner_uid: 'owner_uid',
  expires_on: 'expires_on',
  enabled: true,
  is_over_usage_allowed: true,
  is_owner: true
}

const orgMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'name',
  plan_id: 'plan_id',
  owner_uid: 'owner_uid',
  expires_on: 'expires_on',
  enabled: true,
  is_over_usage_allowed: true
}

const userMock = {
  ...cloneDeep(systemFieldsMock),
  email: 'sample@email.com',
  username: 'UserName',
  first_name: 'first_name',
  last_name: 'last_name',
  company: 'company',
  mobile_number: 'mobile_number',
  country_code: 'country_code',
  tfa_status: 'verified'
}

const adminRoleMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'Admin',
  description: 'Admin Role',
  org_uid: 'org_uid',
  admin: true,
  default: true,
  users: [
    'user_uid'
  ]
}

const roleMock = {
  ...adminRoleMock,
  admin: false
}

const roleMockWithTaxonomy = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Admin',
  description: 'Admin Role',
  rules: [
    {
      module: 'branch',
      branches: [
        'main'
      ],
      acl: {
        read: true
      }
    },
    {
      module: 'environment',
      environments: ['env_uid1', 'env_uid2'],
      acl: {
        read: true
      }
    },
    {
      module: 'locale',
      locales: ['locales'],
      acl: {
        read: true
      }
    },
    {
      module: 'taxonomy',
      taxonomies: ['taxonomy_1'],
      terms: ['taxonomy_1.term_1'],
      content_types: [
        {
          uid: '$all',
          acl: {
            read: true,
            sub_acl: {
              read: true,
              create: true,
              update: true,
              delete: true,
              publish: true
            }
          }
        }
      ],
      acl: {
        read: true,
        sub_acl: {
          read: true,
          create: true,
          update: true,
          delete: true,
          publish: true
        }
      }
    },
    {
      module: 'content_type',
      content_types: ['ct_1'],
      acl: {
        read: true,
        sub_acl: {
          read: true,
          create: true,
          update: true,
          delete: true,
          publish: true
        }
      }
    }
  ],
  org_uid: 'org_uid',
  api_key: 'api_key',
  admin: false,
  default: true,
  users: [
    'user_uid'
  ]
}

const branchMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  alias: [],
  description: '',
  source: 'master'
}

const branchAliasMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  alias: [
    {
      uid: 'master'
    }
  ],
  source: ''
}

const folderMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  content_type: 'application/vnd.contenstack.folder',
  tags: [],
  name: 'Demo Folder',
  ACL: {},
  is_dir: true,
  parent_uid: 'parent_uid',
  _version: 1
}

const extensionMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
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

const releaseItemMock = {
  version: 1,
  uid: 'entry_or_asset_uid',
  content_type_uid: 'your_content_type_uid',
  action: 'publish',
  locale: 'en-us'
}

const releaseMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Name',
  description: 'Description',
  locked: false,
  archived: false,
  items: [
    releaseItemMock
  ],
  items_count: 1
}

const assetMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  content_type: 'text/html',
  file_size: '42670',
  tags: [],
  filename: 'file.png',
  url: 'url',
  ACL: {},
  is_dir: false,
  parent_uid: 'parent_uid',
  _version: 1,
  title: 'file.png'
}

const webhookMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Test',
  retry_policy: 'manual',
  channels: [
    'assets.create'
  ],
  destinations: [
    {
      custom_header: [
        {
          header_name: '',
          value: '',
          _id: '_id'
        }
      ],
      http_basic_password: '',
      http_basic_auth: '',
      target_url: 'https://localhost'
    }
  ]
}

const workflowMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  ...stackHeadersMock,
  name: 'TEST workflow',
  description: 'Workflow description',
  org_uid: 'orgUID',
  content_types: [
    'author',
    'article'
  ],
  enabled: true,
  admin_users: {
    users: [],
    roles: [
      ''
    ]
  }
}

const publishRulesMock = {
  ...systemFieldsMock,
  locale: 'en-us',
  action: 'publish',
  environment: 'env',
  workflow_stage: 'stage'
}

const contentTypeMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  options:
  {
    is_page: true,
    singleton: false,
    title: 'title',
    sub_title: [],
    url_pattern: '/:title'
  },
  title: 'title',
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
}

const globalFieldMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  title: 'title',
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
}

const nestedGlobalFieldMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  title: 'title',
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
}

const nestedGlobalFieldPayload = {
  global_field: {
    title: 'Nested Global Field 12345',
    uid: 'nested_global_field_12345',
    description: '',
    schema: [
      {
        data_type: 'text',
        display_name: 'Single Line Textbox',
        uid: 'single_line',
        field_metadata: {
          description: '',
          default_value: '',
          version: 3
        },
        format: '',
        error_messages: {
          format: ''
        },
        mandatory: false,
        multiple: false,
        non_localizable: false,
        unique: false
      },
      {
        data_type: 'global_field',
        display_name: 'Global',
        reference_to: 'nested_global_field1234',
        field_metadata: {
          description: ''
        },
        uid: 'global_field',
        mandatory: false,
        multiple: false,
        non_localizable: false,
        unique: false
      }
    ],
    global_field_refs: [
      {
        uid: 'nested_global_field_1234',
        occurrence_count: 3,
        isChild: true,
        paths: [
          'schema.1',
          'schema.3.schema.4',
          'schema.4.blocks.0.schema.2'
        ]
      },
      {
        uid: 'nested_global_field_123',
        occurrence_count: 1,
        isChild: false
      }
    ]
  }
}

const entryMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  title: 'title',
  url: '/url',
  locale: 'en-us',
  ACL: {},
  _version: 1,
  _in_progress: false,
  _rules: []
}

const variantsEntriesMock = {
  title: 'title',
  url: '/url',
  author: 'Kurt Tank',
  created_by: 'created_by',
  updated_by: 'updated_by',
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  uid: 'UID',
  locale: 'en-us',
  _version: 1,
  _in_progress: false,
  _variant: {
    uid: '_variant_uid',
    variant_id: 'variant_id',
    customized_fields: ['title', 'author'],
    base_entry_version: 1
  }
}

const variantsUpdateEntryMock = {
  title: 'title',
  url: '/url',
  uid: 'UID',
  locale: 'en-us',
  _version: 1,
  _in_progress: false,
  _variant: {
    customized_fields: ['title', 'url']
  },
  created_at: 'created_at_date',
  updated_at: 'updated_at_date'
}

const variantsEntryMock = {
  title: 'title',
  url: '/url',
  locale: 'en-us',
  uid: 'UID',
  _version: 1,
  _in_progress: false,
  created_by: 'created_by_uid',
  updated_by: 'updated_by_uid',
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  _variant: {
    uid: '_variant_uid',
    variant_id: 'variant_id',
    customized_fields: ['title'],
    base_entry_version: 10
  }
}

const labelMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'name',
  parent: [],
  ACL: [],
  _version: 1,
  content_types: [
    'bank',
    'brand',
    'category',
    'for_synchronization_calls'
  ]
}

const variantsMock1 = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'name'
}

const environmentMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  deploy_content: true,
  servers: [
    {
      name: 'Server1'
    },
    {
      name: 'Server2'
    }
  ],
  urls: [
    {
      url: 'http://localhost.com',
      locale: 'en-us'
    }
  ],
  name: 'name',
  ACL: [],
  _version: 1
}

const localeMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  code: 'zh-cn',
  name: 'Chinese - China',
  _version: 1,
  fallback_locale: 'en-us'
}

const deliveryTokenMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Test',
  scope: [{
    environments: [environmentMock],
    module: 'environment',
    acl: {
      read: true
    }
  }],
  description: 'description',
  token: 'token',
  type: 'delivery'
}

const managementTokenMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Test',
  scope: [{
    environments: [environmentMock],
    module: 'environment',
    acl: {
      read: true
    }
  }],
  description: 'description',
  token: 'token',
  type: 'management'
}

const userAssignments = {
  ...stackHeadersMock,
  content_type: 'CT_UID',
  entry_uid: 'ETR_UID',
  locale: 'en-us',
  org_uid: 'orgUID',
  type: 'workflow_stage',
  entry_locale: 'en-us',
  version: 1,
  assigned_to: [
    'user_UID'
  ],
  assigned_at: 'assign_date',
  assigned_by: 'assign_by',
  due_date: 'due_date',
  job: {
    org: 'sample_org',
    stack: 'demo',
    content_type: 'CT_JOB',
    entry: 'ERT_JOB',
    locale: 'English - United States',
    workflow_stage: {
      uid: 'review',
      title: 'Review',
      color: 'red'
    }
  }
}

const globalFieldDiff = [{
  uid: 'global_field_uid',
  title: 'Global Field Title',
  type: 'global_field',
  status: 'base_only'
}]

const contentTypeDiff = [{
  uid: 'content_type_uid_1',
  title: 'Content Type 1 Title',
  type: 'content_type',
  status: 'compare_only'
  },
  {
    uid: 'content_type_uid_2',
    title: 'Content Type 2 Title',
    type: 'content_type',
    status: 'modified'
  }
]

const branchCompareAllMock = {
  branches: {
    base_branch: 'UID',
    compare_branch: 'dev'
  },
  diff: [...globalFieldDiff, ...contentTypeDiff],
  next_url: 'https://api.contentstack.io/v3/stacks/branches/compare?base_branch=main&compare_branch=dev&skip=0&limit=100'
}

const branchCompareContentTypeMock = {
  branches: {
    base_branch: 'UID',
    compare_branch: 'dev'
  },
  diff: [...contentTypeDiff],
  next_url: 'https://api.contentstack.io/v3/stacks/branches/compare?base_branch=main&compare_branch=dev&skip=0&limit=100'
}

const branchCompareGlobalFieldMock = {
  branches: {
    base_branch: 'UID',
    compare_branch: 'dev'
  },
  diff: [...globalFieldDiff],
  next_url: 'https://api.contentstack.io/v3/stacks/branches/compare?base_branch=main&compare_branch=dev&skip=0&limit=100'
}

const branchMergeAllMock = {
  uid: 'UID',
  stack: 'stack_uid',
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  created_by: 'created_by_user_uid',
  updated_by: 'updated_by_user_uid',
  merge_details: {
    base_branch: 'main',
    compare_branch: 'dev',
    status: 'in_progress'
  },
  merged_at: null,
  errors: [
    {
      code: 'error_code',
      message: 'Error message'
    }
  ]
}

const branchMergeQueueFetchMock = {
  ...branchMergeAllMock
}

const branchMergeQueueFindMock = {
  queue: [
    { ...branchMergeQueueFetchMock }
  ]
}

const auditLogItemMock = {
  logs: {
    uid: 'UID',
    stack: 'stack_uid',
    created_at: 'created_at_date',
    created_by: 'created_by_author',
    module: 'environment',
    event_type: 'create',
    request_id: '86352',
    metadata: {
      title: 'production',
      uid: 'uid'
    },
    remote_addr: '202.179.94.0',
    request: {
      r: '0.5090218519397551',
      environment: {
        deploy_content: false,
        servers: [],
        urls: [
          {
            url: '',
            locale: 'en-us'
          }
        ],
        name: 'production',
        color: '#01977c'
      }
    },
    response: {
      notice: 'Environment created successfully.',
      environment: {
        deploy_content: false,
        servers: [],
        urls: [
          {
            url: '',
            locale: 'en-us'
          }
        ],
        name: 'production',
        uid: 'UID',
        created_by: 'created_by_author',
        updated_by: 'updated_by_author',
        created_at: 'created_at_date',
        updated_at: 'updated_at_date',
        ACL: {},
        _version: 1,
        isEnvironment: true
      }
    }
  }
}

const auditLogsMock = {
  logs: [
    { ...auditLogItemMock.logs }
  ]
}

const taxonomyImportMock = {
  uid: 'UID',
  name: 'name',
  description: 'test'
}

const taxonomyMock = {
  uid: 'UID',
  name: 'name',
  description: 'Description for Taxonomy',
  terms_count: 4,
  referenced_terms_count: 3,
  referenced_entries_count: 6
}

const termsMock = {
  taxonomy_uid: 'taxonomy_uid',
  uid: 'UID',
  name: 'name',
  parent_uid: 'term_2',
  depth: 2,
  children_count: 2,
  referenced_entries_count: 2,
  ancestors: [{
    uid: 'term_1',
    name: 'Term 1',
    parent_uid: null,
    depth: 1,
    children_count: 3,
    referenced_entries_count: 3
  },
  {
    uid: 'term_2',
    name: 'Term 2',
    parent_uid: 'term_1',
    depth: 2,
    children_count: 2,
    referenced_entries_count: 2
  }],
  descendants: [{
    uid: 'term_4',
    name: 'Term 4',
    parent_uid: 'term_3',
    depth: 3,
    children_count: 1,
    referenced_entries_count: 2
  },
  {
    uid: 'term_5',
    name: 'Term 5',
    parent_uid: 'term_4',
    depth: 4,
    children_count: 0,
    referenced_entries_count: 4
  }]
}

const teamsMock = {
  uid: 'UID',
  name: 'name',
  organizationUid: 'organization_uid',
  users: [],
  stackRoleMapping: [],
  organizationRole: 'organizationRole'
}

const teamUsersMock = {
  users: ['user1', 'user2', 'UID'],
  addUser: {
    userId: 'UID'
  }
}

const variantGroupMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Test',
  source: 'Personalize',
  content_types: [
    'iphone_product_page'
  ]
}

const variantMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  name: 'Test'
}

const variantsMock = {
  uid: 'variant_group_1',
  name: 'Variant Group 1',
  content_types: [
    'CTSTAET123'
  ],
  personalize_metadata: {
    experience_uid: 'variant_group_ex_uid',
    experience_short_uid: 'variant_group_short_uid',
    project_uid: 'variant_group_project_uid'
  },
  variants: [ // variants inside the group
    {
      uid: 'UID',
      created_by: 'user_id',
      updated_by: 'user_id',
      name: 'Test',
      personalize_metadata: {
        experience_uid: 'exp1',
        experience_short_uid: 'expShortUid1',
        project_uid: 'project_uid1',
        variant_short_uid: 'variantShort_uid1'
      },
      created_at: 'created_at_date',
      updated_at: 'updated_at_date'
    }
  ],
  count: 1
}

const variantGroupsMock = {
  count: 2,
  variant_groups: [
    {
      ...systemFieldsMock,
      ...systemFieldsUserMock,
      name: 'Test',
      source: 'Personalize',
      content_types: [
        'iphone_product_page'
      ],
      variant_count: 1,
      variants: [
        {
          ...systemFieldsMock,
          ...systemFieldsUserMock,
          name: 'Test'
        }
      ]
    },
    {
      name: 'Test',
      source: 'Personalize',
      ...systemFieldsMock,
      ...systemFieldsUserMock,
      content_types: [
        'iphone_prod_desc'
      ],
      variant_count: 1,
      variants: [
        {
          ...systemFieldsMock,
          ...systemFieldsUserMock,
          name: 'Test'
        }
      ]
    }
  ],
  ungrouped_variants: [
    {
      created_by: 'blt6cdf4e0b02b1c446',
      updated_by: 'blt303b74fa96e1082a',
      created_at: '2022-10-26T06:52:20.073Z',
      updated_at: '2023-09-25T04:55:56.549Z',
      uid: 'iphone_color_red',
      name: 'Red'
    }
  ],
  ungrouped_variant_count: 1
}

const stackRoleMappingMock = {
  stackRoleMappings: [
    {
      stackApiKey: 'stackApiKey',
      roles: [
        'roles_uid'
      ]
    }
  ]
}

const varinatsEntryMock = {
  ...systemFieldsMock,
  ...systemFieldsUserMock,
  title: 'title',
  url: '/url',
  locale: 'en-us',
  content_type_uid: 'content_type_uid',
  stackHeaders: {},
  ACL: {},
  _version: 1,
  _in_progress: false,
  _rules: [],
  _variant: {
    _uid: 'variant uid',
    _instance_uid: 'entry_variant uid',
    _change_set: [],
    _base_entry_version: 'version number of base entry'
  }
}

const variantEntryVersion = {
  versions: [
    {
      _version: 3,
      locale: 'en-us'
    },
    {
      _version: 2,
      locale: 'en-us'
    },
    {
      _version: 1,
      locale: 'en-us'
    }
  ]
}

function mockCollection (mockData, type) {
  const mock = {
    ...cloneDeep(noticeMock),
    count: 1
  }
  mock[type] = [mockData]
  return mock
}

function entryMockCollection (mockData) {
  const entryMockCll = mockCollection(mockData, 'entries')
  entryMockCll.schema = {
    ...cloneDeep(singlepageCT.content_type)
  }
  entryMockCll.content_type = {
    ...cloneDeep(singlepageCT.content_type)
  }
  return entryMockCll
}

function checkSystemFields (object) {
  expect(object.created_at).to.be.equal(systemFieldsMock.created_at)
  expect(object.uid).to.be.equal(systemFieldsMock.uid)
  expect(object.updated_at).to.be.equal(systemFieldsMock.updated_at)
}

export {
  errorMock,
  noticeMock,
  stackMock,
  userMock,
  orgMock,
  orgOwnerMock,
  orgISOwnerMock,
  adminRoleMock,
  roleMock,
  branchMock,
  branchAliasMock,
  systemUidMock,
  stackHeadersMock,
  folderMock,
  extensionMock,
  releaseMock,
  releaseItemMock,
  assetMock,
  webhookMock,
  workflowMock,
  publishRulesMock,
  contentTypeMock,
  globalFieldMock,
  entryMock,
  labelMock,
  environmentMock,
  localeMock,
  deliveryTokenMock,
  userAssignments,
  branchCompareAllMock,
  branchCompareContentTypeMock,
  branchCompareGlobalFieldMock,
  branchMergeAllMock,
  branchMergeQueueFindMock,
  branchMergeQueueFetchMock,
  auditLogsMock,
  auditLogItemMock,
  taxonomyMock,
  taxonomyImportMock,
  termsMock,
  teamsMock,
  teamUsersMock,
  stackRoleMappingMock,
  mockCollection,
  entryMockCollection,
  checkSystemFields,
  managementTokenMock,
  variantGroupMock,
  variantGroupsMock,
  variantMock,
  variantsMock,
  variantsMock1,
  variantsEntryMock,
  variantsEntriesMock,
  variantsUpdateEntryMock,
  variantBaseEntryMock,
  roleMockWithTaxonomy,
  varinatsEntryMock,
  variantEntryVersion,
  nestedGlobalFieldMock,
  nestedGlobalFieldPayload
}
