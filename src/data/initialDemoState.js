import { aircraft } from './aircraft'
import { employees } from './employees'
import { notifications } from './notifications'
import { requests } from './requests'
import { rosterEvents } from './schedules'
import { securityEvents } from './securityEvents'
import { workOrders } from './maintenance'

export const initialDemoState = {
  employees,
  aircraft,
  requests,
  rosterEvents,
  workOrders,
  notifications,
  securityEvents,
  confirmations: [],
  approvalHistory: [],
  defects: [
    {
      id: 'DEF-301',
      aircraftId: 'ET-AYN',
      title: 'Cabin PA intermittent',
      status: 'Open',
      priority: 'High',
      createdBy: 'MNT-002',
    },
  ],
  savedFilters: {},
  collapsedSections: {},
}
