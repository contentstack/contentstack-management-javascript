import { expect } from "chai";
import { describe, it, setup } from "mocha";
import { jsonReader } from "../utility/fileOperations/readwrite";
import { createVariantGroup } from "../mock/variantGroup.js";
import { variant } from "../mock/variants.js";
import { variantEntryFirst } from "../mock/variantEntry.js";
import { contentstackClient } from "../utility/ContentstackClient.js";

var client = {};

var stack = {};
var variantUid = "";
var variantName = "";
var variantGroupUid = "";
var contentTypeUid = "";
var entryUid = "";

const entry = jsonReader("entry.json");
entryUid = entry[2].uid;
contentTypeUid = entry[2].content_type_uid;

describe("Entry Variants api Test", () => {
  setup(() => {
    const user = jsonReader("loggedinuser.json");
    stack = jsonReader("stack.json");
    client = contentstackClient(user.authtoken);
  });

  it("should create a Variant Group", (done) => {
    makeVariantGroup()
      .create(createVariantGroup)
      .then((variantGroup) => {
        variantGroupUid = variantGroup.uid;
        expect(variantGroup.name).to.be.equal(createVariantGroup.name);
        expect(variantGroup.uid).to.be.equal(createVariantGroup.uid);
        done();
      })
      .catch(done);
  });

  it("should create a Variants", (done) => {
    makeVariants()
      .create(variant)
      .then((variants) => {
        variantUid = variants.uid;
        expect(variants.name).to.be.equal(variant.name);
        expect(variants.uid).to.be.not.equal(null);
        done();
      })
      .catch(done);
  });

  it("should update/create variant of an entry", (done) => {
    makeEntryVariants(variantUid)
      .update(variantEntryFirst)
      .then((variantEntry) => {
        expect(variantEntry.entry.title).to.be.equal("First page variant");
        expect(variantEntry.entry._variant._uid).to.be.not.equal(null);
        expect(variantEntry.notice).to.be.equal(
          "Entry variant created successfully."
        );
        done();
      })
      .catch(done);
  });

  it("should get an entry variant", (done) => {
    makeEntryVariants(variantUid)
      .fetch(variantUid)
      .then((variantEntry) => {
        expect(variantEntry.entry.title).to.be.equal("First page variant");
        expect(variantEntry.entry._variant._uid).to.be.not.equal(null);
        done();
      })
      .catch(done);
  });

  it("should publish entry variant", (done) => {
    var publishVariantEntryFirst = {
      entry: {
        environments: ["development"],
        locales: ["en-us", "en-at"],
        variants: [
          {
            uid: variantUid,
            version: 1,
          },
        ],
        variant_rules: {
          publish_latest_base: false,
          publish_latest_base_conditionally: true,
        },
      },
      locale: "en-us",
      version: 1,
    };
    makeEntry()
      .entry(entryUid)
      .publish({
        publishDetails: publishVariantEntryFirst.entry,
        locale: publishVariantEntryFirst.locale,
      })
      .then((data) => {
        expect(data.notice).to.be.equal(
          "The requested action has been performed."
        );
        expect(data.job_id).to.be.not.equal(null);
        done();
      })
      .catch(done);
  });

  it("should unpublish entry variant", (done) => {
    var publishVariantEntryFirst = {
      entry: {
        environments: ["development"],
        locales: ["en-at"],
        variants: [
          {
            uid: variantUid,
            version: 1,
          },
        ],
        variant_rules: {
          publish_latest_base: false,
          publish_latest_base_conditionally: true,
        },
      },
      locale: "en-us",
      version: 1,
    };
    makeEntry()
      .entry(entryUid)
      .unpublish({
        publishDetails: publishVariantEntryFirst.entry,
        locale: publishVariantEntryFirst.locale,
      })
      .then((data) => {
        expect(data.notice).to.be.equal(
          "The requested action has been performed."
        );
        expect(data.job_id).to.be.not.equal(null);
        done();
      })
      .catch(done);
  });

  it("should get all entry variants", (done) => {
    makeEntryVariants()
      .query({})
      .find()
      .then((variantEntries) => {
        expect(variantEntries.items).to.be.an("array");
        expect(variantEntries.items[0].variants.title).to.be.equal(
          "First page variant"
        );
        expect(variantEntries.items[0].variants._variant._uid).to.be.not.equal(
          null
        );
        done();
      })
      .catch(done);
  });

  it("should delete entry variant from uid", (done) => {
    makeEntryVariants(variantUid)
      .delete(variantUid)
      .then((variantEntry) => {
        expect(variantEntry.notice).to.be.equal(
          "Entry variant deleted successfully."
        );
        done();
      })
      .catch(done);
  });

  it("Delete a Variant from uid", (done) => {
    makeVariantGroup(variantGroupUid)
      .variants(variantUid)
      .delete()
      .then((data) => {
        expect(data.message).to.be.equal("Variant deleted successfully");
        done();
      })
      .catch(done);
  });

  it("Delete a Variant Group from uid", (done) => {
    makeVariantGroup(variantGroupUid)
      .delete()
      .then((data) => {
        expect(data.message).to.be.equal(
          "Variant Group and Variants deleted successfully"
        );
        done();
      })
      .catch(done);
  });
});

function makeVariants(uid = null) {
  return client
    .stack({ api_key: process.env.API_KEY })
    .variantGroup(variantGroupUid)
    .variants(uid);
}

function makeVariantGroup(uid = null) {
  return client.stack({ api_key: process.env.API_KEY }).variantGroup(uid);
}

function makeEntryVariants(uid = null) {
  return client
    .stack({ api_key: process.env.API_KEY })
    .contentType(contentTypeUid)
    .entry(entryUid)
    .variants(uid);
}

function makeEntry() {
  return client
    .stack({ api_key: process.env.API_KEY })
    .contentType(contentTypeUid);
}
