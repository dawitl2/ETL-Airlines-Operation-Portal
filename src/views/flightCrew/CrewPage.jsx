'use client'

import { useState } from 'react'
import { Bell, CalendarDays, Clock3, FileText, Plane, ShieldCheck } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Modal } from '../../components/forms/Modal'
import { DataTable } from '../../components/tables/DataTable'
import { flights } from '../../data/flights'
import { employees } from '../../data/employees'
import { useMockData } from '../../context/MockDataContext'
import { useSession } from '../../context/SessionContext'

export function CrewPage({ section = 'dashboard' }) {
  const { currentUser } = useSession()
  const data = useMockData()
  const [formType, setFormType] = useState(null)
  const profile = currentUser.profile
  const employeeNumber = profile.employeeNumber

  const myFlights = flights.filter((flight) => flight.crewAssigned.includes(employeeNumber))
  const nextFlight = myFlights[0] || flights[0]

  if (section === 'schedule') return <Schedule currentUser={currentUser} data={data} myFlights={myFlights} />
  if (section === 'flights') return <FlightDetails currentUser={currentUser} data={data} flight={nextFlight} />
  if (section === 'requests') return <Requests currentUser={currentUser} data={data} openForm={setFormType} />
  if (section === 'qualifications') return <Qualifications currentUser={currentUser} />
  if (section === 'documents') return <Documents currentUser={currentUser} />
  if (section === 'notifications') return <Notifications data={data} />
  if (section === 'security') return <Security currentUser={currentUser} />

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton tone="secondary" onClick={() => setFormType('Leave')}>Request leave</ActionButton>
            <ActionButton onClick={() => data.confirmAssignment(nextFlight.id, employeeNumber)}>Confirm assignment</ActionButton>
          </>
        }
        eyebrow="Personal crew portal"
        title="My dashboard"
      >
        Personal duty summary, next assignment, qualification status, notices, and request tools.
      </PageHeader>
      <section className="crew-hero">
        <div>
          <p className="eyebrow">Next flight</p>
          <h2>{nextFlight.id} {nextFlight.route}</h2>
          <p>{nextFlight.aircraft} - Gate {nextFlight.gate} - Report 19:30</p>
        </div>
        <StatusBadge status={nextFlight.status} />
      </section>
      <section className="metrics-grid crew-metrics">
        <MetricCard icon={Clock3} label="Rest countdown" value="13h 40m" detail="Eligible before report" tone="green" />
        <MetricCard icon={Plane} label="Aircraft" value={nextFlight.aircraft} detail={nextFlight.aircraftId} />
        <MetricCard icon={CalendarDays} label="Weekly duties" value={myFlights.length || 1} detail="Published assignments" />
        <MetricCard icon={ShieldCheck} label="Qualifications" value="Valid" detail={profile.qualifications.join(', ')} tone="green" />
      </section>
      <section className="dashboard-grid">
        <Panel title="Assigned team" eyebrow="Crew composition">
          <CrewTeam flight={nextFlight} />
        </Panel>
        <Panel title="Notices" eyebrow="Unread updates">
          <NoticeList data={data} />
        </Panel>
      </section>
      {formType && <RequestForm currentUser={currentUser} data={data} type={formType} onClose={() => setFormType(null)} />}
    </>
  )
}

function Schedule({ currentUser, data, myFlights }) {
  return (
    <>
      <PageHeader eyebrow="My schedule" title="Published crew schedule" />
      <Panel title="My flight duties">
        <DataTable
          columns={[
            { key: 'id', label: 'Flight' },
            { key: 'route', label: 'Route' },
            { key: 'aircraft', label: 'Aircraft' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'action', label: 'Action', render: (row) => <ActionButton tone="secondary" onClick={() => data.confirmAssignment(row.id, currentUser.profile.employeeNumber)}>Confirm</ActionButton> },
          ]}
          rows={myFlights.length ? myFlights : flights.slice(0, 1)}
        />
      </Panel>
    </>
  )
}

function FlightDetails({ currentUser, data, flight }) {
  return (
    <>
      <PageHeader actions={<ActionButton onClick={() => data.confirmAssignment(flight.id, currentUser.profile.employeeNumber)}>Confirm assignment</ActionButton>} eyebrow="Flight details" title={`${flight.id} ${flight.route}`} />
      <section className="dashboard-grid">
        <Panel title="Route briefing">
          <div className="detail-stack">
            <p><strong>Aircraft:</strong> {flight.aircraft}</p>
            <p><strong>Gate:</strong> {flight.gate}</p>
            <p><strong>Departure:</strong> {flight.departure}</p>
            <p><strong>Briefing:</strong> {flight.briefing}</p>
          </div>
        </Panel>
        <Panel title={currentUser.profile.position.includes('Cabin') || currentUser.profile.position === 'Purser' ? 'Cabin briefing' : 'Flight deck briefing'}>
          <PositionBriefing currentUser={currentUser} />
        </Panel>
      </section>
    </>
  )
}

