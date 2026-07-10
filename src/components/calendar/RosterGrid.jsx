'use client'

import { employees } from '../../data/employees'

const crewRows = employees.filter((employee) => employee.role === 'crew')
const days = ['Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16']

function eventStyle(event) {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const startHour = start.getHours() + start.getMinutes() / 60
  const duration = Math.max(2, (end - start) / 3600000)
  return {
    left: `${Math.min(82, (startHour / 24) * 100)}%`,
    width: `${Math.min(55, (duration / 24) * 100)}%`,
  }
}

export function RosterGrid({ events, onSelect }) {
  return (
    <div className="roster-grid-wrap">
      <div className="roster-grid">
        <div className="roster-corner">Crew</div>
        {days.map((day) => (
          <div className="roster-day" key={day}>
            {day}
          </div>
        ))}
        {crewRows.map((crew) => (
          <div className="roster-row" key={crew.id}>
            <div className="roster-person">
              <strong>{crew.name}</strong>
              <span>{crew.position}</span>
            </div>
            {days.map((day, index) => (
              <div className="roster-cell" key={`${crew.id}-${day}`}>
                {events
                  .filter((event) => event.employeeId === crew.id)
                  .filter((event) => new Date(event.start).getDate() === 10 + index)
                  .map((event) => (
                    <button
                      className={`roster-event ${event.type} ${event.conflict ? 'conflict' : ''}`}
                      key={event.id}
                      style={eventStyle(event)}
                      type="button"
                      onClick={() => onSelect?.(event)}
                    >
                      <strong>{event.label}</strong>
                      {event.conflict && <span>{event.conflictType}</span>}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
