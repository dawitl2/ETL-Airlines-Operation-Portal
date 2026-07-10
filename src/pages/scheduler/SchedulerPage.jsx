import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, CalendarDays, CheckCircle2, Plane, Save, Users } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { RosterGrid } from '../../components/calendar/RosterGrid'
import { DataTable } from '../../components/tables/DataTable'
import { Modal } from '../../components/forms/Modal'
import { employees } from '../../data/employees'
import { flights } from '../../data/flights'
import { conflictTypes } from '../../data/schedules'
import { useMockData } from '../../context/MockDataContext'

const crew = employees.filter((employee) => employee.role === 'crew')

export function SchedulerPage() {
  const { section = 'roster' } = useParams()
  const data = useMockData()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [assignmentOpen, setAssignmentOpen] = useState(false)

  if (section === 'assignments') return <Assignments data={data} onAssign={() => setAssignmentOpen(true)} />
  if (section === 'availability') return <Availability />
  if (section === 'conflicts') return <ConflictCenter data={data} />
  if (section === 'reserve') return <ReserveCrew />
  if (section === 'history') return <AssignmentHistory data={data} />
  if (section === 'monthly') return <MonthlyCalendar data={data} onSelect={setSelectedEvent} />

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton tone="secondary"><Save size={16} />Save draft</ActionButton>
            <ActionButton><CheckCircle2 size={16} />Publish roster</ActionButton>
          </>
        }
        eyebrow="Crew scheduling"
        title={section === 'weekly' ? 'Weekly roster' : 'Schedule board'}
      >
        Build assignments against availability, rest, qualifications, leave, reserve, and
        duty-hour limits.
      </PageHeader>
      <section className="scheduler-toolbar">
        <select defaultValue="week"><option value="day">Day view</option><option value="week">Week view</option><option value="month">Month view</option></select>
        <select defaultValue="all"><option value="all">All roles</option><option value="pilot">Pilots</option><option value="cabin">Cabin crew</option></select>
        <select defaultValue="ADD"><option value="ADD">ADD base</option></select>
        <button type="button">Previous</button>
        <button type="button">Today</button>
        <button type="button">Next</button>
        <button type="button" onClick={() => setAssignmentOpen(true)}>Assign employee</button>
      </section>
      <RosterGrid events={data.rosterEvents} onSelect={setSelectedEvent} />
      <section className="dashboard-grid">
        <Panel title="Conflict overlays" eyebrow="Automatic checks">
          <ConflictList events={data.rosterEvents} />
        </Panel>
        <Panel title="Coverage impact" eyebrow="Supervisor workflow">
          <DataTable
            columns={[
              { key: 'id', label: 'Request' },
              { key: 'type', label: 'Type' },
              { key: 'impact', label: 'Impact' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            ]}
            rows={data.requests}
            pageSize={4}
          />
        </Panel>
      </section>
      {selectedEvent && <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {assignmentOpen && <AssignmentModal data={data} onClose={() => setAssignmentOpen(false)} />}
    </>
  )
}

