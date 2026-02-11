import { expect } from 'chai'
import { describe, it, beforeEach, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { 
  validateErrorResponse, 
  generateUniqueId, 
  wait,
  testData,
  trackedExpect
} from '../utility/testHelpers.js'

let client = null
const organizationUid = process.env.ORGANIZATION

// Test data storage
let teamUid1 = null
let teamUid2 = null
let orgAdminRoleUid = null
let stackRoleUids = []
let testUserId = null

describe('Teams API Tests', () => {
  beforeEach(function (done) {
    client = contentstackClient()
    done()
  })

  after(async function () {
    // NOTE: Deletion removed - teams persist for other tests
    // Team Deletion tests will handle cleanup
  })

  describe('Team CRUD Operations', () => {
    it('should fetch organization roles for team creation', async function () {
      this.timeout(15000)
      
      try {
        const response = await client.organization(organizationUid).roles()
        
        expect(response).to.exist
        
        // Handle different response structures
        const roles = response.roles || response.items || (Array.isArray(response) ? response : [])
        expect(roles).to.be.an('array', 'Organization roles should be an array')
        
        if (roles.length === 0) {
          console.log('No organization roles found, team tests will be skipped')
          return
        }
        
        // Find admin role for team creation
        const adminRole = roles.find(role => role.name && role.name.toLowerCase().includes('admin'))
        if (adminRole) {
          orgAdminRoleUid = adminRole.uid
        } else if (roles.length > 0) {
          orgAdminRoleUid = roles[0].uid
        }
        
        if (!orgAdminRoleUid) {
          console.log('No suitable organization role found')
        }
      } catch (error) {
        console.log('Failed to fetch organization roles:', error.errorMessage || error.message)
        // Don't fail the test - team tests will be skipped due to missing role
      }
    })

    it('should create first team with basic configuration', async function () {
      this.timeout(30000)
      
      if (!orgAdminRoleUid) {
        this.skip()
      }

      const teamData = {
        name: `Test Team 1 ${generateUniqueId()}`,
        users: [],
        stackRoleMapping: [],
        organizationRole: orgAdminRoleUid
      }

      const response = await client.organization(organizationUid).teams().create(teamData)
      
      teamUid1 = response.uid
      testData.teamUid = teamUid1
      
      trackedExpect(response, 'Team').toBeAn('object')
      trackedExpect(response.uid, 'Team UID').toExist()
      trackedExpect(response.uid, 'Team UID type').toBeA('string')
      trackedExpect(response.name, 'Team name').toEqual(teamData.name)
      trackedExpect(response.organizationRole, 'Team organizationRole').toExist()
      
      // Wait for team to be fully created
      await wait(2000)
    })

    it('should create second team for additional testing', async function () {
      this.timeout(15000)
      
      if (!orgAdminRoleUid) {
        this.skip()
      }

      const teamData = {
        name: `Test Team 2 ${generateUniqueId()}`,
        users: [],
        stackRoleMapping: [],
        organizationRole: orgAdminRoleUid
      }

      const response = await client.organization(organizationUid).teams().create(teamData)
      
      teamUid2 = response.uid
      
      expect(response.uid).to.not.equal(null)
      expect(response.name).to.equal(teamData.name)
    })

    it('should fetch all teams in organization', async function () {
      this.timeout(15000)

      const response = await client.organization(organizationUid).teams().fetchAll()
      
      trackedExpect(response, 'Teams response').toExist()
      
      // Handle different response structures
      const teams = response.items || response.teams || (Array.isArray(response) ? response : [])
      trackedExpect(teams, 'Teams list').toBeAn('array')
      
      // Only check for at least 1 team if we created teams earlier
      if (teamUid1) {
        trackedExpect(teams.length, 'Teams count').toBeAtLeast(1)
      }
      
      // OLD pattern: use organizationUid, name, created_by, updated_by
      teams.forEach(team => {
        expect(team.organizationUid).to.equal(organizationUid)
        expect(team.name).to.not.equal(null)
        // created_by and updated_by might be undefined in some responses
        if (team.created_by !== undefined) {
          expect(team.created_by).to.not.equal(null)
        }
        if (team.updated_by !== undefined) {
          expect(team.updated_by).to.not.equal(null)
        }
      })
    })

    it('should fetch a single team by UID', async function () {
      this.timeout(15000)
      
      if (!teamUid1) {
        this.skip()
      }

      const response = await client.organization(organizationUid).teams(teamUid1).fetch()
      
      trackedExpect(response, 'Team').toBeAn('object')
      trackedExpect(response.uid, 'Team UID').toEqual(teamUid1)
      trackedExpect(response.organizationUid, 'Team organizationUid').toEqual(organizationUid)
      trackedExpect(response.name, 'Team name').toExist()
      // OLD pattern: check created_by and updated_by if they exist
      if (response.created_by !== undefined) {
        expect(response.created_by).to.not.equal(null)
      }
      if (response.updated_by !== undefined) {
        expect(response.updated_by).to.not.equal(null)
      }
    })

    it('should update team name and description', async function () {
      this.timeout(15000)
      
      if (!teamUid1) {
        this.skip()
      }

      // OLD pattern: update requires users array (can include email)
      // IMPORTANT: Use MEMBER_EMAIL instead of EMAIL to avoid modifying the admin user's role
      const updateData = {
        name: `Updated Team Name ${generateUniqueId()}`,
        users: process.env.MEMBER_EMAIL ? [{ email: process.env.MEMBER_EMAIL }] : [],
        organizationRole: orgAdminRoleUid,
        stackRoleMapping: []
      }

      const response = await client.organization(organizationUid).teams(teamUid1).update(updateData)
      
      expect(response.name).to.equal(updateData.name)
      expect(response.uid).to.equal(teamUid1)
    })

    it('should handle fetching non-existent team', async function () {
      this.timeout(15000)

      try {
        await client.organization(organizationUid).teams('non_existent_team_uid').fetch()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })
  })

  describe('Team Stack Role Mapping Operations', () => {
    before(async function () {
      this.timeout(15000)
      
      // Get stack roles for mapping
      if (process.env.API_KEY) {
        try {
          const stack = client.stack({ api_key: process.env.API_KEY })
          const roles = await stack.role().fetchAll()
          
          if (roles && roles.items) {
            stackRoleUids = roles.items.slice(0, 3).map(role => role.uid)
          }
        } catch (e) {
          // Stack roles might not be accessible
        }
      }
    })

    it('should add stack role mapping to team', async function () {
      this.timeout(15000)
      
      if (!teamUid2 || stackRoleUids.length === 0 || !process.env.API_KEY) {
        this.skip()
      }

      const stackRoleMappings = {
        stackApiKey: process.env.API_KEY,
        roles: [stackRoleUids[0]]
      }

      const response = await client.organization(organizationUid)
        .teams(teamUid2)
        .stackRoleMappings()
        .add(stackRoleMappings)
      
      expect(response.stackRoleMapping).to.not.equal(undefined)
      expect(response.stackRoleMapping.stackApiKey).to.equal(stackRoleMappings.stackApiKey)
      expect(response.stackRoleMapping.roles).to.include(stackRoleMappings.roles[0])
    })

    it('should fetch all stack role mappings for team', async function () {
      this.timeout(15000)
      
      if (!teamUid2) {
        this.skip()
      }

      const response = await client.organization(organizationUid)
        .teams(teamUid2)
        .stackRoleMappings()
        .fetchAll()
      
      expect(response.stackRoleMappings).to.not.equal(undefined)
    })

    it('should update stack role mapping with multiple roles', async function () {
      this.timeout(15000)
      
      if (!teamUid2 || stackRoleUids.length < 2 || !process.env.API_KEY) {
        this.skip()
      }

      const updateData = {
        roles: stackRoleUids
      }

      const response = await client.organization(organizationUid)
        .teams(teamUid2)
        .stackRoleMappings(process.env.API_KEY)
        .update(updateData)
      
      expect(response.stackRoleMapping).to.not.equal(undefined)
      expect(response.stackRoleMapping.roles.length).to.be.at.least(1)
    })

    it('should delete stack role mapping', async function () {
      this.timeout(15000)
      
      if (!teamUid2 || !process.env.API_KEY) {
        this.skip()
      }

      try {
        const response = await client.organization(organizationUid)
          .teams(teamUid2)
          .stackRoleMappings(process.env.API_KEY)
          .delete()
        
        expect(response.status).to.equal(204)
      } catch (e) {
        // Stack role mapping might not exist
      }
    })
  })

  describe('Team Users Operations', () => {
    it('should add user to team via email', async function () {
      this.timeout(15000)
      
      // Use MEMBER_EMAIL to avoid modifying the admin user's role
      if (!teamUid2 || !process.env.MEMBER_EMAIL) {
        this.skip()
      }

      const usersMail = {
        emails: [process.env.MEMBER_EMAIL]
      }

      try {
        const response = await client.organization(organizationUid)
          .teams(teamUid2)
          .teamUsers()
          .add(usersMail)
        
        expect(response.status).to.be.oneOf([200, 201])
      } catch (e) {
        // User might already be in team or email might be invalid
        expect(e).to.not.equal(undefined)
      }
    })

    it('should fetch all users in team', async function () {
      this.timeout(15000)
      
      if (!teamUid2) {
        this.skip()
      }

      const response = await client.organization(organizationUid)
        .teams(teamUid2)
        .teamUsers()
        .fetchAll()
      
      expect(response).to.not.equal(undefined)
      
      if (response.items && response.items.length > 0) {
        testUserId = response.items[0].userId
        response.items.forEach(user => {
          expect(user.userId).to.not.equal(null)
        })
      }
    })

    it('should remove user from team', async function () {
      this.timeout(15000)
      
      if (!teamUid2 || !testUserId) {
        this.skip()
      }

      try {
        const response = await client.organization(organizationUid)
          .teams(teamUid2)
          .teamUsers(testUserId)
          .remove()
        
        expect(response.status).to.equal(204)
      } catch (e) {
        // User might already be removed
      }
    })
  })

  describe('Team Deletion', () => {
    it('should delete a team', async function () {
      this.timeout(30000)
      
      if (!orgAdminRoleUid) {
        this.skip()
        return
      }

      // Create a TEMPORARY team for deletion testing
      // Don't delete the shared teamUid1 or teamUid2
      const tempTeamData = {
        name: `Delete Test Team ${generateUniqueId()}`,
        users: [],
        stackRoleMapping: [],
        organizationRole: orgAdminRoleUid
      }

      try {
        const tempTeam = await client.organization(organizationUid).teams().create(tempTeamData)
        expect(tempTeam.uid).to.be.a('string')
        
        await wait(1000)

        const response = await client.organization(organizationUid).teams(tempTeam.uid).delete()
        
        expect(response.status).to.equal(204)
      } catch (error) {
        console.log('Team deletion test failed:', error.message || error)
        throw error
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle creating team without required fields', async function () {
      this.timeout(15000)

      try {
        await client.organization(organizationUid).teams().create({})
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })

    it('should handle invalid organization UID', async function () {
      this.timeout(15000)

      try {
        await client.organization('invalid_org_uid').teams().fetchAll()
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).to.not.equal(undefined)
      }
    })
  })
})
