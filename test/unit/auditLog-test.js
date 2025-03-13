import Axios from 'axios'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import MockAdapter from 'axios-mock-adapter'
import { stackHeadersMock, auditLogsMock, auditLogItemMock } from './mock/objects'
import { AuditLog } from '../../lib/stack/auditlog'

describe('Contentstack AuditLog test', () => {
  it('AuditLog test without uid', done => {
    const branch = makeAuditLog()
    expect(branch).to.not.equal(undefined)
    expect(branch.uid).to.be.equal(undefined)
    expect(branch.urlPath).to.be.equal('/audit-logs')
    expect(branch.fetch).to.equal(undefined)
    expect(branch.fetchAll).to.not.equal(undefined)
    done()
  })

  it('AuditLog test with uid', done => {
    const branch = makeAuditLog({ logs: { uid: 'logUid' } })
    expect(branch).to.not.equal(undefined)
    expect(branch.uid).to.be.equal('logUid')
    expect(branch.urlPath).to.be.equal('/audit-logs/logUid')
    expect(branch.fetch).to.not.equal(undefined)
    expect(branch.fetchAll).to.equal(undefined)
    done()
  })

  it('AuditLog Fetch all without Stack Headers test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/audit-logs').reply(200, auditLogsMock)
    makeAuditLog()
      .fetchAll()
      .then((response) => {
        expect(response.items[0].created_at).to.be.equal('created_at_date')
        expect(response.items[0].uid).to.be.equal('UID')
        done()
      })
      .catch(done)
  })

  it('AuditLog Fetch all with params test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/audit-logs').reply(200, auditLogsMock)
    makeAuditLog({ stackHeaders: stackHeadersMock })
      .fetchAll({})
      .then((response) => {
        expect(response.items[0].created_at).to.be.equal('created_at_date')
        expect(response.items[0].uid).to.be.equal('UID')
        done()
      })
      .catch(done)
  })

  it('AuditLog fetch test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/audit-logs/UID').reply(200, auditLogItemMock)
    makeAuditLog({ stackHeaders: stackHeadersMock, logs: { uid: 'UID' } })
      .fetch()
      .then((response) => {
        expect(response.logs.created_at).to.be.equal('created_at_date')
        expect(response.logs.uid).to.be.equal('UID')
        done()
      })
      .catch(done)
  })

  it('AuditLog fetch failing test', done => {
    var mock = new MockAdapter(Axios)
    mock.onGet('/audit-logs/UID').reply(400, {})
    makeAuditLog({ stackHeaders: stackHeadersMock, logs: { uid: 'UID' } })
      .fetch()
      .then(done)
      .catch((error) => {
        expect(error).to.not.equal(null)
        done()
      })
  })
})

function makeAuditLog (data) {
  return new AuditLog(Axios, data)
}
