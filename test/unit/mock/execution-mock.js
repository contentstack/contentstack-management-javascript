const executionLogMock = {
  uid: 'execUid',
  application_id: 'blt123a123b123b',
  channel: [
    'cs.apps.installations.63c63fff94b1f1958d9d9f1d.upgrade'
  ],
  created_at: '2023-01-18T06:33:35.563Z',
  event_data: {
    event: 'upgrade',
    module: 'app_installation',
    api_key: 'blt123a123b123b',
    data: {
      app_installation: {
        app_uid: '63c63f8e70387900126f0014',
        app_version: 14,
        organization_uid: 'blt123a123b123c',
        installation_uid: '63c63fff94b1f1958d9d9f1d',
        target: {
          type: 'stack',
          uid: 'blt123a123b123b'
        },
        created_at: '2023-01-17T06:28:15.734Z',
        created_by: 'bltb49cd2a97bdebea6aa',
        updated_at: '2023-01-18T06:03:56.688Z',
        updated_by: 'bltb49cd2a97bdebea6aa'
      }
    }
  },
  event_headers: {
    'content-type': 'application/json',
    'X-Contentstack-Request-Signature': 'v1=rIvt/2oFIFxKvuDQfawtbkaC7uV4B2VHZLdVgPcr6aQS5wnqxWlLudyun3CY1PSpyxN3+YsNlDvrMtByGBPeGKomsjYq2rXmDD59JP915f72YujQITZAH/TwEb0JUN3p/l+senKAZ7sSz77H9pOUCfzhfGJGVaooNVNwizJujgmZum68bavz9lTR7DUOYugIW3r/Jes4fEJVNha6D5pil/SKQszczAfp3z+qcMe+PTg14S83TsNZbPVJObMBf7GRJnmJ91RR6h9XKJEd8bkVqLUemzwdKikUyg09bEG2099VoxzST7aca2uDlr9W1g0Tk6QD71v9aoCq6jVvtXtIVA=='
  },
  org_uid: 'blt123a123b123c',
  request_details: [
    {
      _id: '63c792bf6f593d0019d87b02',
      retry_number: 0,
      request: {
        method: 'POST',
        followAllRedirects: true,
        uri: 'https://www.googlw.com',
        body: {
          triggered_at: '2023-01-18T06:33:35.465Z',
          event: 'upgrade',
          module: 'app_installation',
          api_key: 'blt1ca6e8665d0f3ad3',
          data: {
            app_installation: {
              app_uid: '63c63f8e70387900126f0014',
              app_version: 14,
              organization_uid: 'blt123a123b123c',
              installation_uid: '63c63fff94b1f1958d9d9f1d',
              target: {
                type: 'stack',
                uid: 'blt123a123b123b'
              },
              created_at: '2023-01-17T06:28:15.734Z',
              created_by: 'bltb49cd2a97bdebea6aa',
              updated_at: '2023-01-18T06:03:56.688Z',
              updated_by: 'bltb49cd2a97bdebea6aa'
            }
          }
        },
        headers: {
          'content-type': 'application/json',
          'X-Contentstack-Request-Signature': 'v1=rIvt/2oFIFxKvuDQfawtbkaC7uV4B2VHZLdVgPcr6aQS5wnqxWlLudyun3CY1PSpyxN3+YsNlDvrMtByGBPeGKomsjYq2rXmDD59JP915f72YujQITZAH/TwEb0JUN3p/l+senKAZ7sSz77H9pOUCfzhfGJGVaooNVNwizJujgmZum68bavz9lTR7DUOYugIW3r/Jes4fEJVNha6D5pil/SKQszczAfp3z+qcMe+PTg14S83TsNZbPVJObMBf7GRJnmJ91RR6h9XKJEd8bkVqLUemzwdKikUyg09bEG2099VoxzST7aca2uDlr9W1g0Tk6QD71v9aoCq6jVvtXtIVA=='
        },
        json: true,
        resolveWithFullResponse: true,
        timeout: 30000
      },
      response: {},
      created_at: '2023-01-18T06:33:35.563Z'
    }
  ],
  retry_count: 4,
  status: 500,
  updated_at: '2023-01-18T06:46:36.563Z',
  webhooks: [
    'cseba9e0d8-8c9b-44a8-980a-36a65dfa4e4e'
  ],
  projectUid: 'blt123a123b123b'
}

const executionLogsListMock = {
  data: [
    { ...executionLogMock }
  ],
  count: 1,
  skip: 0,
  limit: 50
}

export { executionLogMock, executionLogsListMock }
