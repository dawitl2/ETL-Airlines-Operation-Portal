'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardCheck, Plane, Wrench } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Modal } from '../../components/forms/Modal'
import { DataTable } from '../../components/tables/DataTable'
import { checklistItems } from '../../data/maintenance'
import { useMockData } from '../../context/MockDataContext'
import { useSession } from '../../context/SessionContext'

export function MaintenancePage({ section = 'dashboard' }) {
  const data = useMockData()
  const [defectOpen, setDefectOpen] = useState(false)

  if (section === 'work-orders') return <WorkOrders data={data} />
  if (section === 'aircraft') return <Aircraft data={data} />
  if (section === 'inspections') return <Inspections />
  if (section === 'defects') return <Defects data={data} onOpen={() => setDefectOpen(true)} />
  if (section === 'clearance') return <Clearance data={data} />
  if (section === 'parts') return <Parts />
  if (section === 'history') return <History data={data} />
  if (section === 'handover') return <Handover />

  return (
    <>
      <PageHeader actions={<ActionButton onClick={() => setDefectOpen(true)}>Record defect</ActionButton>} eyebrow="Technical operations" title="Maintenance dashboard">
        Industrial work-order view for aircraft readiness, open defects, clearance states, and handover notes.
      </PageHeader>
      <section className="metrics-grid">
        <MetricCard icon={Wrench} label="Assigned tasks" value={data.workOrders.length} detail="Current shift" />
        <MetricCard icon={AlertTriangle} label="Urgent work orders" value={data.workOrders.filter((w) => w.priority === 'Critical' || w.priority === 'High').length} detail="High priority" tone="red" />
        <MetricCard icon={Plane} label="Awaiting inspection" value={data.aircraft.filter((a) => a.status === 'Inspection').length} detail="Aircraft holds" tone="amber" />
        <MetricCard icon={CheckCircle2} label="Completed" value={data.workOrders.filter((w) => w.status === 'Completed').length} detail="Recently completed" tone="green" />
      </section>
      <section className="dashboard-grid wide-left">
        <Panel title="Work-order pipeline" eyebrow="Kanban">
          <Kanban data={data} />
        </Panel>
        <Panel title="Aircraft clearance states" eyebrow="Release">
          <AircraftCards data={data} />
        </Panel>
      </section>
      {defectOpen && <DefectModal data={data} onClose={() => setDefectOpen(false)} />}
    </>
  )
}

function WorkOrders({ data }) {
  return (
    <>
      <PageHeader eyebrow="Work orders" title="Work-order pipeline" />
      <Kanban data={data} />
    </>
  )
}