function Assignments({ data, onAssign }) {
  return (
    <>
      <PageHeader actions={<ActionButton onClick={onAssign}>Assign employee</ActionButton>} eyebrow="Assignments" title="Flight assignments" />
      <Panel title="Flight assignment coverage">
        <DataTable
          columns={[
            { key: 'id', label: 'Flight' },
            { key: 'route', label: 'Route' },
            { key: 'aircraft', label: 'Aircraft' },
            { key: 'coverage', label: 'Coverage', render: (row) => `${row.crewAssigned.length}/${row.crewRequired}` },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={flights}
        />
      </Panel>
    </>
  )
}

function Availability() {
  return (
    <>
      <PageHeader eyebrow="Availability" title="Crew availability" />
      <Panel title="Eligible crew search">
        <DataTable
          columns={[
            { key: 'name', label: 'Employee' },
            { key: 'position', label: 'Position' },
            { key: 'qualification', label: 'Qualification' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'action', label: 'Action', render: () => <ActionButton tone="secondary">Search eligible crew</ActionButton> },
          ]}
          rows={crew}
        />
      </Panel>
    </>
  )
}

function ConflictCenter({ data }) {
  return (
    <>
      <PageHeader eyebrow="Conflict center" title="Scheduling conflicts" />
      <section className="metrics-grid">
        {conflictTypes.slice(0, 4).map((type, index) => (
          <MetricCard key={type} icon={AlertTriangle} label={type} value={index + 1} detail="Mock rule check" tone={index === 0 ? 'red' : 'amber'} />
        ))}
      </section>
      <Panel title="Detected roster conflicts">
        <ConflictList events={data.rosterEvents} />
      </Panel>
    </>
  )
}

function ReserveCrew() {
  return (
    <>
      <PageHeader eyebrow="Reserve" title="Reserve crew desk" />
      <Panel title="Reserve pool">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'position', label: 'Position' },
            { key: 'base', label: 'Base' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={crew.filter((employee) => employee.status === 'Reserve' || employee.status === 'Available')}
        />
      </Panel>
    </>
  )
}

function AssignmentHistory({ data }) {
  return (
    <>
      <PageHeader eyebrow="History" title="Assignment history" />
      <Panel title="Recent assignment confirmations">
        <DataTable
          columns={[
            { key: 'flightId', label: 'Flight' },
            { key: 'employeeId', label: 'Employee' },
            { key: 'time', label: 'Confirmed at' },
          ]}
          rows={data.confirmations.map((item, index) => ({ id: `${item.flightId}-${index}`, ...item }))}
          empty="No assignment confirmations yet"
        />
      </Panel>
    </>
  )
}

function MonthlyCalendar({ data, onSelect }) {
  return (
    <>
      <PageHeader eyebrow="Monthly view" title="Monthly calendar" />
      <RosterGrid events={data.rosterEvents} onSelect={onSelect} />
    </>
  )
}

function ConflictList({ events }) {
  const conflicts = events.filter((event) => event.conflict)
  return (
    <div className="conflict-list">
      {conflicts.map((event) => (
        <article key={event.id}>
          <AlertTriangle size={18} />
          <div>
            <strong>{event.conflictType}</strong>
            <span>{event.employeeId} - {event.label}</span>
          </div>
          <ActionButton tone="secondary">Resolve conflict</ActionButton>
        </article>
      ))}
    </div>
  )
}

function EventDrawer({ event, onClose }) {
  return (
    <Modal title="Assignment details" onClose={onClose}>
      <div className="detail-stack">
        <p><strong>Event:</strong> {event.label}</p>
        <p><strong>Employee:</strong> {event.employeeId}</p>
        <p><strong>Type:</strong> {event.type}</p>
        <p><strong>Start:</strong> {event.start}</p>
        <p><strong>End:</strong> {event.end}</p>
        {event.conflict && <StatusBadge status={event.conflictType} />}
      </div>
    </Modal>
  )
}

function AssignmentModal({ data, onClose }) {
  const [employeeId, setEmployeeId] = useState(crew[0]?.id)
  const [flight, setFlight] = useState('ETL-812')
  return (
    <Modal title="Assign employee to flight" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); data.assignCrew(employeeId, flight); onClose() }}>
        <label>
          Employee
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            {crew.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} - {employee.position}</option>)}
          </select>
        </label>
        <label>
          Flight
          <select value={flight} onChange={(event) => setFlight(event.target.value)}>
            {flights.map((item) => <option key={item.id} value={item.id}>{item.id} {item.route}</option>)}
          </select>
        </label>
        <div className="form-actions">
          <ActionButton tone="secondary" onClick={onClose}>Cancel</ActionButton>
          <button className="action-button primary" type="submit">Assign employee</button>
        </div>
      </form>
    </Modal>
  )
}
