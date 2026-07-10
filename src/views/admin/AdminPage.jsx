'use client'

import { useState } from 'react'
import { Activity, AlertTriangle, KeyRound, ShieldCheck, UserMinus, Users } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { DistributionChart, LoginActivityChart } from '../../components/charts/Charts'
import { Modal } from '../../components/forms/Modal'
import { DataTable } from '../../components/tables/DataTable'
import { loginActivity, roleDistribution } from '../../data/securityEvents'
import { roleLabels } from '../../data/employees'
import { useMockData } from '../../context/MockDataContext'

const permissions = [
  ['Identity', 'View users', true, true, true, false, false, false],
  ['Identity', 'Suspend account', true, false, false, false, false, false],
  ['Identity', 'Change role', true, false, false, false, false, false],
  ['Operations', 'Open incident', false, true, false, false, false, false],
  ['Scheduling', 'Publish roster', false, false, true, false, false, false],
  ['Approvals', 'Approve leave', false, false, false, true, false, false],
  ['Crew', 'Confirm assignment', false, false, false, false, true, false],
  ['Maintenance', 'Clear aircraft', false, false, false, false, false, true],
]

export function AdminPage({ section = 'dashboard' }) {
  const data = useMockData()
  const [inviteOpen, setInviteOpen] = useState(false)

  if (section === 'users') return <UsersScreen data={data} />
  if (section === 'roles') return <RolesScreen />
  if (section === 'permissions') return <PermissionMatrix />
  if (section === 'invitations') return <InvitationsScreen onOpen={() => setInviteOpen(true)} />
  if (section === 'sessions') return <SessionsScreen data={data} />
  if (section === 'audit') return <AuditScreen data={data} />
  if (section === 'security') return <SecuritySettings resetDemoData={data.resetDemoData} />

  return (
    <>
      <PageHeader
        actions={<ActionButton onClick={() => setInviteOpen(true)}>Create invitation</ActionButton>}
        eyebrow="Identity and security"
        title="System administration dashboard"
      >
        Monitor account health, sessions, failed access attempts, and sensitive changes across
        ETL Airlines Operation Portal.
      </PageHeader>
      <section className="metrics-grid">
        <MetricCard icon={Users} label="Active accounts" value={data.employees.filter((e) => e.status !== 'Suspended').length} detail="All role workspaces" tone="green" />
        <MetricCard icon={UserMinus} label="Suspended" value={data.employees.filter((e) => e.status === 'Suspended').length} detail="Unavailable employees" tone="red" />
        <MetricCard icon={Activity} label="Active sessions" value="42" detail="Mock session monitor" />
        <MetricCard icon={AlertTriangle} label="Failed sign-ins" value="13" detail="Last 24 hours" tone="amber" />
      </section>
      <section className="dashboard-grid">
        <Panel eyebrow="Access telemetry" title="Login activity">
          <LoginActivityChart data={loginActivity} />
        </Panel>
        <Panel eyebrow="Identity composition" title="Role distribution">
          <DistributionChart data={roleDistribution} />
        </Panel>
      </section>
      <section className="dashboard-grid">
        <Panel eyebrow="Security timeline" title="Recent security events">
          <SecurityTimeline events={data.securityEvents} />
        </Panel>
        <Panel eyebrow="Sensitive actions" title="Recent audit records">
          <DataTable
            columns={[
              { key: 'time', label: 'Time' },
              { key: 'actor', label: 'Actor' },
              { key: 'action', label: 'Action' },
              { key: 'severity', label: 'Severity', render: (row) => <StatusBadge status={row.severity} /> },
            ]}
            rows={data.securityEvents}
            pageSize={4}
          />
        </Panel>
      </section>
      {inviteOpen && <InvitationModal onClose={() => setInviteOpen(false)} />}
    </>
  )
}

function UsersScreen({ data }) {
  return (
    <>
      <PageHeader eyebrow="Accounts" title="Users">
        Suspend, restore, inspect, and filter employee access records.
      </PageHeader>
      <Panel title="Account directory" eyebrow="Mock identity store">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'position', label: 'Position' },
            { key: 'role', label: 'Role', render: (row) => roleLabels[row.role] },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) =>
                row.status === 'Suspended' ? (
                  <ActionButton tone="secondary" onClick={() => data.restoreEmployee(row.id)}>Restore</ActionButton>
                ) : (
                  <ActionButton tone="danger" onClick={() => data.suspendEmployee(row.id)}>Suspend</ActionButton>
                ),
            },
          ]}
          rows={data.employees}
        />
      </Panel>
    </>
  )
}

function RolesScreen() {
  const rows = Object.entries(roleLabels).map(([id, label]) => ({
    id,
    label,
    access: id === 'admin' ? 'Full security administration' : 'Scoped operational workspace',
  }))
  return (
    <>
      <PageHeader eyebrow="Access model" title="Roles">
        Review mock role definitions and operational access boundaries.
      </PageHeader>
      <Panel title="Role catalog">
        <DataTable
          columns={[
            { key: 'label', label: 'Role' },
            { key: 'access', label: 'Access scope' },
            { key: 'actions', label: 'Mock action', render: () => <ActionButton tone="secondary">Change role</ActionButton> },
          ]}
          rows={rows}
        />
      </Panel>
    </>
  )
}

