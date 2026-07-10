import mongoose from 'mongoose'

const AuditEventSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  category: { type: String, required: true },
  result: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
})

export const AuditEvent =
  mongoose.models.AuditEvent || mongoose.model('AuditEvent', AuditEventSchema)
