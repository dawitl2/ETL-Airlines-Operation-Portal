import { AuditEvent } from './models'

export async function recordAuditEvent({
  action,
  actorUserId,
  category = 'AUTH',
  ipAddress,
  metadata,
  result = 'SUCCESS',
  targetUserId,
  userAgent,
}) {
  try {
    await AuditEvent.create({
      action,
      actorUserId,
      category,
      ipAddress,
      metadata,
      result,
      targetUserId,
      userAgent,
    })
  } catch {
    // Audit failures should not expose internals or break the user-facing flow.
  }
}