function PermissionMatrix() {
  return (
    <>
      <PageHeader eyebrow="Permission matrix" title="Role permissions">
        Read-only mock matrix grouped by permission area.
      </PageHeader>
      <Panel title="Permission matrix" eyebrow="Searchable mock state">
        <div className="permission-matrix">
          <div className="matrix-row header">
            <span>Permission</span>
            {Object.values(roleLabels).map((role) => <span key={role}>{role}</span>)}
          </div>
          {permissions.map(([group, permission, ...values]) => (
            <div className="matrix-row" key={`${group}-${permission}`}>
              <span><small>{group}</small>{permission}</span>
              {values.map((enabled, index) => (
                <span className={enabled ? 'enabled' : ''} key={`${permission}-${index}`}>
                  {enabled ? 'Yes' : 'No'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function InvitationsScreen({ onOpen }) {
  return (
    <>
      <PageHeader actions={<ActionButton onClick={onOpen}>Create invitation</ActionButton>} eyebrow="Invitations" title="Pending invitations" />
      <Panel title="Invitation queue">
        <DataTable
          columns={[
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'expires', label: 'Expires' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={[
            { id: 'INV-1', email: 'new.scheduler@etl.example', role: 'Crew Scheduler', expires: '2026-07-17', status: 'Pending' },
            { id: 'INV-2', email: 'security.analyst@etl.example', role: 'System Administrator', expires: '2026-07-15', status: 'Pending' },
          ]}
        />
      </Panel>
    </>
  )
}

function SessionsScreen({ data }) {
  const rows = data.employees.slice(0, 8).map((employee, index) => ({
    id: `SES-${index}`,
    name: employee.name,
    role: roleLabels[employee.role],
    device: index % 2 ? 'Windows workstation' : 'iPad crew portal',
    lastSeen: employee.lastSeen,
    status: index === 1 ? 'Risk' : 'Active',
  }))
  return (
    <>
      <PageHeader eyebrow="Sessions" title="Active sessions" />
      <Panel title="Session monitor">
        <DataTable
          columns={[
            { key: 'name', label: 'Employee' },
            { key: 'role', label: 'Role' },
            { key: 'device', label: 'Device' },
            { key: 'lastSeen', label: 'Last seen' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'action', label: 'Action', render: () => <ActionButton tone="secondary">Revoke</ActionButton> },
          ]}
          rows={rows}
        />
      </Panel>
    </>
  )
}

function AuditScreen({ data }) {
  return (
    <>
      <PageHeader eyebrow="Audit logs" title="Sensitive action history" />
      <Panel title="Audit event filter">
        <DataTable
          columns={[
            { key: 'time', label: 'Time' },
            { key: 'actor', label: 'Actor' },
            { key: 'area', label: 'Area' },
            { key: 'action', label: 'Action' },
            { key: 'severity', label: 'Severity', render: (row) => <StatusBadge status={row.severity} /> },
          ]}
          rows={data.securityEvents}
        />
      </Panel>
    </>
  )
}

function SecuritySettings({ resetDemoData }) {
  return (
    <>
      <PageHeader eyebrow="Security settings" title="Security controls" />
      <Panel title="Demo controls" eyebrow="Frontend-only settings">
        <div className="settings-grid">
          <div>
            <strong>Session timeout</strong>
            <span>30 minutes inactivity</span>
          </div>
          <div>
            <strong>Password resets</strong>
            <span>5 pending mock requests</span>
          </div>
          <div>
            <strong>Reset demo data</strong>
            <span>Restore local mock state across all roles.</span>
            <ActionButton tone="danger" onClick={resetDemoData}>Reset demo data</ActionButton>
          </div>
        </div>
      </Panel>
    </>
  )
}

function SecurityTimeline({ events }) {
  return (
    <div className="event-timeline">
      {events.map((event) => (
        <article key={event.id}>
          <span>{event.time}</span>
          <div>
            <strong>{event.action}</strong>
            <small>{event.actor} - {event.area}</small>
          </div>
          <StatusBadge status={event.severity} />
        </article>
      ))}
    </div>
  )
}

function InvitationModal({ onClose }) {
  const [email, setEmail] = useState('')
  const valid = email.includes('@')
  return (
    <Modal title="Create invitation" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); if (valid) onClose() }}>
        <label>
          Employee email
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="employee@etl.example" />
          {!valid && email && <small className="error-text">Enter a valid email address.</small>}
        </label>
        <label>
          Role
          <select defaultValue="scheduler">
            <option value="scheduler">Crew Scheduler</option>
            <option value="supervisor">Supervisor</option>
            <option value="operations">Operations Manager</option>
          </select>
        </label>
        <div className="form-actions">
          <ActionButton tone="secondary" onClick={onClose}>Cancel</ActionButton>
          <button className="action-button primary" disabled={!valid} type="submit">Send invitation</button>
        </div>
      </form>
    </Modal>
  )
}
