import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite.js'

import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}
let uid = ''
describe('Audit Log api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })

  it('Should Fetch all the Audit Logs', async () => {
    const response = await makeAuditLog().fetchAll()
    uid = response.items[0].uid
    // eslint-disable-next-line no-unused-expressions
    expect(Array.isArray(response.items)).to.be.true
    // eslint-disable-next-line no-unused-expressions
    expect(response.items[0].uid).not.to.be.undefined
  })

  it('Should Fetch a single audit log', async () => {
    const response = await makeAuditLog(uid).fetch()
    console.log(response)
    expect(response.log.uid).to.be.equal(uid)
  })
})

function makeAuditLog (uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).auditLog(uid)
}
