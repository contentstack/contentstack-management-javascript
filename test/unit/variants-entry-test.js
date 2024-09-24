import Axios from "axios";
import { expect } from "chai";
import { describe, it } from "mocha";
import MockAdapter from "axios-mock-adapter";
import {
  Variants,
  VariantsCollection,
} from "../../lib/stack/contentType/entry/variants/";
import { checkSystemFields, varinatsEntryMock, variantEntryVersion } from "./mock/objects";

describe("Contentstack Variants entry test", () => {
  it("Variants entry test without uid", (done) => {
    const entry = makeEntry({
      content_type_uid: "content_type_uid",
      entry_uid: "UID",
    });
    expect(entry.urlPath).to.be.equal(
      "/content_types/content_type_uid/entries/UID/variants"
    );
    expect(entry.stackHeaders).to.be.equal(undefined);
    expect(entry.update).to.be.equal(undefined);
    expect(entry.delete).to.be.equal(undefined);
    expect(entry.fetch).to.be.equal(undefined);
    expect(entry.query).to.not.equal(undefined);
    done();
  });

  it("Variants entry test with uid", (done) => {
    const entry = makeEntry({
      content_type_uid: "content_type_uid",
      entry_uid: "UID",
    });
    expect(entry.urlPath).to.be.equal(
      `/content_types/content_type_uid/entries/UID/variants`
    );
    done();
  });

  it("Variants entry Collection test with blank data", (done) => {
    const entries = new VariantsCollection(Axios, {});
    expect(entries.length).to.be.equal(0);
    done();
  });

  it("Variants entry Collection test with data", (done) => {
    const entries = new VariantsCollection(Axios, {
      entries: [varinatsEntryMock],
    });
    expect(entries.length).to.be.equal(1);
    checkEntry(entries[0].variants);
    done();
  });

  it("Variants entry Query test", (done) => {
    var mock = new MockAdapter(Axios);
    mock
      .onGet("/content_types/content_type_uid/entries/UID/variants")
      .reply(200, {
        entries: [varinatsEntryMock],
      });
    makeEntry({ content_type_uid: "content_type_uid", entry_uid: "UID" })
      .query()
      .find()
      .then((entry) => {
        checkEntry(entry.items[0].variants);
        done();
      })
      .catch(done);
  });

  it("Variants entry fetch test", (done) => {
    var mock = new MockAdapter(Axios);
    mock
      .onGet(
        "/content_types/content_type_uid/entries/UID/variants/variants_uid"
      )
      .reply(200, {
        entry: {
          ...varinatsEntryMock,
        },
      });
    makeEntry({
      content_type_uid: "content_type_uid",
      entry_uid: "UID",
      variants_uid: "variants_uid",
    })
      .fetch()
      .then((entry) => {
        checkEntry(entry.entry);
        done();
      })
      .catch(done);
  });
  it("Variants entry version test", (done) => {
    var mock = new MockAdapter(Axios);
    mock
      .onGet(
        "/content_types/content_type_uid/entries/UID/variants/variants_uid/versions"
      )
      .reply(200, {
          ...variantEntryVersion,
      });
    makeEntry({
      content_type_uid: "content_type_uid",
      entry_uid: "UID",
      variants_uid: "variants_uid",
    })
      .versions()
      .then((entry) => {
        expect(entry.versions.length).to.be.equal(3);
        done();
      })
      .catch(done);
  });
});

function makeEntry(data) {
  return new Variants(Axios, { ...data });
}

function checkEntry(entry) {
  checkSystemFields(entry);
}
