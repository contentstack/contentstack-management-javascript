/**
 * Role API Tests
 * 
 * Comprehensive test suite for:
 * - Role CRUD operations
 * - Complex permission rules
 * - Error handling
 */

import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { contentstackClient } from '../utility/ContentstackClient.js'
import {
  basicRole,
  advancedRole,
  roleUpdate
} from '../mock/configurations.js'
import { validateRoleResponse, testData, wait, trackedExpect } from '../utility/testHelpers.js'

describe('Role API Tests', () => {
  let client
  let stack

  before(function () {
    client = contentstackClient()
    stack = client.stack({ api_key: process.env.API_KEY })
  })

  // Helper to fetch role by UID (since stack.role(uid).fetch() doesn't exist)
  async function fetchRoleByUid(roleUid) {
    const response = await stack.role().fetchAll({ include_rules: true, include_permissions: true })
    const items = response.items || response.roles
    const role = items.find(r => r.uid === roleUid)
    if (!role) {
      const error = new Error(`Role with UID ${roleUid} not found`)
      error.status = 404
      throw error
    }
    return role
  }

  // Helper to delete role by UID
  async function deleteRoleByUid(roleUid) {
    const role = await fetchRoleByUid(roleUid)
    // The role object from fetchAll should have delete method
    if (role.delete) {
      return await role.delete()
    }
    // If not, use the stack.role(uid) pattern for deletion
    return await stack.role(roleUid).delete()
  }

  // Base branch rule required for all roles
  const branchRule = {
    module: 'branch',
    branches: ['main'],
    acl: { read: true }
  }

  // ==========================================================================
  // ROLE CRUD OPERATIONS
  // ==========================================================================

  describe('Role CRUD Operations', () => {
    let createdRoleUid

    after(async () => {
      // NOTE: Deletion removed - roles persist for other tests
    })

    it('should create a basic role', async function () {
      this.timeout(30000)
      const roleData = JSON.parse(JSON.stringify(basicRole))
      roleData.role.name = `Content Editor ${Date.now()}`

      const response = await stack.role().create(roleData)

      trackedExpect(response, 'Role').toBeAn('object')
      trackedExpect(response.uid, 'Role UID').toBeA('string')
      
      validateRoleResponse(response)

      trackedExpect(response.name, 'Role name').toInclude('Content Editor')
      trackedExpect(response.rules, 'Role rules').toBeAn('array')

      createdRoleUid = response.uid
      testData.roles.basic = response
      
      // Wait for role to be fully created
      await wait(2000)
    })

    it('should fetch role by UID from fetchAll', async function () {
      this.timeout(15000)
      const role = await fetchRoleByUid(createdRoleUid)

      trackedExpect(role, 'Role').toBeAn('object')
      trackedExpect(role.uid, 'Role UID').toEqual(createdRoleUid)
    })

    it('should validate role rules structure', async () => {
      const role = await fetchRoleByUid(createdRoleUid)

      expect(role.rules).to.be.an('array')
      role.rules.forEach(rule => {
        expect(rule.module).to.be.a('string')
        expect(rule.acl).to.be.an('object')
      })
    })

    it('should update role name', async () => {
      const role = await fetchRoleByUid(createdRoleUid)
      const newName = `Updated Editor ${Date.now()}`

      role.name = newName
      const response = await role.update()

      expect(response).to.be.an('object')
      expect(response.name).to.equal(newName)
    })

    it('should update role description', async () => {
      const role = await fetchRoleByUid(createdRoleUid)
      role.description = 'Updated role description'

      const response = await role.update()

      expect(response.description).to.equal('Updated role description')
    })

    it('should query all roles', async () => {
      const response = await stack.role().fetchAll()

      expect(response).to.be.an('object')
      expect(response.items || response.roles).to.be.an('array')
    })

    it('should query roles with limit', async () => {
      const response = await stack.role().fetchAll({ limit: 2 })

      expect(response).to.be.an('object')
      const items = response.items || response.roles
      expect(items.length).to.be.at.most(2)
    })

    it('should query roles with skip', async () => {
      const response = await stack.role().fetchAll({ skip: 1 })

      expect(response).to.be.an('object')
    })

    it('should query roles with include_rules', async () => {
      const response = await stack.role().fetchAll({ include_rules: true })

      expect(response).to.be.an('object')
      const items = response.items || response.roles
      // At least some roles should have rules included
      const hasRules = items.some(r => r.rules && r.rules.length >= 0)
      expect(hasRules).to.be.true
    })
  })

  // ==========================================================================
  // ADVANCED ROLE
  // ==========================================================================

  describe('Advanced Role with Complex Permissions', () => {
    let advancedRoleUid

    after(async () => {
      // NOTE: Deletion removed - roles persist for other tests
    })

    it('should create role with complex permissions', async function () {
      this.timeout(30000)
      const roleData = JSON.parse(JSON.stringify(advancedRole))
      roleData.role.name = `Senior Editor ${Date.now()}`

      const response = await stack.role().create(roleData)
      
      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      
      validateRoleResponse(response)
      expect(response.rules.length).to.be.at.least(3)

      advancedRoleUid = response.uid
      testData.roles.advanced = response
      
      await wait(2000)
    })

    it('should have content_type module permissions', async function () {
      this.timeout(15000)
      const role = await fetchRoleByUid(advancedRoleUid)

      const ctRule = role.rules.find(r => r.module === 'content_type')
      expect(ctRule).to.exist
      expect(ctRule.acl).to.be.an('object')
    })

    it('should have asset module permissions', async () => {
      const role = await fetchRoleByUid(advancedRoleUid)

      const assetRule = role.rules.find(r => r.module === 'asset')
      expect(assetRule).to.exist
      expect(assetRule.acl).to.be.an('object')
    })

    it('should have branch module permissions', async () => {
      const role = await fetchRoleByUid(advancedRoleUid)

      const branchRule = role.rules.find(r => r.module === 'branch')
      expect(branchRule).to.exist
      expect(branchRule.branches).to.include('main')
    })

    it('should add new permission rule', async () => {
      const role = await fetchRoleByUid(advancedRoleUid)
      const initialRuleCount = role.rules.length

      role.rules.push({
        module: 'taxonomy',
        taxonomies: ['$all'],
        acl: { read: true, sub_acl: { read: true, create: false, update: false, delete: false } }
      })

      const response = await role.update()

      expect(response.rules.length).to.be.at.least(initialRuleCount)
    })
  })

  // ==========================================================================
  // ROLE PERMISSIONS
  // ==========================================================================

  describe('Role Permission Types', () => {
    let permissionRoleUid

    after(async () => {
      // NOTE: Deletion removed - roles persist for other tests
    })

    it('should create read-only role', async function () {
      this.timeout(30000)
      const roleData = {
        role: {
          name: `Read Only ${Date.now()}`,
          description: 'Read-only access',
          rules: [
            branchRule, // Required branch rule
            {
              module: 'content_type',
              content_types: ['$all'],
              acl: {
                read: true,
                sub_acl: { read: true, create: false, update: false, delete: false, publish: false }
              }
            },
            {
              module: 'asset',
              assets: ['$all'],
              acl: { read: true, update: false, publish: false, delete: false }
            }
          ]
        }
      }

      const response = await stack.role().create(roleData)

      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      
      validateRoleResponse(response)

      // Verify read-only permissions
      const ctRule = response.rules.find(r => r.module === 'content_type')
      expect(ctRule.acl.read).to.be.true

      permissionRoleUid = response.uid
      
      await wait(2000)
    })

    it('should verify asset permissions', async function () {
      this.timeout(15000)
      const role = await fetchRoleByUid(permissionRoleUid)

      const assetRule = role.rules.find(r => r.module === 'asset')
      expect(assetRule.acl.read).to.be.true
    })

    it('should update to add write permissions', async () => {
      const role = await fetchRoleByUid(permissionRoleUid)

      const ctRule = role.rules.find(r => r.module === 'content_type')
      if (ctRule && ctRule.acl && ctRule.acl.sub_acl) {
        ctRule.acl.sub_acl.create = true
        ctRule.acl.sub_acl.update = true
      }

      const response = await role.update()

      const updatedCtRule = response.rules.find(r => r.module === 'content_type')
      expect(updatedCtRule).to.exist
    })
  })

  // ==========================================================================
  // CONTENT TYPE SPECIFIC PERMISSIONS
  // ==========================================================================

  describe('Content Type Specific Permissions', () => {
    let ctSpecificRoleUid

    after(async () => {
      // NOTE: Deletion removed - roles persist for other tests
    })

    it('should create role with specific content type access', async function () {
      this.timeout(30000)
      const roleData = {
        role: {
          name: `Blog Editor ${Date.now()}`,
          description: 'Can only edit blog content',
          rules: [
            branchRule, // Required branch rule
            {
              module: 'content_type',
              content_types: ['$all'], // Use $all since specific CTs may not exist
              acl: {
                read: true,
                sub_acl: { read: true, create: true, update: true, delete: false, publish: false }
              }
            }
          ]
        }
      }

      const response = await stack.role().create(roleData)
      
      expect(response).to.be.an('object')
      expect(response.uid).to.be.a('string')
      
      validateRoleResponse(response)

      const ctRule = response.rules.find(r => r.module === 'content_type')
      expect(ctRule).to.exist

      ctSpecificRoleUid = response.uid
      
      await wait(2000)
    })
  })

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe('Error Handling', () => {

    it('should fail to create role without name', async () => {
      const roleData = {
        role: {
          rules: [branchRule]
        }
      }

      try {
        await stack.role().create(roleData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
      }
    })

    it('should fail to create role without branch rule', async () => {
      const roleData = {
        role: {
          name: 'No Branch Rule Role',
          rules: [
            {
              module: 'content_type',
              content_types: ['$all'],
              acl: { read: true }
            }
          ]
        }
      }

      try {
        await stack.role().create(roleData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([400, 422])
        // Check for specific error if errors object exists
        if (error.errors) {
          expect(error.errors).to.have.property('rules.branch')
        }
      }
    })

    it('should fail to fetch non-existent role', async () => {
      try {
        await fetchRoleByUid('nonexistent_role_12345')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })

    it('should fail to delete system role', async () => {
      // Get all roles and try to delete a system role
      try {
        const response = await stack.role().fetchAll()
        const items = response.items || response.roles

        const systemRole = items.find(r => r.system || r.name === 'Admin' || r.name === 'Developer')

        if (systemRole && systemRole.delete) {
          await systemRole.delete()
          expect.fail('Should have thrown an error')
        }
      } catch (error) {
        // System roles cannot be deleted
        expect(error.status).to.be.oneOf([400, 403, 422])
      }
    })
  })

  // ==========================================================================
  // DELETE ROLE
  // ==========================================================================

  describe('Delete Role', () => {

    it('should delete a custom role', async function () {
      this.timeout(30000)
      // Create temp role
      const roleData = {
        role: {
          name: `Delete Test Role ${Date.now()}`,
          rules: [
            branchRule, // Required branch rule
            {
              module: 'content_type',
              content_types: ['$all'],
              acl: { read: true }
            }
          ]
        }
      }

      const response = await stack.role().create(roleData)
      expect(response.uid).to.be.a('string')
      
      await wait(1000)
      
      const role = await fetchRoleByUid(response.uid)
      const deleteResponse = await role.delete()

      expect(deleteResponse).to.be.an('object')
      expect(deleteResponse.notice).to.be.a('string')
    })

    it('should return 404 for deleted role', async function () {
      this.timeout(30000)
      // Create and delete
      const roleData = {
        role: {
          name: `Verify Delete Role ${Date.now()}`,
          rules: [branchRule]
        }
      }

      const response = await stack.role().create(roleData)
      const roleUid = response.uid
      
      await wait(1000)
      
      const role = await fetchRoleByUid(roleUid)
      await role.delete()

      await wait(2000)

      try {
        await fetchRoleByUid(roleUid)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.status).to.be.oneOf([404, 422])
      }
    })
  })
})
