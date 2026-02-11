import { ContentstackClient } from "../..";
import { expect } from 'chai';
import { ContentstackCollection, Response } from "../../types/contentstackCollection";
import { Organization } from "../../types/organization";
import { Stack } from "../../types/stack";
import { Role } from "../../types/stack/role";
import { User } from "../../types/user";

export function organizations(client: ContentstackClient) {
    describe('Organizations Test', () => {
        test('Fetch all users organization', done => {
            client.organization().fetchAll()
            .then((response: ContentstackCollection<Organization>) => {
                response.items.forEach((organization) => {
                    expect(organization.uid).to.not.null
                    expect(organization.name).to.not.null
                })
                done()
            })
            .catch(done)
        })
    })

}

export function organization(organization: Organization) {
    var stackCount = 0
    var roleUid: string
    var shareUID: string
    var email = 'test@example.com'
    describe('Organization test', () => {
        test('Fetch organization from uid', done => {
            organization
            .fetch()
            .then((organization: Organization) => {
                expect(organization.uid).to.be.equal(organization.uid)
                expect(organization.name).to.not.null             
                done()
            })
            .catch(done)
        })

        test('Fetch all Stack for the Organization', done => {
            organization
            .stacks({include_count: true})
            .then((stacks: ContentstackCollection<Stack>) => {
                stacks.items.forEach((stack: Stack) => {
                    expect(stack.uid).to.not.null
                    expect(stack.name).to.not.null
                    expect(stack.api_key).to.not.null
                })
                stackCount = stacks.count
                done()
            })
            .catch(done)
        })
        
        test('Get all roles for Organization', done => {
            organization.roles()
            .then((roles: ContentstackCollection<Role>) => {
                roles.items.forEach((role: Role) => {
                    expect(role.uid).to.not.null
                    expect(role.name).to.not.null
                })
                roleUid = roles.items[0].uid
                done()
            })
            .catch(done)
        })

        test('Add User to organization', done => {
            var fss = organization.addUser({
                users:{
                    [email]: [roleUid]
                },
                stacks: {
                    [email]: {}
                }
            })
            .then((response: ContentstackCollection<User>) => {
                shareUID = response.items[0].uid
                expect(response.items.length).to.be.equal(1)
                expect(response.items[0].uid).to.not.null
                expect(response.items[0].email).to.be.equal(`${email}`)
                done()
            })
            .catch(done)
        })

        test('Resend pending invitation', done => {
            organization
            .resendInvitation(shareUID)
            .then((response: Response) => {
                expect(response.notice).to.be.equal('The invitation has been resent successfully.')
                done()
            })
            .catch(done)
        })

        test('Gel all invitations for the Organization', done => {
            organization.getInvitations()
            .then((users: ContentstackCollection<User>) => {
                users.items.forEach((user: User) => {
                    expect(user.uid).to.not.null
                    expect(user.email).to.not.null
                })
                done()
            })
            .catch(done)
        })

        test('Remove invitation from Organization', done => {
            organization.removeUsers([email])
            .then((response: Response) => {
                expect(response.notice).to.be.equal('The invitation has been deleted successfully.')
                done()
            })
            .catch(done)
        })
    })
}