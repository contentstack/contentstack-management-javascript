const signedUrlResponse = {
  data: {
    upload_uid: 'upload_uid',
    form_fields: [
      {
        key: 'key',
        value: 'value'
      }
    ],
    upload_url: 'upload_url',
    expires_in: 900
  }
}
const latestLiveResponse = {
  data:
        {
          created_at: '2023-01-17T10:07:13.215Z',
          deployment_number: 1,
          deployment_url: 'deployment_url',
          environment: 'environment',
          latest: true,
          preview_url: 'preview_url',
          status: 'DEPLOYED',
          uid: 'uid',
          updated_at: '2023-01-17T10:15:11.360Z'
        }

}

export {
  signedUrlResponse,
  latestLiveResponse
}
