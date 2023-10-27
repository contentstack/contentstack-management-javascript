import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { jsonReader } from '../utility/fileOperations/readwrite'
// import * as contentstack from '../../lib/contentstack.js'
import { contentstackClient } from '../utility/ContentstackClient.js'

var client = {}

var org_uid = 'blt242b133b4e9bd736'
const team_uid = '***REMOVED***'
const team = {
  name: 'team_name',
  users: [],
  stackRoleMapping: [],
  organizationRole: 'organization_role_uid'
}

describe('Teams API Test', () => {
  beforeEach(() => {
    const user = jsonReader('loggedinuser.json')
    client = contentstackClient(user.authtoken)
  })
  it('Query and get all teams', async () => {
    try {
      const response = await client.organization(org_uid).teams().query()
      console.log('res', response)
    } catch (err) {
      console.log(err)
    }
  })
  it('fetch test', async () => {
    try {
      const response = await client.organization(org_uid).teams(team_uid).fetch()
      console.log('res2', await response)
    } catch (err) {
      console.log(err)
    }
  })
  // it('create test', async () => {
  //   try {
  //     const response = await makeTeams(org_uid).create({
  //       name: 't2',
  //       users: [],
  //       stackRoleMapping: [],
  //       organizationRole: 'blt09e5dfced326aaea' })
  //     console.log('res2', response)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
  // it('delete test', async () => {
  //   try {
  //     const response = await makeTeams(org_uid, '').delete()
  //     console.log('res2', response)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
  // it('update test', async () => {
  //   try {
  //     var response = await makeTeams(org_uid, team_uid).fetch()
  //       .then((team) => {
  //         team.name = 'updated'
  //         console.log('tttt', team)
  //         return response.update()
  //       })
  //     // const res = response.update()
  //     console.log('update', response)
  //     // console.log('update12', res)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
})

function makeTeams (org_uid, team_uid = null) {
  return client.organization(org_uid).teams(team_uid)
}
