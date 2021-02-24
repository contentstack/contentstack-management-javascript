import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { releaseCreate } from './mock/release.js'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}
var stack = {}
var releaseUID = 'bltf20fe4e00e77ffc6'

describe('Relases api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')

    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Create a Release', done => {
    makeRelease()
      .create(releaseCreate)
      .then((release) => {
        releaseUID = release.uid
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Fetch a Release from Uid', done => {
    makeRelease(releaseUID)
      .fetch()
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Fetch a Release items from Uid', done => {
    makeRelease(releaseUID)
      .item()
      .findAll()
      .then((release) => {
        done()
      })
      .catch(done)
  })

  it('Fetch and Update a Release from Uid', done => {
    makeRelease(releaseUID)
      .fetch()
      .then((release) => {
        release.name = 'Update release name'
        return release.update()
      })
      .then((release) => {
        expect(release.name).to.be.equal('Update release name')
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Update a Release from Uid', done => {
    var relaseObject = makeRelease(releaseUID)
    Object.assign(relaseObject, cloneDeep(releaseCreate.release))
    relaseObject
      .update()
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Get all Releases', done => {
    makeRelease()
      .query()
      .find()
      .then((releaseCollection) => {
        releaseCollection.items.forEach(release => {
          expect(release.name).to.be.not.equal(null)
          expect(release.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Get specific Releases with name ', done => {
    makeRelease()
      .query({ query: { name: releaseCreate.release.name } })
      .find()
      .then((releaseCollection) => {
        releaseCollection.items.forEach(release => {
          expect(release.name).to.be.equal(releaseCreate.release.name)
          expect(release.uid).to.be.not.equal(null)
        })
        done()
      })
      .catch(done)
  })

  it('Delete specific Releases with Uid ', done => {
    makeRelease(releaseUID)
      .clone({ name: 'New Clone Name', description: 'New Desc' })
      .then((release) => {
        expect(release.name).to.be.equal('New Clone Name')
        expect(release.description).to.be.equal('New Desc')
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Delete specific Releases with Uid ', done => {
    makeRelease(releaseUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Release deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeRelease (uid = null) {
  return client.stack({ api_key: stack.api_key }).release(uid)
}