function Kanban({ data }) {
  const stages = ['Assigned', 'Inspection', 'Parts', 'Completed']
  return (
    <div className="kanban">
      {stages.map((stage) => (
        <section key={stage}>
          <h3>{stage}</h3>
          {data.workOrders.filter((order) => order.stage === stage || order.status === stage).map((order) => (
            <article key={order.id}>
              <strong>{order.title}</strong>
              <span>{order.aircraftId} - Due {order.due}</span>
              <StatusBadge status={order.priority} />
              <div className="kanban-actions">
                <ActionButton tone="secondary" onClick={() => data.updateWorkOrder(order.id, 'In Progress')}>Start</ActionButton>
                <ActionButton tone="secondary" onClick={() => data.updateWorkOrder(order.id, 'Paused')}>Pause</ActionButton>
                <ActionButton onClick={() => data.updateWorkOrder(order.id, 'Completed')}>Complete</ActionButton>
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}

function Aircraft({ data }) {
  return (
    <>
      <PageHeader eyebrow="Aircraft" title="Aircraft status cards" />
      <AircraftCards data={data} />
    </>
  )
}

function AircraftCards({ data }) {
  return (
    <div className="aircraft-board">
      {data.aircraft.map((item) => (
        <article className="aircraft-card" key={item.id}>
          <div><strong>{item.id}</strong><span>{item.type}</span></div>
          <StatusBadge status={item.status} />
          <dl>
            <dt>Restriction</dt><dd>{item.restriction}</dd>
            <dt>Clearance</dt><dd>{item.clearance}</dd>
            <dt>Next flight</dt><dd>{item.nextFlight}</dd>
          </dl>
          <ActionButton tone="secondary">Submit for review</ActionButton>
        </article>
      ))}
    </div>
  )
}

function Inspections() {
  return (
    <>
      <PageHeader eyebrow="Inspections" title="Inspection checklist" />
      <Panel title="Release checklist">
        <div className="checklist">
          {checklistItems.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
        </div>
      </Panel>
    </>
  )
}

function Defects({ data, onOpen }) {
  return (
    <>
      <PageHeader actions={<ActionButton onClick={onOpen}>Record defect</ActionButton>} eyebrow="Defects" title="Open defects" />
      <Panel title="Defect log">
        <DataTable
          columns={[
            { key: 'id', label: 'Defect' },
            { key: 'aircraftId', label: 'Aircraft' },
            { key: 'title', label: 'Title' },
            { key: 'priority', label: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={data.defects}
        />
      </Panel>
    </>
  )
}

function Clearance({ data }) {
  return (
    <>
      <PageHeader eyebrow="Clearance" title="Aircraft clearance" />
      <AircraftCards data={data} />
    </>
  )
}

function Parts() {
  return (
    <>
      <PageHeader actions={<ActionButton>Request part</ActionButton>} eyebrow="Parts" title="Parts requests" />
      <Panel title="Parts queue">
        <DataTable
          columns={[
            { key: 'part', label: 'Part' },
            { key: 'aircraft', label: 'Aircraft' },
            { key: 'eta', label: 'ETA' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={[
            { id: 'PRT-1', part: 'Cabin PA amplifier', aircraft: 'ET-AYN', eta: 'Today 18:00', status: 'Requested' },
            { id: 'PRT-2', part: 'Galley latch kit', aircraft: 'ET-BAR', eta: 'Tomorrow 06:20', status: 'Waiting Parts' },
          ]}
        />
      </Panel>
    </>
  )
}

function History({ data }) {
  return (
    <>
      <PageHeader eyebrow="History" title="Technical history" />
      <Panel title="Maintenance history table">
        <DataTable
          columns={[
            { key: 'id', label: 'WO' },
            { key: 'aircraftId', label: 'Aircraft' },
            { key: 'title', label: 'Task' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={data.workOrders}
        />
      </Panel>
    </>
  )
}

function Handover() {
  const { currentUser } = useSession()
  return (
    <>
      <PageHeader eyebrow="Handover" title="Handover notes" />
      <Panel title="Shift handover">
        <div className="handover-note">
          <strong>{currentUser.profile.displayName}</strong>
          <p>ET-AYN cabin PA requires final test before boarding release. Notify Operations if review exceeds 20 minutes.</p>
          <ActionButton tone="secondary">Add note</ActionButton>
        </div>
      </Panel>
    </>
  )
}

function DefectModal({ data, onClose }) {
  const [aircraftId, setAircraftId] = useState(data.aircraft[0]?.id)
  const [title, setTitle] = useState('')
  const valid = title.trim().length > 5
  return (
    <Modal title="Record aircraft defect" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => {
        event.preventDefault()
        if (!valid) return
        data.recordDefect({ aircraftId, title, priority: 'High', createdBy: 'maintenance' })
        onClose()
      }}>
        <label>
          Aircraft
          <select value={aircraftId} onChange={(event) => setAircraftId(event.target.value)}>
            {data.aircraft.map((item) => <option key={item.id} value={item.id}>{item.id} - {item.type}</option>)}
          </select>
        </label>
        <label>
          Defect description
          <textarea value={title} onChange={(event) => setTitle(event.target.value)} />
          {!valid && title && <small className="error-text">Describe the defect in more detail.</small>}
        </label>
        <div className="form-actions">
          <ActionButton tone="secondary" onClick={onClose}>Cancel</ActionButton>
          <button className="action-button primary" disabled={!valid} type="submit">Record defect</button>
        </div>
      </form>
    </Modal>
  )
}
