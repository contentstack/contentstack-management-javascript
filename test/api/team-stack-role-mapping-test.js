import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

const stackApiKey = 'stackApiKey'
const organizationUid = 'organizationUid'
const teamUid = 'teamUid'

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should fetch all stackRoleMappings', async () => {
    try {
      makestackRoleMappings(organizationUid, teamUid).fetchAll().then((response) => {
        console.log('🚀 ~ file: team-stack-role-mapping-test.js:19 ~ makestackRoleMappings ~ response:', response.stackRoleMappings[0].roles)
      })
    } catch (err) {
      console.log("🚀 ~ file: team-stack-role-mapping-test.js:21 ~ it.only ~ err:", err)
    }
  })
  it('should add roles', async () => {
    try {
      const stackRoleMappings = {
        stackApiKey: 'stackApiKey',
        roles: [
          'role_uid'
        ]
      }
      await makestackRoleMappings(organizationUid, teamUid).add(stackRoleMappings).then((response) => {
        console.log('🚀 ~ file: team-stack-role-mapping-test.js:36 ~ awaitmakestackRoleMappings ~ response:', response)
      })
    } catch (err) {
      console.log(err)
    }
  })
  it('should update roles', async () => {
    try {
      const stackRoleMappings = {
        roles: [
          'role_uid1',
          'role_uid2'
        ]
      }
      await makestackRoleMappings(organizationUid, teamUid, stackApiKey).update(stackRoleMappings).then((response) => {
        console.log('🚀 ~ file: team-stack-role-mapping-test.js:31 ~ makestackRoleMappings ~ response:', response)
      })
    } catch (err) {
      console.log(err.errors)
    }
  })
  it('should delete roles', async () => {
    try {
      await makestackRoleMappings(organizationUid, teamUid, stackApiKey).delete().then((response) => {
        console.log('🚀 ~ file: team-stack-role-mapping-test.js:31 ~ makestackRoleMappings ~ response:', response)
      })
    } catch (err) {
      console.log(err.errors)
    }
  })
})

function makestackRoleMappings (organizationUid, teamUid, stackApiKey = null) {
  return client.organization(organizationUid).teams(teamUid).stackRoleMappings(stackApiKey)
}

// delete done
// update done
// add done
