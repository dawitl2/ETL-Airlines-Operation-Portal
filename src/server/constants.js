export const ROLE_CODES = {
  admin: 'SYSTEM_ADMIN',
  operations: 'OPERATIONS_MANAGER',
  scheduler: 'CREW_SCHEDULER',
  supervisor: 'SUPERVISOR',
  crew: 'FLIGHT_CREW',
  maintenance: 'MAINTENANCE_TECHNICIAN',
}

export const ROLE_SLUGS = Object.fromEntries(
  Object.entries(ROLE_CODES).map(([slug, code]) => [code, slug]),
)

export const ROLE_LANDING = {
  SYSTEM_ADMIN: '/admin/dashboard',
  OPERATIONS_MANAGER: '/operations/command-center',
  CREW_SCHEDULER: '/scheduler/roster',
  SUPERVISOR: '/supervisor/approvals',
  FLIGHT_CREW: '/crew/dashboard',
  MAINTENANCE_TECHNICIAN: '/maintenance/dashboard',
}

export const ROLE_REQUIRED_PERMISSION = {
  SYSTEM_ADMIN: 'account.read',
  OPERATIONS_MANAGER: 'flight.read.all',
  CREW_SCHEDULER: 'schedule.manage',
  SUPERVISOR: 'leave.approve',
  FLIGHT_CREW: 'schedule.read.own',
  MAINTENANCE_TECHNICIAN: 'maintenance.manage',
}

export const ACCESS_COOKIE = 'etl_access'
export const REFRESH_COOKIE = 'etl_refresh'

export const ACCESS_TOKEN_SECONDS = 15 * 60
export const REFRESH_TOKEN_SECONDS = 30 * 24 * 60 * 60
