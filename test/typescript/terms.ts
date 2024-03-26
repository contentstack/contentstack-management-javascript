import { expect } from "chai";
import { Stack } from "../../types/stack";
var taxonomyUID = ''
var termUID = ''
export function testTerm(stack: Stack) {
    describe('Term API test', () => {
        test('Create Term', done => {
            const term = {
                uid: 'term_uid',
                name: 'term name',
                parent_uid: 'parent_uid',
                order: 1
              }
            stack.taxonomy(taxonomyUID).terms().create({term})
            .then((termResponse) => {
                expect(termResponse.uid).to.be.equal(term.uid)
                expect(termResponse.name).to.be.equal(term.name)
                done()
            })
            .catch((err) => {
              console.log(err)
            })
        })
        test('Fetch term from uid', done => {
            stack.taxonomy(taxonomyUID).terms(termUID).fetch()
            .then((termResponse) => {
                expect(termResponse.uid).to.be.equal(termUID)
                expect(termResponse.name).not.to.be.equal(null)
                done()
            })
            .catch(done)
        })
        test('Update term from uid', done => {
            stack.taxonomy(taxonomyUID).terms(termUID)
            .fetch()
            .then((termResponse) => {
                termResponse.name = 'Updated Name'
                return termResponse.update()
            })
            .then((termResponse) => {
                expect(termResponse.uid).to.be.equal(termUID)
                expect(termResponse.name).to.be.equal('Updated Name')
                done()
            })
            .catch(done)
        })
        test('Delete term from uid', done => {
            stack.taxonomy(taxonomyUID).terms(termUID)
            .delete()
            .then((termResponse) => {
                expect(termResponse.notice).to.be.equal('Term deleted successfully.')
                done()
            })
            .catch(done)
        })
        test('Query to get all Terms', done => {
            stack.taxonomy(taxonomyUID).terms()
            .query()
            .find()
            .then((response) => {
                response.items.forEach((termResponse) => {
                    expect(termResponse.uid).to.be.not.equal(null)
                    expect(termResponse.name).to.be.not.equal(null)
                })
                done()
            })
            .catch(done)
        })
        test('Ancestors of the term given', done => {
            stack.taxonomy(taxonomyUID).terms(termUID)
            .ancestors()
            .then((termResponse) => {
                expect(termResponse.terms[0].uid).not.to.be.equal(null)
                expect(termResponse.terms[0].name).not.to.be.equal(null)
                expect(termResponse.terms[0].created_by).not.to.be.equal(null)
                expect(termResponse.terms[0].updated_by).not.to.be.equal(null)
                done()
            })
            .catch(done)
        })
        test('Descendants of the term given', done => {
            stack.taxonomy(taxonomyUID).terms(termUID)
            .descendants()
            .then((termResponse) => {
                expect(termResponse.terms[0].uid).not.to.be.equal(null)
                expect(termResponse.terms[0].name).not.to.be.equal(null)
                expect(termResponse.terms[0].created_by).not.to.be.equal(null)
                expect(termResponse.terms[0].updated_by).not.to.be.equal(null)
                done()
            })
            .catch(done)
        })
        it('search term', done => {
            const typeahead = 'term_string'
            stack.taxonomy('$all').terms()
            .search(typeahead)
            .then((termResponse) => {
                expect(termResponse.terms).to.be.an('array')
                done()
            })
            .catch((err) => {console.log(err)})
            
        })
        it('move term', done => {
            const term = {
                parent_uid: 'parent_uid',
                order: 2
            }
            stack.taxonomy(taxonomyUID).terms(termUID)
            .move({ term })
            .then((termResponse) => {
                expect(termResponse.notice).to.be.equal('Term moved successfully.')
                done()
            })
            .catch(done)
        })
    })
}
