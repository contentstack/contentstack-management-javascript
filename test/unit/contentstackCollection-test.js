import { describe, it } from 'mocha'
import ContentstackCollection from '../../lib/contentstackCollection'
import axios from 'axios'
import { StackCollection } from '../../lib/stack'
import { expect } from 'chai'
import { mockCollection, stackMock, entryMockCollection } from './mock/objects'
import { EntryCollection } from '../../lib/stack/contentType/entry'

describe('Contentstack collection test', () => {
  it('Collection with no Data', done => {
    const stackResponse = new ContentstackCollection({}, axios, null, StackCollection)
    expect(stackResponse.items.length).to.be.equal(0)
    expect(stackResponse.count).to.be.equal(undefined)
    expect(stackResponse.notice).to.be.equal(undefined)
    expect(stackResponse.schema).to.be.equal(undefined)
    expect(stackResponse.content_type).to.be.equal(undefined)
    done()
  })

  it('Stack Collection', done => {
    const stackResponse = new ContentstackCollection({
      data: mockCollection(stackMock, 'stacks')
    },
    axios,
    null,
    StackCollection
    )
    expect(stackResponse.items.length).to.be.equal(1)
    expect(stackResponse.count).to.be.equal(1)
    expect(stackResponse.notice).to.be.equal('Notice')
    expect(stackResponse.schema).to.be.equal(undefined)
    expect(stackResponse.content_type).to.be.equal(undefined)
    done()
  })

  it('Stack Collection with headers', done => {
    const stackResponse = new ContentstackCollection({
      data: mockCollection(stackMock, 'stacks')
    },
    axios,
    {
      api_key: 'stack_api_key'
    },
    StackCollection
    )
    expect(stackResponse.items.length).to.be.equal(1)
    expect(stackResponse.count).to.be.equal(1)
    expect(stackResponse.notice).to.be.equal('Notice')
    expect(stackResponse.schema).to.be.equal(undefined)
    expect(stackResponse.content_type).to.be.equal(undefined)
    done()
  })

  it('Entry Collection with Schema and Content Type', done => {
    const stackResponse = new ContentstackCollection({
      data: entryMockCollection({})
    },
    axios,
    {
      api_key: 'stack_api_key'
    },
    EntryCollection
    )
    expect(stackResponse.items.length).to.be.equal(1)
    expect(stackResponse.count).to.be.equal(1)
    expect(stackResponse.notice).to.be.equal('Notice')
    expect(stackResponse.schema).to.not.equal(undefined)
    expect(stackResponse.content_type).to.not.equal(undefined)
    done()
  })
})
