import { expect } from 'chai'
import { describe, it, afterEach } from 'mocha'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  publish,
  unpublish,
  upload,
  create,
  query,
  update,
  deleteEntity,
  fetch,
  fetchAll
} from '../../lib/entity'

describe('Entity Tests', () => {
  const http = axios.create()
  const mock = new MockAdapter(http)
  const stackHeaders = { api_key: 'api_key' }
  const urlPath = '/test-url'
  const type = 'entry'
  const publishDetails = { title: 'Test Entry' }
  const locale = 'en-us'
  const version = 1
  const scheduledAt = '2023-10-10T10:00:00Z'
  const formData = new FormData()
  const params = { param1: 'value1' }
  const data = { data: 'test data' }
  const param = { param2: 'value2' }

  afterEach(() => {
      mock.reset()
  })

  it('should set headers correctly in publish function', async () => {
      const publishFn = publish(http, type).bind({ urlPath, stackHeaders })
      mock.onPost(`${urlPath}/publish`).reply(200, { data: 'response data' })

      const response = await publishFn({ publishDetails, locale, version, scheduledAt })
      expect(response.data).to.equal('response data')
      expect(mock.history.post[0].headers.api_key).to.equal('api_key')
  })

  it('should set headers correctly in unpublish function', async () => {
      const unpublishFn = unpublish(http, type).bind({ urlPath, stackHeaders })
      mock.onPost(`${urlPath}/unpublish`).reply(200, { data: 'response data' })

      const response = await unpublishFn({ publishDetails, locale, version, scheduledAt })
      expect(response.data).to.equal('response data')
      expect(mock.history.post[0].headers.api_key).to.equal('api_key')
  })

  it('should set headers correctly in upload function', async () => {
      mock.onPost(urlPath).reply(200, { data: 'response data' })

      const response = await upload({ http, urlPath, stackHeaders, formData, params })
      expect(response.data.data).to.equal('response data')
      expect(mock.history.post[0].headers.api_key).to.equal('api_key')
  })

//   it('should set headers correctly in create function', async () => {
//       const createFn = create({ http, params }).bind({ urlPath, stackHeaders })
//       mock.onPost(urlPath).reply(200, { data: 'response data' })

//       const response = await createFn(data, param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.post[0].headers.api_key).to.equal('api_key')
//   })

//   it('should set headers correctly in query function', () => {
//       const queryFn = query({ http, wrapperCollection: [], apiVersion: 'v3' }).bind({ urlPath, stackHeaders })
//       queryFn(params)
//       expect(mock.history.get[0].headers.api_key).to.equal('api_key')
//   })

//   it('should set headers correctly in update function', async () => {
//       const updateFn = update(http, type, params).bind({ urlPath, stackHeaders })
//       mock.onPut(urlPath).reply(200, { data: 'response data' })

//       const response = await updateFn(param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.put[0].headers.api_key).to.equal('api_key')
//   })

  it('should set headers correctly in deleteEntity function', async () => {
      const deleteFn = deleteEntity(http, false, params).bind({ urlPath, stackHeaders })
      mock.onDelete(urlPath).reply(200, { data: 'response data' })

      const response = await deleteFn(param)
      expect(response.data).to.equal('response data')
      expect(mock.history.delete[0].headers.api_key).to.equal('api_key')
  })

//   it('should set headers correctly in fetch function', async () => {
//       const fetchFn = fetch(http, type, params).bind({ urlPath, stackHeaders })
//       mock.onGet(urlPath).reply(200, { data: 'response data' })

//       const response = await fetchFn(param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.get[0].headers.api_key).to.equal('api_key')
//   })

//   it('should set headers correctly in fetchAll function', async () => {
//       const fetchAllFn = fetchAll(http, [], params).bind({ urlPath, stackHeaders })
//       mock.onGet(urlPath).reply(200, { data: 'response data' })

//       const response = await fetchAllFn(param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.get[0].headers.api_key).to.equal('api_key')
//   })

//   it('should handle api_version in create function', async () => {
//       const httpWithApiVersion = axios.create({
//         headers: {
//             api_version: 'v3'
//         }
//       })
//       const createFn = create({ http: httpWithApiVersion, params }).bind({ urlPath, stackHeaders })
//       mock.onPost(urlPath).reply(200, { data: 'response data' })

//       const response = await createFn(data, param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.post[0].headers.api_version).to.equal('v3')
//   })

//   it('should handle missing headers in create function', async () => {
//       const createFn = create({ http, params }).bind({ urlPath })
//       mock.onPost(urlPath).reply(200, { data: 'response data' })

//       const response = await createFn(data, param)
//       expect(response.data).to.equal('response data')
//       expect(mock.history.post[0].headers.api_key).to.be.undefined
//   })
})