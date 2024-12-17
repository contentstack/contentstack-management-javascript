import Axios from 'axios';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { describe, it } from 'mocha';
import { BulkOperation } from '../../lib/stack/bulkOperation';
import { stackHeadersMock } from './mock/objects';

describe('Contentstack BulkOperation test', () => {
  it('BulkOperation test without uid', done => {
    const bulkOperation = makeBulkOperation();
    expect(bulkOperation.urlPath).to.be.equal('/bulk');
    expect(bulkOperation.stackHeaders).to.be.equal(undefined);
    expect(bulkOperation.addItems).to.not.equal(undefined);
    expect(bulkOperation.publish).to.not.equal(undefined);
    expect(bulkOperation.unpublish).to.not.equal(undefined);
    expect(bulkOperation.delete).to.not.equal(undefined);
    done();
  });

  it('BulkOperation test with stackHeaders', done => {
    const bulkOperation = makeBulkOperation({ stackHeaders: { ...stackHeadersMock } });
    expect(bulkOperation.urlPath).to.be.equal('/bulk');
    expect(bulkOperation.stackHeaders).to.not.equal(undefined);
    expect(bulkOperation.stackHeaders.api_key).to.be.equal(stackHeadersMock.api_key);
    expect(bulkOperation.addItems).to.not.equal(undefined);
    expect(bulkOperation.publish).to.not.equal(undefined);
    expect(bulkOperation.unpublish).to.not.equal(undefined);
    expect(bulkOperation.delete).to.not.equal(undefined);
    done();
  });

  it('should add items to a release', async () => {
    const items = {
      release: 'blt05e951e5f3a1d342',
      action: 'publish',
      locale: ['en-us'],
      reference: true,
      items: [
        {
          content_type_uid: 'ct_1',
          uid: 'bltf6e197a18a11ec5f',
          version: 2,
          locale: 'en-us',
          title: 'validation test',
        },
      ],
    };

    var mock = new MockAdapter(Axios);
    mock.onPost('/bulk/release/items').reply(200, {
      notice: 'Your add to release request is in progress.',
      job_id: 'job_id',
    });

    const response = await makeBulkOperation().addItems({ data: items, bulk_version: '2.0' });
    expect(response.notice).to.equal('Your add to release request is in progress.');
    expect(response.job_id).to.not.equal(undefined);
  });

  it('should publish items in bulk', async () => {
    const publishDetails = {
      entries: [
        {
          uid: 'entry_uid',
          content_type: 'content_type_uid',
          version: 'version',
          locale: 'entry_locale',
        },
      ],
      assets: [{ uid: 'uid' }],
      locales: ['en'],
      environments: ['env_uid'],
    };

    var mock = new MockAdapter(Axios);
    mock.onPost('/bulk/publish').reply(200, {
      notice: 'Your publish request is in progress.',
      job_id: 'job_id',
    });

    const response = await makeBulkOperation().publish({ details: publishDetails });
    expect(response.notice).to.equal('Your publish request is in progress.');
    expect(response.job_id).to.not.equal(undefined);
  });

  it('should unpublish items in bulk', async () => {
    const unpublishDetails = {
      entries: [
        {
          uid: 'entry_uid',
          content_type: 'content_type_uid',
          version: 'version',
          locale: 'entry_locale',
        },
      ],
      assets: [{ uid: 'uid' }],
      locales: ['en'],
      environments: ['env_uid'],
    };

    var mock = new MockAdapter(Axios);
    mock.onPost('/bulk/unpublish').reply(200, {
      notice: 'Your unpublish request is in progress.',
      job_id: 'job_id',
    });

    const response = await makeBulkOperation().unpublish({ details: unpublishDetails });
    expect(response.notice).to.equal('Your unpublish request is in progress.');
    expect(response.job_id).to.not.equal(undefined);
  });

  it('should delete items in bulk', async () => {
    const deleteDetails = {
      entries: [
        {
          uid: 'entry_uid',
          content_type: 'content_type_uid',
          locale: 'entry_locale',
        },
      ],
      assets: [{ uid: 'uid' }],
    };

    var mock = new MockAdapter(Axios);
    mock.onPost('/bulk/delete').reply(200, {
      notice: 'Your delete request is in progress.',
      job_id: 'job_id',
    });

    const response = await makeBulkOperation().delete({ details: deleteDetails });
    expect(response.notice).to.equal('Your delete request is in progress.');
    expect(response.job_id).to.not.equal(undefined);
  });

  it('should update items in bulk', async () => {
    const updateBody = {
      entries: [
        {
          content_type: 'content_type_uid1',
          uid: 'entry_uid',
          locale: 'en-us',
        },
        {
          content_type: 'content_type_uid2',
          uid: 'entry_uid',
          locale: 'en-us',
        },
      ],
      workflow: {
        workflow_stage: {
          comment: 'Workflow-related Comments',
          due_date: 'Thu Dec 01 2018',
          notify: false,
          uid: 'workflow_stage_uid',
          assigned_to: [
            {
              uid: 'user_uid',
              name: 'user_name',
              email: 'user_email_id',
            },
          ],
          assigned_by_roles: [
            {
              uid: 'role_uid',
              name: 'role_name',
            },
          ],
        },
      },
    };

    var mock = new MockAdapter(Axios);
    mock.onPost('/bulk/workflow').reply(200, {
      notice: 'Your update request is in progress.',
      job_id: 'job_id',
    });

    const response = await makeBulkOperation().update(updateBody);
    expect(response.notice).to.equal('Your update request is in progress.');
    expect(response.job_id).to.not.equal(undefined);
  });

  it('should fetch job status', async () => {
    const jobId = 'job_id';
    const jobStatusDetails = {
      job_id: jobId,
    };

    var mock = new MockAdapter(Axios);
    mock.onGet(`/bulk/jobs/${jobId}`).reply(200, {
      notice: 'Your job status request is successful.',
      status: 'completed',
    });

    const response = await makeBulkOperation().jobStatus(jobStatusDetails);
    expect(response.notice).to.equal('Your job status request is successful.');
    expect(response.status).to.equal('completed');
  });
});

function makeBulkOperation(data) {
  return new BulkOperation(Axios, data);
}