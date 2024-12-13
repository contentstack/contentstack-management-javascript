import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'
import { releaseCreate } from '../mock/release.js'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { multiPageCT } from '../mock/content-type.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}
let releaseUID = ''
let releaseUID2 = ''
let entries = {}
const itemToDelete = {}

describe('Relases api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    entries = jsonReader('entry.json')
    client = contentstackClient(user.authtoken)
  })

  it('should create a Release', done => {
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

  it('should fetch a Release from Uid', done => {
    makeRelease(releaseUID)
      .fetch()
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.equal(releaseUID)
        done()
      })
      .catch(done)
  })

  it('should create release item', done => {
    const item = {
      version: entries[0]._version,
      uid: entries[0].uid,
      content_type_uid: multiPageCT.content_type.uid,
      action: 'publish',
      locale: 'en-us'
    }
    makeRelease(releaseUID)
      .item()
      .create({ item })
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.equal(releaseUID)
        expect(release.items.length).to.be.equal(1)
        done()
      })
      .catch(done)
  })

  it('should create release items', done => {
    const items = [
      {
        version: entries[1]._version,
        uid: entries[1].uid,
        content_type_uid: multiPageCT.content_type.uid,
        action: 'publish',
        locale: 'en-us'
      },
      {
        version: entries[2]._version,
        uid: entries[2].uid,
        content_type_uid: multiPageCT.content_type.uid,
        action: 'publish',
        locale: 'en-us'
      }
    ]
    makeRelease(releaseUID)
      .item()
      .create({ items })
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.equal(releaseUID)
        expect(release.items.length).to.be.equal(3)
        done()
      })
      .catch(done)
  })

  it('should fetch a Release items from Uid', done => {
    makeRelease(releaseUID)
      .item()
      .findAll()
      .then((collection) => {
        const itemdelete = collection.items[0]
        itemToDelete['version'] = itemdelete.version
        itemToDelete.action = itemdelete.action
        itemToDelete.uid = itemdelete.uid
        itemToDelete.locale = itemdelete.locale
        itemToDelete.content_type_uid = itemdelete.content_type_uid
        expect(collection.items.length).to.be.equal(3)
        done()
      })
      .catch(done)
  })

  it('should delete specific item', done => {
    makeRelease(releaseUID)
      .item()
      .delete({ items: [itemToDelete] })
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.equal(releaseUID)
        expect(release.items.length).to.be.equal(2)
        done()
      })
      .catch(done)
  })

  it('should delete all items', done => {
    makeRelease(releaseUID)
      .item()
      .delete()
      .then((release) => {
        expect(release.name).to.be.equal(releaseCreate.release.name)
        expect(release.description).to.be.equal(releaseCreate.release.description)
        expect(release.uid).to.be.equal(releaseUID)
        expect(release.items.length).to.be.equal(0)
        done()
      })
      .catch(done)
  })

  it('should fetch and Update a Release from Uid', done => {
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

  it('should update a Release from Uid', done => {
    const relaseObject = makeRelease(releaseUID)
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

  it('should get all Releases', done => {
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

  it('should get specific Releases with name ', done => {
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

  it('should clone specific Releases with Uid ', done => {
    makeRelease(releaseUID)
      .clone({ name: 'New Clone Name', description: 'New Desc' })
      .then((release) => {
        releaseUID2 = release.uid
        expect(release.name).to.be.equal('New Clone Name')
        expect(release.description).to.be.equal('New Desc')
        expect(release.uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('Bulk Operation: should add items to a release', done => {
    const items = {
      release: releaseUID,
      action: 'publish',
      locale: ['en-us'],
      reference: true,
      items: [
        {
          version: entries[1]._version,
          uid: entries[1].uid,
          content_type_uid: multiPageCT.content_type.uid,
          locale: 'en-us',
          title: entries[1].title
        },
        {
          version: entries[2]._version,
          uid: entries[2].uid,
          content_type_uid: multiPageCT.content_type.uid,
          locale: 'en-us',
          title: entries[2].title
        },
      ],
    }
    doBulkOperation().addItems({ data: items, bulk_version: '2.0' })
    .then((response) => {
      expect(response.notice).to.equal('Your add to release request is in progress.')
      expect(response.job_id).to.not.equal(undefined)
      done()
    })
    .catch(done)
  })

  it('should delete specific Releases with Uid ', done => {
    makeRelease(releaseUID)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Release deleted successfully.')
        done()
      })
      .catch(done)
  })

  it('should delete cloned Release with Uid', done => {
    makeRelease(releaseUID2)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal('Release deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeRelease (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).release(uid)
}

function doBulkOperation(uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).bulkOperation()
}