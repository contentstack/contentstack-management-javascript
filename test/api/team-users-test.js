import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'

let client = {}

const organizationUid = 'organizationUid'
const teamUid = 'teamUid'
const userId = 'userId'

describe('Teams Users API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('should add the user when user\'s mail is passed', done => {
    const usersMail = {
      emails: ['email@email.com']
    }
    makeUsers(organizationUid, teamUid).add(usersMail).then((response) => {
      expect(response.status).to.be.equal(201)
      done()
    })
      .catch(done)
  })
  it('should remove the user when uid is passed', done => {
    makeUsers(organizationUid, teamUid, userId).remove().then((response) => {
      expect(response.status).to.be.equal(204)
      done()
    })
      .catch(done)
  })
  it('should fetch all users', async () => {
    makeUsers(organizationUid, teamUid)
      .fetchAll()
      .then((response) => {
        response.items.forEach((user) => {
          expect(user.uidId).to.be.not.equal(null)
        })
      })
  })
})

function makeUsers (organizationUid, teamUid, userId = null) {
  return client.organization(organizationUid).teams(teamUid).users(userId)
}
