import { NextResponse } from 'next/server'

export function apiError(code, message, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status })
}

export function apiOk(payload = {}, init) {
  return NextResponse.json(payload, init)
}

export function safeUserPayload(user, role, permissions, sessions = []) {
  const profile = user.employeeProfileId
  return {
    id: String(user._id),
    email: user.email,
    accountStatus: user.accountStatus,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    role: {
      id: String(role._id),
      code: role.code,
      name: role.name,
    },
    permissions,
    profile: profile
      ? {
          id: String(profile._id),
          employeeNumber: profile.employeeNumber,
          displayName: profile.displayName,
          firstName: profile.firstName,
          lastName: profile.lastName,
          position: profile.position,
          department: profile.department,
          baseAirport: profile.baseAirport,
          phone: profile.phone,
          avatar: profile.avatar,
          employmentStatus: profile.employmentStatus,
          qualifications: profile.qualifications || [],
        }
      : null,
    sessions,
  }
}
