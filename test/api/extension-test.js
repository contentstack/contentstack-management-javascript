import path from 'path'
import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import * as contentstack from '../../lib/contentstack.js'
import axios from 'axios'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { customFieldURL, customFieldSRC, customWidgetURL, customWidgetSRC, customDashboardURL, customDashboardSRC } from '../unit/mock/extension'
var client = {}
var stack = {}

var customFieldUID = ''
var customWidgetUID = ''
var customDashboardUID = ''

describe('ContentType api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstack.client(axios, { authtoken: user.authtoken })
  })
  it('Create Custom field with source URL', done => {
    makeExtension()
      .create(customFieldURL)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        customFieldUID = extension.uid
        expect(extension.title).to.be.equal(customFieldURL.extension.title)
        expect(extension.src).to.be.equal(customFieldURL.extension.src)
        expect(extension.type).to.be.equal(customFieldURL.extension.type)
        expect(extension.tag).to.be.equal(customFieldURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Create Custom field with source Code', done => {
    makeExtension()
      .create(customFieldSRC)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal(customFieldSRC.extension.title)
        expect(extension.src).to.be.equal(customFieldSRC.extension.src)
        expect(extension.type).to.be.equal(customFieldSRC.extension.type)
        expect(extension.tag).to.be.equal(customFieldSRC.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Create Custom widget with source URL', done => {
    makeExtension()
      .create(customWidgetURL)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        customWidgetUID = extension.uid
        expect(extension.title).to.be.equal(customWidgetURL.extension.title)
        expect(extension.src).to.be.equal(customWidgetURL.extension.src)
        expect(extension.type).to.be.equal(customWidgetURL.extension.type)
        expect(extension.tag).to.be.equal(customWidgetURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Create Custom widget with source Code', done => {
    makeExtension()
      .create(customWidgetSRC)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal(customWidgetSRC.extension.title)
        expect(extension.src).to.be.equal(customWidgetSRC.extension.src)
        expect(extension.type).to.be.equal(customWidgetSRC.extension.type)
        expect(extension.tag).to.be.equal(customWidgetSRC.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Create Custom dashboard with source URL', done => {
    makeExtension()
      .create(customDashboardURL)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        customDashboardUID = extension.uid
        expect(extension.title).to.be.equal(customDashboardURL.extension.title)
        expect(extension.src).to.be.equal(customDashboardURL.extension.src)
        expect(extension.type).to.be.equal(customDashboardURL.extension.type)
        expect(extension.tag).to.be.equal(customDashboardURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Create Custom dashboard with source Code', done => {
    makeExtension()
      .create(customDashboardSRC)
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal(customDashboardSRC.extension.title)
        expect(extension.src).to.be.equal(customDashboardSRC.extension.src)
        expect(extension.type).to.be.equal(customDashboardSRC.extension.type)
        expect(extension.tag).to.be.equal(customDashboardSRC.extension.tag)
        done()
      })
      .catch(done)
  })

  it('fetch and Update Custom fields', done => {
    makeExtension(customFieldUID)
      .fetch()
      .then((extension) => {
        expect(extension.title).to.be.equal(customFieldURL.extension.title)
        expect(extension.src).to.be.equal(customFieldURL.extension.src)
        expect(extension.type).to.be.equal(customFieldURL.extension.type)
        expect(extension.tag).to.be.equal(customFieldURL.extension.tag)
        extension.title = 'Old field'
        return extension.update()
      })
      .then((extension) => {
        expect(extension.uid).to.be.equal(customFieldUID)
        expect(extension.title).to.be.equal('Old field')
        expect(extension.src).to.be.equal(customFieldURL.extension.src)
        expect(extension.type).to.be.equal(customFieldURL.extension.type)
        expect(extension.tag).to.be.equal(customFieldURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('fetch and Update Custom Widget', done => {
    makeExtension(customWidgetUID)
      .fetch()
      .then((extension) => {
        expect(extension.title).to.be.equal(customWidgetURL.extension.title)
        expect(extension.src).to.be.equal(customWidgetURL.extension.src)
        expect(extension.type).to.be.equal(customWidgetURL.extension.type)
        expect(extension.tag).to.be.equal(customWidgetURL.extension.tag)
        extension.title = 'Old widget'
        return extension.update()
      })
      .then((extension) => {
        expect(extension.uid).to.be.equal(customWidgetUID)
        expect(extension.title).to.be.equal('Old widget')
        expect(extension.src).to.be.equal(customWidgetURL.extension.src)
        expect(extension.type).to.be.equal(customWidgetURL.extension.type)
        expect(extension.tag).to.be.equal(customWidgetURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('fetch and Update Custom dashboard', done => {
    makeExtension(customDashboardUID)
      .fetch()
      .then((extension) => {
        expect(extension.title).to.be.equal(customDashboardURL.extension.title)
        expect(extension.src).to.be.equal(customDashboardURL.extension.src)
        expect(extension.type).to.be.equal(customDashboardURL.extension.type)
        expect(extension.tag).to.be.equal(customDashboardURL.extension.tag)
        extension.title = 'Old dashboard'
        return extension.update()
      })
      .then((extension) => {
        expect(extension.uid).to.be.equal(customDashboardUID)
        expect(extension.title).to.be.equal('Old dashboard')
        expect(extension.src).to.be.equal(customDashboardURL.extension.src)
        expect(extension.type).to.be.equal(customDashboardURL.extension.type)
        expect(extension.tag).to.be.equal(customDashboardURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Query Custom field', done => {
    makeExtension()
      .query({ query: { type: 'field' } })
      .find()
      .then((extensions) => {
        extensions.items.forEach(extension => {
          expect(extension.uid).to.be.not.equal(null)
          expect(extension.title).to.be.not.equal(null)
          expect(extension.type).to.be.equal('field')
        })
        done()
      })
      .catch(done)
  })

  it('Query Custom widget', done => {
    makeExtension()
      .query({ query: { type: 'widget' } })
      .find()
      .then((extensions) => {
        extensions.items.forEach(extension => {
          expect(extension.uid).to.be.not.equal(null)
          expect(extension.title).to.be.not.equal(null)
          expect(extension.type).to.be.equal('widget')
        })
        done()
      })
      .catch(done)
  })

  it('Query Custom dashboard', done => {
    makeExtension()
      .query({ query: { type: 'dashboard' } })
      .find()
      .then((extensions) => {
        extensions.items.forEach(extension => {
          expect(extension.uid).to.be.not.equal(null)
          expect(extension.title).to.be.not.equal(null)
          expect(extension.type).to.be.equal('dashboard')
        })
        done()
      })
      .catch(done)
  })

  it('Upload Custom field', done => {
    makeExtension()
      .upload({
        title: 'Custom field Upload',
        data_type: customFieldURL.extension.data_type,
        type: customFieldURL.extension.type,
        tags: customFieldURL.extension.tags,
        multiple: customFieldURL.extension.multiple,
        upload: path.join(__dirname, '../unit/mock/customUpload.html')
      })
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal('Custom field Upload')
        expect(extension.data_type).to.be.equal(customFieldURL.extension.data_type)
        expect(extension.type).to.be.equal(customFieldURL.extension.type)
        expect(extension.tag).to.be.equal(customFieldURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Upload Custom widget', done => {
    makeExtension()
      .upload({
        title: 'Custom widget Upload',
        data_type: customWidgetURL.extension.data_type,
        type: customWidgetURL.extension.type,
        scope: customWidgetURL.extension.scope,
        tags: customWidgetURL.extension.tags.join(','),
        upload: path.join(__dirname, '../unit/mock/customUpload.html')
      })
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal('Custom widget Upload')
        expect(extension.data_type).to.be.equal(customWidgetURL.extension.data_type)
        expect(extension.type).to.be.equal(customWidgetURL.extension.type)
        expect(extension.tag).to.be.equal(customWidgetURL.extension.tag)
        done()
      })
      .catch(done)
  })

  it('Upload dashboard', done => {
    makeExtension()
      .upload({
        title: 'Custom dashboard Upload',
        data_type: customDashboardURL.extension.data_type,
        type: customDashboardURL.extension.type,
        tags: customDashboardURL.extension.tags,
        enable: customDashboardURL.extension.enable,
        default_width: customDashboardURL.extension.default_width,
        upload: path.join(__dirname, '../unit/mock/customUpload.html')
      })
      .then((extension) => {
        expect(extension.uid).to.be.not.equal(null)
        expect(extension.title).to.be.equal('Custom dashboard Upload')
        expect(extension.data_type).to.be.equal(customDashboardURL.extension.data_type)
        expect(extension.type).to.be.equal(customDashboardURL.extension.type)
        expect(extension.tag).to.be.equal(customDashboardURL.extension.tag)
        expect(extension.enable).to.be.equal(customDashboardURL.extension.enable)
        expect(extension.default_width).to.be.equal(customDashboardURL.extension.default_width)
        done()
      })
      .catch(done)
  })

  it('Delete Custom dashboard', done => {
    makeExtension(customDashboardUID)
      .delete()
      .then((notice) => {
        expect(notice).to.be.equal('Extension deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeExtension (uid = null) {
  return client.stack(stack.api_key).extension(uid)
}
