import path from 'path'
import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { GlobalField, GlobalFieldCollection, createFormData } from '../../lib/stack/globalField'
import { systemUidMock, checkSystemFields, globalFieldMock, stackHeadersMock, noticeMock, nestedGlobalFieldMock, nestedGlobalFieldPayload } from './mock/objects'
import MockAdapter from 'axios-mock-adapter'

describe("Contentstack GlobalField test", () => {
  it("GlobalField test without uid", (done) => {
    const globalField = makeGlobalField();
    expect(globalField.urlPath).to.be.equal("/global_fields");
    expect(globalField.stackHeaders).to.be.equal(undefined);
    expect(globalField.update).to.be.equal(undefined);
    expect(globalField.delete).to.be.equal(undefined);
    expect(globalField.fetch).to.be.equal(undefined);
    expect(globalField.create).to.not.equal(undefined);
    expect(globalField.query).to.not.equal(undefined);
    done();
  });

  it("GlobalField test with uid", (done) => {
    const globalField = makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
    });
    expect(globalField.urlPath).to.be.equal(
      `/global_fields/${systemUidMock.uid}`
    );
    expect(globalField.stackHeaders).to.be.equal(undefined);
    expect(globalField.update).to.not.equal(undefined);
    expect(globalField.delete).to.not.equal(undefined);
    expect(globalField.fetch).to.not.equal(undefined);
    expect(globalField.create).to.be.equal(undefined);
    expect(globalField.query).to.be.equal(undefined);
    done();
  });

  it("GlobalField test with Stack Headers", (done) => {
    const globalField = makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
    });
    expect(globalField.urlPath).to.be.equal(
      `/global_fields/${systemUidMock.uid}`
    );
    expect(globalField.stackHeaders).to.not.equal(undefined);
    expect(globalField.stackHeaders.api_key).to.be.equal(
      stackHeadersMock.api_key
    );
    expect(globalField.update).to.not.equal(undefined);
    expect(globalField.delete).to.not.equal(undefined);
    expect(globalField.fetch).to.not.equal(undefined);
    expect(globalField.create).to.be.equal(undefined);
    expect(globalField.query).to.be.equal(undefined);
    done();
  });

  it("GlobalField Collection test with blank data", (done) => {
    const globalFields = new GlobalFieldCollection(Axios, {});
    expect(globalFields.length).to.be.equal(0);
    done();
  });

  it("GlobalField Collection test with data", (done) => {
    const globalFields = new GlobalFieldCollection(Axios, {
      global_fields: [globalFieldMock],
    });
    expect(globalFields.length).to.be.equal(1);
    checkGlobalField(globalFields[0]);
    done();
  });

  it("GlobalField create test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    makeGlobalField()
      .create()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField Query test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onGet("/global_fields").reply(200, {
      global_fields: [globalFieldMock],
    });
    makeGlobalField()
      .query()
      .find()
      .then((globalField) => {
        checkGlobalField(globalField.items[0]);
        done();
      })
      .catch(done);
  });

  it("GlobalField update test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPut("/global_fields/UID").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
    })
      .update()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField fetch test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onGet("/global_fields/UID").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
    })
      .fetch()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField delete test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onDelete("/global_fields/UID").reply(200, {
      ...noticeMock,
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice);
        done();
      })
      .catch(done);
  });

  it("Global Field import test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields/import").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    const gfUpload = {
      global_field: path.join(__dirname, "../api/mock/globalfield.json"),
    };
    const form = createFormData(gfUpload)();
    var boundary = form.getBoundary();

    expect(boundary).to.be.equal(form.getBoundary());
    expect(boundary.length).to.be.equal(50);
    makeGlobalField()
      .import()
      .then((webhook) => {
        checkGlobalField(webhook);
        done();
      })
      .catch(done);
  });

  it("Global Field import test with overwrite flag", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields/import").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    const gfUpload = {
      global_field: path.join(__dirname, "../api/mock/globalfield.json"),
    };
    const form = createFormData(gfUpload)();
    var boundary = form.getBoundary();

    expect(boundary).to.be.equal(form.getBoundary());
    expect(boundary.length).to.be.equal(50);
    makeGlobalField()
      .import(gfUpload, { overwrite: true })
      .then((webhook) => {
        checkGlobalField(webhook);
        done();
      })
      .catch(done);
  });
});

