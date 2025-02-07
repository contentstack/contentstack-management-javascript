import Axios from "axios";
import { expect } from "chai";
import { describe, it } from "mocha";
import MockAdapter from "axios-mock-adapter";
import {
  Variants,
  VariantsCollection,
} from "../../lib/stack/contentType/entry/variants/";
import { Entry } from "../../lib/stack/contentType/entry/";
import {
  checkSystemFields,
  varinatsEntryMock,
  variantEntryVersion,
} from "./mock/objects";
import { systemUidMock, noticeMock } from "./mock/objects";

describe("Contentstack Variants entry test", () => {
  it("Variants entry test without uid", (done) => {
    const entry = makeEntryVariants({
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
    const entry = makeEntryVariants({
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
    makeEntryVariants({
      content_type_uid: "content_type_uid",
      entry_uid: "UID",
    })
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
    makeEntryVariants({
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
    makeEntryVariants({
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

  it("Entry publish test", (done) => {
    var mock = new MockAdapter(Axios);
    const publishVariantEntryFirst = {
      entry: {
        environments: ["development"],
        locales: ["en-us"],
        variants: [
          {
            uid: "variants_uid",
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
    mock
      .onPost("/content_types/content_type_uid/entries/UID/publish")
      .reply(200, {
        ...noticeMock,
        job_id: "job_id",
      });

    makeEntry({ entry: { ...systemUidMock }, options: { api_version: "3.2" } })
      .publish({
        publishDetails: publishVariantEntryFirst.entry,
        locale: publishVariantEntryFirst.locale,
      })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice);
        expect(entry.job_id).to.be.not.equal(undefined);
        done();
      })
      .catch(done);
  });

  it("Entry unpublish test", (done) => {
    var unpublishVariantEntryFirst = {
      entry: {
        environments: ["development"],
        locales: ["en-at"],
        variants: [
          {
            uid: "",
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
    var mock = new MockAdapter(Axios);
    mock
      .onPost("/content_types/content_type_uid/entries/UID/unpublish")
      .reply(200, {
        ...noticeMock,
        job_id: "job_id",
      });
    makeEntry({ entry: { ...systemUidMock }, options: { api_version: "3.2" } })
      .unpublish({
        publishDetails: unpublishVariantEntryFirst.entry,
        locale: unpublishVariantEntryFirst.locale,
      })
      .then((entry) => {
        expect(entry.notice).to.be.equal(noticeMock.notice);
        done();
      })
      .catch(done);
  });

  it("Variants update test", (done) => {
    var mock = new MockAdapter(Axios);
    const updatedData = {
      entry: {
        title: "Updated Variant Title",
        url: "/updated-variant-url",
      },
    };
    const variantEntryMock = {
      uid: 'variant_uid',
      title: 'Variant Title',
      content_type: 'content_type_uid',
      locale: 'en-us',
      _version: 1,
      _in_progress: false
    }

    mock
      .onPut(`/content_types/content_type_uid/entries/entry_uid/variants/variant_uid`)
      .reply(200, {
        entry: {
          ...variantEntryMock,
          ...updatedData.entry,
        },
      });

      makeEntryVariants({
      content_type_uid: "content_type_uid",
      entry_uid: "entry_uid",
      variants_uid: "variant_uid",
    })
      .update(updatedData)
      .then((response) => {
        expect(response.entry.title).to.be.equal("Updated Variant Title");
        expect(response.entry.url).to.be.equal("/updated-variant-url");
        done();
      })
      .catch(done);
  });
});

function makeEntryVariants(data) {
  return new Variants(Axios, { ...data });
}

function makeEntry(data) {
  return new Entry(Axios, { content_type_uid: "content_type_uid", ...data });
}

function checkEntry(entry) {
  checkSystemFields(entry);
}