function Requests({ currentUser, data, openForm }) {
  const mine = data.requests.filter((request) => request.employeeId === currentUser.profile.employeeNumber)
  return (
    <>
      <PageHeader actions={<><ActionButton tone="secondary" onClick={() => openForm('Swap')}>Request swap</ActionButton><ActionButton onClick={() => openForm('Leave')}>Request leave</ActionButton></>} eyebrow="Self service" title="My requests" />
      <Panel title="Request history">
        <DataTable
          columns={[
            { key: 'type', label: 'Type' },
            { key: 'dates', label: 'Dates' },
            { key: 'impact', label: 'Impact' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={mine}
          empty="No requests submitted yet"
        />
      </Panel>
    </>
  )
}

function Qualifications({ currentUser }) {
  return (
    <>
      <PageHeader eyebrow="Qualifications" title="Qualification status" />
      <Panel title="Active documents">
        <div className="settings-grid">
          <div><strong>Position</strong><span>{currentUser.profile.position}</span></div>
          <div><strong>Aircraft qualification</strong><span>{currentUser.profile.qualifications.join(', ')}</span></div>
          <div><strong>Medical / recurrent</strong><span>Verified in employee profile</span></div>
        </div>
      </Panel>
    </>
  )
}

function Documents({ currentUser }) {
  const pilot = ['Captain', 'First Officer'].includes(currentUser.profile.position)
  return (
    <>
      <PageHeader eyebrow="Documents" title="Required documents" />
      <Panel title="Document checklist">
        <div className="checklist">
          {(pilot ? ['Passport', 'License', 'Medical certificate', 'Route briefing'] : ['Passport', 'Cabin recurrent', 'Hotel voucher', 'Ground transport']).map((item) => (
            <label key={item}><input defaultChecked type="checkbox" /> {item}</label>
          ))}
        </div>
      </Panel>
    </>
  )
}

function Notifications({ data }) {
  return (
    <>
      <PageHeader eyebrow="Notifications" title="Crew notices" />
      <NoticeList data={data} />
    </>
  )
}

function Security({ currentUser }) {
  return (
    <>
      <PageHeader eyebrow="Account and security" title="Mock active sessions" />
      <Panel title="Security details">
        <div className="settings-grid">
          <div><strong>Email</strong><span>{currentUser.email}</span></div>
          <div><strong>Last login</strong><span>{currentUser.lastLoginAt || 'Current session'}</span></div>
          <div><strong>Active sessions</strong><span>{currentUser.sessions?.length || 1} server session(s)</span></div>
        </div>
      </Panel>
    </>
  )
}

function CrewTeam({ flight }) {
  const team = employees.filter((employee) => flight.crewAssigned.includes(employee.id))
  return (
    <div className="team-list">
      {team.map((member) => (
        <article key={member.id}><strong>{member.name}</strong><span>{member.position}</span><StatusBadge status={member.status} /></article>
      ))}
    </div>
  )
}

function PositionBriefing({ currentUser }) {
  const pilot = ['Captain', 'First Officer'].includes(currentUser.profile.position)
  return (
    <div className="detail-stack">
      {pilot ? (
        <>
          <p><strong>Flight duty:</strong> Long-haul international duty.</p>
          <p><strong>Rest eligibility:</strong> Legal rest validated before report.</p>
          <p><strong>Route:</strong> Weather, alternates, and fuel briefing available.</p>
        </>
      ) : (
        <>
          <p><strong>Service briefing:</strong> Full international meal service.</p>
          <p><strong>Hotel:</strong> Crew hotel voucher available after arrival.</p>
          <p><strong>Ground transport:</strong> Departure from crew center at 19:10.</p>
        </>
      )}
    </div>
  )
}

function NoticeList({ data }) {
  const notices = data.notifications.filter((notification) => notification.audience.includes('crew'))
  return (
    <Panel title="Notification center">
      <div className="notification-stack">
        {notices.map((notice) => (
          <article key={notice.id}>
            <Bell size={18} />
            <span>{notice.title}</span>
            <StatusBadge status={notice.read ? 'Read' : notice.severity} />
            {!notice.read && <ActionButton tone="secondary" onClick={() => data.markNotificationRead(notice.id)}>Dismiss</ActionButton>}
          </article>
        ))}
      </div>
    </Panel>
  )
}

function RequestForm({ currentUser, data, onClose, type }) {
  const [reason, setReason] = useState('')
  const [date, setDate] = useState('2026-07-15')
  const valid = reason.trim().length > 4
  return (
    <Modal title={`${type} request`} onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => {
        event.preventDefault()
        if (!valid) return
        data.createRequest({
          employeeId: currentUser.profile.employeeNumber,
          employeeName: currentUser.profile.displayName,
          type,
          reason,
          dates: date,
          assignment: 'Next published duty',
          impact: 'Supervisor and scheduler coverage review required.',
          replacement: type === 'Swap' ? 'Reserve crew to be selected' : 'Scheduler recommendation pending',
        })
        onClose()
      }}>
        <label>
          Date or duty
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          Reason
          <textarea value={reason} onChange={(event) => setReason(event.target.value)} />
          {!valid && reason && <small className="error-text">Please add a more complete reason.</small>}
        </label>
        <div className="form-actions">
          <ActionButton tone="secondary" onClick={onClose}>Cancel</ActionButton>
          <button className="action-button primary" disabled={!valid} type="submit">Submit request</button>
        </div>
      </form>
    </Modal>
  )
}