describe("Contentstack GlobalField test (API Version 3.2)", () => {
  it("GlobalField test without uid", (done) => {
    const globalField = makeGlobalField({
      stackHeaders: stackHeadersMock,
      api_version: "3.2"});
    expect(globalField.urlPath).to.be.equal("/global_fields");
    expect(globalField.apiVersion).to.be.equal("3.2");
    expect(globalField.stackHeaders).to.deep.equal({api_key: 'api_key', api_version: '3.2'});
    done();
  });

  it("GlobalField test with uid", (done) => {
    const globalField = makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
      api_version: "3.2",
    });
    expect(globalField.urlPath).to.be.equal(
      `/global_fields/${systemUidMock.uid}`
    );
    expect(globalField.apiVersion).to.be.equal("3.2");
    expect(globalField.update).to.not.equal(undefined);
    expect(globalField.delete).to.not.equal(undefined);
    expect(globalField.fetch).to.not.equal(undefined);
    expect(globalField.create).to.be.equal(undefined);
    expect(globalField.query).to.be.equal(undefined);
    done();
  });

  it("GlobalField test with Stack Headers", (done) => {
    const globalField = makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
      api_version: "3.2",
    });
    expect(globalField.urlPath).to.be.equal(
      `/global_fields/${systemUidMock.uid}`
    );
    expect(globalField.apiVersion).to.be.equal("3.2");
    expect(globalField.stackHeaders).to.not.equal(undefined);
    expect(globalField.stackHeaders.api_key).to.be.equal(
      stackHeadersMock.api_key
    );
    expect(globalField.update).to.not.equal(undefined);
    expect(globalField.delete).to.not.equal(undefined);
    expect(globalField.fetch).to.not.equal(undefined);
    expect(globalField.create).to.be.equal(undefined);
    expect(globalField.query).to.be.equal(undefined);
    done();
  });

  it("GlobalField Collection test with blank data", (done) => {
    const globalFields = new GlobalFieldCollection(Axios, {
      api_version: "3.2",
    });
    expect(globalFields.length).to.be.equal(0);
    done();
  });

  it("GlobalField Collection test with data", (done) => {
    const globalFields = new GlobalFieldCollection(Axios, {
      global_fields: [nestedGlobalFieldMock],
      api_version: "3.2",
    });
    expect(globalFields.length).to.be.equal(1);
    checkGlobalField(globalFields[0]);
    done();
  });

  it("GlobalField create test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields").reply(200, {
      global_field: {
        ...nestedGlobalFieldMock,
      },
    });
    makeGlobalField({
      stackHeaders: stackHeadersMock,
      api_version: "3.2"})
      .create()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField Query test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onGet("/global_fields").reply(200, {
      global_fields: [nestedGlobalFieldMock],
    });
    makeGlobalField({
      stackHeaders: stackHeadersMock,
      api_version: "3.2"})
      .query()
      .find()
      .then((globalField) => {
        checkGlobalField(globalField.items[0]);
        done();
      })
      .catch(done);
  });

  it("GlobalField update test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPut("/global_fields/UID").reply(200, {
      global_field: {
        ...nestedGlobalFieldMock,
      },
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
      api_version: "3.2",
    })
      .update()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField fetch test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onGet("/global_fields/UID").reply(200, {
      global_field: {
        ...nestedGlobalFieldMock,
      },
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
      api_version: "3.2",
    })
      .fetch()
      .then((globalField) => {
        checkGlobalField(globalField.global_field);
        done();
      })
      .catch(done);
  });

  it("GlobalField delete test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onDelete("/global_fields/UID").reply(200, {
      ...noticeMock,
    });
    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
      api_version: "3.2",
    })
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal(noticeMock.notice);
        done();
      })
      .catch(done);
  });

  it("GlobalField import test", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields/import").reply(200, {
      global_field: {
        ...globalFieldMock,
      },
    });
    const gfUpload = {
      global_field: path.join(__dirname, "../api/mock/globalfield.json"),
    };
    const form = createFormData(gfUpload)();
    var boundary = form.getBoundary();

    expect(boundary).to.be.equal(form.getBoundary());
    expect(boundary.length).to.be.equal(50);
    makeGlobalField({
      stackHeaders: stackHeadersMock,
      api_version: "3.2"})
      .import()
      .then((webhook) => {
        checkGlobalField(webhook);
        done();
      })
      .catch(done);
  });

  it("GlobalField import test with overwrite flag", (done) => {
    var mock = new MockAdapter(Axios);
    mock.onPost("/global_fields/import").reply(200, {
      global_field: {
        ...nestedGlobalFieldMock,
      },
    });
    const gfUpload = {
      global_field: path.join(__dirname, "../api/mock/globalfield.json"),
    };
    const form = createFormData(gfUpload)();
    var boundary = form.getBoundary();

    expect(boundary).to.be.equal(form.getBoundary());
    expect(boundary.length).to.be.equal(50);
    makeGlobalField({
      stackHeaders: stackHeadersMock,
      api_version: "3.2"})
      .import(gfUpload, { overwrite: true })
      .then((webhook) => {
        checkGlobalField(webhook);
        done();
      })
      .catch(done);
  });

  it("should update nested global field", (done) => {
    var mock = new MockAdapter(Axios);
    const updatedData = {
      global_field: {
        title: "Updated Nested Global Field Title",
        schema: nestedGlobalFieldPayload,
      },
    };

    mock
      .onPut(`/global_fields/${systemUidMock.uid}`)
      .reply(200, {
        global_field: {
          ...nestedGlobalFieldMock,
          ...updatedData.global_field,
        },
      });

    makeGlobalField({
      global_field: {
        ...systemUidMock,
      },
      stackHeaders: stackHeadersMock,
    })
      .updateNestedGlobalField(updatedData)
      .then((response) => {
        expect(response.global_field.title).to.be.equal("Updated Nested Global Field Title");
        expect(response.global_field.schema).to.deep.equal(nestedGlobalFieldPayload);
        done();
      })
      .catch(done);
  });
});

function makeGlobalField (data) {
  return new GlobalField(Axios, data)
}

function checkGlobalField(globalField) {
  checkSystemFields(globalField);
  expect(globalField.title).to.be.equal("title");
  expect(globalField.schema.length).to.be.equal(2);
}
