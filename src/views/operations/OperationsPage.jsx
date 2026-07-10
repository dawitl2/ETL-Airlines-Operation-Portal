'use client'

import { AlertTriangle, Gauge, Plane, RadioTower, Users, Wrench } from 'lucide-react'
import { ActionButton } from '../../components/common/ActionButton'
import { MetricCard } from '../../components/common/MetricCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Panel } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/StatusBadge'
import { DemandChart, FlightStatusChart } from '../../components/charts/Charts'
import { DataTable } from '../../components/tables/DataTable'
import { aircraft } from '../../data/aircraft'
import { flights, hourlyDepartures, routeSummary } from '../../data/flights'
import { useMockData } from '../../context/MockDataContext'

const demand = [
  { label: 'Pilots', demand: 34, available: 29 },
  { label: 'Pursers', demand: 18, available: 16 },
  { label: 'Cabin', demand: 86, available: 79 },
  { label: 'Tech', demand: 22, available: 24 },
]

export function OperationsPage({ section = 'command-center' }) {
  const data = useMockData()

  if (section === 'flights') return <FlightsScreen />
  if (section === 'crew-coverage') return <CrewCoverage />
  if (section === 'aircraft') return <AircraftStatus data={data} />
  if (section === 'disruptions') return <Disruptions data={data} />
  if (section === 'performance') return <Performance />
  if (section === 'reports') return <Reports />

  return (
    <>
      <PageHeader
        actions={<ActionButton>Open incident</ActionButton>}
        eyebrow="Network operations"
        title="Command center"
      >
        Live operational picture for flights, crew coverage, aircraft readiness, and
        disruption severity.
      </PageHeader>
      <section className="ops-command-strip">
        <MetricCard icon={Plane} label="Flights today" value="53" detail="ADD network departures" />
        <MetricCard icon={Gauge} label="On-time" value="84%" detail="Above daily target" tone="green" />
        <MetricCard icon={AlertTriangle} label="Delayed" value="7" detail="2 high impact" tone="amber" />
        <MetricCard icon={Users} label="Crew coverage" value="89%" detail="5 open gaps" tone="amber" />
        <MetricCard icon={Wrench} label="Aircraft available" value="41/45" detail="1 hold" />
      </section>
      <section className="dashboard-grid wide-left">
        <Panel eyebrow="Departure flow" title="Hourly departure timeline">
          <FlightStatusChart data={hourlyDepartures} />
        </Panel>
        <Panel eyebrow="Disruptions" title="Severity list">
          <DisruptionList defects={data.defects} />
        </Panel>
      </section>
      <section className="dashboard-grid">
        <Panel eyebrow="Crew balance" title="Demand versus availability">
          <DemandChart data={demand} />
        </Panel>
        <Panel eyebrow="Route summary" title="Flights by region">
          <div className="route-summary">
            {routeSummary.map((route) => (
              <div key={route.region}>
                <span>{route.region}</span>
                <strong>{route.flights}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  )
}

function FlightsScreen() {
  return (
    <>
      <PageHeader eyebrow="Flights" title="Flight operations board" />
      <Panel title="Today's flights">
        <DataTable
          columns={[
            { key: 'id', label: 'Flight' },
            { key: 'route', label: 'Route' },
            { key: 'aircraft', label: 'Aircraft' },
            { key: 'gate', label: 'Gate' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'action', label: 'Action', render: () => <ActionButton tone="secondary">View affected flights</ActionButton> },
          ]}
          rows={flights}
        />
      </Panel>
    </>
  )
}

function CrewCoverage() {
  return (
    <>
      <PageHeader eyebrow="Crew coverage" title="Coverage and staffing gaps" />
      <section className="dashboard-grid">
        <Panel title="Demand versus availability">
          <DemandChart data={demand} />
        </Panel>
        <Panel title="Critical staffing gaps">
          <div className="gap-list">
            <article><strong>ETL-812</strong><span>Missing senior cabin crew and first officer</span><ActionButton tone="secondary">Review staffing gap</ActionButton></article>
            <article><strong>ETL-706</strong><span>Rest exception review needed</span><ActionButton tone="secondary">Review staffing gap</ActionButton></article>
          </div>
        </Panel>
      </section>
    </>
  )
}

function AircraftStatus({ data }) {
  return (
    <>
      <PageHeader eyebrow="Aircraft" title="Aircraft status board" />
      <div className="aircraft-board">
        {data.aircraft.map((item) => (
          <article className="aircraft-card" key={item.id}>
            <div>
              <strong>{item.id}</strong>
              <span>{item.type}</span>
            </div>
            <StatusBadge status={item.status} />
            <dl>
              <dt>Next flight</dt><dd>{item.nextFlight}</dd>
              <dt>Restriction</dt><dd>{item.restriction}</dd>
              <dt>Clearance</dt><dd>{item.clearance}</dd>
            </dl>
            <ActionButton tone="secondary">View restriction</ActionButton>
          </article>
        ))}
      </div>
    </>
  )
}

function Disruptions({ data }) {
  return (
    <>
      <PageHeader actions={<ActionButton>Approve emergency override</ActionButton>} eyebrow="Disruptions" title="Operational incidents" />
      <Panel title="Disruption severity list">
        <DisruptionList defects={data.defects} />
      </Panel>
    </>
  )
}

function Performance() {
  return (
    <>
      <PageHeader eyebrow="Performance" title="Operational performance" />
      <section className="dashboard-grid">
        <Panel title="Flight status trend">
          <FlightStatusChart data={hourlyDepartures} />
        </Panel>
        <Panel title="Route volume">
          <div className="route-summary tall">
            {routeSummary.map((route) => (
              <div key={route.region}><span>{route.region}</span><strong>{route.flights}</strong></div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  )
}

function Reports() {
  return (
    <>
      <PageHeader actions={<ActionButton>Export mock report</ActionButton>} eyebrow="Reports" title="Operations reports" />
      <Panel title="Report catalog">
        <DataTable
          columns={[
            { key: 'name', label: 'Report' },
            { key: 'owner', label: 'Owner' },
            { key: 'updated', label: 'Last updated' },
            { key: 'action', label: 'Action', render: () => <ActionButton tone="secondary">Export</ActionButton> },
          ]}
          rows={[
            { id: 'RPT-1', name: 'Daily operations summary', owner: 'Network Control', updated: 'Today 09:00' },
            { id: 'RPT-2', name: 'Crew coverage exceptions', owner: 'Crew Planning', updated: 'Today 08:35' },
          ]}
        />
      </Panel>
    </>
  )
}

function DisruptionList({ defects }) {
  const items = [
    { id: 'INC-1', title: 'ETL-706 cabin defect', severity: 'High', area: 'Aircraft', detail: 'Boarding hold likely if PA review fails.' },
    { id: 'INC-2', title: 'ETL-812 crew gap', severity: 'Critical', area: 'Crew', detail: 'Minimum cabin coverage not met.' },
    ...defects.map((defect) => ({ id: defect.id, title: defect.title, severity: defect.priority, area: defect.aircraftId, detail: defect.status })),
  ]
  return (
    <div className="event-timeline">
      {items.map((item) => (
        <article key={item.id}>
          <RadioTower size={18} />
          <div><strong>{item.title}</strong><small>{item.area} - {item.detail}</small></div>
          <StatusBadge status={item.severity} />
        </article>
      ))}
    </div>
  )
}
