import { expect } from "chai";
import { Stack } from "../../types/stack";
import path from "path";
var assetUID = ''
var folderUID = ''
var publishAssetUID = ''
var assetURL = ''
export function createAsset(stack: Stack) {
    describe('Asset create', () => {
        test('Asset Upload', done => {
            const asset = {
                upload:  path.join(__dirname, '../api/mock/customUpload.html'),
                title: 'customasset',
                description: 'Custom Asset Desc',
                tags: ['custom']
            }
            stack.asset().create(asset)
            .then((asset) => {
                assetUID = asset.uid
                assetURL = asset.url
                expect(asset.uid).to.be.not.equal(null)
                expect(asset.url).to.be.not.equal(null)
                expect(asset.filename).to.be.equal('customUpload.html')
                expect(asset.title).to.be.equal('customasset')
                expect(asset.description).to.be.equal('Custom Asset Desc')
                expect(asset.content_type).to.be.equal('text/html')
                done()
            })
            .catch(done)
        })

        test('Create folder', done => {
            stack.asset().folder().create({asset: {
                name: "Sample Folder"
            }})
            .then((folder) => {
                folderUID = folder.uid
                expect(folder.uid).to.be.not.equal(null)
                expect(folder.name).to.be.equal('Sample Folder')
                expect(folder.is_dir).to.be.equal(true)
                done()
              })
              .catch(done)       
         })

         test('Upload asset in folder', done => {
            const asset = {
                upload: path.join(__dirname, '../api/mock/customUpload.html'),
                title: 'customasset in Folder',
                description: 'Custom Asset Desc in Folder',
                parent_uid: folderUID,
                tags: 'folder'
            }
            stack.asset().create(asset)
            .then((asset) => {
                publishAssetUID = asset.uid
                expect(asset.uid).to.be.not.equal(null)
                expect(asset.url).to.be.not.equal(null)
                expect(asset.filename).to.be.equal('customUpload.html')
                expect(asset.title).to.be.equal('customasset in Folder')
                expect(asset.description).to.be.equal('Custom Asset Desc in Folder')
                expect(asset.content_type).to.be.equal('text/html')
                expect(asset.parent_uid).to.be.equal(folderUID)
                done()
            })
            .catch(done)
         })
    })
}

export function downloadAsset(stack: Stack) {
    describe('Asset download', () => {
        test('Download asset from url', done => {
            stack.asset().download({url: assetURL, responseType: 'stream'})
            .then((_) => {
                done()
            })
            .catch(done)
        })

        test('Download asset from uid', done => {
            stack.asset(assetUID).fetch()
            .then((asset) => asset.download({responseType: 'stream'}))
            .then((_) => {
                done()
            })
            .catch(done)
        })
    })
}

export function replaceAsset(stack: Stack) {
    describe('Asset replace', () => {
        test('Replace Asset', done => {
            const asset = {
                upload: path.join(__dirname, '../api/mock/upload.html')
            }

            stack.asset(assetUID)
            .replace(asset)
            .then((asset) => {
                expect(asset.uid).to.be.equal(assetUID)
                expect(asset.filename).to.be.equal('upload.html')
                expect(asset.content_type).to.be.equal('text/html')
                done()
            })
            .catch(done)
        })
    })
}

export function getAssets(stack: Stack) {
    describe('Get asset details', () => {
        test('Fetch and update asset details' , done => {
            stack.asset(assetUID)
            .fetch()
            .then((asset) => {
                asset.title = 'Update title'
                asset.description = 'Update description'
                delete asset.ACL
                return asset.update()
              })
              .then((asset) => {
                expect(asset.uid).to.be.equal(assetUID)
                expect(asset.title).to.be.equal('Update title')
                expect(asset.description).to.be.equal('Update description')
                done()
              })
              .catch(done)
        })
    })
}

export function publishUnpublishAsset(stack: Stack) {
    describe('Publish unpublish asset', () => {
        it('Publish asset', done => {
            stack.asset(publishAssetUID)
            .publish({
                publishDetails: {
                    locales: ['hi-in', 'en-us'],
                    environments: ['development']
                }
            })
            .then((data) => {
                expect(data.notice).to.be.equal('Asset sent for publishing.')
                done()
            })
            .catch(done)
        })

        it('unpublish asset', done => {
            stack.asset(publishAssetUID)
            .unpublish({
                publishDetails: {
                    locales:['hi-in', 'en-us'],
                    environments:['development']
                }
            })
            .then((data) => {
                expect(data.notice).to.be.equal('Asset sent for unpublishing.')
                done()
            })
            .catch(done)
        })
    })
}

export function deleteAsset(stack: Stack) {
    describe('Delete asset', () => {
        it('Delete asset', done => {
            stack.asset(assetUID)
            .delete()
            .then((data) => {
                expect(data.notice).to.be.equal('Asset deleted successfully.')
                done()
            })
            .catch(done)
        })
    })
}

export function queryOnAsset(stack: Stack) {
    describe('Query on asset', () => {
        it('Query to fetch all assets', done => {
            stack.asset().query().find()
            .then((collection) => {
                collection.items.forEach((asset) => {
                  expect(asset.uid).to.be.not.equal(null)
                  expect(asset.title).to.be.not.equal(null)
                  expect(asset.description).to.be.not.equal(null)
                })
                done()
              })
              .catch(done)
        })

        it('Query to fetch asset match title', done => {
            stack.asset().query({query: {title: 'Update title'}})
            .find()
            .then((collection) => {
                collection.items.forEach((asset) => {
                expect(asset.uid).to.be.not.equal(null)
                expect(asset.title).to.be.equal('Update title')
                expect(asset.description).to.be.equal('Update description')
                })
                done()
            })
            .catch(done)
        })
    })
}