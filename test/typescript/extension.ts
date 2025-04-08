import { expect } from "chai"
import { Extensions } from "../../types/stack/extension";
import { customFieldURL, customFieldSRC, customWidgetURL, customWidgetSRC, customDashboardURL, customDashboardSRC } from "../sanity-check/mock/extension";

var customFieldUID = ''
var customWidgetUID = ''
var customDashboardUID = ''

export function createExtension(extension: Extensions) {
    describe('Create extension', () => {
        test('Create Custom field with source URL', done => {
            extension.create(customFieldURL)
            .then((extension) => {
                expect(extension.uid).to.be.not.equal(null)
                customFieldUID = extension.uid
                expect(extension.title).to.be.equal(customFieldURL.extension.title)
                expect(extension.src).to.be.equal(customFieldURL.extension.src)
                expect(extension.type).to.be.equal(customFieldURL.extension.type)
                expect(extension.tag).to.be.equal(customFieldURL.extension.tag)
                done()
              })
              .catch(done)
        })

        test('Create Custom field with source Code', done => {
            extension.create(customFieldSRC)
            .then((extension) => {
                expect(extension.uid).to.be.not.equal(null)
                expect(extension.title).to.be.equal(customFieldSRC.extension.title)
                expect(extension.src).to.be.equal(customFieldSRC.extension.src)
                expect(extension.type).to.be.equal(customFieldSRC.extension.type)
                expect(extension.tag).to.be.equal(customFieldSRC.extension.tag)
                done()
              })
              .catch(done)
        })

        test('Create Custom widget with source URL', done => {
            extension.create(customWidgetURL)
            .then((extension) => {
              expect(extension.uid).to.be.not.equal(null)
              customWidgetUID = extension.uid
              expect(extension.title).to.be.equal(customWidgetURL.extension.title)
              expect(extension.src).to.be.equal(customWidgetURL.extension.src)
              expect(extension.type).to.be.equal(customWidgetURL.extension.type)
              expect(extension.tag).to.be.equal(customWidgetURL.extension.tag)
              done()
            })
            .catch(done)
        })

        test('Create Custom widget with source Code', done => {
            extension.create(customWidgetSRC)
            .then((extension) => {
              expect(extension.uid).to.be.not.equal(null)
              expect(extension.title).to.be.equal(customWidgetSRC.extension.title)
              expect(extension.src).to.be.equal(customWidgetSRC.extension.src)
              expect(extension.type).to.be.equal(customWidgetSRC.extension.type)
              expect(extension.tag).to.be.equal(customWidgetSRC.extension.tag)
              done()
            })
            .catch(done)
        })

        test('Create Custom dashboard with source URL', done => {
            extension.create(customDashboardURL)
            .then((extension) => {
              expect(extension.uid).to.be.not.equal(null)
              customDashboardUID = extension.uid
              expect(extension.title).to.be.equal(customDashboardURL.extension.title)
              expect(extension.src).to.be.equal(customDashboardURL.extension.src)
              expect(extension.type).to.be.equal(customDashboardURL.extension.type)
              expect(extension.tag).to.be.equal(customDashboardURL.extension.tag)
              done()
            })
            .catch(done)
        })

        test('Create Custom dashboard with source Code', done => {
            extension.create(customDashboardSRC)
            .then((extension) => {
              expect(extension.uid).to.be.not.equal(null)
              expect(extension.title).to.be.equal(customDashboardSRC.extension.title)
              expect(extension.src).to.be.equal(customDashboardSRC.extension.src)
              expect(extension.type).to.be.equal(customDashboardSRC.extension.type)
              expect(extension.tag).to.be.equal(customDashboardSRC.extension.tag)
              done()
            })
            .catch(done)
        })
    })
}