import cloneDeep from 'lodash/cloneDeep'
import { singlepageCT } from '../../api/mock/content-type'

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
const noticeMock = {
  notice: 'Notice'
}

const systemFieldsMock = {
  created_at: 'created_at_date',
  updated_at: 'updated_at_date',
  uid: 'UID'
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

function mockCollection (mockData, type) {
  var mock = {
    ...cloneDeep(noticeMock),
    count: 1
  }
  mock[type] = [mockData]
  return mock
}

const orgMock = {
  ...cloneDeep(systemFieldsMock),
  name: 'Sample',
  plan_id: 'cms_plan',
  owner_uid: 'blt1f1cddeaefbefdd111b11111',
  expires_on: '2029-12-31T00:00:00.000Z',
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

function entryMockCollection (mockData) {
  var entryMockCollection = mockCollection(mockData, 'entries')
  entryMockCollection.schema = {
    ...cloneDeep(singlepageCT.content_type)
  }
  entryMockCollection.content_type = {
    ...cloneDeep(singlepageCT.content_type)
  }
  return entryMockCollection
}

export {
  errorMock,
  noticeMock,
  stackMock,
  userMock,
  orgMock,
  mockCollection,
  entryMockCollection
}
