import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshTokenHash: { type: String, required: true },
    deviceName: { type: String },
    browser: { type: String },
    operatingSystem: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    revokeReason: { type: String },
  },
  { timestamps: true },
)

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema)
