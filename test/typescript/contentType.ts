import { expect } from "chai"
import path from "path"
import { Stack } from "../../types/stack"
import { ContentTypes } from "../../types/stack/contentType"

import { multiPageCT , schema, singlepageCT } from "./mock/contentType"

export function createContentType(contentType: ContentTypes) {
    describe('Content type create', () => { 
        test('Create single page content type', done => {
            contentType.create({content_type: singlepageCT.content_type})
            .then(response => { 
                expect(response.uid).equal(singlepageCT.content_type.uid)
                expect(response.title).equal(singlepageCT.content_type.title)
                done()
            })
            .catch(done)
        })

        test('Create Multi page content type', done => {
            contentType.create({content_type: multiPageCT.content_type})
            .then(response => { 
                expect(response.uid).equal(multiPageCT.content_type.uid)
                expect(response.title).equal(multiPageCT.content_type.title)
                done()
            })
            .catch(done)
        })

        test('Import Content type', done => {
            contentType.import({
                content_type: path.join(__dirname, '../sanity-check/mock/contentType.json')
            })
            .then((response) => {
                expect(response.uid).to.be.not.equal(null)
                done()
            })
            .catch(done)
        })
    })
}

export function queryContentType(contentType: ContentTypes) {
    describe('Content type query', () => {
        test('Get all content types', done => {
            contentType.query()
            .find()
            .then((response) => {
                response.items.forEach(contentType => {
                  expect(contentType.uid).to.be.not.equal(null)
                  expect(contentType.title).to.be.not.equal(null)
                  expect(contentType.schema).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        test('Query content types', done => {
            contentType.query({ query: { title: singlepageCT.content_type.title } })
            .find()
            .then((response) => {
                response.items.forEach(contentType => {
                    expect(contentType.uid).to.be.not.equal(null)
                    expect(contentType.title).to.be.not.equal(null)
                    expect(contentType.schema).to.be.not.equal(null)
                    expect(contentType.uid).to.be.equal(singlepageCT.content_type.uid, 'UID not mathcing')
                    expect(contentType.title).to.be.equal(singlepageCT.content_type.title, 'Title not mathcing')
                  })
                done()
              })
              .catch(done)
        })
    })
}

export function contentType(stack: Stack) {
    describe('Content Type operations', () => { 
        test('Fetch content type', done => {
            stack.contentType(multiPageCT.content_type.uid).fetch()
            .then((response) => {
                expect(response.uid).to.be.equal(multiPageCT.content_type.uid)
                expect(response.title).to.be.equal(multiPageCT.content_type.title)
                done()
            })
            .catch(done)
        })

        test('Fetch and Update ContentType schema', done => {
            stack.contentType(multiPageCT.content_type.uid).fetch()
              .then((response) => {
                response.schema = schema
                return response.update()
              })
              .then((response) => {
                expect(response.schema.length).to.be.equal(6)
                done()
              })
              .catch(done)
          })
        
    })
}
