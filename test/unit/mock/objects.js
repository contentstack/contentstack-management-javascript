import cloneDeep from 'lodash/cloneDeep'
import { singlepageCT } from '../../api/mock/content-type'
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
  content_type: 'image/png',
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

const appMock = {
  framework_version: '1.0',
  version: 1,
  icon: 'icon',
  description: 'Description of the app',
  target_type: 'stack',
  name: 'App Name',
  ui_location: {
    signed: true,
    base_url: 'base_url',
    locations: [
      {
        type: 'cs.cm.stack.config',
        meta: [
          {
            signed: true,
            path: '/config',
            name: 'Configuration'
          }
        ]
      },
      {
        type: 'cs.cm.stack.custom_field',
        meta: [
          {
            signed: true,
            path: '/custom-field',
            name: 'Field',
            data_type: 'text'
          }
        ]
      }
    ]
  },
  webhook: {
    signed: true,
    name: 'Algolia',
    enabled: true,
    target_url: 'target_url',
    channels: [
    ],
    app_lifecycle_enabled: true,
    retry_policy: 'manual'
  },
  visibility: 'private',
  organization_uid: 'org_uid',
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  uid: 'UID',
  oauth: {
    redirect_uri: 'redirect_url',
    app_token_config: {
      enabled: true,
      scopes: [
        'user:read',
        'user:write',
        'user.profile:read'
      ]
    },
    user_token_config: {
      enabled: true,
      scopes: [
        'user.profile:read'
      ]
    }
  }
}

const appsMock = {
  data: [
    { ...appMock },
    { ...appMock, name: 'App2 Name' }
  ],
  skip: 0,
  limit: 50,
  count: 2
}

const oAuthMock = {
  client_id: 'client_id',
  client_secret: 'client_secret',
  redirect_uri: 'http://localhost:5000/callback',
  app_token_config: {
    enabled: true,
    scopes: [
      'user:read',
      'user:write',
      'user.profile:read'
    ]
  },
  user_token_config: {
    enabled: true,
    scopes: [
      'user.profile:read'
    ]
  }
}

const oAuthScopesMock = {
  scopes: [
    'user:read',
    'user:write',
    'user.profile:read'
  ]
}

const appInstallMock = {
  status: 'installed',
  installation_uid: 'installationUID',
  redirect_to: 'config',
  redirect_uri: 'redirect_uri'
}

const installationMock = {
  status: 'installed',
  manifest: {
    framework_version: '1.0',
    version: 1,
    icon: '',
    description: '',
    target_type: 'stack',
    name: 'Post man test 2',
    visibility: 'private',
    created_by: {
      uid: 'user_uid',
      first_name: 'user_name',
      last_name: 'user_last_name'
    },
    updated_by: {
      uid: 'user_uid',
      first_name: 'user_name',
      last_name: 'user_last_name'
    },
    organization_uid: 'org_uid',
    created_at: 'date_time',
    updated_at: 'date_time',
    uid: 'installation_uid'
  },
  created_by: {
    uid: 'user_uid',
    first_name: 'user_name',
    last_name: 'user_last_name'
  },
  updated_by: {
    uid: 'user_uid',
    first_name: 'user_name',
    last_name: 'user_last_name'
  },
  target: {
    type: 'stack',
    uid: '{{stackUid}}'
  },
  organization_uid: 'org_uid',
  created_at: 'date_time',
  updated_at: 'date_time',
  uid: 'installation_uid'
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
}]

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

const installationConfigLocationMock = {
  uid: 'Installation_UID',
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  created_by: 'created_by_author',
  updated_by: 'updated_by_author',
  tags: [],
  ACL: [],
  _version: 1,
  title: 'App Name',
  config: {},
  type: 'stack_config_widget',
  app_installation_uid: 'app_installation_uid',
  app_uid: 'app_uid',
  signed: true,
  enable: true,
  src: 'http://localhost:3000/config'
}

const installedAppsMock = {
  app1: 'data1',
  app2: 'data2',
  app3: 'data3'
}

const installedUsersMock = {
  user1: 'data1',
  user2: 'data2',
  user3: 'data3'
}

const installedStacksMock = {
  stack1: 'data1',
  stack2: 'data2',
  stack3: 'data3'
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
  appMock,
  appsMock,
  oAuthMock,
  oAuthScopesMock,
  appInstallMock,
  installationMock,
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
  installationConfigLocationMock,
  installedAppsMock,
  installedUsersMock,
  installedStacksMock,
  auditLogItemMock,
  auditLogsMock,
  mockCollection,
  entryMockCollection,
  checkSystemFields
}
