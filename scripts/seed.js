import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mongoose from 'mongoose'
import { aircraft } from '../src/data/aircraft.js'
import { employees as phaseEmployees } from '../src/data/employees.js'
import { permissionsSeed, rolePermissionMap } from '../src/server/permissions.js'
import { ROLE_CODES } from '../src/server/constants.js'
import { AuditEvent } from '../src/server/models/AuditEvent.js'
import { EmployeeProfile } from '../src/server/models/EmployeeProfile.js'
import { Permission } from '../src/server/models/Permission.js'
import { Role } from '../src/server/models/Role.js'
import { Session } from '../src/server/models/Session.js'
import { User } from '../src/server/models/User.js'

const password = 'ChangeMe123!'

const roleNames = {
  SYSTEM_ADMIN: 'System Administrator',
  OPERATIONS_MANAGER: 'Operations Manager',
  CREW_SCHEDULER: 'Crew Scheduler',
  SUPERVISOR: 'Supervisor',
  FLIGHT_CREW: 'Flight Crew Member',
  MAINTENANCE_TECHNICIAN: 'Maintenance Technician',
}

const seedUsers = [
  ['admin@etl.example', 'ADM-001', ROLE_CODES.admin],
  ['operations@etl.example', 'OPS-001', ROLE_CODES.operations],
  ['scheduler@etl.example', 'SCH-001', ROLE_CODES.scheduler],
  ['supervisor@etl.example', 'SUP-001', ROLE_CODES.supervisor],
  ['crew@etl.example', 'CRW-001', ROLE_CODES.crew],
  ['maintenance@etl.example', 'MNT-001', ROLE_CODES.maintenance],
]

function splitName(displayName) {
  const clean = displayName.replace('Capt. ', '')
  const parts = clean.split(' ')
  return [parts[0], parts.slice(1).join(' ') || parts[0]]
}

function tokenHash() {
  return crypto.createHash('sha256').update(crypto.randomBytes(48)).digest('hex')
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to seed MongoDB Atlas.')
  }

  await mongoose.connect(process.env.MONGODB_URI)

  await Promise.all([
    AuditEvent.deleteMany({}),
    EmployeeProfile.deleteMany({}),
    Permission.deleteMany({}),
    Role.deleteMany({}),
    Session.deleteMany({}),
    User.deleteMany({}),
  ])

  const permissions = await Permission.insertMany(
    permissionsSeed.map(([code, name, description, category]) => ({
      code,
      name,
      description,
      category,
    })),
  )
  const permissionByCode = new Map(permissions.map((permission) => [permission.code, permission]))

  const roles = {}
  for (const code of Object.values(ROLE_CODES)) {
    roles[code] = await Role.create({
      name: roleNames[code],
      code,
      description: `${roleNames[code]} access role`,
      permissionIds: rolePermissionMap[code].map((permissionCode) => permissionByCode.get(permissionCode)._id),
      isSystemRole: true,
    })
  }

  const profiles = {}
  for (const employee of phaseEmployees) {
    const [firstName, lastName] = splitName(employee.name)
    profiles[employee.id] = await EmployeeProfile.create({
      employeeNumber: employee.id,
      firstName,
      lastName,
      displayName: employee.name,
      position: employee.position,
      department: employee.department,
      baseAirport: employee.base,
      phone: '+251-11-000-0000',
      avatar: '',
      employmentStatus: employee.status === 'Suspended' ? 'SUSPENDED' : 'ACTIVE',
      qualifications: employee.qualification ? employee.qualification.split(',').map((item) => item.trim()) : [],
    })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const createdUsers = []
  for (const [email, employeeNumber, roleCode] of seedUsers) {
    createdUsers.push(
      await User.create({
        email,
        passwordHash,
        roleId: roles[roleCode]._id,
        employeeProfileId: profiles[employeeNumber]._id,
        accountStatus: 'ACTIVE',
        emailVerified: true,
        failedLoginCount: 0,
        passwordChangedAt: new Date(),
      }),
    )
  }

  await Session.create({
    userId: createdUsers[0]._id,
    refreshTokenHash: tokenHash(),
    deviceName: 'Seed workstation',
    browser: 'Chrome',
    operatingSystem: 'Windows',
    ipAddress: '127.0.0.1',
    userAgent: 'seed-script',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastUsedAt: new Date(),
  })

  await AuditEvent.insertMany([
    {
      actorUserId: createdUsers[0]._id,
      action: 'SEED_DATABASE',
      category: 'SYSTEM',
      result: 'SUCCESS',
      metadata: { aircraftSeeded: aircraft.length },
      createdAt: new Date(),
    },
    {
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      result: 'FAILED',
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
      metadata: { sample: true },
      createdAt: new Date(),
    },
  ])

  console.log('Seed complete for ETL Airlines Operation Portal')
  console.log('Development password for all seeded users:', password)
  console.table(seedUsers.map(([email, employeeNumber, roleCode]) => ({ email, employeeNumber, roleCode })))

  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error.message)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
