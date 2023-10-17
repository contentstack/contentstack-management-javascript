import { expect } from "chai";
import { Stack } from "../../types/stack";

var taxonomyUID = ''
export function testTaxonomy(stack: Stack) {
    describe('Taxonomy API test', () => {
        test('Create taxonomy', done => {
            const taxonomy = {
                uid: 'uid',
                name: 'taxonomy',
                description: 'Description for Taxonomy'
              }
            stack.taxonomy().create({taxonomy})
            .then((taxonomyResponse) => {
                console.log(taxonomyResponse)
                expect(taxonomyResponse.uid).to.be.equal(taxonomy.uid)
                expect(taxonomyResponse.name).to.be.equal(taxonomy.name)
                done()
            })
            .catch(done)
        })
        test('Fetch taxonomy from uid', done => {
            stack.taxonomy(taxonomyUID).fetch()
            .then((taxonomyResponse) => {
                console.log(taxonomyResponse)
                expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
                expect(taxonomyResponse.name).not.to.be.equal('a')
                done()
            })
            .catch(done)
        })
        test('Update taxonomy from uid', done => {
            stack.taxonomy(taxonomyUID)
            .fetch()
            .then((taxonomyResponse) => {
                taxonomyResponse.name = 'updated name'
                return taxonomyResponse.update()
            })
            .then((taxonomyResponse) => {
                console.log(taxonomyResponse)
                expect(taxonomyResponse.uid).to.be.equal(taxonomyUID)
                expect(taxonomyResponse.name).to.be.equal('updated name')
                done()
            })
            .catch(done)
        })
        test('Delete taxonomy from uid', done => {
            stack.taxonomy(taxonomyUID)
            .delete()
            .then((taxonomyResponse) => {
                expect(taxonomyResponse.notice).to.be.equal('Taxonomy deleted successfully.')
                done()
            })
            .catch(done)
        })
        test('Query to get all taxonomies', async () => {
            await stack.taxonomy()
            .query()
            .find()
            .then((response) => {
                response.items.forEach((taxonomyResponse) => {
                    expect(taxonomyResponse.uid).to.be.not.equal(null)
                    expect(taxonomyResponse.name).to.be.not.equal(null)
                })
            })
        })
    })
}
