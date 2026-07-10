export const securityEvents = [
  {
    id: 'SEC-001',
    time: '08:43',
    actor: 'Mekdes Alemu',
    action: 'Changed supervisor permissions',
    severity: 'Medium',
    area: 'Roles',
  },
  {
    id: 'SEC-002',
    time: '07:56',
    actor: 'System',
    action: 'Blocked repeated failed sign-in attempt',
    severity: 'High',
    area: 'Authentication',
  },
  {
    id: 'SEC-003',
    time: '06:30',
    actor: 'Tomas Desta',
    action: 'Revoked inactive session',
    severity: 'Low',
    area: 'Sessions',
  },
]

export const loginActivity = [
  { day: 'Mon', success: 142, failed: 7 },
  { day: 'Tue', success: 151, failed: 5 },
  { day: 'Wed', success: 138, failed: 11 },
  { day: 'Thu', success: 162, failed: 8 },
  { day: 'Fri', success: 147, failed: 13 },
  { day: 'Sat', success: 91, failed: 3 },
  { day: 'Sun', success: 84, failed: 2 },
]

export const roleDistribution = [
  { name: 'Crew', value: 186 },
  { name: 'Operations', value: 22 },
  { name: 'Maintenance', value: 48 },
  { name: 'Supervisor', value: 16 },
  { name: 'Scheduler', value: 12 },
  { name: 'Admin', value: 6 },
]
