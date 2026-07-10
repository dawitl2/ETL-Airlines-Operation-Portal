# ETL Airlines Operation Portal

ETL Airlines Operation Portal is a Phase 1 frontend-only React application for a multi-role airline operations system.

There is no backend, database, JWT, password authentication, email, deployment, or real API integration in this phase. All workflows use realistic mock data and local browser persistence.

## Roles

- System Administrator
- Operations Manager
- Crew Scheduler
- Supervisor
- Flight Crew Member
- Maintenance Technician

Flight Crew Member profiles include positions such as Captain, First Officer, Purser, and Cabin Crew. The position changes the displayed information, while the authentication role remains Flight Crew Member.

## Simulated Login

The login flow is:

1. Select role.
2. Select an employee within that role.
3. Enter that employee's workspace.

The selected employee and role are remembered in `localStorage`. Use **Switch user** to return to the access portal.

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Mock Workflows

- Crew member submits leave or swap requests, supervisor reviews them, and scheduler sees coverage impact.
- Scheduler assigns crew to flights and crew members can confirm assignments.
- Maintenance technician records aircraft defects, which update aircraft status and notify operations/scheduling.
- System administrator suspends employees, making the local identity state reflect restricted access.

## Local Persistence

The app persists these demo values in `localStorage`:

- Current user session
- Theme
- Mock requests and decisions
- Assignment confirmations
- Roster changes
- Aircraft defects
- Notifications
- Demo filters and reset state

Use the reset action in the application top bar or Security Settings to restore demo data.

## Current Limitations

- Frontend-only mock state
- No real authentication or authorization
- No MongoDB, PostgreSQL, Express, or API server
- No production deployment
- Calendar and workflow actions are realistic simulations, not connected to live airline systems

## Planned Future Phases

- Node.js and Express API
- MongoDB persistence
- JWT authentication
- Role-based authorization
- Real audit logging
- API-backed scheduling workflows
- Optional PostgreSQL analytics/reporting layer
