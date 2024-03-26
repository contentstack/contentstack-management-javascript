const requestMock = {
  organization_uid: 'org_uid',
  manifest: {
    uid: 'app_uid',
    name: 'Awesome App',
    description: '',
    icon: '',
    visibility: 'private',
    target_type: 'stack',
    organization_uid: 'org_uid',
    framework_version: '1.0',
    version: 1,
    created_by: {
      uid: 'user_uid',
      first_name: 'John',
      last_name: 'Doe'
    },
    updated_by: {
      uid: 'user_uid',
      first_name: 'John',
      last_name: 'Doe'
    },
    created_at: '2022-02-11T08:43:59.837Z',
    updated_at: '2022-02-11T08:43:59.837Z'
  },
  requested_by: {
    uid: 'user_request_uid',
    first_name: 'sample',
    last_name: 'user'
  },
  target_uid: 'target_uid',
  created_at: '2023-01-17T09:40:20.464Z',
  updated_at: '2023-01-17T09:40:20.464Z',
  uid: 'request_uid'
}
export { requestMock }
