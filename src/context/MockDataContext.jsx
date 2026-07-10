import { createContext, useContext, useMemo, useState } from 'react'
import { initialDemoState } from '../data/initialDemoState'
import { readStorage, writeStorage } from '../utils/storage'

const MockDataContext = createContext(null)

function persist(nextState) {
  writeStorage('demoState', nextState)
  return nextState
}

export function MockDataProvider({ children }) {
  const [state, setState] = useState(() => readStorage('demoState', initialDemoState))

  function update(updater) {
    setState((current) => persist(updater(current)))
  }

  function resetDemoData() {
    setState(persist(initialDemoState))
  }

  function createRequest(payload) {
    update((current) => {
      const request = {
        id: `REQ-${2400 + current.requests.length + 1}`,
        status: 'Pending',
        priority: payload.type === 'Swap' ? 'High' : 'Medium',
        timeline: ['Submitted by employee', 'Awaiting supervisor decision'],
        notes: '',
        ...payload,
      }
      return {
        ...current,
        requests: [request, ...current.requests],
        notifications: [
          {
            id: `NOT-${Date.now()}`,
            audience: ['supervisor', 'scheduler'],
            title: `${payload.type} request submitted by ${payload.employeeName}`,
            read: false,
            severity: payload.type === 'Swap' ? 'High' : 'Medium',
          },
          ...current.notifications,
        ],
      }
    })
  }

  function decideRequest(requestId, status, note = '') {
    update((current) => {
      const request = current.requests.find((item) => item.id === requestId)
      return {
        ...current,
        requests: current.requests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status,
                notes: note,
                timeline: [...item.timeline, `${status} by supervisor`],
              }
            : item,
        ),
        approvalHistory: request
          ? [
              {
                id: `HIS-${Date.now()}`,
                requestId,
                type: request.type,
                employeeId: request.employeeId,
                status,
                note,
                time: new Date().toLocaleString(),
              },
              ...current.approvalHistory,
            ]
          : current.approvalHistory,
        notifications: [
          {
            id: `NOT-${Date.now()}`,
            audience: ['crew', 'scheduler'],
            title: `${request?.type || 'Request'} ${status.toLowerCase()} for ${request?.employeeId || 'employee'}`,
            read: false,
            severity: status === 'Approved' ? 'Low' : 'Medium',
          },
          ...current.notifications,
        ],
      }
    })
  }

  function confirmAssignment(flightId, employeeId) {
    update((current) => ({
      ...current,
      confirmations: current.confirmations.some(
        (item) => item.flightId === flightId && item.employeeId === employeeId,
      )
        ? current.confirmations
        : [
            {
              flightId,
              employeeId,
              time: new Date().toLocaleString(),
            },
            ...current.confirmations,
          ],
    }))
  }

  function assignCrew(employeeId, label = 'ETL-812') {
    update((current) => ({
      ...current,
      rosterEvents: [
        {
          id: `EVT-${Date.now()}`,
          employeeId,
          label,
          type: 'flight',
          start: '2026-07-12T06:30:00',
          end: '2026-07-12T17:00:00',
          conflict: false,
        },
        ...current.rosterEvents,
      ],
      notifications: [
        {
          id: `NOT-${Date.now()}`,
          audience: ['crew'],
          title: `${label} assignment published`,
          read: false,
          severity: 'Low',
        },
        ...current.notifications,
      ],
    }))
  }

  function recordDefect(payload) {
    update((current) => ({
      ...current,
      defects: [
        {
          id: `DEF-${300 + current.defects.length + 1}`,
          status: 'Open',
          priority: payload.priority || 'Medium',
          ...payload,
        },
        ...current.defects,
      ],
      aircraft: current.aircraft.map((item) =>
        item.id === payload.aircraftId
          ? { ...item, status: 'Inspection', clearance: 'Hold', restriction: payload.title }
          : item,
      ),
      notifications: [
        {
          id: `NOT-${Date.now()}`,
          audience: ['operations', 'scheduler'],
          title: `${payload.aircraftId} defect recorded: ${payload.title}`,
          read: false,
          severity: 'High',
        },
        ...current.notifications,
      ],
    }))
  }

  function updateWorkOrder(workOrderId, status) {
    update((current) => ({
      ...current,
      workOrders: current.workOrders.map((workOrder) =>
        workOrder.id === workOrderId ? { ...workOrder, status, stage: status } : workOrder,
      ),
    }))
  }

  function suspendEmployee(employeeId) {
    update((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId ? { ...employee, status: 'Suspended' } : employee,
      ),
      securityEvents: [
        {
          id: `SEC-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: 'System Administrator',
          action: `Suspended employee ${employeeId}`,
          severity: 'High',
          area: 'Accounts',
        },
        ...current.securityEvents,
      ],
    }))
  }

  function restoreEmployee(employeeId) {
    update((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId ? { ...employee, status: 'Active' } : employee,
      ),
    }))
  }

  function markNotificationRead(notificationId) {
    update((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    }))
  }

  function saveFilter(key, value) {
    update((current) => ({ ...current, savedFilters: { ...current.savedFilters, [key]: value } }))
  }

  const value = useMemo(
    () => ({
      ...state,
      assignCrew,
      confirmAssignment,
      createRequest,
      decideRequest,
      markNotificationRead,
      recordDefect,
      resetDemoData,
      restoreEmployee,
      saveFilter,
      suspendEmployee,
      updateWorkOrder,
    }),
    [state],
  )

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
}

export function useMockData() {
  return useContext(MockDataContext)
}
