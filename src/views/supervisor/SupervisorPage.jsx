'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ClipboardCheck, Clock3, History, Users } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Modal } from '../../components/forms/Modal'
import { DataTable } from '../../components/tables/DataTable'
import { employees } from '../../data/employees'
import { useMockData } from '../../context/MockDataContext'

export function SupervisorPage({ section = 'approvals' }) {
  const data = useMockData()
  const [selected, setSelected] = useState(null)

  const requests = useMemo(() => {
    if (section === 'leave') return data.requests.filter((request) => request.type === 'Leave')
    if (section === 'swaps') return data.requests.filter((request) => request.type === 'Swap')
    if (section === 'replacements') return data.requests.filter((request) => request.type === 'Replacement')
    return data.requests
  }, [data.requests, section])

  if (section === 'team') return <TeamOverview data={data} />
  if (section === 'history') return <HistoryScreen data={data} />
  if (section === 'escalations') return <Escalations data={data} />

  return (
    <>
      <PageHeader eyebrow="Approval system" title={titleFor(section)}>
        Review leave, swap, replacement, overtime, sick reports, escalations, and coverage impact.
      </PageHeader>
      <section className="metrics-grid">
        <MetricCard icon={ClipboardCheck} label="Pending leave" value={data.requests.filter((r) => r.type === 'Leave' && r.status === 'Pending').length} detail="Awaiting decision" tone="amber" />
        <MetricCard icon={Users} label="Swap requests" value={data.requests.filter((r) => r.type === 'Swap').length} detail="Crew initiated" />
        <MetricCard icon={AlertTriangle} label="Escalated conflicts" value="2" detail="Rest and coverage" tone="red" />
        <MetricCard icon={History} label="History" value={data.approvalHistory.length} detail="Local decisions" />
      </section>
      <section className="supervisor-split">
        <Panel title="Approval queue" eyebrow="Decision list">
          <div className="approval-list">
            {requests.map((request) => (
              <button
                className={selected?.id === request.id ? 'active' : ''}
                key={request.id}
                type="button"
                onClick={() => setSelected(request)}
              >
                <div>
                  <strong>{request.type}</strong>
                  <span>{employeeName(request.employeeId)} - {request.dates}</span>
                </div>
                <StatusBadge status={request.status} />
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Request detail" eyebrow="Operational impact">
          {selected ? (
            <RequestDetail request={selected} decideRequest={data.decideRequest} />
          ) : (
            <div className="empty-state">Select a request to review employee history, impact, timeline, and decision actions.</div>
          )}
        </Panel>
      </section>
    </>
  )
}

function RequestDetail({ decideRequest, request }) {
  const [note, setNote] = useState(request.notes || '')
  return (
    <div className="request-detail">
      <dl>
        <dt>Employee</dt><dd>{employeeName(request.employeeId)}</dd>
        <dt>Request type</dt><dd>{request.type}</dd>
        <dt>Reason</dt><dd>{request.reason}</dd>
        <dt>Dates</dt><dd>{request.dates}</dd>
        <dt>Current assignment</dt><dd>{request.assignment}</dd>
        <dt>Operational impact</dt><dd>{request.impact}</dd>
        <dt>Recommended replacement</dt><dd>{request.replacement}</dd>
      </dl>
      <label>
        Supervisor notes
        <textarea value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <div className="timeline-small">
        {request.timeline.map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="decision-actions">
        <ActionButton onClick={() => decideRequest(request.id, 'Approved', note)}>Approve</ActionButton>
        <ActionButton tone="danger" onClick={() => decideRequest(request.id, 'Rejected', note)}>Reject</ActionButton>
        <ActionButton tone="secondary" onClick={() => decideRequest(request.id, 'Clarification Requested', note)}>Request clarification</ActionButton>
        <ActionButton tone="secondary" onClick={() => decideRequest(request.id, 'Escalated', note)}>Escalate</ActionButton>
      </div>
    </div>
  )
}

function TeamOverview({ data }) {
  return (
    <>
      <PageHeader eyebrow="Team" title="Team overview" />
      <Panel title="Crew status">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'position', label: 'Position' },
            { key: 'base', label: 'Base' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={data.employees.filter((employee) => employee.role === 'crew')}
        />
      </Panel>
    </>
  )
}

function HistoryScreen({ data }) {
  return (
    <>
      <PageHeader eyebrow="Approval history" title="Decision history" />
      <Panel title="Local approval history">
        <DataTable
          columns={[
            { key: 'requestId', label: 'Request' },
            { key: 'type', label: 'Type' },
            { key: 'employeeId', label: 'Employee' },
            { key: 'status', label: 'Decision', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'time', label: 'Time' },
          ]}
          rows={data.approvalHistory}
          empty="No decisions recorded yet"
        />
      </Panel>
    </>
  )
}

function Escalations({ data }) {
  return (
    <>
      <PageHeader eyebrow="Escalations" title="Escalated conflicts" />
      <Panel title="Escalation queue">
        <div className="conflict-list">
          {data.requests.filter((request) => ['High', 'Critical'].includes(request.priority)).map((request) => (
            <article key={request.id}>
              <Clock3 size={18} />
              <div><strong>{request.type}</strong><span>{request.impact}</span></div>
              <StatusBadge status={request.priority} />
            </article>
          ))}
        </div>
      </Panel>
    </>
  )
}

function titleFor(section) {
  if (section === 'leave') return 'Leave requests'
  if (section === 'swaps') return 'Swap requests'
  if (section === 'replacements') return 'Replacement requests'
  return 'Approval queue'
}

function employeeName(id) {
  return employees.find((employee) => employee.id === id)?.name || id
}
