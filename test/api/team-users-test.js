import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

const organizationUid = 'organizationUid'
const teamUid = 'teamUid'
const userId = 'userId'

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should add the user when user\'s mail is passed', async () => {
    const usersMail = {
      emails: ['email@email.com']
    }
    makeUsers(organizationUid, teamUid).add(usersMail).then((response) => {
      expect(response).to.be.equal(null)
    })
  })
  it('should remove the user when uid is passed', async () => {
    makeUsers(organizationUid, teamUid, userId).remove().then((response) => {
      expect(response).to.be.equal(null)
      expect(response.status).to.be.equal(204)
    })
  })
  it('should fetch all users', async () => {
    makeUsers(organizationUid, teamUid)
      .query()
      .find()
      .then((response) => {
        response.items.forEach((termResponse) => {
          expect(termResponse.uidId).to.be.not.equal(null)
        })
      })
  })
})

function makeUsers (organizationUid, teamUid, userId = null) {
  return client.organization(organizationUid).teams(teamUid).users(userId)
}
