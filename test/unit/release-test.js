import Axios from 'axios'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'
import { describe, it } from 'mocha'
import { Release, ReleaseCollection } from '../../lib/stack/release'
import { systemUidMock, stackHeadersMock, releaseMock, checkSystemFields, noticeMock } from './mock/objects'

describe('Contentstack Release test', () => {
  it('Release test without uid', done => {
    const release = makeRelease()
    expect(release.urlPath).to.be.equal('/releases')
    expect(release.stackHeaders).to.be.equal(undefined)
    expect(release.update).to.be.equal(undefined)
    expect(release.delete).to.be.equal(undefined)
    expect(release.fetch).to.be.equal(undefined)
    expect(release.items).to.be.equal(undefined)
    expect(release.deploy).to.be.equal(undefined)
    expect(release.item).to.be.equal(undefined)
    expect(release.clone).to.be.equal(undefined)
    expect(release.create).to.not.equal(undefined)
    expect(release.query).to.not.equal(undefined)
    done()
  })

  it('Release test with uid', done => {
    const release = makeRelease({ release: { ...systemUidMock } })
    expect(release.urlPath).to.be.equal(`/releases/${systemUidMock.uid}`)
    expect(release.stackHeaders).to.be.equal(undefined)
    expect(release.update).to.not.equal(undefined)
    expect(release.delete).to.not.equal(undefined)
    expect(release.fetch).to.not.equal(undefined)
    expect(release.items).to.be.equal(undefined)
    expect(release.item).to.not.equal(undefined)
    expect(release.deploy).to.not.equal(undefined)
    expect(release.clone).to.not.equal(undefined)
    expect(release.query).to.be.equal(undefined)
    done()
  })

  it('Release test with uid', done => {
    const release = makeRelease({ release: { ...systemUidMock }, stackHeaders: { ...stackHeadersMock } })
    expect(release.urlPath).to.be.equal(`/releases/${systemUidMock.uid}`)
    expect(release.stackHeaders).to.not.equal(undefined)
    expect(release.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key)
    expect(release.update).to.not.equal(undefined)
    expect(release.delete).to.not.equal(undefined)
    expect(release.fetch).to.not.equal(undefined)
    expect(release.items).to.be.equal(undefined)
    expect(release.item).to.not.equal(undefined)
    expect(release.deploy).to.not.equal(undefined)
    expect(release.clone).to.not.equal(undefined)
    expect(release.create).to.be.equal(undefined)
    expect(release.query).to.be.equal(undefined)
    done()
  })

  it('Release item initialize test', done => {
    const release = makeRelease({ release: { ...systemUidMock } })
    const item = release.item()
    expect(item).to.not.equal(undefined)
    done()
  })

  it('Release Collection test with blank data', done => {
    const releases = new ReleaseCollection(Axios, {})
    expect(releases.length).to.be.equal(0)
    done()
  })

  it('Release Collection test with data', done => {
    const releases = new ReleaseCollection(Axios, {
      releases: [
        releaseMock
      ]
    })
    expect(releases.length).to.be.equal(1)
    checkRelease(releases[0])
    done()
  })

  it('Release create test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/releases').reply(200, {
      release: {
        ...releaseMock
      }
    })
    makeRelease()
      .create()
      .then((release) => {
        checkRelease(release)
        done()
      })
      .catch(done)
  })

  it('Release Query test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/releases').reply(200, {
      releases: [
        releaseMock
      ]
    })
    makeRelease()
      .query()
      .find()
      .then((releases) => {
        checkRelease(releases.items[0])
        done()
      })
      .catch(done)
  })

  it('Release update test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPut('/releases/UID').reply(200, {
      release: {
        ...releaseMock
      }
    })
    makeRelease({
      release: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .update()
      .then((release) => {
        checkRelease(release)
        done()
      })
      .catch(done)
  })

  it('Release fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/releases/UID').reply(200, {
      release: {
        ...releaseMock
      }
    })
    makeRelease({
      release: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .fetch()
      .then((release) => {
        checkRelease(release)
        done()
      })
      .catch(done)
  })

  it('Release delete test', done => {
    var mock = new MockAdapter(Axios)
    mock.onDelete('/releases/UID').reply(200, {
      ...noticeMock
    })
    makeRelease({
      release: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .delete()
      .then((release) => {
        expect(release.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Release deploy test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/releases/UID/deploy').reply(200, {
      ...noticeMock
    })
    makeRelease({
      release: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .deploy({ environments: [
        'production',
        'uat'
      ],
      locales: [
        'en-us',
        'ja-jp'
      ],
      scheduledAt: '2018-12-12T13:13:13:122Z',
      action: 'publish' })
      .then((release) => {
        expect(release.notice).to.be.equal(noticeMock.notice)
        done()
      })
      .catch(done)
  })

  it('Release clone test', done => {
    var mock = new MockAdapter(Axios)
    mock.onPost('/releases/UID/clone').reply(200, {
      ...noticeMock,
      release: {
        ...releaseMock
      }
    })
    makeRelease({
      release: {
        ...systemUidMock
      },
      stackHeaders: stackHeadersMock
    })
      .clone({ name: 'New Clone Name', description: 'New Desc' })
      .then((release) => {
        checkRelease(release)
        done()
      })
      .catch(done)
  })
})

function makeRelease (data) {
  return new Release(Axios, data)
}

function checkRelease (release) {
  checkSystemFields(release)
  expect(release.name).to.be.equal('Name')
  expect(release.description).to.be.equal('Description')
  expect(release.locked).to.be.equal(false)
  expect(release.archived).to.be.equal(false)
  expect(release.items_count).to.be.equal(1)
  expect(release.items.length).to.be.equal(1)
  checkItem(release.items[0])
}

function checkItem (item) {
  expect(item.version).to.be.equal(1)
  expect(item.uid).to.be.equal('entry_or_asset_uid')
  expect(item.content_type_uid).to.be.equal('your_content_type_uid')
  expect(item.action).to.be.equal('publish')
  expect(item.locale).to.be.equal('en-us')
}
