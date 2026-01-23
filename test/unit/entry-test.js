import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { Entry, EntryCollection, createFormData } from '../../lib/stack/contentType/entry'
import { cleanAssets } from '../../lib/entity'
import { systemUidMock, stackHeadersMock, entryMock, noticeMock, checkSystemFields, variantBaseEntryMock } from './mock/objects'

describe('Contentstack Entry test', () => {
  it('Entry test without uid', done => {
    const entry = makeEntry()
    expect(entry.urlPath).to.be.equal('/content_types/content_type_uid/entries')
    expect(entry.stackHeaders).to.be.equal(undefined)
    expect(entry.update).to.be.equal(undefined)
    expect(entry.delete).to.be.equal(undefined)
    expect(entry.fetch).to.be.equal(undefined)
    expect(entry.publish).to.be.equal(undefined)
    expect(entry.unpublish).to.be.equal(undefined)
    expect(entry.create).to.not.equal(undefined)
    expect(entry.query).to.not.equal(undefined)
    done()
  })

  it('Entry test with uid', done => {
    const entry = makeEntry({
      entry: {
        ...systemUidMock
      }
    })
    expect(entry.urlPath).to.be.equal(`/content_types/content_type_uid/entries/${systemUidMock.uid}`)
    expect(entry.stackHeaders).to.be.equal(undefined)
    expect(entry.update).to.not.equal(undefined)
    expect(entry.delete).to.not.equal(undefined)
    expect(entry.fetch).to.not.equal(undefined)
    expect(entry.publish).to.not.equal(undefined)
    expect(entry.unpublish).to.not.equal(undefined)
    expect(entry.create).to.be.equal(undefined)
    expect(entry.query).to.be.equal(undefined)
    done()
  })

  it('Entry test with Stack Headers', done => {
    const entry = makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
    expect(entry.urlPath).to.be.equal(`/content_types/content_type_uid/entries/${systemUidMock.uid}`)
    expect(entry.stackHeaders).to.not.equal(undefined)
    expect(entry.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(entry.update).to.not.equal(undefined)
    expect(entry.delete).to.not.equal(undefined)
    expect(entry.fetch).to.not.equal(undefined)
    expect(entry.publish).to.not.equal(undefined)
    expect(entry.unpublish).to.not.equal(undefined)
    expect(entry.create).to.be.equal(undefined)
    expect(entry.query).to.be.equal(undefined)
    done()
  })

  it('Entry Collection test with blank data', done => {
    const entries = new EntryCollection(Axios, {})
    expect(entries.length).to.be.equal(0)
    done()
  })

  it('Entry Collection test with data', done => {
    const entries = new EntryCollection(Axios, {
      entries: [
        entryMock
      ]
    })
    expect(entries.length).to.be.equal(1)
    checkEntry(entries[0])
    done()
  })

  it('Entry create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries').reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry()
      .create()
      .then((role) => {
        checkEntry(role)
        done()
      })
      .catch(done)
  })

  it('Entry Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries').reply(200, {
      entries: [
        entryMock
      ]
    })
    makeEntry()
      .query()
      .find()
      .then((entry) => {
        checkEntry(entry.items[0])
        done()
      })
      .catch(done)
  })

  it('Entry Query test with asset_fields parameter - single value', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries', (config) => {
      // Check if asset_fields parameter is present in the request
      const assetFields = config.params && (config.params['asset_fields[]'] || config.params.asset_fields)
      if (Array.isArray(assetFields)) {
        return assetFields.includes('user_defined_fields')
      }
      // Also check URL if params are serialized
      if (config.url && config.url.includes('asset_fields')) {
        return config.url.includes('user_defined_fields')
      }
      return false
    }).reply(200, {
      entries: [
        entryMock
      ]
    })
    makeEntry()
      .query({ asset_fields: ['user_defined_fields'] })
      .find()
      .then((entry) => {
        checkEntry(entry.items[0])
        done()
      })
      .catch(done)
  })

  it('Entry Query test with asset_fields parameter - multiple values', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries', (config) => {
      // Check if asset_fields parameter is present in the request
      const assetFields = config.params && (config.params['asset_fields[]'] || config.params.asset_fields)
      if (Array.isArray(assetFields)) {
        return assetFields.includes('user_defined_fields') &&
               assetFields.includes('embedded') &&
               assetFields.includes('ai_suggested') &&
               assetFields.includes('visual_markups')
      }
      // Also check URL if params are serialized
      if (config.url && config.url.includes('asset_fields')) {
        return config.url.includes('user_defined_fields') &&
               config.url.includes('embedded') &&
               config.url.includes('ai_suggested') &&
               config.url.includes('visual_markups')
      }
      return false
    }).reply(200, {
      entries: [
        entryMock
      ]
    })
    makeEntry()
      .query({ asset_fields: ['user_defined_fields', 'embedded', 'ai_suggested', 'visual_markups'] })
      .find()
      .then((entry) => {
        checkEntry(entry.items[0])
        done()
      })
      .catch(done)
  })

  it('Entry Query test with asset_fields parameter combined with other query params', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries', (config) => {
      // Check if asset_fields parameter is present in the request
      const assetFields = config.params && (config.params['asset_fields[]'] || config.params.asset_fields)
      const hasAssetFields = Array.isArray(assetFields) 
        ? (assetFields.includes('user_defined_fields') && assetFields.includes('embedded'))
        : (config.url && config.url.includes('asset_fields') && config.url.includes('user_defined_fields') && config.url.includes('embedded'))
      return hasAssetFields && config.params && config.params.include_count === true
    }).reply(200, {
      entries: [
        entryMock
      ],
      count: 1
    })
    makeEntry()
      .query({ 
        asset_fields: ['user_defined_fields', 'embedded'],
        include_count: true
      })
      .find()
      .then((entry) => {
        checkEntry(entry.items[0])
        expect(entry.count).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('Entry update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/content_types/content_type_uid/entries/UID').reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries/UID').reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry fetch test with asset_fields parameter - single value', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries/UID', (config) => {
      // Check if asset_fields parameter is present in the request
      const assetFields = config.params && (config.params['asset_fields[]'] || config.params.asset_fields)
      if (Array.isArray(assetFields)) {
        return assetFields.includes('user_defined_fields')
      }
      // Also check URL if params are serialized
      if (config.url && config.url.includes('asset_fields')) {
        return config.url.includes('user_defined_fields')
      }
      return false
    }).reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch({ asset_fields: ['user_defined_fields'] })
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry fetch test with asset_fields parameter - multiple values', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries/UID', (config) => {
      // Check if asset_fields parameter is present in the request
      const assetFields = config.params && (config.params['asset_fields[]'] || config.params.asset_fields)
      if (Array.isArray(assetFields)) {
        return assetFields.includes('user_defined_fields') &&
               assetFields.includes('embedded') &&
               assetFields.includes('ai_suggested') &&
               assetFields.includes('visual_markups')
      }
      // Also check URL if params are serialized
      if (config.url && config.url.includes('asset_fields')) {
        return config.url.includes('user_defined_fields') &&
               config.url.includes('embedded') &&
               config.url.includes('ai_suggested') &&
               config.url.includes('visual_markups')
      }
      return false
    }).reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch({ asset_fields: ['user_defined_fields', 'embedded', 'ai_suggested', 'visual_markups'] })
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/content_types/content_type_uid/entries/UID').reply(200, {
      ...noticeMock
    })
    makeEntry({
      entry: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry publish test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/UID/publish').reply(200, {
      ...noticeMock
    })
    const publishDetails = {
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    makeEntry({ entry: { ...systemUidMock } })
      .publish({ publishDetails })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry unpublish test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/UID/unpublish').reply(200, {
      ...noticeMock
    })
    const publishDetails = {
      locales: [
        'en-us'
      ],
      environments: [
        'development'
      ]
    }
    makeEntry({ entry: { ...systemUidMock } })
      .unpublish({ publishDetails })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry import test Overwrite False', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/import?overwrite=false').reply(200, {
      entry: {
        ...entryMock
      }
    })
    const entryUpload = { entry: path.join(__dirname, '../sanity-check/mock/entry.json') }
    const form = createFormData(entryUpload.entry)()
    var boundary = form.getBoundary()

    expect(boundary).to.be.equal(form.getBoundary())
    expect(boundary.length).to.be.equal(50)
    makeEntry()
      .import(entryUpload)
      .then((webhook) => {
        checkEntry(webhook)
        done()
      })
      .catch(done)
  })

  it('Entry import test Overwrite true', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/import?overwrite=true').reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry()
      .import({ entry: path.join(__dirname, '../sanity-check/mock/entry.json'), overwrite: true })
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry import test locale en-us', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/import?overwrite=false&locale=en-us').reply(200, {
      entry: {
        ...entryMock
      }
    })
    makeEntry()
      .import({ entry: path.join(__dirname, '../sanity-check/mock/entry.json'), locale: 'en-us' })
      .then((entry) => {
        checkEntry(entry)
        done()
      })
      .catch(done)
  })

  it('Entry publish request test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/UID/workflow').reply(200, {
      ...noticeMock
    })

    const publishingRule = {
      uid: 'uid',
      action: 'publish', // (‘publish’, ‘unpublish’, or ’both’)
      status: 1, // (this could be ‘0’ for Approval Requested, ‘1’ for ‘Approval Accepted’, and ‘-1’ for ‘Approval Rejected’),
      notify: false,
      comment: 'Please review this.'
    }
    makeEntry({ entry: { ...systemUidMock } })
      .publishRequest({ publishing_rule: publishingRule, locale: 'en-us' })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry with include variants request test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/content_types/content_type_uid/entries/UID').reply(200, {
      ...variantBaseEntryMock
    })
    makeEntry({ entry: { ...systemUidMock },
      stackHeaders: stackHeadersMock
    })
      .includeVariants({ include_variant: 'True', variants_uid: 'test_uid' })
      .then((response) => {
        expect(response.api_key).to.be.equal('api_key')
        expect(response['x-cs-variant-uid']).to.be.equal('test_uid')
        done()
      })
      .catch(done)
  })

  it('Entry set Workflow stage test', done => {
    var mock = new MockAdapter(Axios)

    mock.onPost('/content_types/content_type_uid/entries/UID/workflow').reply(200, {
      ...noticeMock
    })

    const workflowStage = {
      uid: 'uid',
      comment: 'Please review this.',
      due_date: 'Thu Dec 01 2018',
      notify: true,
      assigned_to: [{
        uid: 'user_uid',
        name: 'Username',
        email: 'user_email_id'
      }],
      assigned_by_roles: [{
        uid: 'role_uid',
        name: 'Role name'
      }]
    }

    makeEntry({ entry: { ...systemUidMock } })
      .setWorkflowStage({ workflow_stage: workflowStage, locale: 'en-us' })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry set Workflow stage test', done => {
    var mock = new MockAdapter(Axios)

    mock.onPost('/content_types/content_type_uid/entries/UID/workflow').reply(200, {
      ...noticeMock
    })

    const workflowStage = {
      uid: 'uid',
      comment: 'Please review this.',
      due_date: 'Thu Dec 01 2018',
      notify: true,
      assigned_to: [{
        uid: 'user_uid',
        name: 'Username',
        email: 'user_email_id'
      }],
      assigned_by_roles: [{
        uid: 'role_uid',
        name: 'Role name'
      }]
    }

    makeEntry({ entry: { ...systemUidMock }, stackHeaders: stackHeadersMock })
      .setWorkflowStage({ workflow_stage: workflowStage, locale: 'en-us' })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry publish request test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/content_types/content_type_uid/entries/UID/workflow').reply(200, {
      ...noticeMock
    })

    const publishingRule = {
      uid: 'uid',
      action: 'publish', // (‘publish’, ‘unpublish’, or ’both’)
      status: 1, // (this could be ‘0’ for Approval Requested, ‘1’ for ‘Approval Accepted’, and ‘-1’ for ‘Approval Rejected’),
      notify: false,
      comment: 'Please review this.'
    }
    makeEntry({ entry: { ...systemUidMock }, stackHeaders: stackHeadersMock })
      .publishRequest({ publishing_rule: publishingRule, locale: 'en-us' })
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Entry with asset object', done => {
    const entry = {
      empty_array: [],
      empty_object: {},
      single_file: {
        file_size: 69420,
        uid: 'single_file'
      },
      title: 'test entry',
      property: 'test property 3',
      array_file: [
        { file_size: 69420, uid: 'array_file_1' },
        { file_size: 69420, uid: 'array_file_2' },
        { file_size: 69420, uid: 'array_file_3' }
      ],
      wrapper1: {
        something: 'something',
        something_else: 'something_else',
        file_inside_wrapper: {
          file_size: 69420,
          uid: 'single_file'
        },
        file_array_wrapper: [
          { file_size: 69420, uid: 'array_file_wrap_1' },
          { file_size: 69420, uid: 'array_file_wrap_2' },
          { file_size: 69420, uid: 'array_file_wrap_3' }
        ],
        array_wrapper: [
          {
            something: 'something',
            single_file: {
              file_size: 69420,
              uid: 'single_file_1'
            },
            something_else: 'something_else'
          },
          {
            something: 'something',
            single_file: {
              file_size: 69420,
              uid: 'single_file_2'
            },
            something_else: 'something_else'
          },
          {
            something: 'something',
            single_file: {
              file_size: 69420,
              uid: 'single_file_3'
            },
            something_else: 'something_else'
          }
        ],
        wrapper2: {
          array_of_array_wrapper: [
            {
              something: 'something',
              oneMoreWrapper: {
                file_array_wrapper: [
                  { file_size: 69420, uid: 'array_file_wrap_1' },
                  { file_size: 69420, uid: 'array_file_wrap_2' },
                  { file_size: 69420, uid: 'array_file_wrap_3' }
                ],
                array_wrapper: [
                  {
                    something: 'something',
                    single_file: {
                      file_size: 69420,
                      uid: 'single_file_1'
                    },
                    something_else: 'something_else'
                  },
                  {
                    something: 'something',
                    single_file: {
                      file_size: 69420,
                      uid: 'single_file_2'
                    },
                    something_else: 'something_else'
                  },
                  {
                    something: 'something',
                    single_file: {
                      file_size: 69420,
                      uid: 'single_file_3'
                    },
                    something_else: 'something_else'
                  }
                ]
              },
              something_else: 'something_else'
            },
            {
              something: 'something',
              file_array_wrapper: [
                { file_size: 69420, uid: 'array_file_wrap_1' },
                { file_size: 69420, uid: 'array_file_wrap_2' },
                { file_size: 69420, uid: 'array_file_wrap_3' }
              ],
              something_else: 'something_else'
            },
            {
              something: 'something',
              file_array_wrapper: [
                { file_size: 69420, uid: 'array_file_wrap_1' },
                { file_size: 69420, uid: 'array_file_wrap_2' },
                { file_size: 69420, uid: 'array_file_wrap_3' }
              ],
              something_else: 'something_else'
            }
          ]
        }
      },
      ...systemUidMock
    }
    const expectedResult = {
      empty_array: [],
      empty_object: {},
      single_file: 'single_file',
      title: 'test entry',
      property: 'test property 3',
      array_file: ['array_file_1', 'array_file_2', 'array_file_3'],
      wrapper1: {
        something: 'something',
        something_else: 'something_else',
        file_inside_wrapper: 'single_file',
        file_array_wrapper: ['array_file_wrap_1', 'array_file_wrap_2', 'array_file_wrap_3'],
        array_wrapper: [
          {
            something: 'something',
            single_file: 'single_file_1',
            something_else: 'something_else'
          },
          {
            something: 'something',
            single_file: 'single_file_2',
            something_else: 'something_else'
          },
          {
            something: 'something',
            single_file: 'single_file_3',
            something_else: 'something_else'
          }
        ],
        wrapper2: {
          array_of_array_wrapper: [
            {
              something: 'something',
              oneMoreWrapper: {
                file_array_wrapper: ['array_file_wrap_1', 'array_file_wrap_2', 'array_file_wrap_3'],
                array_wrapper: [
                  {
                    something: 'something',
                    single_file: 'single_file_1',
                    something_else: 'something_else'
                  },
                  {
                    something: 'something',
                    single_file: 'single_file_2',
                    something_else: 'something_else'
                  },
                  {
                    something: 'something',
                    single_file: 'single_file_3',
                    something_else: 'something_else'
                  }
                ]
              },
              something_else: 'something_else'
            },
            {
              something: 'something',
              file_array_wrapper: ['array_file_wrap_1', 'array_file_wrap_2', 'array_file_wrap_3'],
              something_else: 'something_else'
            },
            {
              something: 'something',
              file_array_wrapper: ['array_file_wrap_1', 'array_file_wrap_2', 'array_file_wrap_3'],
              something_else: 'something_else'
            }
          ]
        }
      },
      ...systemUidMock
    }
    const result = cleanAssets(entry)
    expect(result).to.deep.equal(expectedResult)
    done()
  })

  it('should get languages of the given Entry uid', done => {
    var mock = new MockAdapter(Axios)
    const locales = [
      {
        code: 'en-us'
      },
      {
        code: 'hi-in'
      },
      {
        code: 'en-at',
        localized: true
      },
      {
        code: 'ja-jp'
      }
    ]
    mock.onGet('/content_types/content_type_uid/entries/UID/locales').reply(200, {
      locales
    })

    makeEntry({ entry: { ...systemUidMock }, stackHeaders: stackHeadersMock }).locales()
      .then((locale) => {
        expect(locale.locales[0].code).to.be.equal('en-us')
        locale.locales.forEach((locales) => {
          expect(locales.code).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })
  it('should get references of the given Entry uid', done => {
    var mock = new MockAdapter(Axios)
    const references = [
      {
        entry_uid: 'entry_uid',
        content_type_uid: 'referred_content_type',
        locale: 'en-us',
        title: 'Jeff Goins',
        content_type_title: 'Referred Content Type'
      }
    ]
    mock.onGet('/content_types/content_type_uid/entries/UID/references').reply(200, {
      references
    })

    makeEntry({ entry: { ...systemUidMock }, stackHeaders: stackHeadersMock }).references()
      .then((reference) => {
        expect(reference.references[0].entry_uid).to.be.equal('entry_uid')
        reference.references.forEach((references) => {
          expect(references.entry_uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('should fetch variants of an Entry', done => {
    var mock = new MockAdapter(Axios)
    const variantsResponse = {
      variants: [
        {
          uid: 'variant_uid',
          title: 'Variant Title',
          content_type: 'content_type_uid'
        }
      ]
    }

    mock.onGet(`/content_types/content_type_uid/entries/UID/variants/variantUid`).reply(200, variantsResponse)

    makeEntry({
      entry: {
        ...systemUidMock
      }
    })
      .variants('variantUid')
      .fetch()
      .then((response) => {
        expect(response.variants).to.be.an('array')
        expect(response.variants[0].uid).to.be.equal('variant_uid')
        expect(response.variants[0].title).to.be.equal('Variant Title')
        expect(response.variants[0].content_type).to.be.equal('content_type_uid')
        done()
      })
      .catch(done)
  })
})

function makeEntry (data) {
  return new Entry(Axios, { content_type_uid: 'content_type_uid', ...data })
}

function checkEntry (entry) {
  checkSystemFields(entry)
  expect(entry.title).to.be.equal('title')
  expect(entry.url).to.be.equal('/url')
  expect(entry.locale).to.be.equal('en-us')
  expect(entry._version).to.be.equal(1)
  expect(entry._in_progress).to.be.equal(false)
}
