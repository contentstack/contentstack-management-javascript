import { expect } from "chai"
import { Stack } from "../../types/stack";
import { Role, Roles } from "../../types/stack/role";
import role from "./mock/role.mock"

var roleUID = ''

export function getRoleUid():string {
    return roleUID
}

export function findAllRole(role: Roles) {
    describe('Delivery token find', () => {
        test('Get all role in stack', done => {
            role.fetchAll()
            .then((roles) => {
                for (const index in roles.items) {
                  const role1 = roles.items[index]
                  expect(role1.uid).to.not.equal(null, 'Role uid cannot be null')
                }
                done()
              })
              .catch(done)
        })

        test('Get 1 role in stack with limit', done => {
            role.fetchAll({ limit: 1 })
            .then((roles) => {
                expect(roles.items.length).to.not.equal(1, 'Role fetch with limit 1 not work')
                done()
              })
              .catch(done)
        })

        test('Get role in stack with skip first', done => {
            role.fetchAll({ limit: 1 })
            .then((roles) => {
                expect(roles.items.length).to.not.equal(1, 'Role fetch with limit 1 not work')
                done()
              })
              .catch(done)
        })
    })
}

export function createRole(roles: Roles) {
    describe('Delivery token create', () => {
        test('Create new role in stack', done => {
            roles.create({role})
            .then((roles) => {
                roleUID = roles.uid
                expect(roles.name).to.be.equal(role.name, 'Role name not match')
                expect(roles.description).to.be.equal(role.description, 'Role description not match')
                expect(roles.rules.length).to.be.equal(3, 'Role rule length not match')
                done()
              })
              .catch(done)
        })
    })
}

export function getRole(stack: Stack) {
    describe('Delivery token fetch/update', () => {
        test('Get role in stack', done => {
            stack.role(roleUID)
            .fetch()
            .then((roles) => {
                expect(roles.name).to.be.equal(role.name, 'Role name not match')
                expect(roles.description).to.be.equal(role.description, 'Role description not match')
                expect(roles.stack.api_key).to.be.equal(stack.api_key, 'Role stack uid not match')
                done()
              })
              .catch(done)
        })

        test('Update role in stack', done => {
            stack.role(roleUID)
            .fetch({ include_rules: true, include_permissions: true })
            .then((roles) => {
                roles.name = 'Update test name'
                roles.description = 'Update description'
                return roles.update()
            })
            .then((roles) => {
                expect(roles.name).to.be.equal('Update test name', 'Role name not match')
                expect(roles.description).to.be.equal('Update description', 'Role description not match')
                done()
            })
            .catch(done)
        })
    })
}

export function queryRole(role: Roles) {
    describe('Delivery token query', () => {
        test('Get all Roles with query', done => {
            role
            .query()
            .find()
            .then((response) => {
              for (const index in response.items) {
                const role = response.items[index]
                expect(role.name).to.not.equal(null)
                expect(role.uid).to.not.equal(null)
              }
              done()
            })
            .catch(done)
        })
        test('Get all Roles with query', done => {
            role
            .query({ query: { name: 'Developer' } })
            .find()
            .then((response) => {
                for (const index in response.items) {
                  const stack = response.items[index]
                  expect(stack.name).to.be.equal('Developer')
                }
                done()
            })
            .catch(done)
        })
    })
}