import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader, jsonWrite } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

import dotenv from 'dotenv'
dotenv.config()

var orgID = process.env.ORGANIZATION
var user = {}
var client = {}

var stacks = {}
describe('Stack api Test', () => {
  setup(() => {
    user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  const newStack = {
    stack:
        {
          name: 'My New Stack',
          description: 'My new test stack',
          master_locale: 'en-us'
        }
  }

  it('should create Stack', done => {
    client.stack()
      .create(newStack, { organization_uid: orgID })
      .then((stack) => {
        jsonWrite(stack, 'stack.json')
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
        stacks = jsonReader('stack.json')
      })
      .catch(done)
  })

  it('should fetch Stack details', done => {
    client.stack({ api_key: stacks.api_key })
      .fetch()
      .then((stack) => {
        expect(stack.org_uid).to.be.equal(orgID)
        expect(stack.api_key).to.not.equal(null)
        expect(stack.name).to.be.equal(newStack.stack.name)
        expect(stack.description).to.be.equal(newStack.stack.description)
        done()
      })
      .catch(done)
  })

  it('should update Stack details', done => {
    const name = 'My New Stack Update Name'
    const description = 'My New description stack'
    client.stack({ api_key: stacks.api_key })
      .fetch().then((stack) => {
        stack.name = name
        stack.description = description
        return stack.update()
      }).then((stack) => {
        expect(stack.name).to.be.equal(name)
        expect(stack.description).to.be.equal(description)
        done()
      })
      .catch(done)
  })

  it('should get all users of stack', done => {
    client.stack({ api_key: stacks.api_key })
      .users()
      .then((response) => {
        expect(response[0].uid).to.be.not.equal(null)
        done()
      })
      .catch(done)
  })

  it('should get stack settings', done => {
    client.stack({ api_key: stacks.api_key })
      .settings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch(done)
  })

  it('should set stack_variables correctly', done => {
    const variables = {
      stack_variables: {
        enforce_unique_urls: true,
        sys_rte_allowed_tags: 'style,figure,script',
        sys_rte_skip_format_on_paste: 'GD:font-size',
        samplevariable: 'too'
      }
    }

    client.stack({ api_key: stacks.api_key })
      .addSettings(variables)
      .then((response) => {
        const vars = response.stack_variables
        expect(vars.enforce_unique_urls).to.equal(true)
        expect(vars.sys_rte_allowed_tags).to.equal('style,figure,script')
        expect(vars.sys_rte_skip_format_on_paste).to.equal('GD:font-size')
        expect(vars.samplevariable).to.equal('too')
        done()
      })
      .catch(done)
  })

  it('should set rte settings correctly', done => {
    const variables = {
      rte: {
        cs_breakline_on_enter: true,
        cs_only_breakline: true
      }
    }

    client.stack({ api_key: stacks.api_key })
      .addSettings(variables)
      .then((response) => {
        const rte = response.rte
        expect(rte.cs_breakline_on_enter).to.equal(true)
        expect(rte.cs_only_breakline).to.equal(true)
        done()
      })
      .catch(done)
  })

  it('should set live_preview settings correctly', done => {
    const variables = {
      live_preview: {
        enabled: true,
        'default-env': '',
        'default-url': 'https://preview.example.com'
      }
    }

    client.stack({ api_key: stacks.api_key })
      .addSettings(variables)
      .then((response) => {
        const preview = response.live_preview
        expect(preview.enabled).to.equal(true)
        expect(preview['default-env']).to.equal('')
        expect(preview['default-url']).to.equal('https://preview.example.com')
        done()
      })
      .catch(done)
  })

  it('should add simple stack variable', done => {
    client.stack({ api_key: stacks.api_key })
      .addSettings({ samplevariable: 'too' })
      .then((response) => {
        expect(response.stack_variables.samplevariable).to.be.equal('too', 'samplevariable must set to \'too\' ')
        done()
      })
      .catch(done)
  })

  it('should add stack settings', done => {
    const variables = {
      stack_variables: {
        enforce_unique_urls: true,
        sys_rte_allowed_tags: 'style,figure,script',
        sys_rte_skip_format_on_paste: 'GD:font-size',
        samplevariable: 'too'
      },
      rte: {
        cs_breakline_on_enter: true,
        cs_only_breakline: true
      },
      live_preview: {
        enabled: true,
        'default-env': '',
        'default-url': 'https://preview.example.com'
      }
    }

    client.stack({ api_key: stacks.api_key })
      .addSettings(variables).then((response) => {
        const vars = response.stack_variables
        expect(vars.enforce_unique_urls).to.equal(true, 'enforce_unique_urls must be true')
        expect(vars.sys_rte_allowed_tags).to.equal('style,figure,script', 'sys_rte_allowed_tags must match')
        expect(vars.sys_rte_skip_format_on_paste).to.equal('GD:font-size', 'sys_rte_skip_format_on_paste must match')
        expect(vars.samplevariable).to.equal('too', 'samplevariable must be "too"')

        const rte = response.rte
        expect(rte.cs_breakline_on_enter).to.equal(true, 'cs_breakline_on_enter must be true')
        expect(rte.cs_only_breakline).to.equal(true, 'cs_only_breakline must be true')

        const preview = response.live_preview
        expect(preview.enabled).to.equal(true, 'live_preview.enabled must be true')
        expect(preview['default-env']).to.equal('', 'default-env must match')
        expect(preview['default-url']).to.equal('https://preview.example.com', 'default-url must match')

        done()
      })
      .catch(done)
  })

  it('should reset stack settings', done => {
    client.stack({ api_key: stacks.api_key })
      .resetSettings()
      .then((response) => {
        expect(response.stack_variable).to.be.equal(undefined, 'Stack variable must be blank')
        expect(response.discrete_variables.access_token).to.not.equal(null, 'Stack variable must not be blank')
        expect(response.discrete_variables.secret_key).to.not.equal(null, 'Stack variable must not be blank')
        done()
      })
      .catch(done)
  })

  it('should get all stack', done => {
    client.stack()
      .query()
      .find()
      .then((response) => {
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.not.equal(null)
          expect(stack.uid).to.not.equal(null)
          expect(stack.owner_uid).to.not.equal(null)
        }
        done()
      })
      .catch(done)
  })

  it('should get query stack', done => {
    client.stack()
      .query({ query: { name: 'My New Stack Update Name' } })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        for (const index in response.items) {
          const stack = response.items[index]
          expect(stack.name).to.be.equal('My New Stack Update Name')
        }
        done()
      })
      .catch(done)
  })

  it('should find one stack', done => {
    client.stack()
      .query({ query: { name: 'My New Stack Update Name' } })
      .findOne()
      .then((response) => {
        const stack = response.items[0]
        expect(response.items.length).to.be.equal(1)
        expect(stack.name).to.be.equal('My New Stack Update Name')
        done()
      })
      .catch(done)
  })

  it('should delete stack', done => {
    client.stack({ api_key: stacks.api_key })
      .delete()
      .then((stack) => {
        expect(stack.notice).to.be.equal('Stack deleted successfully!')
        done()
      })
      .catch(done)
  })
})
