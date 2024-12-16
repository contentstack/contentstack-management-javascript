import path from 'path'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { createGlobalField } from '../mock/globalfield'
import { contentstackClient } from '../utility/ContentstackClient.js'
import dotenv from 'dotenv'

dotenv.config()
let client = {}
let createGlobalFieldUid = ''

describe("Global Field api Test", () => {
  setup(() => {
    const user = jsonReader("loggedinuser.json");
    client = contentstackClient(user.authtoken);
  });

  it("should create global field", (done) => {
    makeGlobalField()
      .create(createGlobalField)
      .then((globalField) => {
        expect(globalField.uid).to.be.equal(createGlobalField.global_field.uid);
        expect(globalField.title).to.be.equal(
          createGlobalField.global_field.title
        );
        expect(globalField.schema[0].uid).to.be.equal(
          createGlobalField.global_field.schema[0].uid
        );
        expect(globalField.schema[0].data_type).to.be.equal(
          createGlobalField.global_field.schema[0].data_type
        );
        expect(globalField.schema[0].display_name).to.be.equal(
          createGlobalField.global_field.schema[0].display_name
        );
        done();
      })
      .catch(done);
  });

  it("should fetch global Field", (done) => {
    makeGlobalField(createGlobalField.global_field.uid)
      .fetch()
      .then((globalField) => {
        expect(globalField.uid).to.be.equal(createGlobalField.global_field.uid);
        expect(globalField.title).to.be.equal(
          createGlobalField.global_field.title
        );
        expect(globalField.schema[0].uid).to.be.equal(
          createGlobalField.global_field.schema[0].uid
        );
        expect(globalField.schema[0].data_type).to.be.equal(
          createGlobalField.global_field.schema[0].data_type
        );
        expect(globalField.schema[0].display_name).to.be.equal(
          createGlobalField.global_field.schema[0].display_name
        );
        done();
      })
      .catch(done);
  });

  it("should fetch and update global Field", (done) => {
    makeGlobalField(createGlobalField.global_field.uid)
      .fetch()
      .then((globalField) => {
        globalField.title = "Update title";
        return globalField.update();
      })
      .then((updateGlobal) => {
        expect(updateGlobal.uid).to.be.equal(
          createGlobalField.global_field.uid
        );
        expect(updateGlobal.title).to.be.equal("Update title");
        expect(updateGlobal.schema[0].uid).to.be.equal(
          createGlobalField.global_field.schema[0].uid
        );
        expect(updateGlobal.schema[0].data_type).to.be.equal(
          createGlobalField.global_field.schema[0].data_type
        );
        expect(updateGlobal.schema[0].display_name).to.be.equal(
          createGlobalField.global_field.schema[0].display_name
        );
        done();
      })
      .catch(done);
  });

  it("should update global Field", (done) => {
    const globalField = makeGlobalField(createGlobalField.global_field.uid);
    Object.assign(globalField, cloneDeep(createGlobalField.global_field));
    globalField
      .update()
      .then((updateGlobal) => {
        expect(updateGlobal.uid).to.be.equal(
          createGlobalField.global_field.uid
        );
        expect(updateGlobal.title).to.be.equal(
          createGlobalField.global_field.title
        );
        expect(updateGlobal.schema[0].uid).to.be.equal(
          createGlobalField.global_field.schema[0].uid
        );
        expect(updateGlobal.schema[0].data_type).to.be.equal(
          createGlobalField.global_field.schema[0].data_type
        );
        expect(updateGlobal.schema[0].display_name).to.be.equal(
          createGlobalField.global_field.schema[0].display_name
        );
        done();
      })
      .catch(done);
  });

  it("should import global Field", (done) => {
    makeGlobalField()
      .import({
        global_field: path.join(__dirname, "../mock/globalfield.json"),
      })
      .then((response) => {
        createGlobalFieldUid = response.uid;
        expect(response.uid).to.be.not.equal(null);
        done();
      })
      .catch(done);
  });

  it("should get all global field from Query", (done) => {
    makeGlobalField()
      .query()
      .find()
      .then((collection) => {
        collection.items.forEach((globalField) => {
          expect(globalField.uid).to.be.not.equal(null);
          expect(globalField.title).to.be.not.equal(null);
          expect(globalField.schema).to.be.not.equal(null);
        });
        done();
      })
      .catch(done);
  });

  it("should get global field title matching Upload", (done) => {
    makeGlobalField()
      .query({ query: { title: "Upload" } })
      .find()
      .then((collection) => {
        collection.items.forEach((globalField) => {
          expect(globalField.uid).to.be.not.equal(null);
          expect(globalField.title).to.be.equal("Upload");
        });
        done();
      })
      .catch(done);
  });

  it("should get all nested global field from Query", (done) => {
    makeGlobalField({ api_version: "3.2" })
      .query()
      .find()
      .then((collection) => {
        collection.items.forEach((globalField) => {
          expect(globalField.uid).to.be.not.equal(null);
          expect(globalField.title).to.be.not.equal(null);
          expect(globalField.schema).to.be.not.equal(null);
        });
        done();
      })
      .catch(done);
  });

  it('should create nested global field', done => {
    const payload = {
        global_field: {
            title: 'Nested Global Field',
            uid: 'nested_global_field222',
            schema: [
                { data_type: 'text', display_name: 'Single Line Textbox', uid: 'single_line' },
                { data_type: 'global_field', display_name: 'Global', uid: 'global_field', reference_to: 'first' },
            ],
        },
    };

    makeGlobalField({ api_version: '3.2' }).create(payload)
        .then(globalField => {
            console.log('Response:', globalField);
            expect(globalField.uid).to.be.equal(payload.global_field.uid);
            done();
        })
        .catch(err => {
            console.error('Error:', err.response?.data || err.message);
            done(err);
        });
  });

  it('should fetch nested global field', done => {
    makeGlobalField('nested_global_field222').fetch()
        .then(globalField => {
            console.log('Response:', globalField);
            expect(globalField.uid).to.be.equal('nested_global_field222');
            done();
        })
        .catch(err => {
            console.error('Error:', err.response?.data || err.message);
            done(err);
        });
  });

  it("should delete nested global field", (done) => {
    makeGlobalField("nested_global_field222")
      .delete()
      .then((data) => {
        console.log("Response:", data);
        expect(data.notice).to.be.equal("Global Field deleted successfully.");
        done();
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        done(err);
      });
  });

  it("should delete global Field", (done) => {
    makeGlobalField(createGlobalField.global_field.uid)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal("Global Field deleted successfully.");
        done();
      })
      .catch(done);
  });

  it("should delete imported global Field", (done) => {
    makeGlobalField(createGlobalFieldUid)
      .delete()
      .then((data) => {
        expect(data.notice).to.be.equal("Global Field deleted successfully.");
        done();
      })
      .catch(done);
  });
});

function makeGlobalField(globalFieldUid = null, options = {}) {
  let uid = null;
  let finalOptions = options;
  // If globalFieldUid is an object, treat it as options
  if (typeof globalFieldUid === "object") {
    finalOptions = globalFieldUid;
  } else {
    uid = globalFieldUid;
  }
  // Ensure finalOptions is always an object with default values
  finalOptions = finalOptions || {};

  return client
    .stack({ api_key: process.env.API_KEY })
    .globalField(uid, finalOptions);
}
